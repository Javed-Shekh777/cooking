const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const recipeLikeSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Types.ObjectId, 
    ref: SchemaName.recipe,
    required: [true,"Recipe Id is required."]
  },
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


const recipeLikeModel = mongoose.model(SchemaName.recipeLike, recipeLikeSchema);

module.exports = recipeLikeModel;