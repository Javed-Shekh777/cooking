const mongoose = require("mongoose");
const { SchemaName } = require("../constants");


const tagSchema = new mongoose.Schema({
    name: { type: String, trim: true, unique: true }
}, { timestamps: true });

const tagModel = mongoose.model(SchemaName.tag, tagSchema);

module.exports = tagModel;


// tagModel.insertMany([
//     {
//         name: "Quick",
//     },{
//          name: "Vegetarian"
//     },
//     {
//           name: "Snack",
      
//     },
//     {
//           name: "Breakfast",
      
//     },
//     {
//           name: "Tasty",
//     },{
//         name: "Yummy"

//     }
// ]);