const tags = [
    { name: "healthy" },
    { name: "spicy" },
    { name: "quick" },
    { name: "low-calorie" },
    { name: "budget" },
    { name: "kids-special" },
    { name: "high-protein" },
    { name: "street-food" },
    { name: "traditional" },
    { name: "festive" },
    { name: "sweet" },
    { name: "vegan" },
    { name: "breakfast" },
    { name: "lunch" },
    { name: "snacks" },
];


// Category Raw Data 

const categories = [
    {
        name: "Breakfast",
        description: "Morning energy meals",
        categoryImage: "../images/pexels-janetrangdoan-793772.jpg",
        icon: "🍳"
    },
    {
        name: "Lunch",
        description: "Midday full meal",
        categoryImage: "../images/pexels-daniela-elena-tentis-118658-691114.jpg",
        icon: "🍱"
    },
    {
        name: "Dinner",
        description: "Night meal recipes",
        categoryImage: "../images/pexels-janetrangdoan-793772.jpg",
        icon: "🍽️"
    },
    {
        name: "Snacks",
        description: "Light bites and munchies",
        categoryImage: "../images/pexels-novkov-visuals-745725-34618727.jpg",
        icon: "🥨"
    },
    {
        name: "Beverages",
        description: "Juices, shakes and drinks",
        categoryImage: "../images/pexels-janetrangdoan-1099680.jpg",
        icon: "🥤"
    },
    {
        name: "Dessert",
        description: "Sweets and bakery",
        categoryImage: "../images/pexels-beatriz-haiana-2154400330-34599529.jpg",
        icon: "🍰"
    },
    {
        name: "Vegan",
        description: "100% plant based food",
        categoryImage: "../images/pexels-janetrangdoan-793772.jpg",
        icon: "🥗"
    },

    {
        name: "Non-Veg",
        description: "Chicken, meat, fish and eggs",
        categoryImage: "../images/pexels-christina-agalia-2156276332-34596747.jpg",
        icon: "🍗"
    }
];






// const recipes = [
//     {
//         title: "Paneer Butter Masala",
//         slug: "paneer-butter-masala",
//         cuisine:"Indian",
//         description: "Rich creamy paneer gravy with butter, tomatoes and aromatic spices.",
//         categoryObjectId: "CATEGORY_ID_HERE",
//         ingredients: [
//             { name: "Paneer", quantity: "200", unit: "g" },
//             { name: "Butter", quantity: "2", unit: "tbsp" },
//             { name: "Tomato", quantity: "3", unit: "pcs" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Blend Tomatoes", description: "Make tomato puree.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Cook Gravy", description: "Heat butter & add puree + spices.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Add Paneer", description: "Simmer paneer cubes.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "../images/pexels-novkov-visuals-745725-34618727.jpg", public_id: null, resource_type: "image" },
//         tags: ["TAG_ID_HERE"],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 20, unit: "min" },
//         servings: 2,
//         difficultyLevel: "MEDIUM",
//         isPublished: true,
//         ratings: [],
//         likes: [],
//         views: [],
//         shares: []
//     },

//     {
//         title: "Chole Bhature",
//         slug: "chole-bhature",
//         description: "Punjabi chole served with deep fried bhature.",
//         categoryObjectId: "CATEGORY_ID_HERE",
//         ingredients: [
//             { name: "Chickpeas", quantity: "1", unit: "cup" },
//             { name: "Oil", quantity: "3", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Boil Chole", description: "Soak and pressure cook chole.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Prepare Masala", description: "Cook onion, tomato, spices.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Mix & Serve", description: "Add chole and simmer.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "../images/pexels-janetrangdoan-1092730.jpg", public_id: null, resource_type: "image" },
//         tags: ["TAG_ID_HERE"],
//         prepTime: { value: 20, unit: "min" },
//         cookTime: { value: 30, unit: "min" },
//         servings: 3,
//         difficultyLevel: "MEDIUM",
//         isPublished: true,
//         ratings: [],
//         likes: [],
//         views: [],
//         shares: []
//     },

//     {
//         title: "Masala Dosa",
//         slug: "masala-dosa",
//         description: "Crispy dosa stuffed with spiced potato filling.",
//         categoryObjectId: "CATEGORY_ID_HERE",
//         ingredients: [
//             { name: "Dosa Batter", quantity: "2", unit: "cup" },
//             { name: "Potato", quantity: "3", unit: "pcs" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Prepare Filling", description: "Make potato mixture.", stepImages:"../images/pexels-undo-kim-2153633398-34628049.jpg" , stepVideo: null },
//             { stepNumber: 2, heading: "Spread Batter", description: "Make dosa on tawa.", stepImages: null, stepVideo: null },
//             { stepNumber: 3, heading: "Stuff & Fold", description: "Serve hot.", stepImages: null, stepVideo: null }
//         ],
//         dishImage: { url: "pexels-janetrangdoan-793772.jpg", public_id: null, resource_type: "image" },
//         tags: ["TAG_ID_HERE"],
//         prepTime: { value: 15, unit: "min" },
//         cookTime: { value: 10, unit: "min" },
//         servings: 2,
//         difficultyLevel: "EASY",
//         isPublished: true
//     },

//     {
//         title: "Veg Biryani",
//         slug: "veg-biryani",
//         description: "Layered aromatic basmati rice and vegetables cooked in dum.",
//         categoryObjectId: "CATEGORY_ID_HERE",
//         ingredients: [
//             { name: "Rice", quantity: "2", unit: "cup" },
//             { name: "Mixed Veggies", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Cook Rice", description: "Half cook basmati.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Prepare Masala", description: "Cook veg with spices.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Layer & Dum", description: "Cook on low heat.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://dummyimage.com/600x400/ffeebb/000&text=Veg+Biryani", public_id: null, resource_type: "image" },
//         tags: ["TAG_ID_HERE"],
//         prepTime: { value: 20, unit: "min" },
//         cookTime: { value: 30, unit: "min" },
//         servings: 4,
//         difficultyLevel: "HARD",
//         isPublished: true
//     },

//     {
//         title: "Idli Sambar",
//         slug: "idli-sambar",
//         description: "Soft steamed idlis with hot sambar.",
//         categoryObjectId: "CATEGORY_ID_HERE",
//         ingredients: [
//             { name: "Idli Batter", quantity: "2", unit: "cup" },
//             { name: "Dal", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Steam Idli", description: "Steam batter.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Cook Sambar", description: "Boil dal with masala.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Serve", description: "Serve hot.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://dummyimage.com/600x400/fffccc/000&text=Idli+Sambar", public_id: null, resource_type: "image" },
//         tags: ["TAG_ID_HERE"],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 15, unit: "min" },
//         servings: 2,
//         difficultyLevel: "EASY",
//         isPublished: true
//     },

//     {
//         title: "Masala Dosa",
//         slug: "masala-dosa",
//         description: "Crispy dosa filled with spicy potato masala.",
//         categoryObjectId: "REPLACE_CATEGORY_ID",
//         ingredients: [
//             { name: "Dosa Batter", quantity: "2", unit: "cup" },
//             { name: "Potato", quantity: "3", unit: "pcs" },
//             { name: "Oil", quantity: "2", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Cook Potatoes", description: "Boil and mash the potatoes.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Prepare Masala", description: "Temper mustard seeds, curry leaves and spices.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Make Dosa", description: "Spread batter on tawa and add masala.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://images.unsplash.com/photo-1601050690597-ac823a4c1ffa", public_id: null, resource_type: "image" },
//         video: null,
//         tags: ["tag1", "tag2"],
//         prepTime: { value: 15, unit: "min" },
//         cookTime: { value: 20, unit: "min" },
//         servings: 2,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 80,
//         isPublished: true
//     },

//     {
//         title: "Chicken Biryani",
//         slug: "chicken-biryani",
//         description: "Aromatic basmati rice cooked with spiced chicken.",
//         categoryObjectId: "REPLACE_CATEGORY_ID",
//         ingredients: [
//             { name: "Chicken", quantity: "500", unit: "g" },
//             { name: "Basmati Rice", quantity: "2", unit: "cup" },
//             { name: "Curd", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Marinate Chicken", description: "Mix curd & spices well.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Cook Rice", description: "Boil rice till 80% done.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Layer & Steam", description: "Layer rice & chicken then cook on low heat.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://images.unsplash.com/photo-1601050690597-fd189c3db53b", public_id: null, resource_type: "image" },
//         video: null,
//         tags: ["tag3", "tag4"],
//         prepTime: { value: 30, unit: "min" },
//         cookTime: { value: 45, unit: "min" },
//         servings: 4,
//         difficultyLevel: "HARD",
//         estimatedCost: 300,
//         isPublished: true
//     },

//     {
//         title: "Chole Bhature",
//         slug: "chole-bhature",
//         description: "North Indian spicy chickpeas with fluffy bhature.",
//         categoryObjectId: "REPLACE_CATEGORY_ID",
//         ingredients: [
//             { name: "Chickpeas", quantity: "1", unit: "cup" },
//             { name: "Maida", quantity: "2", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Boil Chole", description: "Pressure cook chole until soft.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Make Masala", description: "Cook spices, onion & tomato.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Fry Bhature", description: "Make dough and fry.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://images.unsplash.com/photo-1668236548705-dfc1e7d33d66", public_id: null, resource_type: "image" },
//         video: null,
//         tags: ["tag5"],
//         prepTime: { value: 20, unit: "min" },
//         cookTime: { value: 25, unit: "min" },
//         servings: 3,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 120,
//         isPublished: true
//     },

//     {
//         title: "Rajma Chawal",
//         slug: "rajma-chawal",
//         description: "Comfort bowl of rajma curry with steamed rice.",
//         categoryObjectId: "REPLACE_CATEGORY_ID",
//         ingredients: [
//             { name: "Rajma", quantity: "1", unit: "cup" },
//             { name: "Rice", quantity: "1.5", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Prepare Rajma", description: "Soak overnight & pressure cook.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Make Gravy", description: "Cook onion, tomato & spices.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d", public_id: null, resource_type: "image" },
//         video: null,
//         tags: ["tag6"],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 40, unit: "min" },
//         servings: 3,
//         difficultyLevel: "EASY",
//         estimatedCost: 90,
//         isPublished: true
//     },

//     {
//         title: "Gulab Jamun",
//         slug: "gulab-jamun",
//         description: "Soft milk dumplings soaked in sugar syrup.",
//         categoryObjectId: "REPLACE_CATEGORY_ID",
//         ingredients: [
//             { name: "Khoya", quantity: "200", unit: "g" },
//             { name: "Sugar", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Make Dough", description: "Mix khoya and flour.", stepImage: null, stepVideo: null },
//             { stepNumber: 2, heading: "Fry Jamuns", description: "Cook until golden.", stepImage: null, stepVideo: null },
//             { stepNumber: 3, heading: "Add Syrup", description: "Soak in warm syrup.", stepImage: null, stepVideo: null }
//         ],
//         dishImage: { url: "https://images.unsplash.com/photo-1625752155908-89a2e48d40a2", public_id: null, resource_type: "image" },
//         video: null,
//         tags: ["tag7", "tag8"],
//         prepTime: { value: 15, unit: "min" },
//         cookTime: { value: 25, unit: "min" },
//         servings: 4,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 150,
//         isPublished: true
//     },

//     // ---------------- A. INDIAN ----------------
//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_INDIAN,
//         title: "Paneer Butter Masala",
//         slug: "paneer-butter-masala",
//         isPublished: true,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 180,
//         description: "Rich and creamy paneer gravy cooked in butter and tomato base.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1609501674579-3d43f381bb7a",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Paneer", quantity: "200", unit: "g" },
//             { name: "Tomato", quantity: "3", unit: "pc" },
//             { name: "Butter", quantity: "2", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Saute", description: "Heat butter and saute tomatoes & spices." },
//             { stepNumber: 2, heading: "Blend", description: "Blend the mixture into smooth gravy." },
//             { stepNumber: 3, heading: "Cook Paneer", description: "Add paneer cubes and simmer for 5 mins." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 20, unit: "min" },
//         servings: 3,
//         tags: ["paneer", "creamy", "veg"]
//     },

//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_INDIAN,
//         title: "Masala Dosa",
//         slug: "masala-dosa",
//         isPublished: true,
//         difficultyLevel: "HARD",
//         estimatedCost: 70,
//         description: "Crispy South Indian dosa stuffed with potato masala.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1589308078053-fc0f09b8f5dc",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Dosa Batter", quantity: "2", unit: "cup" },
//             { name: "Potato", quantity: "3", unit: "pc" },
//             { name: "Oil", quantity: "2", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Make Masala", description: "Cook mashed potatoes with spices." },
//             { stepNumber: 2, heading: "Spread Batter", description: "Spread dosa batter on hot tawa." },
//             { stepNumber: 3, heading: "Fill & Fold", description: "Add masala and fold crispy dosa." }
//         ],
//         prepTime: { value: 15, unit: "min" },
//         cookTime: { value: 15, unit: "min" },
//         servings: 2,
//         tags: ["south indian", "breakfast"]
//     },

//     // ---------------- B. ITALIAN ----------------
//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_ITALIAN,
//         title: "Margherita Pizza",
//         slug: "margherita-pizza",
//         isPublished: true,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 250,
//         description: "Classic Italian pizza topped with cheese, basil and tomato sauce.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1548365328-5b2697c1d7b7",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Pizza Dough", quantity: "1", unit: "pc" },
//             { name: "Mozzarella", quantity: "150", unit: "g" },
//             { name: "Tomato Sauce", quantity: "4", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Spread Sauce", description: "Apply tomato sauce over the base." },
//             { stepNumber: 2, heading: "Add Cheese", description: "Top with cheese and basil leaves." },
//             { stepNumber: 3, heading: "Bake", description: "Bake at 250°C for 8-10 minutes." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 10, unit: "min" },
//         servings: 2,
//         tags: ["pizza", "cheese", "italian"]
//     },

//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_ITALIAN,
//         title: "White Sauce Pasta",
//         slug: "white-sauce-pasta",
//         isPublished: true,
//         difficultyLevel: "EASY",
//         estimatedCost: 120,
//         description: "Creamy cheesy pasta cooked in white sauce.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1543352634-60abfdbfd8d4",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Pasta", quantity: "200", unit: "g" },
//             { name: "Milk", quantity: "1", unit: "cup" },
//             { name: "Butter", quantity: "1", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Boil Pasta", description: "Cook pasta till soft." },
//             { stepNumber: 2, heading: "Make Sauce", description: "Cook butter, flour & milk into creamy sauce." },
//             { stepNumber: 3, heading: "Mix", description: "Add pasta and mix well." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 15, unit: "min" },
//         servings: 2,
//         tags: ["pasta", "white sauce", "creamy"]
//     },

//     // ---------------- C. MEXICAN ----------------
//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_MEXICAN,
//         title: "Tacos",
//         slug: "mexican-tacos",
//         isPublished: true,
//         difficultyLevel: "EASY",
//         estimatedCost: 140,
//         description: "Street-style crispy tacos with seasoned fillings.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1601050690597-df7d9f24c2e0",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Tortillas", quantity: "6", unit: "pc" },
//             { name: "Veg Filling", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Heat Tortillas", description: "Warm tortillas on a pan." },
//             { stepNumber: 2, heading: "Fill", description: "Add cooked filling and veggies." },
//             { stepNumber: 3, heading: "Serve", description: "Top with sauce and serve." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 10, unit: "min" },
//         servings: 3,
//         tags: ["mexican", "snack"]
//     },

//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_MEXICAN,
//         title: "Mexican Burrito Bowl",
//         slug: "burrito-bowl",
//         isPublished: true,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 150,
//         description: "Rice bowl mixed with beans, salsa and toppings.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1617196032874-0ef17f9db0d2",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Rice", quantity: "1", unit: "cup" },
//             { name: "Beans", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Cook Rice", description: "Boil rice till fluffy." },
//             { stepNumber: 2, heading: "Prepare Beans", description: "Cook beans with spices." },
//             { stepNumber: 3, heading: "Assemble", description: "Layer rice, beans, salsa in a bowl." }
//         ],
//         prepTime: { value: 15, unit: "min" },
//         cookTime: { value: 20, unit: "min" },
//         servings: 2,
//         tags: ["bowl", "healthy"]
//     },

//     // ---------------- D. CHINESE ----------------
//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_CHINESE,
//         title: "Veg Noodles",
//         slug: "veg-noodles",
//         isPublished: true,
//         difficultyLevel: "EASY",
//         estimatedCost: 80,
//         description: "Stir-fried noodles mixed with vegetables.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1571834498558-cba0b11d9a5f",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Noodles", quantity: "200", unit: "g" },
//             { name: "Veggies", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Boil", description: "Boil noodles." },
//             { stepNumber: 2, heading: "Stir Fry", description: "Stir fry vegetables." },
//             { stepNumber: 3, heading: "Mix", description: "Add noodles and sauces." }
//         ],
//         prepTime: { value: 5, unit: "min" },
//         cookTime: { value: 10, unit: "min" },
//         servings: 2,
//         tags: ["noodles", "chinese"]
//     },

//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_CHINESE,
//         title: "Manchurian",
//         slug: "veg-manchurian",
//         isPublished: true,
//         difficultyLevel: "MEDIUM",
//         estimatedCost: 120,
//         description: "Crispy veggie balls tossed in spicy sauce.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1651008376815-4b0cab50b36d",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Cabbage", quantity: "1", unit: "cup" },
//             { name: "Flour", quantity: "3", unit: "tbsp" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Make Balls", description: "Mix veggies and flour and shape balls." },
//             { stepNumber: 2, heading: "Fry", description: "Deep fry until golden." },
//             { stepNumber: 3, heading: "Sauce", description: "Toss in spicy manchurian sauce." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 15, unit: "min" },
//         servings: 3,
//         tags: ["chinese", "starter"]
//     },

//     // ---------------- E. DESSERTS ----------------
//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_DESSERT,
//         title: "Chocolate Brownie",
//         slug: "chocolate-brownie",
//         isPublished: true,
//         difficultyLevel: "EASY",
//         estimatedCost: 150,
//         description: "Soft and fudgy chocolate brownies.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Chocolate", quantity: "100", unit: "g" },
//             { name: "Flour", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Mix", description: "Mix melted chocolate and batter." },
//             { stepNumber: 2, heading: "Bake", description: "Bake at 180°C for 20 minutes." },
//             { stepNumber: 3, heading: "Cool", description: "Let it cool before cutting." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 20, unit: "min" },
//         servings: 4,
//         tags: ["dessert", "chocolate"]
//     },

//     {
//         author: AUTHOR_ID,
//         categoryId: CATEGORY_ID_DESSERT,
//         title: "Fruit Custard",
//         slug: "fruit-custard",
//         isPublished: true,
//         difficultyLevel: "EASY",
//         estimatedCost: 100,
//         description: "Sweet creamy custard with mixed fruits.",
//         dishImage: {
//             url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
//             public_id: "",
//             resource_type: "image"
//         },
//         ingredients: [
//             { name: "Milk", quantity: "2", unit: "cup" },
//             { name: "Custard Powder", quantity: "2", unit: "tbsp" },
//             { name: "Fruits", quantity: "1", unit: "cup" }
//         ],
//         directions: [
//             { stepNumber: 1, heading: "Boil Milk", description: "Heat milk and add custard mix." },
//             { stepNumber: 2, heading: "Cool", description: "Let custard cool completely." },
//             { stepNumber: 3, heading: "Mix Fruits", description: "Add sliced fruits and serve chilled." }
//         ],
//         prepTime: { value: 10, unit: "min" },
//         cookTime: { value: 10, unit: "min" },
//         servings: 4,
//         tags: ["sweet", "cool", "dessert"]
//     }
// ];




module.exports = { categories, tags };