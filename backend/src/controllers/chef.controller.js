const { cloudinaryFolderNames } = require("../constants");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipe.model");
const User = require("../models/user.model");
const RecipeComment = require("../models/comment.model");
const Request = require("../models/deleteRequest.model");
const AuditLog = require("../models/auditLog.model");


const RecipeCategory = require("../models/category.model");
const { default: mongoose } = require("mongoose");

exports.getChefDashboardStats = async (req, res, next) => {
  try {
    const chefId = req.user._id;

    const [
      totalRecipes,
      publishedRecipes,
      draftRecipes,
      deletedRecipes,
      pendingDeleteRequests,
      engagementStats,
    ] = await Promise.all([
      Recipe.countDocuments({ author: chefId }),
      Recipe.countDocuments({ author: chefId, isPublished: true, isDeleted: false }),
      Recipe.countDocuments({ author: chefId, isPublished: false, isDeleted: false }),

      Recipe.countDocuments({ author: chefId, isDeleted: true }),
      Request.countDocuments({
        requestedBy: chefId,
        status: "PENDING"
      }),

      Recipe.aggregate([
        {
          $match: {
            author: new mongoose.Types.ObjectId(chefId),
            isDeleted: false
          }
        },
        {
          $project: {
            likesCount: { $size: { $ifNull: ["$likes", []] } },
            viewsCount: { $size: { $ifNull: ["$views", []] } },
            shareCount: { $size: { $ifNull: ["$shares", []] } }
          }
        },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: "$likesCount" },
            totalViews: { $sum: "$viewsCount" },
            totalShares: { $sum: "$shareCount" },

          }
        }
      ])
    ]);

    const {
      totalLikes = 0,
      totalViews = 0,
      totalShares = 0
    } = engagementStats[0] || {};

    return successResponse(res, "Chef dashboard stats", {
      recipes: {
        total: totalRecipes,
        published: publishedRecipes,
        drafts: draftRecipes,
        deleted: deletedRecipes,
        totalLikes: totalLikes,
        totalShares: totalShares,
        totalViews: totalViews
      },
      deleteRequests: {
        pending: pendingDeleteRequests
      }
    });

  } catch (error) {
    console.error("Chef Dashboard Error:", error);
    next(error);

    // return errorResponse(res, error.message || "Dashboard fetch failed", 500);
  }
};



exports.deleteRequest = async (req, res, next) => {
  try {
    const { id, itemType, reason } = req.body;
    if (!id || !itemType || !reason) {
      return errorResponse(res, "All fields are required.", 402);
    }

    let exist;

    if (itemType === "RECIPE") {

      const exist = await Recipe.findOne({
        _id: id,
      });


      if (!exist) {
        return errorResponse(res, "Recipe not found.", 404);
      }
    } else if (itemType === "CATEGORY") {
      exist = await RecipeCategory.findOne({ _id: id });
      if (!exist) {
        return errorResponse(res, "Category not found.", 404);
      }
    }

    const request = await Request.create({
      itemId: id,
      itemType,
      reason,
      requestedBy: req?.user?._id,
    });

    const createdRequest = await Request.findById(request._id);
    if (!createdRequest) {
      return errorResponse(res, "Request not created.", 402);
    }
    await AuditLog.create({ action: "DELETE_REQUESTED", performedBy: req.user._id, targetId: id, targetType: itemType })

    return successResponse(res, "Request send successfully", createdRequest);


  } catch (error) {
    console.log(error);
    next(error);

    // return errorResponse(res, error.message || "Delete Request failed.", 500);
  }

}



exports.getChefPerformance = async (req, res, next) => {
  try {
    const chefId = req.user._id;

    const topRecipes = await Recipe.find({
      author: chefId,
      isPublished: true,
      isDeleted: false
    })
      .sort({ avgRating: -1, "likes.length": -1 })
      .limit(5)
      .select("title avgRating likes views");

    const stats = await Recipe.aggregate([
      { $match: { author: chefId } },
      {
        $group: {
          _id: null,
          totalRecipes: { $sum: 1 },
          avgRating: { $avg: "$avgRating" },
          totalViews: { $sum: { $size: { $ifNull: ["$views", []] } } },
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } }
        }
      }
    ]);

    return successResponse(res, "Chef performance analytics", {
      overview: stats[0] || {},
      topRecipes
    });

  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Chef analytics failed", 500);
  }
};


exports.getAllRequests = async (req, res, next) => {
  try {
    const chefId = req.user._id;

    let requests = null;
    if (req?.user?.role === "CHEF") {
      requests = await Request.find({ requestedBy: chefId })
        .populate("itemId", "title description")
        .sort({ createdAt: -1 })
    } else {
      requests = await Request.find()
        .populate("itemId", "title description")
        .populate("requestedBy","username profileImage")
        .sort({ createdAt: -1 })
    }

    return successResponse(res, "Requests fetched", requests.length < 0 ? [] : requests);

  } catch (error) {
    next(error);

    // return errorResponse(res, error.message || "Chef analytics failed", 500);
  }
};