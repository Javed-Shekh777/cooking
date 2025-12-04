const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const ImageSchema = {
  url: { type: String },
  public_id: { type: String },
  resource_type: { type: String }
};

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

const recipeSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: SchemaName.user,
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
        stepNumber: { type: Number },
        heading: { type: String, trim: true },
        description: { type: String, trim: true },
        stepImage: ImageSchema,
        stepVideo: VideoSchema // 👈 अब हर step में image या video दोनों optional हैं
      }
    ],
    video: VideoSchema,// 👈 अब हर step में image या video दोनों optional हैं
    dishImage: ImageSchema, // 👈 सिर्फ image allowed
    // dishVideo हटा दिया गया है

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
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    difficultyLevel: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true
    },
    estimatedCost: {
      type: Number, // or String like "₹200"
    },
    isPublished: { type: Boolean, default: true },
    commentsCount: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // likes: { type: Number, default: 0 },
    // views: { type: Number, default: 0 },
    // shares: { type: Number, default: 0 },
    ratings: [{
      user: { type: mongoose.Types.ObjectId, ref: SchemaName.user },
      value: { type: Number, min: 1, max: 5 },
      comment: String
    }],
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    likes: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
    saves: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }], // ✅ saved recipes
    views: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
    shares: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }]

  },
  { timestamps: true }
);

const recipeModel = mongoose.model(SchemaName.recipe, recipeSchema);

module.exports = recipeModel;
