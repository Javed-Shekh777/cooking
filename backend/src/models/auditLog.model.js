const { SchemaName } = require("../constants");
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: [
            "RECIPE_CREATED",
            "RECIPE_UNPUBLISHED",
            "DELETE_REQUESTED",
            "RECIPE_SOFT_DELETED",
            "RECIPE_RESTORED",
            "RECIPE_UPDATED",
            "CATEGORY_CREATED",
            "CATEGORY_UNPUBLISHED",
            "CATEGORY_DELETED",
            "CATEGORY_RESTORED",
            "CATEGORY_UPDATED",
            "DELETE_APPROVED",
            "DELETE_REJECTED",
            "RECIPE_PERMANENTLY_DELETED",
            "CATEGORY_PUBLISHED",
            "CATEGORY_SOFT_DELETED",
            "RECIPE_PUBLISHED",          // jab unpublished → published ho
            "RECIPE_VIEWED",             // analytics / insights
            "RECIPE_LIKED",
            "RECIPE_UNLIKED",
            "RECIPE_SAVED",
            "RECIPE_UNSAVED",
            "RECIPE_RATED",
            "RECIPE_COMMENTED",
            "RECIPE_COMMENT_DELETED",
            "DELETE_REJECTED",          // user ne delete request wapas li
            "DELETE_REVIEWED",           // admin ne review ki
            "USER_REGISTERED",
            "USER_LOGIN",
            "USER_LOGOUT",
            "EMAIL_VERIFIED",
            "CHEF_REGISTERED",
            "CHEF_APPROVED",
            "CHEF_REJECTED",
            "CHEF_SUSPENDED",
            "ADMIN_ACTION",
            "SYSTEM_ACTION",
            "DATA_MIGRATED",
            "CHEF_REGISTERED_PENDING_APPROVAL",
            "USER_UNBLOCKED",
            "USER_BLOCKED",
            "WELCOME_MAIL_SENT"
        ],
        required: true
    },

    performedBy: {
        type: mongoose.Types.ObjectId,
        ref: SchemaName.user
    },
    targetId: mongoose.Types.ObjectId,
    targetType: {
        type: String,
        enum: ["RECIPE", "CATEGORY", "USER", "ADMIN", "MODERATOR", "CHEF"]
    },


    meta: Object
}, { timestamps: true });

auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model(SchemaName.auditLog, auditLogSchema);
