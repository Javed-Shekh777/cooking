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
        if (exist) {
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

        await verifyMail(createdUser[0]);

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

        console.log(req);
        const { username, password } = req.body;
        console.log(req.body, username?.toLowerCase());
        if (!username || !password) {
            return errorResponse(res, "All fields are required.", 400);
        }

        const user = await User.findOne({
            $or: [
                { email: username?.toLowerCase() },
                { username: username?.toLowerCase() }
            ]
        });
        if (!user) return errorResponse(res, "User not exist.", 404);

        if (!user?.isVerified) {
            return errorResponse(res, "Please first verify your email.", 400);
        }

        const isCorrect = await user.isPasswordCorrect(password);

        if (!isCorrect) return errorResponse(res, "Invalid credentials", 401);


        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            return errorResponse(res, "Something went wrong.", 402);
        }

        user.accessToken = await user.generateAccessToken();
        user.refreshToken = await user.generateRefreshToken();
        await user.save({ validateBeforeSave: false });
        user.password = undefined;
        await logUserActivity(user._id, "LOGIN", req);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            // maxAge: 7*24*60*60*1000
        };

        // set cookies
        res.cookie("accessToken", user.accessToken, cookieOptions);
        res.cookie("refreshToken", user.refreshToken, cookieOptions);
        res.cookie("loginUserData", user, cookieOptions);


        return successResponse(res, "Login successfully.", {
            user,
            accessToken: accessToken,
            // refreshToken: refreshToken
        });

    } catch (error) {
        return errorResponse(res, error.message || "Login failed. Please try again.", 500);
    }
};


// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return errorResponse(res, "No refresh token", 401);

        const payload = JWT.verify(token, Tokens.refreshToken);
        const user = await User.findById(payload.id);
        if (!user) return errorResponse(res, "User not found", 404);

        const newAccessToken = user.generateAccessToken();
        return successResponse(res, "Token refreshed", { accessToken: newAccessToken });
    } catch (err) {
        return errorResponse(res, err.message || "Token refresh failed", 401);
    }
}

exports.logout = async (req, res) => {
    try {
        let user = null;

        // Check if middleware ne user attach kiya
        if (req.user) {
            user = await User.findById(req.user._id);
        }

        // Agar middleware fail ho gaya → refreshToken se user nikaalo
        if (!user && req.cookies?.refreshToken) {
            user = await User.findOne({ refreshToken: req.cookies.refreshToken });
        }

        // User mila to uske tokens clear karo
        if (user) {
            user.accessToken = null;
            user.refreshToken = null;
            await user.save({ validateBeforeSave: false });

            await logUserActivity(user._id, "LOGOUT", req);
        }

        // Har case me cookies clear kar do
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.clearCookie("loginUserData");

        return successResponse(res, "Logout successfully");
    } catch (error) {
        return errorResponse(res, error.message || "Logout failed. Please try again.", 500);
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
