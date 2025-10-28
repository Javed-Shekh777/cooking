const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const userLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user, required: true },
    action: { type: String, required: true },  // e.g. "REGISTER", "VERIFY_EMAIL", "LOGIN"
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(SchemaName.userLog, userLogSchema);
