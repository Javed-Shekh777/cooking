const { errorResponse, successResponse } = require("../util/response");
const User = require("../models/user.model");
const Request = require("../models/deleteRequest.model");
const Recipe = require("../models/recipe.model");
const RecipeComment = require("../models/comment.model");
const RecipeCategory = require("../models/category.model");
const AuditLog = require("../models/auditLog.model");



const { allotChefMail, disAllotChefMail, chefApplicationMail } = require("../helper/sendMail");
const { startSession } = require("../helper/common");
const { FRONTEND_URL } = require("../constants");



exports.allotDisAllotChef = async (req, res, next) => {
    const session = await startSession();

    try {
        const userId = req.params.id;
        const { approve } = req.body; // true / false

        if (approve === undefined) {
            return errorResponse(res, "approve flag is required", 400);
        }

        const user = await User.findById(userId).session(session);
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        // already same state
        if (user.isChefApproved === approve) {
            return errorResponse(
                res,
                approve
                    ? "User is already a Chef"
                    : "User is already not a Chef",
                400
            );
        }

        // update role + approval
        user.isChefApproved = approve;
        user.role = approve ? "CHEF" : "USER";
        user.chefApprovedAt = approve && new Date();
        await user.save();


        let request;
        let status;

        // send email (async, no rollback)
        if (approve) {
            request = await Request.findOneAndUpdate({ itemId: user?._id, status: "PENDING" }, { $set: { status: "APPROVED", approvedBy: req.user._id } }).session(session);
            status="APPROVED";
            await allotChefMail({ username: user.username, email: user.email, dashboardUrl: `${FRONTEND_URL}/chef` });
        } else {
            request = await Request.findOneAndUpdate({ itemId: user?._id, status: "PENDING" }, { $set: { status: "REJECTED", approvedBy: req.user._id } }).session(session);
            status="REJECTED";

            await disAllotChefMail({ username: user.username, email: user.email });
        }

        await session.commitTransaction();
        session.endSession();
        return successResponse(
            res,
            approve ? "Chef approved successfully" : "Chef access removed",
            {
                isChefApproved: user.isChefApproved,
                role: user.role,
                reqId: request?._id,
                status: status
            }
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);

        // return errorResponse(
        //     res,
        //     error.message || "Chef approval failed",
        //     500
        // );
    }
};

// GET USERS (filter by role)
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role } = req.query;

        let filter = {};
        if (role) filter.role = role;

        const users = await User.find(filter).select("-password");

        return successResponse(res, "Users fetched successfully", users);
    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to fetch users", 500);
    }
};

// BLOCK / UNBLOCK USER
exports.blockUnblockUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) return errorResponse(res, "User ID missing", 400);

        const user = await User.findById(userId);
        if (!user) return errorResponse(res, "User not found", 404);

        user.isBlocked = !user.isBlocked;
        await user.save();

        await AuditLog.create({
            action: user.isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
            performedBy: req.user._id,
            targetId: user._id,
            targetType: "USER"
        });

        return successResponse(res, "User status updated", {
            isBlocked: user.isBlocked,
            userId: userId
        });
    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Operation failed", 500);
    }
};


exports.getDeleteRequests = async (req, res, next) => {
    try {
        const { status } = req.query;

        let filter = {};
        if (status) filter.status = status;

        const requests = await Request.find(filter).populate("requestedBy", "username email profileImage")
            .populate("itemId");

        return successResponse(res, "Delete requests fetched", requests);
    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to fetch requests", 500);
    }
};

exports.getAuditLog = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .sort({ createdAt: -1 })
            .populate("performedBy", "username email")
            .populate("targetId");

        return successResponse(res, "Audit logs fetched", logs);
    } catch (error) {
        next(error);

        // return errorResponse(res, error.message || "Failed to fetch audit logs", 500);
    }
};


exports.getAdminDashboardStats = async (req, res, next) => {

    try {

        const [
            totalUsers,
            totalChefs,
            totalRecipes,
            publishedRecipes,
            deletedRecipes,
            totalCategories,
            totalRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests

        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "chef" }),
            Recipe.countDocuments(),
            Recipe.countDocuments({ isPublished: true, isDeleted: false }),
            Recipe.countDocuments({ isDeleted: true }),
            RecipeCategory.countDocuments({ isDeleted: { $ne: true } }),
            Request.countDocuments(),
            Request.countDocuments({ status: "PENDING" }),
            Request.countDocuments({ status: "APPROVED" }),
            Request.countDocuments({ status: "REJECTED" })



        ]);

        return successResponse(res, "Admin dashboard stats", {
            users: {
                total: totalUsers,
                chefs: totalChefs
            },
            recipes: {
                total: totalRecipes,
                published: publishedRecipes,
                deleted: deletedRecipes
            },
            requests: {
                total: totalRequests,
                pending: pendingRequests,
                approved: approvedRequests,
                rejected: rejectedRequests
            },
            categories: totalCategories,
            pendingDeleteRequests: pendingRequests
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        next(error);

        // return errorResponse(res, error.message || "Dashboard fetch failed", 500);
    }
};

exports.rejectRequest = async (req, res, next) => {
    try {
        const id = req.params?.id || req.body?.id;
        if (!id) return errorResponse(res, "ID is missing", 400);
        console.log(id);
        const request = await Request.findOne({ _id: id, status: "PENDING" });


        if (!request) return errorResponse(res, "Pending request not found", 404);



        const user = await User.findById(request?.itemId);
        if (user) {
            await disAllotChefMail({ username: user?.username, email: user?.email });

            // update role + approval
            user.isChefApproved = false;
            await user.save();
        }


        request.status = "REJECTED";
        request.rejectedBy = req.user._id;
        await request.save();

        await AuditLog.create(
            [{
                action: "DELETE_REJECTED",
                performedBy: req.user._id,
                targetId: request._id,
                targetType: request?.itemType
            }],
        );

        return successResponse(res, "Delete request rejected.", {
            reqId: request._id,
            status: request.status
        });
    } catch (error) {
        next(error);

        // return errorResponse(res, err.message || "Reject failed", 500);
    }
};

exports.getModerationStats = async (req, res, next) => {
    try {
        const [
            totalComments,
            deletedComments,
            deletedRecipes,
            unpublishedRecipes
        ] = await Promise.all([
            RecipeComment.countDocuments(),
            RecipeComment.countDocuments({ isDeleted: true }),
            Recipe.countDocuments({ isDeleted: true }),
            Recipe.countDocuments({ isPublished: false, isDeleted: false })
        ]);

        return successResponse(res, "Moderation dashboard", {
            comments: {
                total: totalComments,
                deleted: deletedComments
            },
            recipes: {
                deleted: deletedRecipes,
                unpublished: unpublishedRecipes
            }
        });

    } catch (error) {
        next(error);
    }
};


