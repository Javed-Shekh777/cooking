import { userProfile } from "../features/authSlice";

export const authApis = {
    localregisterUser: "/auth/localregister",
    verifyMail: "/auth/verify-mail",
    localloginUser: "/auth/locallogin",
    logout: "/auth/logout",
    contact: "/user/contact",
    userProfile: "/user/user-profile",
    updateProfile: "/user/update-profile",
    refreshToken: "/auth/refresh",
    mailChangeReq: "/auth/request-email-change",
    mailChange: "/auth/verify-email-change",
};

export const recipeApis = {
    suggestTag: "/recipes/suggest-tags",
    addRecipe: "/recipes/add-recipe",
    updateRecipe: "/recipes/update-recipe",
    getCageroy: "/recipes/get-categories",
    getRecipes: "/recipes/get-recipes",
    getRecipesByCategory: "/recipes/get-recipes-category",
    getRecipe: "/recipes/get-recipe",

    getRecommendedRecipes: "/recipes/get-recommendrecipes",

    dashboard: "/recipes/dashboard",
    addComment: "/comments/add-comment",
    deleteComment: "/comments/delete-comment",
    getComments: "/comments/get-comments",
    toggleCommentLike: "/comments/like-comment",
    recipeLikeDish: "/recipes/recipe-like",
    recipeShare: "/recipes/recipe-share",
    recipeView: "/recipes/recipe-view",
    recipeSave: "/recipes/recipe-save",
    submitRecipeRating: "/recipes/recipe-rating",
    chart:"/recipes/charts/last-7-days"

};


export const categoryApi = {
    addCategory: "/categories/add-category",
    updateCategory: "/categories/update-category",
    getCategory: "/categories/get-category",
    getCategories: "/categories/get-categories",
}


export const adminApis = {


    adminDashboard: "/admin/dashboard",
    manageUsers: "/admin/users",
    userBlockUnBlock: "/admin/user/block-unblock",
    deleteReq: "/admin/delete-requests",
    auditLog: "/admin/audit-logs",
    rejectReq: "/admin/reject-request",
    moderation: "/admin/moderation",
    chefApprove: "/admin/chef/approve",
    getDeleteReq: "/recipes/get-delete-req",
    updateDeleteReq: "/recipes/update-delete-req",

    // Recipe 

    recipeSoftDel: "/recipes/delete-recipe",
    recipeDel: "/recipes/permanent-delete",
    recipeRestore: "/recipes/restore-recipe",

    categorySoftDel: "/categories/delete-category",
    categoryDel: "/categories/permanent-delete",
    categoryRestore: "/categories/restore-category",








};
export const chefApis = {
    chefDashboard: "/chef/dashboard",
    myRecipes: "/chef/my-recipes",
    addNewRecipe: "/chef/add-recipe",
    updateMyRecipe: "/chef/update-recipe",

    // New 
    deleteReq: "/recipes/delete-req",
    createReq: "/chef/create-req",
    analytics: "/chef/analytics",
    allRequests: "/chef/requests",
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
