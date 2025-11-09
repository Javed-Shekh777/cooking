const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const commentSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.recipe,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
  replies: [replySchema]
}, { timestamps: true });

const recipeCommentModel = mongoose.model(SchemaName.recipeComment, commentSchema);

module.exports = recipeCommentModel;
