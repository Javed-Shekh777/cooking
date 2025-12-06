import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getCategories, getRecipes, fetchRecommendations } from '../features/recipeSlice';
import RecipieCard from '../components/RecipieCard';
import MailBox from '../components/MailBox';
import { FaEdit } from 'react-icons/fa';
import { FaShare, FaComment, FaEye, FaHeart, FaStopwatch } from "react-icons/fa6"
import { PiForkKnifeBold } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Spinner from '../components/Spinner';

const tagColors = [
    "bg-red-200 text-red-700",
    "bg-green-200 text-green-700",
    "bg-blue-200 text-blue-700",
    "bg-yellow-200 text-yellow-700",
    "bg-purple-200 text-purple-700",
    "bg-pink-200 text-pink-700",
    "bg-indigo-200 text-indigo-700",
];

const dummyRecipes = [
    { id: 1, imgUrl: "/reciepies/resp1.jpg", isLiked: true, title: "Big Wagyu Burger", time: "30 Minutes" },
    { id: 2, imgUrl: "/reciepies/resp2.jpg", isLiked: false, title: "Lime Salmon", time: "30 Minutes" },
    { id: 3, imgUrl: "/reciepies/resp3.jpg", isLiked: false, title: "Strawberry Pancake", time: "30 Minutes" },
    { id: 4, imgUrl: "/reciepies/resp4.jpg", isLiked: true, title: "Healthy Salad", time: "30 Minutes" },
];


const Recipes = () => {
    const dispatch = useDispatch();
    const { suggestTags: suggestions, error, recipes = [], loading, categories = [], recommendRecipes = [] } = useSelector((state) => state.recipe);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(getCategories());
        }
    }, [categories.length, dispatch]);


    useEffect(() => {
        if (selectedCategory === "All") {
            dispatch(getRecipes({isPublished:true}));
        } else {
            dispatch(getRecipes({categoryId:selectedCategory,isPublished:true}));
        }
    }, [selectedCategory, dispatch]);

console.log(selectedCategory);
    useEffect(() => {
        dispatch(fetchRecommendations({
            categoryId: selectedCategory === "All" ? undefined : selectedCategory,
            limit: 5
        }));
    }, [selectedCategory, dispatch]);

    return (
        <section>
            <div className="recipieDetailsWrapper md:px-8 px-3 py-20">
                {/* User Info */}
                <div className="flex overflow-x-auto gap-x-6 no-scrollbar   [scrollbar-width:none] px-1 py-2">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm ${selectedCategory === "All"
                            ? "bg-black text-white shadow-md"
                            : "bg-gray-100 text-gray-800 hover:bg-black hover:text-white"
                            }`}
                    >
                        All
                    </button>

                    {categories?.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm ${selectedCategory === cat._id
                                ? "bg-black text-white shadow-md"
                                : "bg-gray-100 text-gray-800 hover:bg-black hover:text-white"
                                }`}
                        >
                            {cat?.name}
                        </button>
                    ))}
                </div>


                <div className="recipes grid grid-cols-1 pt-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <Spinner />
                    ) : recipes.length > 0 ? (
                        recipes.map((recp) => (
                            <div
                                key={recp?._id}
                                className="group cursor-pointer relative rounded-3xl overflow-hidden px-3.5 pt-2 pb-7"
                                style={{
                                    background: `linear-gradient(180deg, rgba(231, 249, 253, 0) 0%, #E7F9FD 100%)`,
                                }}
                            >
                                <Link
                                    to={`/category/${recp?.categoryId}/recipe/${recp?._id}`}
                                    className="text-gray-600 hover:text-black transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 w-full overflow-hidden rounded-xl">
                                        <img
                                            src={recp?.dishImage?.url || "/placeholder.jpg"}
                                            alt={`${recp?.title} Recipe`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="likeBox absolute right-3 top-3 h-9 w-9 rounded-full flex items-center justify-center bg-white shadow">
                                            <FaHeart className="text-red-500" size={18} />
                                        </div>
                                    </div>


                                    {/* Title */}
                                    <div className="mt-4">
                                        <h3 className="title text-xl sm:w-[80%] w-full mb-1">{recp?.title}</h3>

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

                                        {/* Time & Type */}
                                        <div className="flex items-center gap-x-3.5 mt-3">
                                            <div className="time flex items-center gap-x-1">
                                                <FaStopwatch size={16} />
                                                <span>
                                                    {recp.prepTime?.value || "-"} {recp.prepTime?.unit || ""}
                                                </span>
                                            </div>
                                            <div className="type flex items-center gap-x-1">
                                                <PiForkKnifeBold size={16} className="font-bold" />
                                                <span>
                                                    {recp.cookTime?.value || "-"} {recp.cookTime?.unit || ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-500">No recipes found.</p>
                    )}
                </div>



                <div className="bottom my-20 ">
                    <h1 className="title text-4xl font-semibold text-center my-4">You may like these recipes too</h1>
                    <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                        {recommendRecipes?.length > 0 && recommendRecipes?.map((recp) => (
                            <RecipieCard key={recp._id} title={recp.title} prepTime={recp.prepTime} cookTime={recp.cookTime} url={recp?.dishImage?.url} />
                        ))}
                    </div>
                </div>

                <MailBox />

                {/* Recommended */}

            </div>
        </section>
    )
}

export default Recipes

