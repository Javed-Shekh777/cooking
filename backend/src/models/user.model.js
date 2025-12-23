const mongoose = require("mongoose");
const { SchemaName, SALT, Tokens, ROLES } = require("../constants");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");


// In your User or Chef model
const ChefProfileSchema = new mongoose.Schema(
    {
        experienceYears: {
            type: Number,
            min: 0,
            max: 60,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: "Experience must be an integer year count",
            },
        },
        specialization: {
            type: [String],
            default: [],
            // Optional: restrict to known cuisines
            enum: [
                "Indian",
                "Chinese",
                "Italian",
                "Mexican",
                "Japanese",
                "Thai",
                "French",
                "Turkish",
                "Mediterranean",
                "Middle Eastern",
                "Korean",
                "Spanish",
                "American",
                "Vietnamese",
                "Fusion",
            ],
        },
        certifications: {
            type: [String],
            default: [],
            // Optional: trim and prevent empty strings
            set: (arr) => (Array.isArray(arr) ? arr.filter((s) => s?.trim()) : []),
        },
    },
    { _id: false }
);

// Example embedding in User schema
const UserSchema = new mongoose.Schema({
    // ...
    role: { type: String, enum: ["user", "chef", "admin"], default: "user" },
    chefProfile: { type: ChefProfileSchema, default: () => ({}) }
});


const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ROLES,
        default: 'user',
        required: [true, "Role is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        lowercase: true,
        trim: true,
        unique: true
    },

    mobile: {
        type: String,
    },
    dob: {
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
    bio: {
        type: String,
        maxlength: 300,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    dateOfBirth: {
        type: Date
    },
    location: {
        // city: String,
        // country: String
        type: String
    },

    isChefApproved: {
        type: Boolean,
        default: false
    },
    chefAppliedAt: Date,
    chefApprovedAt: Date,
    chefProfile: {
        experienceYears: Number,
        specialization: [String], // eg: ["Indian", "Chinese"]
        certifications: [String]
    },

    lastLoginAt: {
        type: Date
    },

    savedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaName.recipe
    }],

    likedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaName.recipe
    }],


    provider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'twitter', 'apple', 'microsoft'],
        default: 'local'
    },
    providerId: {
        type: String // unique ID from social provider
    },
    webToken: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpiry: { type: Date },

    emailChange: {
        newEmail: { type: String },        // new email waiting verification
        verificationCode: { type: String },
        verificationExpiry: { type: Date },
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaName.user
    },
    deletedAt: {
        type: Date
    }

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
