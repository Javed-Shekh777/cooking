const { Tokens } = require("../constants");
const { errorResponse } = require("../util/response");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticated = async (req, res, next) => {
    try {
        let token;

        // Header token
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // Cookie token
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }


        if (!token) {
            return errorResponse(res, "Token not found.", 401);
        }

        console.log("Token",req.cookies?.accessToken);
        console.log(req.headers.authorization);


        // Verify JWT
        let decoded;
        try {
            decoded = JWT.verify(token, Tokens.acessToken);
        } catch (err) {
            return errorResponse(res, "Invalid or expired token. Please login again.", 401);
        }

        // Fetch user from DB
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return errorResponse(res, "User does not exist.", 404);
        }

        req.user = user;
        next();

    } catch (error) {
        return errorResponse(res, error.message || "Authentication failed.", 401);
    }
};

module.exports = authenticated;
