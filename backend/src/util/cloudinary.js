const { cloudinaryConfig } = require("../constants");
const fs = require("fs").promises;

const cloudinary = require("cloudinary").v2;
const path = require("path");

// config set karo (env vars se lena best hai)
cloudinary.config(cloudinaryConfig);

// ✅ Upload file

 const cloudinaryUpload = async (filePath, folder, type = "image") => {
  try {
    const uploadRes = await cloudinary.uploader.upload(filePath, {
      folder: folder || "general",
      resource_type: type,
    });
    console.log(filePath);
    // ✅ Delete local file safely (only the filePath, not joined again)
    try {
      await fs.unlink(filePath);
      console.log("Local file deleted:", filePath);
    } catch (err) {
      console.warn("Local file deletion failed:", err.message);
    }

    return uploadRes;
  } catch (error) {
    // ✅ Attempt to delete even if upload fails
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Cleanup file deletion failed:", err.message);
    }

    throw new Error("Cloudinary upload failed: " + error.message);
  }
};


// ✅ Delete file
const cloudinaryDelete = async (public_id, fileType = "image") => {
  try {
    const res = await cloudinary.uploader.destroy(public_id, {
      resource_type: fileType
    });
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { cloudinaryUpload, cloudinaryDelete };
