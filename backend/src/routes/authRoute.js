const {  localRegister, verifyMail, localLogin, logout, contact } = require("../controllers/userController");
const authenticated = require("../middlewares/authMiddleware");

const route = require("express").Router();

route.route("/localregister").post(localRegister);
route.route("/locallogin").post(localLogin);
route.route("/verify-mail").post(verifyMail);
route.route("/logout").post(logout);
route.route("/contact").post(contact);





module.exports = route;