const { cloudinaryFolderNames } = require("../constants");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipeSchema");
const User = require("../models/userModel");
const RecipeLikeShareModel = require("../models/recipeLikes");
const RecipeCommentModel = require("../models/recipeCommentShema");


const Tag = require("../models/tagSchema");
const { logUserActivity } = require("../helper/logUserActivity");
const RecipeCategorySchema = require("../models/recipeCategorySchema");
const mongoose = require("mongoose");
const { generateSlug } = require("../helper/generateOTP");


exports.addRecipe = async (req, res) => {

  const uploadedAllMedia = [{ public_id: "", resource_type: "" }]; // for tracking uploads
  try {


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

      // console.log(`Step ${i + 1} → hasNewImage:${d.hasNewImage}, hasNewVideo:${d.hasNewVideo}`);

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
    }

    await logUserActivity(req.user._id, "RECIPE_UPDATED", req);

    for (let tag of parsedTags) {
      await Tag.updateOne({ name: tag }, { name: tag }, { upsert: true });
    }

    return successResponse(res, "Recipe updated successfully.", updatedRecipe);
  } catch (error) {

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
    return errorResponse(res, error.message || "Recipe deletion failed", 500);
  }
};



exports.suggestTags = async (req, res) => {
  try {

    const search = req.query?.search || "";

    const tags = await Tag.find({
      name: { $regex: search, $options: "i" }
    }).select("name").limit(10);


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
    return errorResponse(res, error.message || "Category creation failed.", 500);
  }
};



exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, oldPublicId } = req.body;
    const newFile = req.file;

    const existingCategory = await RecipeCategorySchema.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return errorResponse(res, "This category name is already in use by another category.", 400);
    }

    const category = await RecipeCategorySchema.findById(id);
    if (!category) {
      return errorResponse(res, "Category not found.", 404);
    }

    const updateData = {
      description,
      name,
      icon,
    };

    if (newFile) {
      const cloud = await cloudinaryUpload(newFile.buffer, cloudinaryFolderNames.images, "image");

      if (cloud?.secure_url) {
        if (category?.categoryImage?.public_id) {
          await cloudinaryDelete(category.categoryImage.public_id, "image");
        }
        updateData.categoryImage = { url: cloud.secure_url, public_id: cloud.public_id };
      } else {
        return errorResponse(res, "Image upload to Cloudinary failed.", 500);
      }

    } else if (req.body.categoryImage === "" && category.categoryImage?.public_id) {
      await cloudinaryDelete(category.categoryImage.public_id, "image");
      updateData.categoryImage = null;
    }



    const updatedCategory = await RecipeCategorySchema.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true, // इसे वापस चालू करें
        useFindAndModify: false // इसे false पर सेट करें
      }
    );
    if (!updatedCategory) {
      return errorResponse(res, "Category not found after update.", 404);
    }

    return successResponse(res, "Category updated successfully", updatedCategory);

  } catch (error) {
    console.error("Update category error:", error);
    if (error.code === 11000) {
      return errorResponse(res, "This category name is already in use.", 400);
    }
    return errorResponse(res, error.message || "Category update failed.", 500);
  }
};




exports.getRecommendedRecipes = async (req, res) => {
  try {
    const { recipeId, categoryId, limit } = req.query;

    console.log("Received recipeId:", recipeId);
    console.log("Received categoryId:", categoryId);

    let query = {};

    // Filter by categoryId (except "All")
    if (categoryId && categoryId !== "All") {
      query.categoryId = categoryId;
    }

    // Exclude current recipe
    if (recipeId && recipeId !== "null" && recipeId !== "undefined") {
      query._id = { $ne: new mongoose.Types.ObjectId(recipeId) };
    }

    console.log("Final MongoDB Query:", query);

    const recommendations = await Recipe.find(query)
      .limit(parseInt(limit) || 8)
      .select("title dishImage rating prepTime cookTime ratings difficultyLevel tags avgRating")
      .lean();

    console.log(`Found ${recommendations.length} recommendations.`);

    return successResponse(res, "Recommendations fetched", recommendations);

  } catch (error) {
    console.error("Error in getRecommendedRecipes:", error);
    return errorResponse(res, error.message || "Failed to fetch recommendations.", 500);
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


    let filter = {};
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }


    const recipes = await Recipe.find(filter);
    console.log(recipes,categoryId);


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

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid or missing category ID.", 400);
    }

    // const catId = new mongoose.Types.ObjectId(id);
    const recipes = await Recipe.find({ categoryId: id }).populate({ path: "categoryId", select: "name icon" });


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
    const id = req.body?.id || req.params?.id;
    if (!id) {
      return errorResponse(res, "Recipe ID is required.", 400);
    }

    const userId = req.user?._id;
    const recipe = await Recipe.findById(id).populate({
      path: "author",
      select: "profilePic username email"
    });

    if (!recipe) {
      return errorResponse(res, "Recipe not found.", 404);
    }
    const likeMeta = await RecipeLikeShareModel.findOne({ recipeId: id });

    const likedUserIds = likeMeta?.likes.map(id => id.toString()) || [];
    const savedUserIds = likeMeta?.saves.map(id => id.toString()) || [];

    const isLiked = likedUserIds.includes(userId?.toString());
    const isSaved = savedUserIds.includes(userId?.toString());




    return successResponse(res, "Recipe found", {
      recipe,
      meta: {
        isLiked: isLiked,
        isSaved: isSaved,
        likesCount: likeMeta?.likes.length || 0,
        savesCount: likeMeta?.saves.length || 0,
        viewsCount: likeMeta?.views.length || 0,
        sharesCount: likeMeta?.shares.length || 0,
      }
    });
  } catch (error) {
    return errorResponse(res, error.message || "Recipe fetch failed.", 500);
  }
};



exports.getCategory = async (req, res) => {
  try {

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
    return errorResponse(res, "Internal Server Error", 500, error);
  }
};


// commentsController.js

exports.getComments = async (req, res) => {
  try {
    console.log("Req Params ID:", req.params.id);
    const recipeId = req?.params?.id || req?.body?.id || req?.query?.id;

    console.log(recipeId);

    if (!recipeId) {
      console.log("Error: Recipe ID not received!");
      return errorResponse(res, "Recipe ID is required.", 400);
    }



    const comments = await RecipeCommentModel.find({ recipeId })
      .populate("user", "username profileImage")
      .populate("replies.user", "username profileImage")
      .sort({ createdAt: -1 });

    console.log(comments);

    return successResponse(res, "Comments fetched", comments);
  } catch (error) {
    return errorResponse(res, "Failed to fetch comments.", 500);
  }
};




exports.addComment = async (req, res) => {
  try {
    console.log(req?.body);
    const { recipeId, text, parentId } = req.body; // ✅ parentId प्राप्त करें
    const userId = req.user._id;

    if (parentId) {
      const parentComment = await RecipeCommentModel.findById(parentId);
      if (!parentComment) {
        return errorResponse(res, "Parent comment not found.", 404);
      }

      const newReply = {
        user: userId,
        text,
        createdAt: new Date()
      };

      parentComment.replies.push(newReply);
      await parentComment.save();

      const updatedComment = await RecipeCommentModel.findById(parentId)
        .populate("user", "username profileImage")
        .populate("replies.user", "username profileImage");

      return successResponse(res, "Reply added successfully", updatedComment); // ✅ पूरा अपडेटेड कमेंट भेजें

    } else {
      // केस 2: यह एक नई मुख्य टिप्पणी है (आपका मौजूदा लॉजिक)
      const newComment = new RecipeCommentModel({
        recipeId, user: userId, text
      });
      await newComment.save();
      await newComment.populate("user", "username profilePic");
      return successResponse(res, "Comment added successfully", newComment);
    }
  } catch (error) {
    return errorResponse(res, "Failed to add comment/reply.", 500);
  }
};






exports.toggleCommentLike = async (req, res) => {
  try {
    console.log("Req Params ID:", req.params.id);
    const commentId = req?.params?.id || req?.body?.id || req?.query?.id;

    console.log(commentId);

    if (!commentId) {
      console.log("Error: Recipe ID not received!");
      return errorResponse(res, "Recipe ID is required.", 400);
    }

    const userId = req?.user?._id;


    const comment = await RecipeCommentModel.findById(commentId);

    if (!comment) {
      return errorResponse(res, "Comment not found.", 404);
    }

    const userIdStr = userId.toString();
    const liked = comment.likes.map(id => id.toString()).includes(userIdStr);

    if (liked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userIdStr);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return successResponse(res, "Comment like status updated", {
      commentId,
      updatedLikesArray: comment.likes, // पूरा एरे भेजा जा रहा है
    });

  } catch (error) {
    return errorResponse(res, "Failed to like comment.", 500);
  }
};



exports.recipeLike = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    let meta = await RecipeLikeShareModel.findOne({ recipeId });

    if (!meta) {
      meta = new RecipeLikeShareModel({ recipeId });
    }

    const isLiked = meta.likes.includes(userId);

    if (isLiked) {
      // Un-like: user ID हटा दें
      meta.likes = meta.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like: user ID जोड़ दें
      meta.likes.push(userId);
    }

    await meta.save();

    // सुनिश्चित करें कि आप अपडेटेड मेटाडेटा वापस भेजें
    return successResponse(res, "Recipe like status updated", {
      isLiked: !isLiked, // नया स्टेटस
      likesCount: meta.likes.length, // नया काउंट
      recipeId:recipeId
    });

  } catch (error) {
    return errorResponse(res, "Like operation failed.", 500);
  }
};


exports.recipeShare = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    let doc = await RecipeLikeShareModel.findOneAndUpdate(
      { recipeId },
      { $addToSet: { shares: userId } },
      { new: true, upsert: true }
    );

    return successResponse(res, "Share counted.", {
      sharesCount: doc.shares.length,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};


exports.recipeSave = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id; // Assuming this is available

    let meta = await RecipeLikeShareModel.findOne({ recipeId });
    if (!meta) {
      meta = new RecipeLikeShareModel({ recipeId });
    }

    const isSaved = meta.saves.map(id => id.toString()).includes(userId.toString());

    if (isSaved) {
      meta.saves = meta.saves.filter(id => id.toString() !== userId.toString());
    } else {
      meta.saves.push(userId);
    }

    await meta.save();

    return successResponse(res, "Recipe save status updated", {
      saved: !isSaved, // Updated Status
      savesCount: meta.saves.length, // Updated Count
    });

  } catch (error) {
    return errorResponse(res, "Save operation failed.", 500);
  }
};



exports.recipeView = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    await RecipeLikeShareModel.findOneAndUpdate(
      { recipeId },
      { $addToSet: { views: userId } },
      { new: true, upsert: true }
    );

    return successResponse(res, "View counted.", { viewed: true });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
 

exports.submitRecipeRating = async (req, res) => {
    try {
        const { recipeId, rating } = req.body;
        const userId = req.user._id;
        console.log(userId);


        const recipe = await Recipe.findById(recipeId);
        console.log(recipe);

        const existingRatingIndex = recipe?.ratings.findIndex(r => r.user.toString() === userId.toString());

        if (existingRatingIndex > -1) {
            recipe.ratings[existingRatingIndex].value =  parseInt(rating);
        } else {
            recipe.ratings.push({ user: userId, value: parseInt(rating) }); // 'rating' key removed, using 'value'
        }
        console.log(existingRatingIndex);

        const totalRatings = recipe.ratings.length;
        const sumRatings = recipe.ratings.reduce((sum, current) => sum + current.value, 0);
        recipe.avgRating = sumRatings / totalRatings;
        console.log(totalRatings,sumRatings)

        await recipe.save();


        console.log(recipe.ratings.length, recipe.avgRating, rating);

        return successResponse(res, "Rating submitted successfully", {
            avgRating: recipe.avgRating,
            totalRatings: recipe.ratings.length,
            submittedRating: rating
        });

    } catch (error) {
      console.log(error);
        return errorResponse(res, error.message || "Rating submission failed.", 500);
    }
};






