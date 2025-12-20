const { errorResponse, successResponse } = require("../util/response");
const User = require("../models/userModel");
const { verifyMail, accountCreationMail, contactMail } = require("../helper/sendMail");
const { generateNumOTP } = require("../helper/generateOTP");
const JWT = require("jsonwebtoken");
const { Tokens, cloudinaryFolderNames } = require("../constants");
const { logUserActivity } = require("../helper/logUserActivity");
const Contact = require("../models/contactSchema");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");






exports.localRegister = async (req, res, next) => {
    const session = await User.startSession();
    session.startTransaction();

    try {
        const { username, email, password = "", role, fullName } = req.body;
        if (!username || !email || !role || !fullName || !password) {
            return errorResponse(res, "All fields required", 400);
        }

        const exist = await User.findOne({ email }).session(session);
        if (exist && exist?.isVerified) {
            return errorResponse(res, "User already exists", 400);
        }

        const verificationCode = generateNumOTP(6);
        const verificationExpiry = Date.now() + 2 * 60 * 1000;
        const webToken = JWT.sign({ email, verificationCode }, Tokens.webToken, { expiresIn: Tokens.webTokenExpiry });

        const createdUser = await User.create([{
            username,
            email,
            password,
            role,
            verificationCode,
            verificationExpiry,
            webToken,
            fullName
        }], { session });

        await verifyMail({
            username: createdUser[0].username,
            email: createdUser[0].email,
            verificationCode: createdUser[0].verificationCode,
            webToken: createdUser[0].webToken,
            purpose: "REGISTER"
        });



        // Log
        await logUserActivity(createdUser[0]._id, "REGISTER_AND_VERIFICATION_MAIL_SENT", req);

        await session.commitTransaction();
        session.endSession();


        return successResponse(res, "User registered. Please verify your email.", createdUser[0]);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
        // return errorResponse(res, err.message || "Registration failed. Please try again.", 500);
    }
};


exports.verifyMail = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return errorResponse(res, "Something went wrong.", 400);
        }
        const user = await User.findOne({ email });
        if (!user) return errorResponse(res, "User not found.", 404);
        // if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Verify token
        JWT.verify(token, Tokens.webToken);

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpiry = null;
        user.webToken = null;
        await user.save();

        // Log the fact that verification succeeded
        await logUserActivity(user._id, "EMAIL_VERIFIED", req);

        // Send welcome mail
        await accountCreationMail(user);

        // Optional: Log that welcome mail was sent
        await logUserActivity(user._id, "WELCOME_MAIL_SENT", req);



        return successResponse(res, "Mail verified successfully.");

    } catch (error) {
        return errorResponse(res, error.message || "Verification failed. Please try again.", 500);

    }

};


exports.localLogin = async (req, res) => {
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

        if (!user) return errorResponse(res, "User not exist.", 404);
        if (!user.isVerified) {
            return errorResponse(res, "Please verify your email.", 400);
        }

        const isCorrect = await user.isPasswordCorrect(password);
        if (!isCorrect) return errorResponse(res, "Invalid credentials", 401);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // ✅ ONLY refresh token DB me rakho
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        user.password = undefined;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            //   sameSite: "strict",
        };

        // ✅ ONLY refresh token cookie
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return successResponse(res, "Login successful", {
            accessToken,
            user
        });

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        console.log("Refresh", req.cookies, token);
        if (!token) return errorResponse(res, "No refresh token", 401);

        const payload = JWT.verify(token, Tokens.refreshToken);
        console.log(payload);

        const user = await User.findOne({
            _id: payload.id,
            refreshToken: token
        });

        console.log("1");
        if (!user) return errorResponse(res, "Invalid refresh token", 401);

        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        console.log("2");

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });
        console.log("3");

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
        console.log("4");

        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        user.password = undefined;
        console.log("5");

        return successResponse(res, "Token refreshed", {
            accessToken: newAccessToken,
            user
        });

    } catch (err) {
        console.log("Error", err);
        return errorResponse(res, "Session expired", 401);
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.cookies?.refreshToken) {
            await User.updateOne(
                { refreshToken: req.cookies.refreshToken },
                { $set: { refreshToken: null } }
            );
        }

        res.clearCookie("refreshToken");

        return successResponse(res, "Logout successful");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


exports.contact = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, subject, enquiryType, message } = req.body;

        if (!username || !email || !subject || !message) {
            return errorResponse(res, "All fields are required", 400);
        }

        const newContact = await Contact.create({ username, email, subject, enquiryType, message });

        // Send email notification

        await contactMail(newContact);
        return successResponse(res, "Contact form submitted successfully");
    } catch (error) {
        return errorResponse(res, "Failed to contact.", 500);
    }
}


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password -accessToken -refreshToken -verificationCode -verificationExpiry -webToken");
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
        return successResponse(res, "User profile fetched successfully", user);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to fetch user profile", 500);
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, username, oldImage } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        // Handle image upload
        if (req.file) {
            const uploadRes = await cloudinaryUpload(req.file.buffer, cloudinaryFolderNames.profile, "image");

            if (uploadRes?.secure_url && uploadRes?.public_id) {
                user.profileImage = {
                    url: uploadRes.secure_url,
                    publicId: uploadRes.public_id,
                };

                if (oldImage) {
                    await cloudinaryDelete(oldImage);
                }
            } else {
                return errorResponse(res, "Image upload failed", 500);
            }
        }

        // Update profile fields
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;

        await user.save();
        return successResponse(res, "User profile updated successfully", user);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to update user profile", 500);
    }
};



exports.requestEmailChange = async (req, res) => {
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

        return successResponse(res, "OTP sent to new email. Please verify.", user);

    } catch (error) {
        return errorResponse(res, error.message || "Failed to request email change", 500);
    }
};


exports.verifyEmailChange = async (req, res) => {
    try {
        const userId = req.user._id;
        const { otp } = req.body;

        const user = await User.findById(userId);
        if (!user) return errorResponse(res, "User not found", 404);
        if (!user.emailChange) return errorResponse(res, "No email change request found", 400);

        if (Date.now() > user.emailChange.verificationExpiry) {
            return errorResponse(res, "OTP expired", 400);
        }

        if (user.emailChange.verificationCode !== otp) {
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
        return errorResponse(res, error.message || "Failed to verify email change", 500);
    }
};
