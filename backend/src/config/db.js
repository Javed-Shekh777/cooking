const mongoose = require("mongoose");
const { MONGODB_URL } = require("../constants");


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 30000, // 30 sec
            socketTimeoutMS: 45000, // optional
        });

        console.log(`MongoDb connected... ${connect.connect.name} ${connect.connection.host}`);
    } catch (error) {
        console.log(`MONGODB error ${error}`);
        throw Error(error);
    }
};


module.exports = connectDB;