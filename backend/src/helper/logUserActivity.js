// helper/logUserActivity.js
const UserLog = require("../models/userLog.model");

exports.logUserActivity = async (userId, action, req) => {
    try {
        let ip =
            req.headers["x-forwarded-for"]?.split(",")[0] || // agar proxy use ho raha hai to
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.ip ||
            "unknown";

        // "::1" ko "127.0.0.1" me convert karna (local case ke liye)
        if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
            ip = "127.0.0.1";
        }

        await UserLog.create({
            userId,
            action,
            ip,
            userAgent: req.headers["user-agent"] || "unknown"
        });
    } catch (err) {
        console.error("Error logging user activity:", err.message);
        throw new Error(err);
    }
};
