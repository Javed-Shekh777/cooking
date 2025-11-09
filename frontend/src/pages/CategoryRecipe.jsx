

import { Link, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // You can switch to other icon packs
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRecipesCategory } from "../features/recipeSlice";
import Spinner from "../components/Spinner";

import { getCategories, getRecipes } from '../features/recipeSlice';
import MailBox from '../components/MailBox';
import { FaEdit } from 'react-icons/fa';
import { FaShare, FaComment, FaEye, FaHeart, FaStopwatch } from "react-icons/fa6"
import { PiForkKnifeBold } from "react-icons/pi";

const tagColors = [
    "bg-red-200 text-red-700",
    "bg-green-200 text-green-700",
    "bg-blue-200 text-blue-700",
    "bg-yellow-200 text-yellow-700",
    "bg-purple-200 text-purple-700",
    "bg-pink-200 text-pink-700",
    "bg-indigo-200 text-indigo-700",
];



const CategoryRecipe = () => {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const { recipe, error, loading, categories, recipeCategory, recipes } = useSelector((state) => state.recipe);

    console.log("Recipe category:", recipeCategory)
    // Fetch recipe
    useEffect(() => {
        if (categoryId) {
            dispatch(getRecipes(categoryId)).unwrap().catch(() => console.log("Recipe not found"));
        }
    }, [categoryId, dispatch]);

    // Format date safely
    let formattedDate = "";
    if (recipe?.createdAt) {
        const [year, month, day] = recipe.createdAt.split("T")[0].split("-");
        const mon = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        formattedDate = `${day} ${mon[Number(month) - 1]} ${year}`;
    }

    if (loading) return <Spinner />;

    if (!recipe) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">Recipe not found 😕</h2>
                <p>Check the URL or go back to the homepage.</p>
            </div>
        );
    }

    return (
        <>
            <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">🍽️ Recipes</h2>
                    <Link
                        to="/"
                        className="bg-blue-100  flex items-center justify-center text-blue-600 hover:bg-blue-200 transition sm:px-4 px-1.5 py-2 rounded-md "
                    >
                        {recipes?.length}
                    </Link>
                </div>

                <div className="recipes grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    {
                        recipes.length > 0 ? recipes.map((recp) => (
                            <div key={recp?._id} className="group cursor-pointer relative rounded-3xl overflow-hidden px-3.5
                                                  pt-2 pb-7  "
                                style={{
                                    background: `linear-gradient(180deg, rgba(231, 249, 253, 0) 0%, #E7F9FD 100%)`
                                }}
                            >
                                <Link to={`/category/${recp?.categoryId}/recipe/${recp?._id}`} className=" text-gray-600 hover:text-black
                                                    transition-all duration-300">
                                    {/* Image */}
                                    <div className="relative w-full h-[220px] rounded-xl overflow-hidden">
                                        <img
                                            src={recp?.dishImage?.url || "/placeholder.jpg"}
                                            alt={`${recp?.title} Recipe`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="likeBox absolute right-4 top-4 h-10 w-10 rounded-full flex items-center justify-center bg-white shadow">
                                            <FaHeart className="text-red-500" size={18} />
                                        </div>
                                    </div>


                                    {/* Title */}
                                    <div className="mt-4">
                                        <h3 className='title text-xl sm:w-[80%] w-full mb-1'>{recp?.title}</h3>

                                        {/* Tags */}
                                        <div className="flex gap-1.5 flex-wrap">
                                            {recp.tags.map((tg, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[idx % tagColors.length]
                                                        }`}
                                                >
                                                    {tg}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-x-3.5 mt-3">
                                            <div className="time flex items-center gap-x-1">
                                                <FaStopwatch size={16} />
                                                <span>{recp.prepTime?.value || "-"} {recp.prepTime?.unit || ""}</span>
                                            </div>
                                            <div className="type flex items-center gap-x-1"><PiForkKnifeBold size={16} className='font-bold' /><span>{recp.cookTime?.value || "-"} {recp.cookTime?.unit || ""}</span></div>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        )) : "No recipes found"
                    }
                </div>



            </section>
            <section className="max-w-screen ">
                <MailBox />




            </section>
        </>

    );
};



export default CategoryRecipe
