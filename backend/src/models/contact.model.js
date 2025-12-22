const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const contactSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true
    },
    enquiryType: {
        type: String,
        enum: ["GENERAL", "SUPPORT", "FEEDBACK", "OTHER"], // apne hisab se types add kare
        default: "GENERAL"
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.contact, contactSchema);
