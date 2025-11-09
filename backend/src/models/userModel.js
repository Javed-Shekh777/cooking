const mongoose = require("mongoose");
const { SchemaName, SALT, Tokens } = require("../constants");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'chef', 'moderator', 'user'],
        default: 'user',
        required:[true,"Role is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase:true,
        trim:true
    },
    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim:true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        lowercase:true,
        trim:true
    },
    mobile: {
        type: String,
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        // maxlength: [15, "Password cannot exceed 15 characters"]
        // required removed for social login
    },
    profileImage: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'twitter', 'apple', 'microsoft'],
        default: 'local'
    },
    providerId: {
        type: String // unique ID from social provider
    },
    webToken:{type:String},
    accessToken: { type: String },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpiry: { type: Date },
    
}, { timestamps: true });


// Hash password if exists
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, SALT);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.password) return false; // for social users with no password
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return JWT.sign({ id: this._id, email: this.email }, Tokens.acessToken, {
        expiresIn: Tokens.accessTokenExpiry
    });
};

userSchema.methods.generateRefreshToken = function () {
    return JWT.sign({ id: this._id }, Tokens.refreshToken, {
        expiresIn: Tokens.refreshTokenExpiry
    });
};

module.exports = mongoose.model(SchemaName.user, userSchema);
