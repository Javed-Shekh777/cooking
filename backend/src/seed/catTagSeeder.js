const upload = require("../config/multerconfig");
const { cloudinaryFolderNames } = require("../constants");
const { tags, categories } = require("../helper/rawData");
const Category = require("../models/recipeCategorySchema"); // path apne project ke hisaab se update karna
const Tag = require("../models/tagSchema"); // path apne project ke hisaab se update karna
const { cloudinaryUpload } = require("../util/cloudinary");
const path = require("path");

module.exports = async function seed() {
  try {


    // ✅ Clear Old Data Before Inserting (optional)
    await Category.deleteMany({});
    await Tag.deleteMany({});

    // for (const cat of categories) {
    //   if (cat.categoryImage) {
    //     cat.categoryImage = path.resolve(__dirname, cat.categoryImage);


    //     const cloud = await cloudinaryUpload(cat.categoryImage, cloudinaryFolderNames.images,"image");
    //     cat.image = {
    //       url: cloud.source_url,
    //       public_id: cloud.public_id,
    //     };
    //   }
    // }




    // ✅ Insert New Data
    await Category.insertMany(categories);
    await Tag.insertMany(tags);

    console.log("✅ Seed Completed Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Failed:", err);
    process.exit();
  }
}

