const Category = require("../models/recipeCategorySchema"); // path apne project ke hisaab se update karna
const Tag = require("../models/tagSchema"); // path apne project ke hisaab se update karna

async function seed() {
  try {

     const recipes = [
  {
    name: "Masala Dosa",
    description: "Crispy dosa filled with spicy aloo masala.",
    category: "South Indian",
    ingredients: ["Rice", "Urad Dal", "Potato", "Mustard Seeds", "Curry Leaves"],
    instructions: ["Soak rice and dal", "Grind to batter", "Make aloo masala", "Spread and fold dosa"],
    dishImage: { url: "", public_id: "" },
    tags: ["breakfast", "crispy", "traditional"]
  },
  {
    name: "Chole Bhature",
    description: "Delhi style spicy chole served with fluffy bhature.",
    category: "North Indian",
    ingredients: ["Chickpeas", "Flour", "Spices", "Onion", "Tomato"],
    instructions: ["Soak chole", "Cook with spices", "Prepare dough", "Deep fry bhature"],
    dishImage: { url: "", public_id: "" },
    tags: ["street-food", "spicy", "punjabi"]
  },
  {
    name: "Pav Bhaji",
    description: "Mumbai famous buttery vegetable bhaji served with pav.",
    category: "Street Food",
    ingredients: ["Tomato", "Potato", "Pav Bhaji Masala", "Butter"],
    instructions: ["Boil vegetables", "Mash and cook with masala", "Toast pav in butter"],
    dishImage: { url: "", public_id: "" },
    tags: ["mumbai", "butter", "evening-snack"]
  },
  {
    name: "Idli Sambhar",
    description: "Soft idlis served with tangy sambhar and chutney.",
    category: "South Indian",
    ingredients: ["Rice", "Urad Dal", "Toor Dal", "Vegetables"],
    instructions: ["Prepare batter", "Steam idlis", "Cook sambhar", "Serve hot"],
    dishImage: { url: "", public_id: "" },
    tags: ["breakfast", "healthy"]
  },
  {
    name: "Fried Rice",
    description: "Chinese style stir-fried rice with vegetables.",
    category: "Chinese",
    ingredients: ["Rice", "Spring Onion", "Soy sauce", "Carrot"],
    instructions: ["Boil rice", "Stir fry vegetables", "Mix together"],
    dishImage: { url: "", public_id: "" },
    tags: ["fast-food", "veg"]
  },
  {
    name: "Chicken Biryani",
    description: "Hyderabadi style layered and spiced chicken biryani.",
    category: "Non-Veg",
    ingredients: ["Chicken", "Basmati Rice", "Saffron", "Spices"],
    instructions: ["Marinate chicken", "Cook rice", "Layer and steam"],
    dishImage: { url: "", public_id: "" },
    tags: ["biryani", "hyderabadi", "spicy"]
  },
  {
    name: "Paneer Butter Masala",
    description: "Rich creamy tomato gravy with paneer.",
    category: "North Indian",
    ingredients: ["Paneer", "Tomato", "Cream", "Butter"],
    instructions: ["Cook tomato gravy", "Add paneer cubes", "Finish with cream"],
    dishImage: { url: "", public_id: "" },
    tags: ["punjabi", "restaurant-style"]
  },
  {
    name: "Rajma Chawal",
    description: "Punjabi rajma curry served with steamed rice.",
    category: "North Indian",
    ingredients: ["Rajma", "Tomato", "Onion", "Rice"],
    instructions: ["Soak rajma", "Pressure cook", "Make gravy", "Serve with rice"],
    dishImage: { url: "", public_id: "" },
    tags: ["comfort-food", "home-style"]
  },
  {
    name: "Aloo Paratha",
    description: "Stuffed paratha served with curd and pickle.",
    category: "Breakfast",
    ingredients: ["Wheat Flour", "Potato", "Masala"],
    instructions: ["Prepare dough", "Make stuffing", "Roll and fry"],
    dishImage: { url: "", public_id: "" },
    tags: ["punjabi", "stuffed"]
  },
  {
    name: "Vegetable Maggi",
    description: "Instant noodles cooked with vegetables and masala.",
    category: "Fast Food",
    ingredients: ["Maggi", "Onion", "Capsicum"],
    instructions: ["Boil noodles", "Cook vegetables", "Mix and serve"],
    dishImage: { url: "", public_id: "" },
    tags: ["quick", "snack"]
  },

  // --- Remaining 10 ---

  {
    name: "Dal Tadka",
    description: "Toor dal tempered with ghee and spices.",
    category: "Indian Veg",
    ingredients: ["Toor Dal", "Ghee", "Jeera", "Garlic"],
    instructions: ["Cook dal", "Prepare tadka", "Mix and serve"],
    dishImage: { url: "", public_id: "" },
    tags: ["home-style", "simple"]
  },
  {
    name: "Gulab Jamun",
    description: "Soft sweet balls soaked in sugar syrup.",
    category: "Dessert",
    ingredients: ["Khoya", "Sugar", "Cardamom"],
    instructions: ["Make dough", "Fry balls", "Prepare syrup", "Soak and serve"],
    dishImage: { url: "", public_id: "" },
    tags: ["sweet", "festival"]
  },
  {
    name: "Ras Malai",
    description: "Soft cheese patties in sweet flavored milk.",
    category: "Dessert",
    ingredients: ["Milk", "Sugar", "Cardamom", "Saffron"],
    instructions: ["Prepare chenna", "Make patties", "Soak in rabri"],
    dishImage: { url: "", public_id: "" },
    tags: ["sweet", "bengali"]
  },
  {
    name: "Chicken Momos",
    description: "Steamed dumplings filled with minced chicken.",
    category: "Tibetan",
    ingredients: ["Flour", "Chicken", "Ginger", "Garlic"],
    instructions: ["Make dough", "Prepare stuffing", "Steam momos"],
    dishImage: { url: "", public_id: "" },
    tags: ["street-food", "dumplings"]
  },
  {
    name: "Hakka Noodles",
    description: "Stir fried noodles with vegetables.",
    category: "Chinese",
    ingredients: ["Noodles", "Capsicum", "Soy Sauce"],
    instructions: ["Boil noodles", "Stir fry veggies", "Mix and serve"],
    dishImage: { url: "", public_id: "" },
    tags: ["fast-food"]
  },
  {
    name: "Poha",
    description: "Flattened rice cooked with onion and peanuts.",
    category: "Breakfast",
    ingredients: ["Poha", "Peanuts", "Onion", "Mustard Seeds"],
    instructions: ["Wash poha", "Cook tadka", "Mix and serve"],
    dishImage: { url: "", public_id: "" },
    tags: ["quick", "light"]
  },
  {
    name: "Upma",
    description: "South Indian dish made from semolina.",
    category: "Breakfast",
    ingredients: ["Rava", "Vegetables", "Mustard Seeds"],
    instructions: ["Roast rava", "Cook tadka", "Mix and steam"],
    dishImage: { url: "", public_id: "" },
    tags: ["healthy", "simple"]
  },
  {
    name: "Masala Tea",
    description: "Milk tea flavored with spices.",
    category: "Beverage",
    ingredients: ["Tea", "Milk", "Ginger", "Cardamom"],
    instructions: ["Boil milk with spices", "Add tea", "Serve hot"],
    dishImage: { url: "", public_id: "" },
    tags: ["chai", "desi"]
  },
  {
    name: "Cold Coffee",
    description: "Chilled creamy coffee shake.",
    category: "Beverage",
    ingredients: ["Coffee", "Milk", "Sugar", "Ice"],
    instructions: ["Blend all ingredients", "Serve chilled"],
    dishImage: { url: "", public_id: "" },
    tags: ["cafe", "refreshing"]
  },
  {
    name: "Egg Curry",
    description: "Boiled eggs cooked in spiced onion tomato gravy.",
    category: "Non-Veg",
    ingredients: ["Eggs", "Onion", "Tomato", "Spices"],
    instructions: ["Prepare gravy", "Add eggs", "Cook and serve"],
    dishImage: { url: "", public_id: "" },
    tags: ["simple", "home-style"]
  }
];

 
    

    console.log("✅ Seed Completed Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Failed:", err);
    process.exit();
  }
}

seed();
