const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
    lowercase: true,
    index: true
  },

  description: {
    type: String,
    trim: true,
  },

  // ✅ FIX: 'image' को 'categoryImage' में बदला गया
  categoryImage: {
    url: { type: String },          // optional image URL
    public_id: { type: String },    // cloudinary public_id if using cloudinary
  },

  icon: { type: String },          // emoji or icon string
  count: {
    type: Number,
    default: 0,
    min: 0
  },



  deletedBy: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user
  },

  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deleteReason: String,


}, { timestamps: true });

module.exports = mongoose.model(SchemaName.recipeCategory, categorySchema);

