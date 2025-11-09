const router = require("express").Router();
const upload = require("../config/multerconfig");
const { suggestTags, addRecipe, addCategory, getCategories, getRecipes, getRecipe, updateRecipe, dashboard, getRecipesByCategory, getCategory } = require("../controllers/recipeController");
const authenticated = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/checkRoles");


router.route("/add-recipe").post(
  authenticated,
  allowRoles("chef", "admin"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
    { name: "directionImages",maxCount:20 },
    { name: "directionVideos",maxCount:5 },

  ]),
  addRecipe
);


router.route("/update-recipe/:id").post(
  authenticated,
  allowRoles("chef", "admin"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
     { name: "directionImages",maxCount:20 },
    { name: "directionVideos",maxCount:5 },
  ]),
  updateRecipe
);

router.route("/dashboard").get(authenticated,  dashboard);

router.route("/get-recipe/:id").get(getRecipe);
router.route("/get-recipes").get(getRecipes);
router.route("/get-recipes-category/:id").get(getRecipesByCategory);

router.route("/delete-recipe").delete(authenticated, allowRoles("chef", "admin"));


router.route("/suggest-tags").get(authenticated, suggestTags);


// For Category Schema 
router.route("/add-category").post(authenticated, allowRoles("admin", "chef"), upload.single("categoryImage"), addCategory);
router.route("/get-categories").get(getCategories);
router.route("/get-category/:id").get(getCategory);





module.exports = router;