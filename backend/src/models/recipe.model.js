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



    directions: {
      type: [{
        stepNumber: { type: Number, required: true },
        heading: { type: String, trim: true },
        description: { type: String, trim: true, required: true },
        stepImage: ImageSchema,
        stepVideo: VideoSchema
      }],
      validate: [arr => arr.length > 0, "At least one step is required"]
    },


    dishVideo: VideoSchema,// 👈 अब हर step में image या video दोनों optional हैं
    dishImage: ImageSchema, // 👈 सिर्फ image allowed
    // dishVideo हटा दिया गया है

    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: SchemaName.recipeCategory,
      required: true
    },


    nutrients: [
      {
        name: String,
        quantity: String, // "300kcal", "30mg"
        unit: String // "g", "kg", "ml"
      }
    ],


    ingredients: {
      type: [{
        name: { type: String, required: true },
        quantity: { type: String },
        unit: { type: String }
      }],
      required: true
    },


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
    isPublished: {
      type: Boolean,
      default: true
    },

    commentsCount: { type: Number, default: 0 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },


    // likes: { type: Number, default: 0 },
    // views: { type: Number, default: 0 },
    // shares: { type: Number, default: 0 },
    ratings: [{
      user: { type: mongoose.Types.ObjectId, ref: SchemaName.user },
      value: { type: Number, min: 1, max: 5 },
      comment: String
    }],
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalRatings: { type: Number, default: 0 },

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: { type: Date },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      ref: SchemaName.user
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
    saves: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }], // ✅ saved recipes
    views: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
    shares: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }]

  },
  { timestamps: true }
);
recipeSchema.index({ title: "text", tags: "text" });


const recipeModel = mongoose.model(SchemaName.recipe, recipeSchema);

module.exports = recipeModel;
