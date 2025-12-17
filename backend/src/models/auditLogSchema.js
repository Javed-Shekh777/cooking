const { SchemaName } =require("../constants");
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: [
            "RECIPE_CREATED",
            "RECIPE_UNPUBLISHED",
            "DELETE_REQUESTED",
            "RECIPE_DELETED",
            "RECIPE_RESTORED",
            "RECIPE_UPDATED",

            "CATEGORY_CREATED",
            "CATEGORY_UNPUBLISHED",
            "CATEGORY_DELETED",
            "CATEGORY_RESTORED",
            "CATEGORY_UPDATED",

            "DELETE_APPROVED",
            "DELETE_REJECTED"
            

        ]
    },
    performedBy: {
        type: mongoose.Types.ObjectId,
        ref: SchemaName.user
    },
    targetId: mongoose.Types.ObjectId,
    targetType: String,
    meta: Object
}, { timestamps: true });


module.exports = mongoose.model(SchemaName.auditLog,auditLogSchema);
