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
    trim: true,
  },

  // ✅ FIX: 'image' को 'categoryImage' में बदला गया
  categoryImage: {
    url: { type: String },          // optional image URL
    public_id: { type: String },    // cloudinary public_id if using cloudinary
  },

  icon: { type: String },          // emoji or icon string
  count: { type: Number, default: 0 },  // number of recipes in this category
  isActive: {
    type: Boolean,
    default: true
  },
  deactivatedAt: { type: Date },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: { type: Date },
  deletedBy: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user
  }
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.recipeCategory, categorySchema);

