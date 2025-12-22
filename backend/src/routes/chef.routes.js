const express = require("express");
const authenticated = require("../middlewares/auth.middleware.js");
const allowRoles  = require("../middlewares/role.middleware.js");
const {
    deleteRequest,
    getChefDashboardStats,
    getChefPerformance,
    getAllRequests
} = require("../controllers/chef.controller.js");

const router = express.Router();

router.use(authenticated, allowRoles("CHEF", "ADMIN"));
router.route("/dashboard").get(getChefDashboardStats);
router.route("/create-req").post(deleteRequest);
router.route("/analytics").get(getChefPerformance);
router.route("/requests").get(getAllRequests);



module.exports= router;
