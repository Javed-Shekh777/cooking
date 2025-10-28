const mongoose = require("mongoose");
const { MONGODB_URL } = require("../constants");


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(MONGODB_URL);
        console.log(`MongoDb connected... ${connect.connect.name}`);
    } catch (error) {
        console.log(`MONGODB error ${error}`);
        throw Error(error);
    }
};


module.exports = connectDB;