const router = require("express").Router();
const upload = require("../config/multerconfig");
const {
  addRecipe,
  updateRecipe,
  getRecipe,
  getRecipes,
  getRecommendedRecipes,
  restoreRecipe,
  permanentDeleteRecipe,
  recipeLike,
  recipeSave,
  recipeShare,
  recipeView,
  submitRecipeRating,
  suggestTags,
  deleteRecipe,
  getRecipesByCategory,
  getLast7DaysStats
} = require("../controllers/recipe.controller");
const authenticated = require("../middlewares/auth.middleware");
const { optionalAuth } = require("../middlewares/optionalAuthenticated");
const allowRoles = require("../middlewares/role.middleware");

// Chef/Admin Routes
router.post(
  "/add-recipe",
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

router.post(
  "/update-recipe/:id",
  authenticated,
  allowRoles("CHEF", "ADMIN","SUPERADMIN"),
  upload.fields([
    { name: "dishImage", maxCount: 1 },
    { name: "dishVideo", maxCount: 1 },
    { name: "directionImages", maxCount: 20 },
    { name: "directionVideos", maxCount: 5 },
  ]),
  updateRecipe
);

router.delete(
  "/delete-recipe/:id",
  authenticated,
  allowRoles("CHEF","ADMIN","SUPERADMIN"),
  deleteRecipe
);

router.patch(
  "/restore-recipe/:id",
  authenticated,
  allowRoles("CHEF", "ADMIN","SUPERADMIN"),
  restoreRecipe
);

router.delete(
  "/permanent-delete/:id",
  authenticated,
  allowRoles("ADMIN","SUPERADMIN"),
  permanentDeleteRecipe
);







// Public Routes
router.get("/get-recipe/:id", getRecipe);
router.get("/get-recipes",optionalAuth, getRecipes);
router.get("/get-recommendrecipes", getRecommendedRecipes);
router.get("/suggest-tags", authenticated, suggestTags);

// Recipe Interactions (Authenticated Users)
router.post("/recipe-like", authenticated, recipeLike);
router.post("/recipe-save", authenticated, recipeSave);
router.post("/recipe-share", authenticated, recipeShare);
router.post("/recipe-view", authenticated, recipeView);
router.post("/recipe-rating", authenticated, submitRecipeRating);


router.get("/charts/last-7-days", authenticated, allowRoles("ADMIN","CHEF"),getLast7DaysStats);
module.exports = router;
