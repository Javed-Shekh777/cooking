const { cloudinaryFolderNames } = require("../constants");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipeSchema");
const Tag = require("../models/tagSchema");
const { logUserActivity } = require("../helper/logUserActivity");
const RecipeCategorySchema = require("../models/recipeCategorySchema");
const mongoose = require("mongoose");





exports.addRecipe = async (req, res) => {
  try {

    console.log("Files", req.files);
    console.log("Body", req.body);

    const { title, description, categoryObjectId, nutrients, ingredients, directions: directionsRaw, prepTime, cookTime, servings, tags } = req.body;

    if (!title || !description || !categoryObjectId || !prepTime || !cookTime || !servings) {
      return errorResponse(res, "All fields are required.");
    }
    const categoryId = new mongoose.Types.ObjectId(categoryObjectId);
    const parsedNutrients = JSON.parse(nutrients);
    const parsedIngredients = JSON.parse(ingredients);
    const parsedDirections = typeof directionsRaw === "string" ? JSON.parse(directionsRaw) : directionsRaw;
    let directions = [];

    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
    const parsedPrepTime = typeof prepTime === "string" ? JSON.parse(prepTime) : prepTime;
    const parsedCookTime = typeof cookTime === "string" ? JSON.parse(cookTime) : cookTime;

    if (!parsedNutrients.length) return errorResponse(res, "Nutrients are required.");
    if (!parsedIngredients.length) return errorResponse(res, "Ingredients are required.");
    if (!parsedDirections.length) return errorResponse(res, "Directions are required.");

    // Dish image
    let dishImage = {};
    if (req.files?.dishImage) {
      const cloures = await cloudinaryUpload(req.files.dishImage[0].path, cloudinaryFolderNames.images, "image");
      dishImage = {
        url: cloures.secure_url,
        public_id: cloures.public_id,
        resource_type: cloures.resource_type
      };
    }

    // Dish video
    let dishVideo = {};
    if (req.files?.dishVideo) {
      const cloures = await cloudinaryUpload(req.files.dishVideo[0].path, cloudinaryFolderNames.videos, "video");
      dishVideo = {
        url: cloures.secure_url,
        public_id: cloures.public_id,
        resource_type: cloures.resource_type,
        height: cloures.height,
        width: cloures.width,
        duration: cloures.duration
      };
    }

    // Directions with images
    for (let i = 0; i < parsedDirections.length; i++) {
      const step = parsedDirections[i];
      let stepImage = {};
      if (req.files?.directionImages && req.files.directionImages[i]) {
        const imgUpload = await cloudinaryUpload(req.files.directionImages[i].path, cloudinaryFolderNames.images, "image");
        stepImage = {
          url: imgUpload.secure_url,
          public_id: imgUpload.public_id,
          resource_type: imgUpload.resource_type
        };
      }
      directions.push({ ...step, image: stepImage });
    }



    const newDish = await Recipe.create({
      author: req.user._id,
      title,
      categoryId,
      description,
      ingredients: typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients,
      nutrients: typeof nutrients === "string" ? JSON.parse(nutrients) : nutrients,
      directions,
      prepTime: {
        value: Number(parsedPrepTime.value),
        unit: parsedPrepTime.unit
      },
      cookTime: {
        value: Number(parsedCookTime.value),
        unit: parsedCookTime.unit
      },
      servings: Number(servings),
      dishImage,
      dishVideo,
      tags: typeof tags === "string" ? JSON.parse(tags) : tags
    });

    await RecipeCategorySchema.findByIdAndUpdate(categoryId, { $inc: { count: 1 } });

    await logUserActivity(req.user._id, "RECIPE_ADDED", req);

    // Upsert tags
    for (let tag of parsedTags) {
      await Tag.updateOne({ name: tag }, { name: tag }, { upsert: true });
    }



    return successResponse(res, "Recipe created successfully.", newDish);

  } catch (error) {
    return errorResponse(res, error.message || "Recipe creation failed. Please try again.", 500);
  }
};


exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) return errorResponse(res, "Recipe not found", 404);

    const {
      title,
      description,
      nutrients,
      ingredients,
      directions: directionsRaw,
      prepTime,
      cookTime,
      servings,
      tags
    } = req.body;

    if (!title || !description || !prepTime || !cookTime || !servings) {
      return errorResponse(res, "All required fields must be filled.");
    }

    // ✅ Parse incoming JSON fields safely
    const parsedNutrients = JSON.parse(nutrients || "[]");
    const parsedIngredients = JSON.parse(ingredients || "[]");
    const parsedDirections = typeof directionsRaw === "string" ? JSON.parse(directionsRaw) : directionsRaw || [];
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
    const parsedPrepTime = typeof prepTime === "string" ? JSON.parse(prepTime) : prepTime;
    const parsedCookTime = typeof cookTime === "string" ? JSON.parse(cookTime) : cookTime;

    if (!parsedNutrients.length) return errorResponse(res, "Nutrients are required.");
    if (!parsedIngredients.length) return errorResponse(res, "Ingredients are required.");
    if (!parsedDirections.length) return errorResponse(res, "Directions are required.");

   // ======================
// 🖼️ or 🎬  Handle Dish Media (Only One Should Exist)
// ======================
let dishImage = existingRecipe.dishImage;
let dishVideo = existingRecipe.dishVideo;

// 🧩 CASE 1: If new image uploaded
if (req.files?.dishImage?.[0]) {
  // 🔥 If there was any existing video, delete it first (only one allowed)
  if (dishVideo?.public_id) {
    await cloudinaryDelete(dishVideo.public_id, "video");
    dishVideo = null;
  }

  // 🔥 If there was an old image, delete it
  if (dishImage?.public_id) {
    await cloudinaryDelete(dishImage.public_id, "image");
  }

  const uploadRes = await cloudinaryUpload(
    req.files.dishImage[0].path,
    cloudinaryFolderNames.images,
    "image"
  );

  dishImage = {
    url: uploadRes.secure_url,
    public_id: uploadRes.public_id,
    resource_type: uploadRes.resource_type,
  };
  dishVideo = null; // ✅ ensure video is removed in DB too
}

// 🧩 CASE 2: If new video uploaded
else if (req.files?.dishVideo?.[0]) {
  // 🔥 If there was any existing image, delete it first (only one allowed)
  if (dishImage?.public_id) {
    await cloudinaryDelete(dishImage.public_id, "image");
    dishImage = null;
  }

  // 🔥 If there was an old video, delete it
  if (dishVideo?.public_id) {
    await cloudinaryDelete(dishVideo.public_id, "video");
  }

  const uploadRes = await cloudinaryUpload(
    req.files.dishVideo[0].path,
    cloudinaryFolderNames.videos,
    "video"
  );

  dishVideo = {
    url: uploadRes.secure_url,
    public_id: uploadRes.public_id,
    resource_type: uploadRes.resource_type,
    height: uploadRes.height,
    width: uploadRes.width,
    duration: uploadRes.duration,
  };
  dishImage = null; // ✅ ensure image is removed in DB too
}

    // ======================
    // 📸 Handle Directions
    // ======================
    const updatedDirections = [];
    let uploadIndex = 0;

    for (let i = 0; i < parsedDirections.length; i++) {
      const d = parsedDirections[i];
      let stepImage = null;

      // CASE 1: User uploaded a NEW image
      if (req.files?.directionImages && req.files.directionImages[uploadIndex]) {
        // delete old if exist
        if (d.existingPublicId) {
          await cloudinaryDelete(d.existingPublicId, "image");
        }

        const uploadRes = await cloudinaryUpload(
          req.files.directionImages[uploadIndex].path,
          cloudinaryFolderNames.images,
          "image"
        );

        stepImage = {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
          resource_type: uploadRes.resource_type
        };

        uploadIndex++;
      }
      // CASE 2: Keep old image
      else if (d.existingPublicId) {
        const old = existingRecipe.directions.find(
          (x) => x.image?.public_id === d.existingPublicId
        );
        if (old) stepImage = old.image;
      }

      // CASE 3: No image (neither old nor new)
      updatedDirections.push({
        stepNumber: d.stepNumber || i + 1,
        heading: d.heading,
        description: d.description,
        image: stepImage
      });
    }

    // ======================
    // 🧾 Update Recipe in DB
    // ======================
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ingredients: parsedIngredients,
        nutrients: parsedNutrients,
        directions: updatedDirections,
        prepTime: {
          value: Number(parsedPrepTime.value),
          unit: parsedPrepTime.unit
        },
        cookTime: {
          value: Number(parsedCookTime.value),
          unit: parsedCookTime.unit
        },
        servings: Number(servings),
        dishImage,
        dishVideo,
        tags: parsedTags
      },
      { new: true }
    );

    await logUserActivity(req.user._id, "RECIPE_UPDATED", req);

    // 🏷️ Upsert tags
    for (let tag of parsedTags) {
      await Tag.updateOne({ name: tag }, { name: tag }, { upsert: true });
    }

    return successResponse(res, "Recipe updated successfully.", updatedRecipe);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Recipe update failed. Please try again.",
      500
    );
  }
};



exports.deleteRecipe = async (req, res) => {
  try {
    const id = req?.body?.id || req?.params?.id;
    if (!id) return errorResponse(res, "Recipe not found", 404);

    const recipe = await Recipe.findById(id);
    if (!recipe) return errorResponse(res, "Recipe not found", 404);

    // Collect all media
    const mediaToDelete = [];
    if (recipe?.dishImage?.public_id) mediaToDelete.push({ public_id: recipe.dishImage.public_id, type: "image" });
    if (recipe?.dishVideo?.public_id) mediaToDelete.push({ public_id: recipe.dishVideo.public_id, type: "video" });
    recipe?.directions?.forEach(dir => {
      if (dir?.image?.public_id) mediaToDelete.push({ public_id: dir.image.public_id, type: "image" });
    });

    // Delete media from Cloudinary first
    for (let media of mediaToDelete) {
      try {
        await cloudinaryDelete(media.public_id, media.type);
      } catch (error) {
        console.error(`Cloudinary deletion failed for ${media.public_id}:`, error.message);
        return errorResponse(res, `Failed to delete media: ${media.public_id}`, 500);
      }
    }

    // Delete recipe from DB
    await Recipe.findByIdAndDelete(id);

    // Update category count safely
    if (recipe.categoryId) {
      await RecipeCategorySchema.findByIdAndUpdate(
        recipe.categoryId,
        { $inc: { count: -1 } }
      );
    }

    // Log activity
    await logUserActivity(req.user._id, "RECIPE_DELETED", id);

    return successResponse(res, "Recipe deleted successfully.");
  } catch (error) {
    console.error("Recipe deletion failed:", error);
    return errorResponse(res, error.message || "Recipe deletion failed", 500);
  }
};



exports.suggestTags = async (req, res) => {
  try {

    console.log(req.query);
    const search = req.query?.search || "";
    console.log(search);

    const tags = await Tag.find({
      name: { $regex: search, $options: "i" }
    }).select("name").limit(10);

    console.log("Tags:", tags);

    if (!tags.length) {
      return errorResponse(res, "Tags not found.", 404);
    }

    // sirf tag names bhejne ke liye
    const tagList = tags.map(t => t.name);

    return successResponse(res, "Tags found.", tagList);

  } catch (error) {
    return errorResponse(res, error.message || "Tag suggestion failed.", 500);
  }
};


exports.addCategory = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, description, icon } = req.body;

    if (!name || !description || !icon) {
      return errorResponse(res, "All fields are required.", 401);
    }

    let cloud = null;

    // Multer stores file in req.file, not req.file.categoryImage
    if (req.file) {
      cloud = await cloudinaryUpload(req.file.path, cloudinaryFolderNames.images, "image");
    }

    // Create category
    let imageData;
    if (cloud) {
      imageData = {
        url: cloud.secure_url,
        public_id: cloud.public_id,
        resource_type: cloud.resource_type
      };
    }

    const category = await RecipeCategorySchema.create({
      name,
      description,
      icon,
      image: imageData
    });


    if (!category) {
      return errorResponse(res, "Category creation failed", 500);
    }

    // Log user activity
    await logUserActivity(req.user?._id, "NEW_CATEGORY_ADDED", req);

    return successResponse(res, "Category saved successfully.", category);
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message || "Category creation failed.", 500);
  }
};


exports.deleteCategoryCascade = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) return errorResponse(res, "Category not found", 404);

    const recipes = await Recipe.find({ category: categoryId });

    // Delete media from Cloudinary
    for (let recipe of recipes) {
      const mediaToDelete = [];
      if (recipe?.dishImage?.public_id) mediaToDelete.push({ public_id: recipe.dishImage.public_id, type: "image" });
      if (recipe?.dishVideo?.public_id) mediaToDelete.push({ public_id: recipe.dishVideo.public_id, type: "video" });
      recipe?.directions?.forEach(dir => {
        if (dir?.image?.public_id) mediaToDelete.push({ public_id: dir.image.public_id, type: "image" });
      });

      for (let media of mediaToDelete) {
        try {
          await cloudinaryDelete(media.public_id, media.type);
        } catch (error) {
          console.error(`Cloudinary deletion failed for ${media.public_id}:`, error.message);
          return errorResponse(res, `Failed to delete media for recipe ${recipe._id}`, 500);
        }
      }
    }

    // Delete all recipes
    const recipeIds = recipes.map(r => r._id);
    await Recipe.deleteMany({ _id: { $in: recipeIds } });

    // Delete the category
    await RecipeCategorySchema.findByIdAndDelete(categoryId);

    // Log activity
    await logUserActivity(req.user._id, "CATEGORY_CASCADE_DELETED", categoryId);

    return successResponse(res, "Category and all related recipes deleted successfully.");
  } catch (error) {
    console.error("Cascade deletion failed:", error);
    return errorResponse(res, error.message || "Cascade deletion failed", 500);
  }
};



exports.getCategories = async (req, res) => {
  try {
    const categories = await RecipeCategorySchema.find();
    if (categories.length <= 0) {
      return errorResponse(res,  "Category fetch failed.", 401);
    }
    return successResponse(res, "Category fetched.", categories);
  } catch (error) {
    return errorResponse(res, error.message || "Category fetch failed.", 500);

  }
}



exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    if (recipes.length <= 0) {
      return errorResponse(res, error.message || "Recipes fetch failed.", 401);
    }
    return successResponse(res, "Recipes fetched.", recipes);
  } catch (error) {
    return errorResponse(res, error.message || "Recipes fetch failed.", 500);

  }
}


exports.getRecipe = async (req, res) => {
  try {

    console.log(req.body?.id, req?.params?.id);
    const id = req.body ? req?.body?.id : req.params?.id;

    const recipe = await Recipe.findById(id).populate({
      path: "author",
      select: "profilePic username email"
    });

    if (!recipe) {
      return errorResponse(res, "Recipe not found.", 404);
    }

    return successResponse(res, "Recipe fetched successfully.", recipe);
  } catch (error) {
    return errorResponse(res, error.message || "Recipe fetch failed.", 500);
  }
};


exports.dashboard = async (req, res) => {
  try {
    let data = {
      recipe: 0,
      likes: 0,
      shares: 0,
      cat: 0
    };

    // Fetch all recipes
    const recipes = await Recipe.find();

    // Count total recipes
    data.recipe = recipes.length;

    // Loop through all recipes
    for (const rec of recipes) {
      data.likes += rec.likes?.length || 0;
      data.shares += rec.shares?.length || 0; // changed from rec.likes?.shares
    }

    // Count total categories
    data.cat = await RecipeCategorySchema.countDocuments();

    // Send response
    return successResponse(res, "Dashboard data fetched successfully", data);

  } catch (error) {
    console.error("Dashboard Error:", error);
    return errorResponse(res, "Internal Server Error", 500, error);
  }
};
