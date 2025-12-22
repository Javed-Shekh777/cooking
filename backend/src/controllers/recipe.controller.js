const { cloudinaryFolderNames } = require("../constants");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipe.model");
const AuditLog = require("../models/auditLog.model");
const Tag = require("../models/tag.model");
const Request = require("../models/deleteRequest.model");


const RecipeCategory = require("../models/category.model");
const mongoose = require("mongoose");
const { generateSlug } = require("../helper/generateOTP");
const { startSession, permanentlyDeleteRecipeInternal } = require("../helper/common");


exports.addRecipe = async (req, res, next) => {
  const uploadedMedia = []; // rollback ke liye

  const session = await startSession();


  try {
    const {
      title,
      description,
      categoryObjectId,
      nutrients,
      ingredients,
      directions,
      prepTime,
      cookTime,
      servings,
      tags,
      difficultyLevel,
      isPublished = true
    } = req.body;

    // 🔴 Required fields
    if (
      !title ||
      !description ||
      !categoryObjectId ||
      !prepTime ||
      !cookTime ||
      !servings ||
      !difficultyLevel
    ) {
      return errorResponse(res, "REQUIRED_FIELDS_MISSING", 400);
    }

    // 🧩 Parsing
    const parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
    const parsedNutrients = typeof nutrients === "string" ? JSON.parse(nutrients) : nutrients;
    const parsedDirections = typeof directions === "string" ? JSON.parse(directions) : directions;
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
    const parsedPrepTime = typeof prepTime === "string" ? JSON.parse(prepTime) : prepTime;
    const parsedCookTime = typeof cookTime === "string" ? JSON.parse(cookTime) : cookTime;

    if (!parsedIngredients?.length) return errorResponse(res, "Ingredients required");
    if (!parsedNutrients?.length) return errorResponse(res, "Nutrients required");
    if (!parsedDirections?.length) return errorResponse(res, "Directions required");

    // 🔗 Slug
    let slug = generateSlug(title);
    const slugExists = await Recipe.findOne({ slug }).session(session);
    if (slugExists) slug = `${slug}-${Date.now()}`;

    // 🍽 Dish Image / Video
    let dishImage = {};
    let dishVideo = {};

    if (req.files?.dishImage) {
      const upload = await cloudinaryUpload(
        req.files.dishImage[0].buffer,
        cloudinaryFolderNames.images,
        "image"
      );

      dishImage = {
        url: upload.secure_url,
        public_id: upload.public_id,
        resource_type: upload.resource_type
      };

      uploadedMedia.push(upload);
    }

    if (req.files?.dishVideo) {
      const upload = await cloudinaryUpload(
        req.files.dishVideo[0].buffer,
        cloudinaryFolderNames.videos,
        "video"
      );

      dishVideo = {
        url: upload.secure_url,
        public_id: upload.public_id,
        resource_type: upload.resource_type,
        height: upload.height,
        width: upload.width,
        duration: upload.duration
      };

      uploadedMedia.push(upload);

      // thumbnail
      dishImage = {
        url: `${upload.secure_url}.jpg`,
        public_id: upload.public_id,
        resource_type: "image"
      };
    }

    // 📍 Directions media
    const finalDirections = [];

    for (let i = 0; i < parsedDirections.length; i++) {
      const step = parsedDirections[i];
      let stepImage = {};
      let stepVideo = {};

      if (req.files?.directionImages?.[i]) {
        const upload = await cloudinaryUpload(
          req.files.directionImages[i].buffer,
          cloudinaryFolderNames.images,
          "image"
        );

        stepImage = {
          url: upload.secure_url,
          public_id: upload.public_id,
          resource_type: upload.resource_type
        };

        uploadedMedia.push(upload);
      }

      if (req.files?.directionVideos?.[i]) {
        const upload = await cloudinaryUpload(
          req.files.directionVideos[i].buffer,
          cloudinaryFolderNames.videos,
          "video"
        );

        stepVideo = {
          url: upload.secure_url,
          public_id: upload.public_id,
          resource_type: upload.resource_type,
          height: upload.height,
          width: upload.width,
          duration: upload.duration
        };

        uploadedMedia.push(upload);
      }

      finalDirections.push({
        ...step,
        stepImage,
        stepVideo
      });
    }

    // 📝 Recipe create
    const recipe = new Recipe({
      author: req.user._id,
      title,
      slug,
      description,
      categoryId: categoryObjectId,
      ingredients: parsedIngredients,
      nutrients: parsedNutrients,
      directions: finalDirections,
      prepTime: parsedPrepTime,
      cookTime: parsedCookTime,
      servings: Number(servings),
      dishImage,
      dishVideo,
      difficultyLevel,
      tags: parsedTags,
      isPublished
    });

    await recipe.save({ session });

    // 📊 Category count
    await RecipeCategory.findByIdAndUpdate(
      categoryObjectId,
      { $inc: { count: 1 } },
      { session }
    );

    // 🏷 Tags upsert + count
    for (let tag of parsedTags) {
      await Tag.findOneAndUpdate(
        { name: tag.toLowerCase() },
        {
          $setOnInsert: { name: tag.toLowerCase() },
          $inc: { recipeCount: 1 }
        },
        { upsert: true, session }
      );
    }

    // 🧾 Audit log
    await AuditLog.create(
      [{
        action: "RECIPE_CREATED",
        performedBy: req.user._id,
        targetId: recipe._id,
        targetType: "RECIPE"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Recipe created successfully", recipe);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // ☁ Cloudinary rollback
    for (const media of uploadedMedia) {
      if (media?.public_id) {
        await cloudinaryDelete(media.public_id, media.resource_type);
      }
    }
    next(error);


    // return errorResponse(res, error.message || "Recipe creation failed", 500);
  }
};


exports.updateRecipe = async (req, res, next) => {
  const uploadedMedia = []; // rollback ke liye
  const mediaToDelete = [];
  const session = await startSession();


  try {
    const { id } = req.params;
    if (!id) return errorResponse(res, "Recipe ID is required", 400);

    const existingRecipe = await Recipe.findById(id).session(session);
    if (!existingRecipe) return errorResponse(res, "Recipe not found", 404);
    if (existingRecipe.isDeleted) return errorResponse(res, "Recipe is deleted", 400);

    if (
      existingRecipe.author.toString() !== req.user._id.toString() &&
      !["ADMIN", "CHEF"].includes(req.user.role)
    ) {
      return errorResponse(res, "Not authorized to update this recipe", 403);
    }

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
      difficultyLevel,
      estimatedCost
    } = req.body;

    if (!title || !description || !categoryObjectId || !prepTime || !cookTime || !servings || !difficultyLevel) {
      return errorResponse(res, "All required fields must be provided", 400);
    }

    // Parse inputs
    const parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients || [];
    const parsedNutrients = typeof nutrients === "string" ? JSON.parse(nutrients) : nutrients || [];
    const parsedDirections = typeof directionsRaw === "string" ? JSON.parse(directionsRaw) : directionsRaw || [];
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
    const parsedPrepTime = typeof prepTime === "string" ? JSON.parse(prepTime) : prepTime;
    const parsedCookTime = typeof cookTime === "string" ? JSON.parse(cookTime) : cookTime;

    if (!parsedIngredients.length) return errorResponse(res, "Ingredients required");
    if (!parsedNutrients.length) return errorResponse(res, "Nutrients required");
    if (!parsedDirections.length) return errorResponse(res, "Directions required");
    if (!parsedPrepTime?.value || !parsedPrepTime?.unit) return errorResponse(res, "Prep time invalid");
    if (!parsedCookTime?.value || !parsedCookTime?.unit) return errorResponse(res, "Cook time invalid");

    // 🔗 Slug
    let slug = generateSlug(title);
    const slugExists = await Recipe.findOne({ slug, _id: { $ne: id } }).session(session);
    if (slugExists) slug = `${slug}-${Date.now()}`;

    const categoryId = new mongoose.Types.ObjectId.isValid(categoryObjectId);

    // Old media IDs for cleanup if new uploaded
    const oldDishImageId = existingRecipe.dishImage?.public_id;
    const oldDishVideoId = existingRecipe.dishVideo?.public_id;
    const oldStepImageIds = existingRecipe.directions.map(d => d.stepImage?.public_id).filter(Boolean);
    const oldStepVideoIds = existingRecipe.directions.map(d => d.stepVideo?.public_id).filter(Boolean);

    // Initialize new dish media
    let newDishImage = existingRecipe.dishImage;
    let newDishVideo = existingRecipe.dishVideo;

    // 🖼️ Dish Image
    if (req.files?.dishImage?.[0]) {
      if (oldDishImageId) mediaToDelete.push({ public_id: oldDishImageId, resource_type: "image" });
      if (oldDishVideoId) mediaToDelete.push({ public_id: oldDishVideoId, resource_type: "video" });

      const uploadRes = await cloudinaryUpload(req.files.dishImage[0].buffer, cloudinaryFolderNames.images, "image");
      uploadedMedia.push(uploadRes);

      newDishImage = { url: uploadRes.secure_url, public_id: uploadRes.public_id, resource_type: uploadRes.resource_type };
      newDishVideo = null;
    }

    // 🎬 Dish Video
    else if (req.files?.dishVideo?.[0]) {
      if (oldDishImageId) mediaToDelete.push({ public_id: oldDishImageId, resource_type: "image" });
      if (oldDishVideoId) mediaToDelete.push({ public_id: oldDishVideoId, resource_type: "video" });

      const uploadRes = await cloudinaryUpload(req.files.dishVideo[0].buffer, cloudinaryFolderNames.videos, "video");
      uploadedMedia.push(uploadRes);

      newDishVideo = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        resource_type: uploadRes.resource_type,
        height: uploadRes.height,
        width: uploadRes.width,
        duration: uploadRes.duration
      };
      newDishImage = { url: `${uploadRes.secure_url}.jpg`, public_id: uploadRes.public_id, resource_type: "image" };
    }

    // 📸 Directions media
    const finalDirections = [];
    let imgCounter = 0, vidCounter = 0;

    for (let i = 0; i < parsedDirections.length; i++) {
      const step = parsedDirections[i];
      let stepImage = {};
      let stepVideo = {};

      // New step image
      if (step.hasNewImage && req.files?.directionImages?.[imgCounter]) {
        if (step.existingImagePublicId) mediaToDelete.push({ public_id: step.existingImagePublicId, resource_type: "image" });

        const uploadRes = await cloudinaryUpload(req.files.directionImages[imgCounter].buffer, cloudinaryFolderNames.images, "image");
        uploadedMedia.push(uploadRes);
        imgCounter++;

        stepImage = { url: uploadRes.secure_url, public_id: uploadRes.public_id, resource_type: uploadRes.resource_type };
      } else if (step.existingImagePublicId) {
        stepImage = existingRecipe.directions.find(x => x.stepImage?.public_id === step.existingImagePublicId)?.stepImage || {};
      }

      // New step video
      if (step.hasNewVideo && req.files?.directionVideos?.[vidCounter]) {
        if (step.existingVideoPublicId) mediaToDelete.push({ public_id: step.existingVideoPublicId, resource_type: "video" });

        const uploadRes = await cloudinaryUpload(req.files.directionVideos[vidCounter].buffer, cloudinaryFolderNames.videos, "video");
        uploadedMedia.push(uploadRes);
        vidCounter++;

        stepVideo = {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
          resource_type: uploadRes.resource_type,
          height: uploadRes.height,
          width: uploadRes.width,
          duration: uploadRes.duration
        };
      } else if (step.existingVideoPublicId) {
        stepVideo = existingRecipe.directions.find(x => x.stepVideo?.public_id === step.existingVideoPublicId)?.stepVideo || {};
      }

      finalDirections.push({ stepNumber: i + 1, heading: step.heading, description: step.description, stepImage, stepVideo });
    }

    // ✅ DB update
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        description,
        categoryId,
        ingredients: parsedIngredients,
        nutrients: parsedNutrients,
        directions: finalDirections,
        prepTime: parsedPrepTime,
        cookTime: parsedCookTime,
        servings: Number(servings),
        dishImage: newDishImage,
        dishVideo: newDishVideo,
        tags: parsedTags,
        isPublished,
        slug,
        estimatedCost,
        difficultyLevel
      },
      { new: true, session }
    );

    // 🧹 Delete old media after successful update
    for (const media of mediaToDelete) {
      await cloudinaryDelete(media.public_id, media.resource_type);
    }

    // 🔄 Category count adjust
    if (!existingRecipe.categoryId.equals(categoryId)) {
      await RecipeCategory.findByIdAndUpdate(existingRecipe.categoryId, { $inc: { count: -1 } }, { session });
      await RecipeCategory.findByIdAndUpdate(categoryId, { $inc: { count: 1 } }, { session });
    }

    // 🏷 Tags upsert
    for (let tag of parsedTags) {
      await Tag.findOneAndUpdate(
        { name: tag.toLowerCase() },
        { $setOnInsert: { name: tag.toLowerCase() }, $inc: { recipeCount: 1 } },
        { upsert: true, session }
      );
    }

    // 🧾 Audit log
    await AuditLog.create([{ action: "RECIPE_UPDATED", performedBy: req.user._id, targetId: updatedRecipe._id, targetType: "RECIPE" }], { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Recipe updated successfully", updatedRecipe);

  } catch (err) {
    await session.abortTransaction();

    // rollback cloudinary
    for (const media of uploadedMedia) {
      if (media?.public_id) await cloudinaryDelete(media.public_id, media.resource_type);
    }
    next(error);

    // return errorResponse(res, err.message || "Recipe update failed. Uploaded media cleaned.", 500);
  } finally {
    session.endSession();
  }
};


// 🔹 Soft Delete
exports.deleteRecipe = async (req, res, next) => {
  const session = await startSession();

  try {
    const recipeId = req.body.id || req.params.id;
    if (!recipeId) return errorResponse(res, "Recipe ID required", 400);

    const recipe = await Recipe.findById(recipeId).session(session);
    if (!recipe) return errorResponse(res, "Recipe not found", 404);
    if (recipe.isDeleted) return errorResponse(res, "Recipe already deleted", 400);

    // Soft delete
    recipe.isDeleted = true;
    recipe.deletedAt = new Date();
    recipe.deletedBy = req.user._id;
    recipe.isPublished = false;
    await recipe.save({ session });

    // Category count
    if (recipe.categoryId) await RecipeCategory.findByIdAndUpdate(recipe.categoryId, { $inc: { count: -1 } }, { session });

    // Tag counts
    for (const tag of recipe.tags) await Tag.findOneAndUpdate({ name: tag.toLowerCase() }, { $inc: { recipeCount: -1 } }, { session });

    // Audit log
    await AuditLog.create([{ action: "RECIPE_SOFT_DELETED", performedBy: req.user._id, targetId: recipe._id, targetType: "RECIPE" }], { session });

    // Optional: request update (agar chef ne request bheja ho)
    const request = await Request.findOneAndUpdate({ itemId: recipeId, status: "PENDING" }, { $set: { status: "APPROVED", approvedBy: req.user._id } }, { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Recipe soft deleted successfully", {
      reqId:request?._id,
      status:request.status
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);

    // return errorResponse(res, err.message || "Delete failed", 500);
  }
};

// 🔹 Restore Recipe
exports.restoreRecipe = async (req, res, next) => {
  const session = await startSession();

  try {
    const id = req.body.id || req.params.id;
    if (!id) return errorResponse(res, "Recipe ID required", 400);

    const recipe = await Recipe.findById(id).session(session);
    if (!recipe) return errorResponse(res, "Recipe not found", 404);
    if (!recipe.isDeleted) return errorResponse(res, "Recipe is not deleted", 400);

    recipe.isDeleted = false;
    recipe.deletedAt = null;
    recipe.deletedBy = null;
    recipe.isPublished = true;
    await recipe.save({ session });

    // Increase category count
    if (recipe.categoryId) {
      await RecipeCategory.findByIdAndUpdate(recipe.categoryId, { $inc: { count: 1 } }, { session });
    }

    for (const tag of recipe.tags) await Tag.updateOne({ name: tag.toLowerCase() }, { $inc: { recipeCount: 1 } }, { session });
    // Audit log
    await AuditLog.create([{ action: "RECIPE_RESTORED", performedBy: req.user._id, targetId: recipe._id, targetType: "RECIPE" }], { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Recipe restored successfully");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(error);

    // return errorResponse(res, err.message || "Restore failed", 500);
  }
};


// 🔹 Permanent Delete
exports.permanentDeleteRecipe = async (req, res, next) => {
  const session = await startSession();

  try {
    const id = req.body.id || req.params.id;
    if (!id) return errorResponse(res, "Recipe ID required", 400);

    const recipe = await Recipe.findById(id).session(session);
    if (!recipe) return errorResponse(res, "Recipe not found", 404);
    if (!recipe.isDeleted) {
      return errorResponse(res, "Recipe must be soft deleted first", 400);
    }

    await permanentlyDeleteRecipeInternal(recipe, session);

    // Audit log
    await AuditLog.create([{ action: "RECIPE_PERMANENTLY_DELETED", performedBy: req.user._id, targetId: recipe._id, targetType: "RECIPE" }], { session });

    await session.commitTransaction();
    session.endSession();

    // Delete media from Cloudinary AFTER DB transaction success
    for (let media of mediaToDelete) {
      try {
        await cloudinaryDelete(media.public_id, media.resource_type);
      } catch (err) {
        console.error(`Failed to delete media ${media.public_id}:`, err.message);
      }
    }

    return successResponse(res, "Recipe permanently deleted successfully");
  } catch (err) {
    await session.abortTransaction();
    next(error);

    // return errorResponse(res, err.message || "Permanent delete failed", 500);
  } finally {
    session.endSession();

  }
};

exports.suggestTags = async (req, res, next) => {
  try {
    const search = req.query?.search?.trim() || "";

    if (!search) {
      return errorResponse(res, "Search query is required.", 400);
    }

    const tags = await Tag.find({
      name: { $regex: search, $options: "i" }
    })
      .select("name")
      .limit(10)
      .lean(); // lean() returns plain JS objects, better performance

    if (!tags.length) {
      return errorResponse(res, "No tags found.", 404);
    }

    const tagList = tags.map(t => t.name);
    return successResponse(res, "Tags found.", tagList);

  } catch (error) {
    console.error("Tag suggestion error:", error);
    next(error);

    // return errorResponse(res, "Failed to fetch tag suggestions.", 500);
  }
};

exports.getRecommendedRecipes = async (req, res, next) => {
  try {
    const { recipeId, categoryId, limit, isPublished = true } = req.query;

    console.log("Received recipeId:", recipeId);
    console.log("Received categoryId:", categoryId);

    let query = { isPublished }; // Only published recipes
    // Category filter
    if (categoryId && categoryId !== "All" && categoryId !== "null") {
      if (mongoose.isValidObjectId(categoryId)) {
        query.categoryId = categoryId;
      } else {
        return errorResponse(res, "Invalid categoryId.", 400);
      }
    }

    // Exclude current recipe
    if (recipeId && mongoose.Types.ObjectId.isValid(recipeId)) {
      query._id = { $ne: recipeId };
    }

    console.log("Final MongoDB Query:", query);



    const recommendations = await Recipe.find(query)
      .limit(Number(limit) || 8)
      .select(
        "title dishImage rating prepTime cookTime ratings difficultyLevel tags avgRating categoryId"
      )
      .lean();
    console.log("REcomenee", recommendations)

    return successResponse(res, "Recommendations fetched", recommendations);
  } catch (error) {
    console.error("Error in getRecommendedRecipes:", error);
    next(error);

    // return errorResponse(res,error.message || "Failed to fetch recommendations.",500);
  }
};


exports.getRecipes = async (req, res, next) => {
  try {
    const { categoryId, isPublished } = req.query;
    console.log(req.query);

    let filter = { isDeleted: false }; // soft-deleted recipes ignore

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true"; // query param se bool conversion
    }

    const recipes = await Recipe.find(filter).lean();
    // .select("title dishImage isPublished categoryId tags prepTime cookTime difficultyLevel")

    console.log(recipes, categoryId);
    if (!recipes.length) {
      return successResponse(res, "No recipes found.", []);
    }
    return successResponse(res, "Recipes fetched successfully.", recipes);
  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Failed to fetch recipes.", 500);
  }
};


exports.getRecipe = async (req, res, next) => {
  try {
    const id = req.body?.id || req.params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Valid Recipe ID is required.", 400);
    }

    const recipe = await Recipe.findOne({ _id: id, isDeleted: false })
      .populate({ path: "author", select: "profilePic username email" })
      .lean();

    if (!recipe) {
      return errorResponse(res, "Recipe not found.", 404);
    }



    return successResponse(res, "Recipe found", {
      recipe,
      meta: {
        likesCount: recipe?.likes?.length || 0,
        savesCount: recipe?.saves?.length || 0,
        viewsCount: recipe?.views?.length || 0,
        sharesCount: recipe?.shares?.length || 0,
      }
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    next(error);

    // return errorResponse(res, error.message || "Recipe fetch failed.", 500);
  }
};

exports.getRecipesByCategory = async (req, res, next) => {
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
    next(error);

    // return errorResponse(res, error.message || "Recipes fetch failed.", 500);
  }
};


exports.recipeLike = async (req, res, next) => {
  try {

    const { recipeId } = req.body;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(res, "Invalid recipe ID.", 400);
    }
    const recipe = await Recipe.findOne({ _id: recipeId, isDeleted: false });
    if (!recipe) return errorResponse(res, "Recipe not found.", 404);

    const isLiked = recipe.likes.includes(userId);
    if (isLiked) recipe.likes.pull(userId);
    else recipe.likes.push(userId);

    await recipe.save();


    return successResponse(res, `Recipe ${isLiked ? "DisLiked" : "Liked"} `, {
      isLiked: !isLiked,
      likesCount: recipe.likes.length
    });


  } catch (error) {
    console.error("recipeLike error:", error);
    next(error);

    // return errorResponse(res, "Server error", 500);
  }
};


exports.recipeShare = async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(res, "Invalid recipe ID.", 400);
    }

    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, isDeleted: false },
      { $addToSet: { shares: userId } },
      { new: true }
    );

    if (!recipe) return errorResponse(res, "Recipe not found.", 404);

    return successResponse(res, "Share counted", {
      sharesCount: recipe.shares.length
    });

  } catch (error) {
    console.error("recipeShare error:", error);
    next(error);

    // return errorResponse(res, "Share operation failed.", 500);
  }
};


exports.recipeSave = async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(res, "Invalid recipe ID.", 400);
    }
    const recipe = await Recipe.findOne({ _id: recipeId, isDeleted: false });
    if (!recipe) return errorResponse(res, "Recipe not found.", 404);

    const isSaved = recipe.saves.includes(userId);
    if (isSaved) recipe.saves.pull(userId);
    else recipe.saves.push(userId);

    await recipe.save();

    return successResponse(res, `Recipe ${isSaved ? "Unsaved" : "Saved"} `, {
      isSaved: !isSaved,
      savesCount: recipe.saves.length
    });

  } catch (error) {
    console.error("recipeSave error:", error);
    next(error);

    // return errorResponse(res, "Save operation failed.", 500);
  }
};


exports.recipeView = async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(res, "Invalid recipe ID.", 400);
    }

    await Recipe.findOneAndUpdate(
      { _id: recipeId, isDeleted: false },
      { $addToSet: { views: userId } }
    );

    return successResponse(res, "View counted", { viewed: true });

  } catch (error) {
    console.error("recipeView error:", error);
    next(error);

    // return errorResponse(res, "View operation failed.", 500);
  }
};


exports.submitRecipeRating = async (req, res, next) => {
  try {
    const { recipeId, rating } = req.body;
    const userId = req.user._id;
    console.log(userId);
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(res, "Invalid recipe ID.", 400);
    }


    const recipe = await Recipe.findOne({ _id: recipeId, isDeleted: false });
    if (!recipe) return errorResponse(res, "Recipe not found.", 404);

    console.log(recipe);

    const existingRatingIndex = recipe?.ratings.findIndex(r => r.user.toString() === userId.toString());

    if (existingRatingIndex > -1) {
      recipe.ratings[existingRatingIndex].value = Number(rating);
    } else {
      recipe.ratings.push({ user: userId, value: Number(rating) }); // 'rating' key removed, using 'value'
    }
    console.log(existingRatingIndex);

    const totalRatings = recipe.ratings.length;
    const sumRatings = recipe.ratings.reduce((sum, current) => sum + current.value, 0);
    recipe.avgRating = sumRatings / totalRatings;
    console.log(totalRatings, sumRatings)

    await recipe.save();


    console.log(recipe.ratings.length, recipe.avgRating, rating);

    return successResponse(res, "Rating submitted successfully", {
      avgRating: recipe.avgRating,
      totalRatings: recipe.ratings.length,
      submittedRating: rating
    });

  } catch (error) {
    console.log(error);
    next(error);

    // return errorResponse(res, error.message || "Rating submission failed.", 500);
  }
};



exports.getLast7DaysStats = async (req, res, next) => {
  try {
    const user = req.user;
    const isChef = user.role === "chef";

    const matchStage = {
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 6))
      }
    };

    // Chef → sirf apni recipes
    if (isChef) {
      matchStage.author = new mongoose.Types.ObjectId(user._id);
    }

    const stats = await Recipe.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          recipes: { $sum: 1 },
          views: { $sum: { $size: { $ifNull: ["$views", []] } } },
          likes: { $sum: { $size: { $ifNull: ["$likes", []] } } }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    return successResponse(res, "Last 7 days stats", stats);

  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Chart stats failed", 500);
  }
};