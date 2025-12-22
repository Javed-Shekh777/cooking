const express = require("express");
const authenticated = require("../middlewares/auth.middleware.js");
const allowRoles  = require("../middlewares/role.middleware.js");

const upload = require("../config/multerconfig");

const {
 contact,getUserProfile,updateUserProfile
} =require("../controllers/user.controller.js");

const router = express.Router();

router.use(authenticated);

router.route("/contact").post(contact);
router.route("/user-profile").get(getUserProfile);
router.route("/update-profile").post(upload.single("profileImage"),updateUserProfile);



module.exports=router;

