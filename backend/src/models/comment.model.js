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
  likes: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }]
}, { timestamps: true });


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
   parentId: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.recipeComment,
    default: null   // null = top-level comment
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: SchemaName.user }],
  // replies: [replySchema],

  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user
  },

}, { timestamps: true });
commentSchema.index({ recipeId: 1, createdAt: -1 });

const recipeCommentModel = mongoose.model(SchemaName.recipeComment, commentSchema);

module.exports = recipeCommentModel;
