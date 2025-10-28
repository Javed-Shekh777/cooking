const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,        // short description about the category
  },
  image: {
    url: { type: String },          // optional image URL
    public_id: { type: String },    // cloudinary public_id if using cloudinary
  },
  icon: { type: String },          // react icon name or class
  count: { type: Number, default: 0 }  // number of recipes in this category
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.recipeCategory, categorySchema);


