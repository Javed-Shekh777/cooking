const { cloudinaryFolderNames } = require("../constants");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipeSchema");
const Tag = require("../models/tagSchema");
const { logUserActivity } = require("../helper/logUserActivity");
const RecipeCategorySchema = require("../models/recipeCategorySchema");
const mongoose = require("mongoose");
const { generateSlug } = require("../helper/generateOTP");


exports.addRecipe = async (req, res) => {

  const uploadedAllMedia = [{ public_id: "", resource_type: "" }]; // for tracking uploads
  try {

    console.log("Files", req.files);
    console.log("Body", req.body);

    const {
      title,
      description,
      categoryObjectId,
      nutrients,
      ingredients,
      directions: directionsRaw,
      prepTime,
      cookTime,
      servings,
      tags,
      isPublished,
      difficultyLevel
    } = req.body;

    // Validate required fields
    if (!title || !description || !categoryObjectId || !prepTime || !cookTime || !servings || !difficultyLevel) {
      return errorResponse(res, "All fields are required.");
    }
    const slug = generateSlug(title);

    const categoryId = new mongoose.Types.ObjectId(categoryObjectId);
    const parsedNutrients = JSON.parse(nutrients || "[]");
    const parsedIngredients = JSON.parse(ingredients || "[]");
    const parsedDirections = typeof directionsRaw === "string" ? JSON.parse(directionsRaw) : directionsRaw;
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
    const parsedPrepTime = typeof prepTime === "string" ? JSON.parse(prepTime) : prepTime;
    const parsedCookTime = typeof cookTime === "string" ? JSON.parse(cookTime) : cookTime;

    if (!parsedNutrients.length) return errorResponse(res, "Nutrients are required.");
    if (!parsedIngredients.length) return errorResponse(res, "Ingredients are required.");
    if (!parsedDirections.length) return errorResponse(res, "Directions are required.");

    let directions = [];


    if (!parsedPrepTime?.value || !parsedPrepTime?.unit) {
      return errorResponse(res, "Prep time is invalid.");
    }
    if (!parsedCookTime?.value || !parsedCookTime?.unit) {
      return errorResponse(res, "Cook time is invalid.");
    }

    // Dish image
    let dishImage = {};
    let dishVideo = {};



    if (req.files?.dishImage) {
      const cloures = await cloudinaryUpload(req.files.dishImage[0].buffer, cloudinaryFolderNames.images, "image");
      dishImage = {
        url: cloures.secure_url,
        public_id: cloures.public_id,
        resource_type: cloures.resource_type
      };
      uploadedAllMedia.push({ public_id: cloures.public_id, resource_type: cloures.resource_type });
    }

    // Dish video
    if (req.files?.dishVideo) {
      const cloures = await cloudinaryUpload(req.files.dishVideo[0].buffer, cloudinaryFolderNames.videos, "video");
      dishVideo = {
        url: cloures.secure_url,
        public_id: cloures.public_id,
        resource_type: cloures.resource_type,
        height: cloures.height,
        width: cloures.width,
        duration: cloures.duration,
      };
      uploadedAllMedia.push({ public_id: cloures.public_id, resource_type: cloures.resource_type });

      const thumbnailUrl = `${cloures.secure_url}.jpg`; // Cloudinary auto-generates thumbnails
      dishImage = {
        url: thumbnailUrl,
        publicId: videoPublicId,
        resource_type: "image"
      };
    }

    // Handle directions with optional images
    for (let i = 0; i < parsedDirections.length; i++) {
      const step = parsedDirections[i];
      let stepImage = {};
      let stepVideo = {};


      // Check if image exists for this step
      if (req.files?.directionImages && req.files.directionImages[i]) {
        const imgBuffer = req.files.directionImages[i].buffer;

        try {
          const imgUpload = await cloudinaryUpload(
            imgBuffer,
            cloudinaryFolderNames.images,
            "image"
          );
          uploadedAllMedia.push({ public_id: imgUpload.public_id, resource_type: imgUpload.resource_type });

          stepImage = {
            url: imgUpload.secure_url,
            public_id: imgUpload.public_id,
            resource_type: imgUpload.resource_type
          };
        } catch (err) {
          console.error(`Image upload failed for step ${i + 1}:`, err.message);
          return errorResponse(res, `Failed to upload image for step ${i + 1}`);
        }
      }

      if (req.files?.directionVideos && req.files.directionVideos[i]) {
        const vidBuffer = req.files.directionVideos[i].buffer;

        try {
          const vidUpload = await cloudinaryUpload(
            vidBuffer,
            cloudinaryFolderNames.videos,
            "video"
          );
          uploadedAllMedia.push({ public_id: vidUpload.public_id, resource_type: vidUpload.resource_type });

          stepVideo = {
            url: vidUpload.secure_url,
            public_id: vidUpload.public_id,
            resource_type: vidUpload.resource_type,
            height: vidUpload.height,
            width: vidUpload.width,
            duration: vidUpload.duration,
          };
        } catch (err) {
          console.error(`Image upload failed for step ${i + 1}:`, err.message);
          return errorResponse(res, `Failed to upload image for step ${i + 1}`);
        }
      }

      directions.push({
        ...step,
        stepImage: stepImage,
        stepVideo: stepVideo
      });
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
      isPublished,
      difficultyLevel,
      slug,
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
    for (const media of uploadedAllMedia) {
      if (media?.public_id) {
        await cloudinaryDelete(media.public_id, media.resource_type);
      }
    }

    return errorResponse(res, error.message || "Recipe creation failed. Please try again.", 500);
  }
};


exports.updateRecipe = async (req, res) => {
  let existingRecipe;
  let allOldIds = [];
  let uploadedAllMedia = [];
  let mediaToDelete = [];
  let newDishImage = null;
  let newDishVideo = null;

  try {
    const { id } = req.params;
    existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) return errorResponse(res, "Recipe not found", 404);

    const {
      title,
      description,
      categoryObjectId,
      nutrients,
      ingredients,
      directions: directionsRaw,
      prepTime,
      cookTime,
      servings,
      tags,
      isPublished,
      difficultyLevel
    } = req.body;

    if (!title || !description || !categoryObjectId || !prepTime || !cookTime || !servings || !difficultyLevel) {
      return errorResponse(res, "All fields are required.");
    }

    console.log("Direction Images:", req.files?.directionImages?.length);
    console.log("Direction Videos:", req.files?.directionVideos?.length);


    const slug = generateSlug(title);
    const categoryId = new mongoose.Types.ObjectId(categoryObjectId);

    const parsedNutrients = JSON.parse(nutrients || "[]");
    const parsedIngredients = JSON.parse(ingredients || "[]");
    const parsedDirections = typeof directionsRaw === "string" ? JSON.parse(directionsRaw) : directionsRaw || [];
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
    const parsedPrepTime = typeof prepTime === "string" ? JSON.parse(prepTime) : prepTime;
    const parsedCookTime = typeof cookTime === "string" ? JSON.parse(cookTime) : cookTime;

    if (!parsedNutrients.length) return errorResponse(res, "Nutrients are required.");
    if (!parsedIngredients.length) return errorResponse(res, "Ingredients are required.");
    if (!parsedDirections.length) return errorResponse(res, "Directions are required.");
    if (!parsedPrepTime?.value || !parsedPrepTime?.unit) return errorResponse(res, "Prep time is invalid.");
    if (!parsedCookTime?.value || !parsedCookTime?.unit) return errorResponse(res, "Cook time is invalid.");

    const oldImageIds = existingRecipe.directions.map(d => d?.stepImage?.public_id).filter(Boolean);
    const oldVideoIds = existingRecipe.directions.map(d => d?.stepVideo?.public_id).filter(Boolean);
    const oldDishImageId = existingRecipe.dishImage?.public_id;
    const oldDishVideoId = existingRecipe.dishVideo?.public_id;

    allOldIds = [...oldImageIds, ...oldVideoIds, oldDishImageId, oldDishVideoId].filter(Boolean);

    newDishImage = existingRecipe.dishImage;
    newDishVideo = existingRecipe.dishVideo;

    // 🖼️ Dish Image Upload
    if (req.files?.dishImage?.[0]) {
      if (existingRecipe.dishVideo?.public_id) mediaToDelete.push({ public_id: existingRecipe.dishVideo.public_id, resource_type: "video" });
      if (existingRecipe.dishImage?.public_id) mediaToDelete.push({ public_id: existingRecipe.dishImage.public_id, resource_type: "image" });

      const uploadRes = await cloudinaryUpload(req.files.dishImage[0].buffer, cloudinaryFolderNames.images, "image");
      uploadedAllMedia.push({ public_id: uploadRes.public_id, resource_type: uploadRes.resource_type });

      newDishImage = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        resource_type: uploadRes.resource_type
      };
      newDishVideo = null;
    }

    // 🎬 Dish Video Upload
    else if (req.files?.dishVideo?.[0]) {
      if (existingRecipe.dishImage?.public_id) mediaToDelete.push({ public_id: existingRecipe.dishImage.public_id, resource_type: "image" });
      if (existingRecipe.dishVideo?.public_id) mediaToDelete.push({ public_id: existingRecipe.dishVideo.public_id, resource_type: "video" });

      const uploadRes = await cloudinaryUpload(req.files.dishVideo[0].buffer, cloudinaryFolderNames.videos, "video");
      uploadedAllMedia.push({ public_id: uploadRes.public_id, resource_type: uploadRes.resource_type });

      newDishVideo = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        resource_type: uploadRes.resource_type,
        height: uploadRes.height,
        width: uploadRes.width,
        duration: uploadRes.duration
      };
      // const videoUrl = uploadRes.secure_url;

      // const thumbnailUrl = videoUrl.replace(
      //   "/upload/",
      //   "/upload/so_1,du_1,fl_thumbnail,w_600,h_600,c_fill/"
      // );
      // newDishImage = {
      //   url: thumbnailUrl,
      //   public_id: uploadRes.public_id, // same as video
      //   resource_type: "video"
      // };

      newDishImage = null;


    }

    // 📸 Directions Media
    const updatedDirections = [];
    let imgCounter = 0;
    let vidCounter = 0;

    for (let i = 0; i < parsedDirections.length; i++) {
      const d = parsedDirections[i];
      let stepImage = {};
      let stepVideo = {};

      console.log(`Step ${i + 1} → hasNewImage:${d.hasNewImage}, hasNewVideo:${d.hasNewVideo}`);

      // ---- IMAGE ----
      if (d.hasNewImage && req.files?.directionImages?.[imgCounter]) {

        if (d.existingImagePublicId) {
          mediaToDelete.push({ public_id: d.existingImagePublicId, resource_type: "image" });
        }

        const uploadRes = await cloudinaryUpload(
          req.files.directionImages[imgCounter].buffer,
          cloudinaryFolderNames.images,
          "image"
        );

        uploadedAllMedia.push(uploadRes);
        imgCounter++; // ✅ increment only when new image exists

        stepImage = {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
          resource_type: uploadRes.resource_type
        };

      } else if (d.existingImagePublicId) {
        stepImage = existingRecipe.directions.find(x => x.stepImage?.public_id === d.existingImagePublicId)?.stepImage || {};
      }

      // ---- VIDEO ----
      if (d.hasNewVideo && req.files?.directionVideos?.[vidCounter]) {

        if (d.existingVideoPublicId) {
          mediaToDelete.push({ public_id: d.existingVideoPublicId, resource_type: "video" });
        }

        const uploadRes = await cloudinaryUpload(
          req.files.directionVideos[vidCounter].buffer,
          cloudinaryFolderNames.videos,
          "video"
        );

        uploadedAllMedia.push(uploadRes);
        vidCounter++;

        stepVideo = {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
          resource_type: uploadRes.resource_type,
          height: uploadRes.height,
          width: uploadRes.width,
          duration: uploadRes.duration
        };

      } else if (d.existingVideoPublicId) {
        stepVideo = existingRecipe.directions.find(x => x.stepVideo?.public_id === d.existingVideoPublicId)?.stepVideo || {};
      }

      updatedDirections.push({
        stepNumber: i + 1,
        heading: d.heading,
        description: d.description,
        stepImage,
        stepVideo
      });
    }


    // ✅ Final DB Update
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        description,
        categoryObjectId: categoryId,
        ingredients: parsedIngredients,
        nutrients: parsedNutrients,
        directions: updatedDirections,
        prepTime: { value: Number(parsedPrepTime.value), unit: parsedPrepTime.unit },
        cookTime: { value: Number(parsedCookTime.value), unit: parsedCookTime.unit },
        servings: Number(servings),
        dishImage: newDishImage,
        dishVideo: newDishVideo,
        tags: parsedTags,
        isPublished,
        slug,
        difficultyLevel
      },
      { new: true }
    );

    // 🧹 Delete old media after successful update
    for (const media of mediaToDelete) {
      await cloudinaryDelete(media.public_id, media.resource_type);
      console.log(JSON.stringify(media), " Deleted");
    }

    await logUserActivity(req.user._id, "RECIPE_UPDATED", req);

    for (let tag of parsedTags) {
      await Tag.updateOne({ name: tag }, { name: tag }, { upsert: true });
    }

    return successResponse(res, "Recipe updated successfully.", updatedRecipe);
  } catch (error) {
    console.error("Update failed:", error.message);

    for (const media of uploadedAllMedia) {
      if (media?.public_id && !allOldIds.includes(media.public_id)) {
        await cloudinaryDelete(media.public_id, media.resource_type);
      }
    }

    return errorResponse(res, "Recipe update failed. Uploaded media has been cleaned up.", 500);
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
      cloud = await cloudinaryUpload(req.file.buffer, cloudinaryFolderNames.images, "image");
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
      return errorResponse(res, "Category fetch failed.", 401);
    }
    return successResponse(res, "Category fetched.", categories);
  } catch (error) {
    return errorResponse(res, error.message || "Category fetch failed.", 500);

  }
}



exports.getRecipes = async (req, res) => {
  try {
    const { categoryId } = req.query;

    console.log(categoryId);

    let filter = {};
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    const recipes = await Recipe.find(filter);

    console.log(recipes)

    if (!recipes || recipes.length === 0) {
      return successResponse(res, "No recipes found.", []);
    }



    return successResponse(res, "Recipes fetched successfully.", recipes);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch recipes.", 500);
  }
};



exports.getRecipesByCategory = async (req, res) => {
  try {
    const id = req.params?.id || req.body?.id;

    console.log(id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid or missing category ID.", 400);
    }

    // const catId = new mongoose.Types.ObjectId(id);
    const recipes = await Recipe.find({ categoryId: id }).populate({ path: "categoryId", select: "name icon" });

    console.log(recipes)

    if (!recipes || recipes.length === 0) {
      return errorResponse(res, "No recipes found for this category.", 404);
    }

    return successResponse(res, "Recipes fetched successfully.", recipes);
  } catch (error) {
    return errorResponse(res, error.message || "Recipes fetch failed.", 500);
  }
};


exports.getRecipe = async (req, res) => {
  try {

    console.log(req.body?.id, req?.params?.id);
    const id = req.body ? req?.body?.id : req.params?.id;
    if (!id) {
      return errorResponse(res, "Recipe ID is required.", 400);
    }

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


exports.getCategory = async (req, res) => {
  try {

    console.log(req.body?.id, req?.params?.id);
    const id = req.body ? req?.body?.id : req.params?.id;
    if (!id) {
      return errorResponse(res, "Category ID is required.", 400);
    }

    const category = await RecipeCategorySchema.findById(id);

    if (!category) {
      return errorResponse(res, "Category not found.", 404);
    }

    return successResponse(res, "Category fetched successfully.", category);
  } catch (error) {
    return errorResponse(res, error.message || "Category fetch failed.", 500);
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
