const { cloudinaryFolderNames } = require("../constants");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipe.model");
const User = require("../models/user.model");
const AuditLog = require("../models/auditLog.model");
const RecipeComment = require("../models/comment.model");
const Request = require("../models/deleteRequest.model");

const Tag = require("../models/tag.model");
const RecipeCategory = require("../models/category.model");
const { startSession, permanentlyDeleteRecipeInternal } = require("../helper/common");


exports.addCategory = async (req, res, next) => {
  const session = await startSession();

  try {


    const { name, description, icon } = req.body;

    if (!name || !description || !icon) {
      return errorResponse(res, "All fields are required.", 401);
    }

    let cloud = null;

    // 🔍 Check duplicate (case-insensitive)
    const existing = await RecipeCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });


    if (existing) {
      return errorResponse(res, "Category already exists", 400);
    }

    let imageData = null;


    if (req.file) {
      const cloud = await cloudinaryUpload(
        req.file.buffer,
        cloudinaryFolderNames.images,
        "image"
      );

      imageData = {
        url: cloud.secure_url,
        public_id: cloud.public_id,
        resource_type: cloud.resource_type
      };
    }

    const category = await RecipeCategory.create([{
      name: name.trim(),
      description,
      icon,
      image: imageData
    }], { session });


    await AuditLog.create([{
      action: "CATEGORY_CREATED",
      performedBy: req.user._id,
      targetId: category[0]._id,
      targetType: "CATEGORY"
    }], { session });


    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Category created successfully", category[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);

    // return errorResponse(res, error.message || "Category creation failed", 500);
  }
};


exports.updateCategory = async (req, res, next) => {
  const session = await startSession();


  try {
    const { id } = req.params;
    const { name, description, icon, oldPublicId } = req.body;

    const category = await RecipeCategory.findById(id).session(session);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    // 🔍 Duplicate name check (case-insensitive)
    if (name) {
      const duplicate = await RecipeCategory.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name}$`, $options: "i" }
      });

      if (duplicate) {
        return errorResponse(res, "Category name already exists", 400);
      }
    }

    // 🖼 IMAGE UPDATE (Replace)
    if (req.file) {
      const cloud = await cloudinaryUpload(
        req.file.buffer,
        cloudinaryFolderNames.images,
        "image"
      );

      // delete old image only if exists
      if (category.image?.public_id) {
        await cloudinaryDelete(category.image.public_id, "image");
      }

      category.image = {
        url: cloud.secure_url,
        public_id: cloud.public_id,
        resource_type: cloud.resource_type
      };
    }

    // ❌ IMAGE REMOVE (only if public_id matches)
    if (
      oldPublicId &&
      category.image?.public_id &&
      oldPublicId === category.image.public_id
    ) {
      await cloudinaryDelete(category.image.public_id, "image");
      category.image = null;
    }

    // ✏️ Text updates
    if (name) category.name = name.trim();
    if (description) category.description = description;
    if (icon !== undefined) category.icon = icon;

    await category.save({ session });

    // 🧾 Audit log
    await AuditLog.create([{
      action: "CATEGORY_UPDATED",
      performedBy: req.user._id,
      targetId: category._id,
      targetType: "CATEGORY"
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Category updated successfully", category);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);

    // return errorResponse(res, error.message || "Category update failed", 500);
  }
};



exports.getCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return errorResponse(res, "Category ID required", 400);
    }

    const category = await RecipeCategory.findById(id);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    return successResponse(res, "Category fetched successfully", category);

  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Category fetch failed", 500);
  }
};





// 👉 sirf active categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await RecipeCategory.find({
      isActive: true,
      isDeleted: false
    });

  



    return successResponse(res, "Categories fetched", categories);
  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Category fetch failed", 500);
  }
};



exports.getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await RecipeCategory.find();
    return successResponse(res, "All categories fetched", categories);
  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Category fetch failed", 500);
  }
};


exports.deleteCategory = async (req, res, next) => {
  const session = await startSession();


  try {
    const id = req.params.id || req.body.id;

    const category = await RecipeCategory.findById(id).session(session);
    if (!category) return errorResponse(res, "Category not found", 404);

    if (category.isDeleted) {
      return errorResponse(res, "Category already deleted", 400);
    }

    category.isDeleted = true;
    category.isActive = false;
    category.deletedAt = new Date();
    category.deletedBy = req.user._id;

    await category.save({ session });

    await Recipe.updateMany({ categoryId: category._id }, {
      $set: {
        isDeleted: true,
        isPublished: false
      }
    });


    // Optional: request update (agar chef ne request bheja ho)
    const request = await Request.findOneAndUpdate({ itemId: category._id, status: "PENDING" }, { $set: { status: "APPROVED", approvedBy: req.user._id } }, { session });

    await AuditLog.create([{
      action: "CATEGORY_SOFT_DELETED",
      performedBy: req.user._id,
      targetId: category._id,
      targetType: "CATEGORY"
    }], { session });

    await session.commitTransaction();
    session.endSession();
    return successResponse(res, "Category soft deleted",{
      reqId:request?._id,
      status:request.status
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);

    // return errorResponse(res, error.message || "Soft delete failed", 500);
  }
};



exports.restoreCategory = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.id;

    const category = await RecipeCategory.findById(id);
    if (!category) return errorResponse(res, "Category not found", 404);

    if (!category.isDeleted) {
      return errorResponse(res, "Category is not deleted", 400);
    }

    category.isDeleted = false;
    category.isActive = true;
    category.deletedAt = null;
    category.deletedBy = null;

    await category.save();

    await Recipe.updateMany({ categoryId: category._id }, {
      $set: {
        isDeleted: false,
        isPublished: true
      }
    });

    await AuditLog.create({
      action: "CATEGORY_RESTORED",
      performedBy: req.user._id,
      targetId: category._id,
      targetType: "CATEGORY"
    });

    return successResponse(res, "Category restored");

  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Restore failed", 500);
  }
};


exports.permanentDeleteCategory = async (req, res, next) => {
  const session = await startSession();


  try {
    const id = req.params.id || req.body.id;

    const category = await RecipeCategory.findById(id).session(session);
    if (!category) return errorResponse(res, "Category not found", 404);

    // ❗ RULE 1: Must be soft deleted
    if (!category.isDeleted) {
      return errorResponse(
        res,
        "Category must be soft deleted first",
        400
      );
    }

    const recipes = await Recipe.find({ categoryId: category._id }).session(session);
    // ❗ RULE 2: All recipes must be soft deleted
    const activeRecipe = recipes.find(r => !r.isDeleted);
    if (activeRecipe) {
      return errorResponse(
        res,
        "All recipes under this category must be deleted first",
        400
      );
    }

    for (const recipe of recipes) {
      await permanentlyDeleteRecipeInternal(recipe, session);
    }


    // 🔥 delete image from cloudinary
    if (category.image?.public_id) {
      await cloudinaryDelete(category.image.public_id, "image");
    }

    await RecipeCategory.findByIdAndDelete(id).session(session);

    await AuditLog.create([{
      action: "CATEGORY_PERMANENT_DELETED",
      performedBy: req.user._id,
      targetId: id,
      targetType: "CATEGORY"
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Category permanently deleted");

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);

    // return errorResponse(res, error.message || "Permanent delete failed", 500);
  }
};
