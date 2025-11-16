const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const recipeLikeSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.recipe,
    required: true
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
  saves: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }], // ✅ saved recipes
  views: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
  shares: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }]
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.recipeLike, recipeLikeSchema);
