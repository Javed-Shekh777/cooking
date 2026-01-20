const { errorResponse, successResponse } = require("../util/response");
const User = require("../models/user.model");
const { verifyMail, accountCreationMail, contactMail, chefApplicationMail, chefVerificationMail } = require("../helper/sendMail");
const { generateNumOTP } = require("../helper/generateOTP");
const JWT = require("jsonwebtoken");
const { Tokens, cloudinaryFolderNames, NODE_ENV } = require("../constants");
const { logUserActivity } = require("../helper/logUserActivity");
const Contact = require("../models/contact.model");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { startSession } = require("../helper/common");
const AuditLog = require("../models/auditLog.model");
const Request = require("../models/deleteRequest.model");


 


exports.localRegister = async (req, res, next) => {
    const session = await startSession();

    try {
        const { username, email, password = "", role = "USER", fullName, } = req.body;
        if (!username || !email || !fullName || !password) {
            return errorResponse(res, "All fields required", 400);
        }

        const exist = await User.findOne({ email }).session(session);
        if (exist && exist?.isVerified) {
            return errorResponse(res, "User already exists", 400);
        }


        const normalizedRole = role?.toUpperCase();
        const isChef = normalizedRole === "CHEF";
        console.log(req.body);


        let insertData = {
            username,
            email,
            password,
            fullName,
            role: isChef ? "CHEF" : "USER",
            isChefApproved: false,
            chefAppliedAt: isChef ? new Date() : null,

        }

        if (isChef) {
            let { experienceYears, specialization, certifications } = req.body;
            if (
                experienceYears === undefined ||
                !Array.isArray(specialization) ||
                specialization.length === 0 ||
                !Array.isArray(certifications) ||
                certifications.length === 0
            ) {
                return errorResponse(res, "Chef fields required", 400);
            }

            insertData.chefProfile = {
                experienceYears,
                specialization,
                certifications
            }
        }


        const verificationCode = generateNumOTP(6);
        const verificationExpiry = Date.now() + 10 * 60 * 1000;
        const webToken = JWT.sign({ email, verificationCode }, Tokens.webToken, { expiresIn: Tokens.webTokenExpiry });

        insertData.verificationCode = verificationCode;
        insertData.verificationExpiry = verificationExpiry;
        insertData.webToken = webToken;



        const [createdUser] = await User.create([insertData], { session });

        await verifyMail({
            username: createdUser.username,
            email: createdUser.email,
            verificationCode,
            webToken,
            purpose: "REGISTER"
        });

        if (isChef) {
            await chefApplicationMail({
                username: createdUser.username,
                email: createdUser.email
            });
        }
        // 🧾 Logs
        await logUserActivity(
            createdUser._id,
            "REGISTER",
            req
        );

        await AuditLog.create(
            [{
                action: isChef ? "CHEF_REGISTERED_PENDING_APPROVAL" : "USER_REGISTERED",
                performedBy: createdUser._id,
                targetId: createdUser._id,
                targetType: isChef ? "CHEF" : "USER"
            }],
            { session }
        );



        await session.commitTransaction();
        session.endSession();

        return successResponse(res,
            isChef
                ? "Chef registered. Email verification sent & approval pending."
                : "User registered. Please verify your email.",
            createdUser
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
        // return errorResponse(res, err.message || "Registration failed. Please try again.", 500);
    }
};


exports.verifyMail = async (req, res, next) => {
    const session = await startSession();

    try {
        const { email, token, otp } = req.body;
        if (!email) {
            return errorResponse(res, "Email  missing.", 400);
        }
        const user = await User.findOne({ email }).session(session);

        if (!user) return errorResponse(res, "User not found.", 404);

        // ✅ Already verified
        if (user.isVerified) {
            return errorResponse(res, "Email already verified.", 400);
        }



        // 🔐 Verify JWT token
        let decoded;

        if (token) {
            try {
                decoded = JWT.verify(token, Tokens.webToken);
                // 🔍 Token email match check
                if (decoded.email !== user.email) {
                    return errorResponse(res, "Token does not match user.", 401);
                }
            } catch (err) {
                return errorResponse(res, "Invalid or expired verification token.", 401);
            }
        }



        if (otp) {
            if (user.verificationCode !== otp) {
                return errorResponse(res, "Invalid OTP.", 401);
            }
            // 🔍 Email match check
            if (email !== user.email) {
                return errorResponse(res, "Email does not match user.", 401);
            }
        }

        // ⏳ Expiry check (DB side)
        if (user.verificationExpiry && user.verificationExpiry.getTime() < Date.now()) {
            return errorResponse(res, "Verification code expired.", 410);
        }


        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpiry = null;
        user.webToken = null;
        await user.save();

        // Log the fact that verification succeeded
        await logUserActivity(user._id, "EMAIL_VERIFIED", req);

        // Send welcome mail
        // 📧 Role based welcome mail
        if (user.role === "CHEF") {
            await chefVerificationMail({ username: user.username, email: user.email }); // "Chef request received"
        } else {
            await accountCreationMail({ username: user.username, email: user.email }); // Normal welcome
        }



        if (user?.role === "CHEF") {
            await Request.create(
                [
                    {
                        itemId: user?._id,
                        itemType: user?.role === "CHEF" ? "CHEF" : "USER",
                        reason: "Requested for approval of being a Chef",
                        requestedBy: user?._id,
                    }
                ],
                { session }
            );
        }




        await AuditLog.create(
            [{
                action: "WELCOME_MAIL_SENT",
                performedBy: user._id,
                targetId: user._id,
                targetType: user?.role === "CHEF" ? "CHEF" : "USER"
            }],
            { session }
        );



        await session.commitTransaction();
        session.endSession();
        return successResponse(res, "Email verified successfully.");

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
        // return errorResponse(res, error.message || "Verification failed. Please try again.", 500);

    }

};


exports.localLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return errorResponse(res, "All fields are required.", 400);
        }

        const user = await User.findOne({
            $or: [
                { email: username.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (!user) return errorResponse(res, "User does not exist.", 404);
        if (!user.isVerified) {
            return errorResponse(res, "Please verify your email.", 400);
        }

        if (user.isBlocked) {
            return errorResponse(res, "Your account is blocked by admin.", 403);
        }

        // 👨‍🍳 Chef approval check
        if (user.role === "CHEF" && !user.isChefApproved) {
            return errorResponse(
                res,
                "Chef approval pending. Please wait for admin approval.",
                403
            );
        }

        const isCorrect = await user.isPasswordCorrect(password);
        if (!isCorrect) return errorResponse(res, "Invalid credentials", 401);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // ✅ ONLY refresh token DB me rakho
        user.refreshToken = refreshToken;
        user.lastLoginAt = new Date();
        await user.save({ validateBeforeSave: false });

        await AuditLog.create(
            [{
                action: "USER_LOGIN",
                performedBy: user._id,
                targetId: user._id,
                targetType: "USER"
            }],
        );

        // ❌ Remove sensitive fields
        user.password = undefined;
        user.refreshToken = undefined;

        const cookieOptions = {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "none"
        };

        // ✅ ONLY refresh token cookie
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return successResponse(res, "Login successful", {
            accessToken,
            user
        });

    } catch (error) {
        console.log(error);
        next(error);

        // return errorResponse(res, error.message, 500);
    }
};


exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return errorResponse(res, "No refresh token", 401);

        let payload;
        try {
            payload = JWT.verify(token, Tokens.refreshToken);
        } catch {
            return errorResponse(res, "Invalid or expired refresh token", 401);
        }


        const user = await User.findOne({
            _id: payload.id,
            refreshToken: token
        });

        if (!user) return errorResponse(res, "Invalid refresh token", 401);

        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const cookieOptions = {
            httpOnly: true,
            secure: NODE_ENV === "production",
                       sameSite: "none"
        };

        // ✅ ONLY refresh token cookie
        res.cookie("refreshToken", newRefreshToken, cookieOptions);


        user.password = undefined;

        return successResponse(res, "Token refreshed", {
            accessToken: newAccessToken,
            user
        });

    } catch (error) {
        next(error);

        console.log("Error", error);
        // return errorResponse(res, "Session expired", 401);
    }
};

exports.logout = async (req, res, next) => {
    try {
        let user = null;
        if (req.cookies?.refreshToken) {
            user = await User.updateOne(
                { refreshToken: req.cookies.refreshToken },
                { $set: { refreshToken: null } }
            );
        }

        // await AuditLog.create(
        //     [{
        //         action: "USER_LOGOUT",
        //         performedBy: req.user._id,
        //         targetId: recipe._id,
        //         targetType: "USER"
        //     }],
        // );


        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "none"
        });


        return successResponse(res, "Logout successful");
    } catch (error) {
        next(error);

        // return errorResponse(res, error.message, 500);
    }
};


exports.requestEmailChange = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { newEmail } = req.body;

        const user = await User.findById(userId);
        if (!user) return errorResponse(res, "User not found", 404);

        // Check if email already exists
        const emailExist = await User.findOne({ email: newEmail });
        if (emailExist) return errorResponse(res, "Email already in use", 400);

        // Generate OTP
        const verificationCode = generateNumOTP(6);
        const verificationExpiry = Date.now() + 5 * 60 * 1000; // 5 min


        // Save temp email change
        user.emailChange = {
            newEmail,
            verificationCode,
            verificationExpiry,
        };
        await user.save();

        // Send email with OTP
        await verifyMail({
            username: user.username,
            email: user.emailChange.newEmail,
            verificationCode: user.emailChange.verificationCode,
            purpose: "EMAIL_CHANGE"
        });



        // Log
        await logUserActivity(user._id, "EMAIL_CHANGE_REQUESTED", req);

        return successResponse(res, "OTP sent to new email. Please verify.");

    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to request email change", 500);
    }
};

exports.verifyEmailChange = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { otp } = req.body;

        const user = await User.findById(userId);
        if (!user) return errorResponse(res, "User not found", 404);
        if (!user.emailChange) return errorResponse(res, "No email change request found", 400);

        if (Date.now() > user.emailChange.verificationExpiry) {
            return errorResponse(res, "OTP expired", 400);
        }

        if (String(user.emailChange.verificationCode) !== String(otp)) {
            return errorResponse(res, "Invalid OTP", 400);
        }

        // ✅ OTP valid, update email
        user.email = user.emailChange.newEmail;
        user.emailChange = undefined;
        user.isVerified = true; // verified again
        await user.save();

        await logUserActivity(user._id, "EMAIL_CHANGED", req);

        return successResponse(res, "Email updated successfully", user);

    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to verify email change", 500);
    }
};
