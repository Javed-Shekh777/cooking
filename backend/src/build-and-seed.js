require("dotenv").config();
const DB = require("./config/db");
const seed = require("./seed/catTagSeeder"); // सुनिश्चित करें कि यह async फ़ंक्शन है

async function buildAndSeed() {
    const shouldSeed = process.env.RUN_SEED_ON_BUILD === 'true';

    console.log(`Build started. Should run seeder? ${shouldSeed}`);

    if (shouldSeed) {
        try {
            await DB(); // DB से कनेक्ट करें
            await seed(); // सीडर चलाएं (इसमें process.exit() नहीं होना चाहिए अब)
            console.log("Seeding complete. Proceeding with build...");
        } catch (error) {
            console.error("Seeding failed:", error);
            // बिल्ड विफल होने दें यदि सीडिंग विफल होती है
            process.exit(1); 
        }
    }
    

    console.log("Custom build script finished.");
}

buildAndSeed();
