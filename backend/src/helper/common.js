const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model");
const RecipeComment = require("../models/comment.model");
const Tag = require("../models/tag.model");
// const User = require("../models/user.model"); // ensure imported
// const { cloudinaryDelete } = require("./cloudinary"); // ensure imported

const startSession = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};

const ensureOwnerOrAdmin = (recipe, user) => {
  if (
    recipe.author.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    throw new Error("NOT_AUTHORIZED");
  }
};

const permanentlyDeleteRecipeInternal = async (recipe, session) => {
  if (recipe.dishImage?.public_id) {
    await cloudinaryDelete(recipe.dishImage.public_id, "image");
  }

  if (recipe.dishVideo?.public_id) {
    await cloudinaryDelete(recipe.dishVideo.public_id, "video");
  }

  for (const d of recipe.directions) {
    if (d.stepImage?.public_id) {
      await cloudinaryDelete(d.stepImage.public_id, "image");
    }
    if (d.stepVideo?.public_id) {
      await cloudinaryDelete(d.stepVideo.public_id, "video");
    }
  }

  await RecipeComment.deleteMany({ recipeId: recipe._id }).session(session);

  await User.updateMany(
    { savedRecipes: recipe._id },
    { $pull: { savedRecipes: recipe._id, likedRecipes: recipe._id } }
  ).session(session);

  for (const tag of recipe.tags) {
    await Tag.updateOne(
      { name: tag.toLowerCase() },
      { $inc: { recipeCount: -1 } }
    ).session(session);
  }

  await Recipe.findByIdAndDelete(recipe._id).session(session);
};

module.exports = {
  startSession,
  ensureOwnerOrAdmin,
  permanentlyDeleteRecipeInternal
};
