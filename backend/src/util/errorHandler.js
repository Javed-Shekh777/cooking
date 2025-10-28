const { errorResponse } = require("./response");

const errorHandler = (err, req, res, next) => {
    console.error("Error 💥:", err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value: ${JSON.stringify(err.keyValue)}`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    return errorResponse(res,message,statusCode);

    

};

module.exports = errorHandler;