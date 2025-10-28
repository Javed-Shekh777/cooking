const router = require("express").Router();
const upload = require("../config/multerconfig");
const { suggestTags, addRecipe, addCategory, getCategories, getRecipes, getRecipe, updateRecipe, dashboard } = require("../controllers/recipeController");
const authenticated = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/checkRoles");


router.route("/add-recipe").post(
  authenticated,
  allowRoles("chef", "admin"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
    { name: "directionImages" }
  ]),
  addRecipe
);


router.route("/update-recipe/:id").post(
  authenticated,
  allowRoles("chef", "admin"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
    { name: "directionImages" }
  ]),
  updateRecipe
);

router.route("/dashboard").get(authenticated,  dashboard);

router.route("/get-recipe/:id").get(getRecipe);
router.route("/get-recipes").get(getRecipes);
router.route("/delete-recipe").delete(authenticated, allowRoles("chef", "admin"));


router.route("/suggest-tags").get(authenticated, suggestTags);


// For Category Schema 
router.route("/add-category").post(authenticated, allowRoles("admin", "chef"), upload.single("categoryImage"), addCategory);
router.route("/get-categories").get(getCategories);




module.exports = router;