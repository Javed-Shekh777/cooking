const { SchemaName } =require("../constants");
const mongoose = require("mongoose");

const deleteRequestSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ["RECIPE", "CATEGORY"],
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
  }
}, { timestamps: true });


module.exports = mongoose.model(SchemaName.deleteRequest, deleteRequestSchema);


