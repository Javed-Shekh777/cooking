const { errorResponse, successResponse } = require("../util/response");
const User = require("../models/user.model");
const { contactMail } = require("../helper/sendMail");
const { cloudinaryFolderNames, mailOptions } = require("../constants");
const Contact = require("../models/contact.model");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");


exports.contact = async (req, res, next) => {
    try {
        console.log(req.body);
        const { username, email, subject, enquiryType, message } = req.body;

        if (!username || !email || !subject || !message) {
            return errorResponse(res, "All fields are required", 400);
        }

        const newContact = await Contact.create({ username, email, subject, enquiryType: enquiryType || "GENERAL", message });

        // Send email notification

        await contactMail({
            to: mailOptions.ownerEmail,
            username,
            email,
            subject,
            message,
            enquiryType,
            type: "ADMIN"
        });

        await contactMail({
            to: email,
            username,
            subject,
            type: "USER"
        });


        return successResponse(res, "Contact form submitted successfully");
    } catch (error) {
        next(error);

        // return errorResponse(res, "Failed to contact.", 500);
    }
}


exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .select("-password -accessToken -refreshToken -verificationCode -verificationExpiry -webToken")
            .lean();

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
        return successResponse(res, "User profile fetched successfully", user);
    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to fetch user profile", 500);
    }
};


exports.updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;


        const { fullName, username, oldImage, role, bio, dateOfBirth, gender, location } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        if (username && username !== user.username) {
            const exists = await User.findOne({ username });
            if (exists) {
                return errorResponse(res, "Username already taken", 400);
            }
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
        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.gender = gender || user.gender;
        await user.save();

        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.refreshToken;

        return successResponse(res, "Profile updated", safeUser);

    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to update user profile", 500);
    }
};