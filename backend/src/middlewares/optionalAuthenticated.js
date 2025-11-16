const { Tokens } = require("../constants");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

const optionalAuthenticated = async (req, res, next) => {
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
            req.user = undefined; // स्पष्ट रूप से सेट करें कि कोई उपयोगकर्ता नहीं है
            return next(); // बस आगे बढ़ें
        }

        // Verify JWT
        let decoded;
        try {
            decoded = JWT.verify(token, Tokens.acessToken);
        } catch (err) {
            // टोकन अमान्य है, लेकिन फिर भी आगे बढ़ें
            req.user = undefined;
            return next(); 
        }

        // Fetch user from DB
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
             req.user = user; // उपयोगकर्ता मिल गया
        } else {
             req.user = undefined; // उपयोगकर्ता नहीं मिला
        }
       
        next(); // अनुरोध को पास करें

    } catch (error) {
        // यदि बीच में कोई और त्रुटि आती है, तो भी अनुरोध को जाने दें
        req.user = undefined; 
        next();
    }
};

module.exports = optionalAuthenticated;
