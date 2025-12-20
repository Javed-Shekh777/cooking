const upload = require("../config/multerconfig");
const {  localRegister, verifyMail, localLogin, logout, contact, getUserProfile, updateUserProfile,refreshToken,requestEmailChange,verifyEmailChange } = require("../controllers/userController");
const authenticated = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.route("/localregister").post(localRegister);
router.route("/locallogin").post(localLogin);
router.route("/refresh").post(refreshToken);
router.route("/logout").post(logout);
router.route("/verify-mail").post(verifyMail);
router.route("/contact").post(contact);

 
router.route("/request-email-change").post(authenticated,requestEmailChange);
router.route("/verify-email-change").post(authenticated,verifyEmailChange);


router.route("/user-profile").get(authenticated,getUserProfile);
router.route("/update-profile").post(authenticated,upload.single("profileImage"),updateUserProfile);





module.exports = router;