const express = require("express");
const router = express();


const authenticated = require("../middlewares/auth.middleware.js");
const allowRoles= require("../middlewares/role.middleware.js");
const {
    blockUnblockUser,
    getAllUsers,
    getAuditLog,
    getDeleteRequests,
    rejectRequest,
    getAdminDashboardStats,
    allotDisAllotChef,
    getModerationStats
} = require("../controllers/admin.controller.js");


router.use(authenticated, allowRoles("SUPERADMIN", "ADMIN"));

router.route("/users").get(getAllUsers);
router.route("/user/block-unblock/:id").post(blockUnblockUser);
router.route("/delete-requests").get(getDeleteRequests);
router.route("/audit-logs").get(getAuditLog);
router.route("/reject-request/:id").post(rejectRequest);
router.route("/dashboard").get(getAdminDashboardStats);
router.route("/chef/approve/:id").patch(allotDisAllotChef);
router.route("/moderation").get(getModerationStats);

// router.route("/top-recipes").get(getDashboardStats);
// router.route("/recent-activities").get(getDashboardStats);


module.exports= router;
