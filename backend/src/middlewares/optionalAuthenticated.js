const JWT = require("jsonwebtoken");
const User = require("../models/user.model");

exports.optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null; // 👈 public user
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("_id role");
    req.user = user || null;

    next();
  } catch (err) {
    req.user = null; // 👈 invalid token → treat as public
    next();
  }
};
