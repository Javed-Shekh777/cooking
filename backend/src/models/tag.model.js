const mongoose = require("mongoose");
const { SchemaName } = require("../constants");


const tagSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
  unique: true,
  index: true
},
count: {
  type: Number,
  default: 0,
  min: 0
},

}, { timestamps: true });

const tagModel = mongoose.model(SchemaName.tag, tagSchema);

module.exports = tagModel;
 