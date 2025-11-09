const upload = require("../config/multerconfig");
const {  localRegister, verifyMail, localLogin, logout, contact, getUserProfile, updateUserProfile } = require("../controllers/userController");
const authenticated = require("../middlewares/authMiddleware");

const route = require("express").Router();

route.route("/localregister").post(localRegister);
route.route("/locallogin").post(localLogin);
route.route("/verify-mail").post(verifyMail);
route.route("/logout").post(logout);
route.route("/contact").post(contact);
route.route("/user-profile").get(authenticated,getUserProfile);
route.route("/update-profile").post(authenticated,upload.single("profileImage"),updateUserProfile);





module.exports = route;