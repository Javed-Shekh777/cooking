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


const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const uniqueSuffix = Date.now(); // or use shortid/nanoid
  return `${baseSlug}-${uniqueSuffix}`;
};


module.exports = { generateNumOTP,generateSlug};


