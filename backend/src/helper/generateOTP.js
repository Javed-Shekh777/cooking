const crypto =require("crypto");

const generateNumOTP = (length = 6) =>{
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        // crypto random byte, mod 10 → 0–9
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};


module.exports = { generateNumOTP};


