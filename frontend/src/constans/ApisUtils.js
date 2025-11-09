import { userProfile } from "../features/authSlice";

export const authApis = {
    localregisterUser: "/auth/localregister",
    verifyMail: "/auth/verify-mail",
    localloginUser: "/auth/locallogin",
    logout: "/auth/logout",
    contact:"/auth/contact",
    userProfile:"/auth/user-profile",
    updateProfile:"/auth/update-profile"
};

export const recipeApis = {
    suggestTag: "/recipe/suggest-tags",
    addRecipe: "/recipe/add-recipe",
    updateRecipe: "/recipe/update-recipe",
    getCageroy :"/recipe/get-categories",
    getRecipes:"/recipe/get-recipes",
    getRecipesByCategory:"/recipe/get-recipes-category",
    getRecipe:"/recipe/get-recipe",
    addCategory:"/recipe/add-category",
    getCategory:"/recipe/get-category",
    dashboard:"/recipe/dashboard" 

    
};

