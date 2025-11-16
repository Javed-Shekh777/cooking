import { userProfile } from "../features/authSlice";

export const authApis = {
    localregisterUser: "/auth/localregister",
    verifyMail: "/auth/verify-mail",
    localloginUser: "/auth/locallogin",
    logout: "/auth/logout",
    contact: "/auth/contact",
    userProfile: "/auth/user-profile",
    updateProfile: "/auth/update-profile"
};

export const recipeApis = {
    suggestTag: "/recipe/suggest-tags",
    addRecipe: "/recipe/add-recipe",
    updateRecipe: "/recipe/update-recipe",
    getCageroy: "/recipe/get-categories",
    getRecipes: "/recipe/get-recipes",
    getRecipesByCategory: "/recipe/get-recipes-category",
    getRecipe: "/recipe/get-recipe",
    addCategory: "/recipe/add-category",
    updateCategory: "/recipe/update-category",
    getRecommendedRecipes: "/recipe/get-recommendrecipes",
    getCategory: "/recipe/get-category",
    getCategories: "/recipe/get-categories",
    dashboard: "/recipe/dashboard",
    addComment: "/recipe/add-comment",
    getComments: "/recipe/get-comments",
    toggleCommentLike: "/recipe/like-comments",
    recipeLikeDish: "/recipe/recipe-likedish",
    recipeShare: "/recipe/recipe-share",
    recipeView: "/recipe/recipe-view",
    recipeSave: "/recipe/recipe-save",
    submitRecipeRating: "/recipe/recipe-rating"



};

export const adminApis = {
    adminDashboard: "/admin/dashboard",
    manageUsers: "/admin/manage-users",
    manageRecipes: "/admin/manage-recipes",
    manageCategories: "/admin/manage-categories",
};
export const chefApis = {
    chefDashboard: "/chef/dashboard",
    myRecipes: "/chef/my-recipes",
    addNewRecipe: "/chef/add-recipe",
    updateMyRecipe: "/chef/update-recipe",
};
export const moderatorApis = {
    moderatorDashboard: "/moderator/dashboard",
    reviewRecipes: "/moderator/review-recipes",
    manageComments: "/moderator/manage-comments",
};
export const userApis = {
    userDashboard: "/user/dashboard",
    favoriteRecipes: "/user/favorite-recipes",
    savedRecipes: "/user/saved-recipes",
    profileSettings: "/user/profile-settings",
};
