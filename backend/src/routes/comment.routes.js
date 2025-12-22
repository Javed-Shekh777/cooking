const express = require("express");
const authenticated = require("../middlewares/auth.middleware.js");
const allowRoles = require("../middlewares/role.middleware.js");

const {
    addComment,
    deleteComment,
    getComments,
    toggleCommentLike
} = require("../controllers/comment.controller.js");

const router = express.Router();


router.route("/add-comment/:id").post(authenticated, addComment);
router.route("/get-comments/:id").get(getComments);
router.route("/like-comment").post(authenticated, toggleCommentLike);
router.route("/delete-comment").delete(authenticated, deleteComment);

// router.route("/reply/:id").post(authenticated, replyComment);

module.exports = router;
