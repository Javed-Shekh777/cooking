const express = require("express");
const authenticated = require("../middlewares/auth.middleware.js");
const allowRoles  = require("../middlewares/role.middleware.js");
const {
  addCategory,
  getCategories,
  deleteCategory,
  getAllCategoriesAdmin,
  getCategory,
  permanentDeleteCategory,
  restoreCategory,
  updateCategory,

} = require("../controllers/category.controller.js");
const upload = require("../config/multerconfig.js");

const router = express.Router();


router.route("/add-category").post(authenticated, allowRoles("CHEF", "ADMIN", "SUPERADMIN"), upload.single("categoryImage"), addCategory);
router.route("/update-category/:id").post(authenticated, allowRoles("CHEF", "ADMIN", "SUPERADMIN"), upload.single("categoryImage"), updateCategory);
router.route("/delete-category/:id").delete(authenticated, allowRoles("CHEF", "ADMIN", "SUPERADMIN"), deleteCategory);
router.route("/restore-category/:id").patch(authenticated, allowRoles("CHEF", "ADMIN", "SUPERADMIN"), restoreCategory);
router.route("/permanent-delete/:id").delete(authenticated, allowRoles("ADMIN", "SUPERADMIN"), permanentDeleteCategory);

// router.route("/get-recipes-category/:id").get(getRecipesByCategory);

router.route("/get-categories").get(getCategories);
router.route("/get-categories-admin").get(authenticated, allowRoles("ADMIN", "SUPERADMIN"), getAllCategoriesAdmin);
router.route("/get-category/:id").get(getCategory);


module.exports=router;
