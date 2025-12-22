const { Tokens } = require("../constants");
const { errorResponse } = require("../util/response");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticated = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return errorResponse(res, "Token not found.", 401);
        }

        let decoded;
        try {
            decoded = JWT.verify(token, Tokens.acessToken);
        } catch (err) {
            return errorResponse(res, "Invalid or expired token. Please login again.", 401);
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return errorResponse(res, "User does not exist.", 404);
        }

        // 🔥 IMPORTANT CHECK
        if (user.isBlocked || user.isDeleted) {
            return errorResponse(res, "Account is blocked or deleted.", 403);
        }

        req.user = user;
        next();
    } catch (error) {
        throw new Error(error);
        // return errorResponse(res, error.message || "Authentication failed.", 401);
    }
};


module.exports = authenticated;
