const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const ImageSchema = {
    url: { type: String },
    public_id: { type: String },
    resource_type: { type: String }
}

const VideoSchema = {
    url: { type: String },
    public_id: { type: String },
    duration: { type: Number },
    height: { type: Number },
    width: { type: Number },
    resource_type: { type: String }

};


const TimeSchema = {
    value: { type: Number },
    unit: { type: String, enum: ["min", "h", "sec"] }
};

const recipeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId, ref: SchemaName.user,
        required: [true, "Author info is required."]
    },

    title: {
        type: String,
        required: [true, "Recipe Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Recipe description is required."],
        trim: true
    },

    directions: [
        {
            stepNumber: { type: Number, },
            heading: { type: String, trim: true },
            description: { type: String, trim: true },
            image: ImageSchema
        }
    ],

    dishImage: ImageSchema,
    dishVideo: VideoSchema,

    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: SchemaName.recipeCategory
    },
    nutrients: [
        {
            name: String,
            quantity: String, // "300kcal", "30mg"
            unit: String // "g", "kg", "ml"
        }
    ],
    ingredients: [
        {
            name: String,
            quantity: String,
            unit: String // "g", "kg", "ml"
        }
    ],
    prepTime: TimeSchema,
    cookTime: TimeSchema,
    servings: { type: Number },
    tags: [{
        type: String,
        trim: true
    }],

    likes: [{
        type: mongoose.Types.ObjectId, ref: SchemaName.user
    }],
    views: [{
        type: mongoose.Types.ObjectId, ref: SchemaName.user
    }],
    shares: [{
        type: mongoose.Types.ObjectId, ref: SchemaName.user
    }]

}, { timestamps: true });


const recipeModel = mongoose.model(SchemaName.recipe, recipeSchema);

module.exports = recipeModel;