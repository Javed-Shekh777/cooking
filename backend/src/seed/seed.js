require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model"); // <-- apne model ka path yaha daalo

const seedData = [
  {
    name: "Masala Dosa",
    category: "Indian",
    ingredients: ["Rice", "Urad Dal", "Potato", "Spices"],
    instructions: "Soak rice & dal, grind, ferment, prepare batter, fry dosa.",
  },
  {
    name: "Chole Bhature",
    category: "Indian",
    ingredients: ["Chickpeas", "Flour", "Spices"],
    instructions: "Boil chole, fry bhature, serve hot.",
  },
  // 👇 Yaha apne recipes daalte jao —
  // A,B,C,D,E ki jitni recipes chahiye — sab isi array me daalo
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");

    await Recipe.deleteMany(); // optional (purana data remove karega)
    console.log("🗑️ Old recipes cleared!");

    const inserted = await Recipe.insertMany(seedData);
    console.log(`🍽️ Successfully inserted ${inserted.length} recipes!`);

    process.exit(0); // ✅ script khud bandh ho jayega
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
