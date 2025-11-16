import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import Contact from "../pages/Contact";
import Index from "../layout/MainLayout";
import Home from "../pages/Home";
import BlogAndArticle from "../pages/BlogAndArticle";
import BlogPost from "../pages/BlogPost";
import RecipeDetails from "../pages/RecipeDetails";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import EmailVerifiedPage from "../pages/EmailVerifiedPage";
import VerifyAccountOTP from "../pages/VerifyAccountOTP";
import VerifyHandler from "../pages/VerifyHandler";
import AddReceipie from "../pages/cooker/AddReceipie";
import Chef from "../pages/cooker/Chef";
import ChefLayout from "../pages/cooker/chefLayout/ChefLayout";
import AllRecipes from "../pages/cooker/AllRecipes";
import AllCategory from "../pages/cooker/AllCategory";
import AllCategories from "../pages/AllCategory";
import Setting from "../pages/cooker/Setting";
import Recipes from "../pages/Recipes";
import CategoryRecipe from "../pages/CategoryRecipe";
import Profile from "../pages/Profile";
import Favorites from "../pages/Favourites";
import About from "../pages/About";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Index />,
                children: [
                    { path: "", element: <Home /> },
                    { path: "contact", element: <Contact /> },
                    { path: "blog", element: <BlogAndArticle /> },
                    { path: "recipie/:id", element: <RecipeDetails /> },
                    { path: "recipes", element: <Recipes /> },
                    { path: "blog/:id", element: <BlogPost /> },
                    { path: "all-category", element: <AllCategories /> },
                    { path: "category/:categoryId", element: <CategoryRecipe /> },
                    { path: "category/:categoryId/recipe/:recipeId", element: <RecipeDetails /> },
                    { path: "profile", element: <Profile /> },
                    { path: "favourites", element: <Favorites /> },
                    { path: "about", element: <About /> },



                ],
            },
            { path: "sign-in", element: <SignIn /> },
            { path: "sign-up", element: <SignUp /> },
            { path: "verify-mail", element: <VerifyAccountOTP /> },
            { path: "verify-account", element: <EmailVerifiedPage /> },
            { path: "verify", element: <VerifyHandler /> },
            {
                path: "chef",
                element: <ChefLayout />,
                children: [
                    { index: true, element: <Chef /> }, // 👈 fix here
                    { path: "recipe/add", element: <AddReceipie mode="add" /> },
                    { path: "recipe/edit/:id", element: <AddReceipie mode="edit" /> },
                    { path: "all-recipes", element: <AllRecipes /> },
                    { path: "all-category", element: <AllCategory /> },
                    { path: "setting", element: <Setting /> },



                ]
            },
        ]
    }
]);


export default router;


