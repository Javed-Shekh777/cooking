const router = require("express").Router();
const upload = require("../config/multerconfig");
const { suggestTags, addRecipe, addCategory, getCategories, getRecipes, getRecipe, updateRecipe, dashboard, getRecipesByCategory, getCategory, recipeLike, recipeSave, recipeShare, recipeView, addComment, getComments, toggleCommentLike, updateCategory, getRecommendedRecipes, submitRecipeRating, deleteComment, deleteRequest, getDeleteRequests, updateDeleteReq, getAuditLog } = require("../controllers/recipeController");
const authenticated = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/checkRoles");
const optionalAuthenticated = require("../middlewares/optionalAuthenticated");
const recipeLikes = require("../models/recipeLikes");


router.route("/add-recipe").post(
  authenticated,
  allowRoles("chef", "admin"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
    { name: "directionImages", maxCount: 20 },
    { name: "directionVideos", maxCount: 5 },

  ]),
  addRecipe
);


router.route("/update-recipe/:id").post(
  authenticated,
  allowRoles("chef", "admin"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
    { name: "directionImages", maxCount: 20 },
    { name: "directionVideos", maxCount: 5 },
  ]),
  updateRecipe
);

router.route("/dashboard").get(authenticated, dashboard);

router.route("/get-recipe/:id").get(optionalAuthenticated, getRecipe);
router.route("/get-recipes").get(getRecipes);
router.route("/get-recommendrecipes").get(getRecommendedRecipes);


router.route("/get-recipes-category/:id").get(getRecipesByCategory);

router.route("/delete-recipe").delete(authenticated, allowRoles("chef", "admin"));


router.route("/suggest-tags").get(authenticated, suggestTags);


// For Category Schema 
router.route("/add-category").post(authenticated, allowRoles("admin", "chef"), upload.single("categoryImage"), addCategory);
router.route("/update-category/:id").post(authenticated, allowRoles("admin", "chef"), upload.single("categoryImage"), updateCategory);

router.route("/get-categories").get(getCategories);
router.route("/get-category/:id").get(getCategory);

router.route("/add-comment/:id").post(authenticated, addComment);
router.route("/get-comments/:id").get(getComments);
router.route("/like-comment/:id").post(authenticated, toggleCommentLike);
router.route("/delete-comment").delete(authenticated, deleteComment);




router.route("/recipe-likedish").post(authenticated, recipeLike);
router.route("/recipe-share").post(authenticated, recipeShare);
router.route("/recipe-view").post(authenticated, recipeView);
router.route("/recipe-save").post(authenticated, recipeSave);
router.route("/recipe-rating").post(authenticated, submitRecipeRating);


router.route("/delete-req").post(authenticated,deleteRequest);
router.route("/get-delete-req").get(authenticated,getDeleteRequests);
router.route("/update-delete-req/:id").patch(authenticated,updateDeleteReq);
router.route("/get-auditlog").get(authenticated,getAuditLog);



module.exports = router;

 