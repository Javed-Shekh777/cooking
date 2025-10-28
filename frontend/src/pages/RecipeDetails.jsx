import React, { useEffect } from 'react';
import { FiPrinter } from 'react-icons/fi';
import { PiForkKnifeBold } from "react-icons/pi";
import { FaCircleCheck, FaStopwatch } from "react-icons/fa6";
import { GoShare } from 'react-icons/go';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from '../features/recipeSlice';
import Spinner from '../components/Spinner';
import MailBox from '../components/MailBox';
import RecipieCard from '../components/RecipieCard';
import { TastyRecipie } from '../components/BlogRecipie';

const RecipeDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { recipe, loading } = useSelector((state) => state.recipe);

    // Fetch recipe
    useEffect(() => {
        if (id) {
            dispatch(getRecipe(id)).unwrap().catch(() => console.log("Recipe not found"));
        }
    }, [id, dispatch]);

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

    const dummyRecipes = [
        { id: 1, imgUrl: "/reciepies/resp1.jpg", isLiked: true, title: "Big Wagyu Burger", time: "30 Minutes" },
        { id: 2, imgUrl: "/reciepies/resp2.jpg", isLiked: false, title: "Lime Salmon", time: "30 Minutes" },
        { id: 3, imgUrl: "/reciepies/resp3.jpg", isLiked: false, title: "Strawberry Pancake", time: "30 Minutes" },
        { id: 4, imgUrl: "/reciepies/resp4.jpg", isLiked: true, title: "Healthy Salad", time: "30 Minutes" },
    ];

    return (
        <section>
            <div className="recipieDetailsWrapper md:px-8 px-3 py-20">
                {/* User Info */}
                <div className="flex lg:flex-row flex-col lg:items-center xl:gap-y-0 gap-y-5 mb-14 justify-between">
                    <div className="left flex flex-col gap-y-10">
                        <h1 className="title sm:text-6xl text-[40px] font-semibold">{recipe.title}</h1>
                        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-x-5 gap-x-3 gap-y-5">
                            <div className="infoGroup flex items-center gap-x-2 border-r-1 border-[rgba(0,0,0,0.1)]">
                                <img src={recipe.author?.profilePic || "/profile/user.jpg"} alt="author" className="h-12 w-12 rounded-full" />
                                <div className="pr-2">
                                    <h2>{recipe.author?.username || "Unknown"}</h2>
                                    <p className="whitespace-nowrap">{formattedDate || "-"}</p>
                                </div>
                            </div>
                            <div className="infoGroup flex items-center gap-x-2 md:border-r-1 border-[rgba(0,0,0,0.1)]">
                                <FaStopwatch  className="text-blue-500" size={20} />
                                <div>
                                    <h2>Prep Time</h2>
                                    <p>{recipe.prepTime?.value || "-"} {recipe.prepTime?.unit || ""}</p>
                                </div>
                            </div>
                            <div className="infoGroup flex items-center gap-x-2 border-r-1 border-[rgba(0,0,0,0.1)]">
                                <FaStopwatch className='text-red-500' size={20} />
                                <div>
                                    <h2>Cook Time</h2>
                                    <p>{recipe.cookTime?.value || "-"} {recipe.cookTime?.unit || ""}</p>
                                </div>
                            </div>
                            <div className="infoGroup flex items-center gap-x-2">
                                <PiForkKnifeBold className='text-green-500' size={20} />
                                <div>
                                    <h2>Servings</h2>
                                    <p>{recipe.servings || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right flex gap-x-5">
                        <div className="option group cursor-pointer flex flex-col items-center">
                            <div className="p-3 h-[70px] w-[70px] rounded-full bg-[#E7FAFE] flex items-center justify-center group-hover:shadow-xl">
                                <FiPrinter size={25} />
                            </div>
                            <p className="uppercase">print</p>
                        </div>
                        <div className="option group cursor-pointer flex flex-col items-center">
                            <div className="p-3 h-[70px] w-[70px] rounded-full bg-[#E7FAFE] flex items-center justify-center group-hover:shadow-xl">
                                <GoShare size={30} />
                            </div>
                            <p className="uppercase">share</p>
                        </div>
                    </div>
                </div>

                {/* Dish Image / Video */}
                <div className="nutritionSection flex lg:flex-row flex-col justify-between lg:gap-y-0 gap-y-6">
                    <div className="left lg:w-[60%] rounded-3xl overflow-hidden bg-red-100 flex items-center justify-center">
                        {recipe.dishImage?.resource_type === "video" ? (
                            <video src={recipe.dishImage.url} controls className="rounded-3xl h-[400px] w-full object-cover" />
                        ) : (
                            <img src={recipe.dishImage?.url || "/reciepies/resp3.jpg"} alt="recipe" className="rounded-3xl h-[400px] w-full object-cover" />
                        )}
                    </div>

                    <div className="right lg:w-[30%]">
                        <div className="nutrition h-full sm:p-8 p-4 bg-[#E7FAFE] rounded-3xl">
                            <h3 className="text-2xl mb-4 font-semibold">Nutrition Information</h3>
                            <div className="details flex flex-col gap-y-4">
                                {recipe.nutrients?.length ? (
                                    recipe.nutrients.map((nt) => (
                                        <div key={nt.name} className="detailGroup flex justify-between border-b-1 py-1.5 border-[rgba(0,0,0,0.1)]">
                                            <p className="text-black/60">{nt.name}</p>
                                            <p>{nt.quantity} {nt.unit}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No Nutrients</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="my-6 text-center text-[17px]">{recipe.description}</p>

                {/* Ingredients */}
                <div className="ingredients sm:w-[50%] w-full bg-white rounded-3xl shadow-md sm:p-6 p-3">
                    <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-3 rounded-tl-lg">Ingredient</th>
                                <th className="py-2 px-3">Quantity</th>
                                <th className="py-2 px-3 rounded-tr-lg">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipe.ingredients?.map(({ name, quantity, unit, _id }) => (
                                <tr key={_id} className="border-t hover:bg-gray-50">
                                    <td className="py-2 px-3">{name}</td>
                                    <td className="py-2 px-3">{quantity}</td>
                                    <td className="py-2 px-3">{unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Directions */}
                <div className="makingDirection mt-10">
                    <h1 className="title text-3xl font-semibold">Directions</h1>
                    <div className="directions flex flex-col gap-y-6">
                        {recipe.directions?.length ? recipe.directions.map((dt) => (
                            <div key={dt.stepNumber} className="direction flex sm:gap-x-5 gap-x-2 border-b-[rgba(0,0,0,0.1)] border-b-1 py-5">
                                <FaCircleCheck size={20} className="mt-1 text-green-500" />
                                <div className="w-full">
                                    <h3 className="text-xl font-semibold mb-4">{dt.stepNumber}. {dt.heading}</h3>
                                    <p>{dt.description}</p>
                                    {dt.image?.url && <img src={dt.image.url} alt="step" className="rounded-xl h-[350px]  my-3 object-cover" />}
                                </div>
                            </div>
                        )) : <p>Directions not found</p>}
                    </div>
                </div>

                {/* Other recipes */}
                {/* <div className="rightWrapper mt-10">
                    <h1 className="text-3xl font-semibold mb-5">Other Recipes</h1>
                    <div className="flex flex-col gap-y-4">
                        {dummyRecipes.map((r) => <TastyRecipie key={r.id} />)}
                    </div>
                </div> */}
                 <div className="bottom my-20 ">
                    <h1 className="title text-4xl font-semibold text-center my-4">You may like these recipes too</h1>
                    <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                        {dummyRecipes.map((recp) => (
                            <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                        ))}
                    </div>
                </div>

                <MailBox />

                {/* Recommended */}
               
            </div>
        </section>
    );
};

export default RecipeDetails;
