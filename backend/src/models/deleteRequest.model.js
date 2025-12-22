const { SchemaName } = require("../constants");
const mongoose = require("mongoose");

const deleteRequestSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ["RECIPE", "CATEGORY","USER","CHEF","ADMIN"],
    required: true
  },
  itemId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  requestedBy: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  reviewedBy: {
    type: mongoose.Types.ObjectId,
    ref: SchemaName.user
  },
  reviewedAt: {
    type: Date
  },

}, { timestamps: true });

deleteRequestSchema.index(
  { itemType: 1, itemId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "PENDING" } }
);

module.exports = mongoose.model(SchemaName.deleteRequest, deleteRequestSchema);


