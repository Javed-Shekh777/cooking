const { localLogin,localRegister,logout,refreshToken,requestEmailChange,verifyEmailChange,verifyMail } = require("../controllers/auth.controller");
const authenticated = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/localregister").post(localRegister);
router.route("/locallogin").post(localLogin);
router.route("/refresh").post(refreshToken);
router.route("/logout").post(logout);
router.route("/verify-mail").post(verifyMail);

router.route("/request-email-change").post(authenticated,requestEmailChange);
router.route("/verify-email-change").post(authenticated,verifyEmailChange);







module.exports = router;