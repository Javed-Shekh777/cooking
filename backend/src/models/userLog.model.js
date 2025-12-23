const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const userLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user, required: true },
    action: {
        type: String,
        enum: ["REGISTER", "VERIFY_EMAIL", "LOGIN", "LOGOUT", "PASSWORD_RESET","EMAIL_VERIFIED"],
        required: true
    },
    ip: String,
    userAgent: String
}, { timestamps: true });

userLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model(SchemaName.userLog, userLogSchema);
