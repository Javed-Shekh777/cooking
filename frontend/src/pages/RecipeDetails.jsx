import React, { useEffect } from 'react';
import { FiPrinter } from 'react-icons/fi';
import { PiForkKnifeBold } from "react-icons/pi";
import { FaCircleCheck, FaStopwatch } from "react-icons/fa6";
import { GoShare } from 'react-icons/go';
import { MdMoreHoriz } from 'react-icons/md';

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from '../features/recipeSlice';
import Spinner from '../components/Spinner';
import MailBox from '../components/MailBox';
import RecipieCard from '../components/RecipieCard';
import { TastyRecipie } from '../components/BlogRecipie';
import "./recipeDetails.css";
import { FaBookmark, FaHeart, FaStar, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';
import ShareOptions from '../components/ShareOptions';

const RecipeDetails = () => {
    const { categoryId, recipeId } = useParams();
    const dispatch = useDispatch();
    const { recipe, loading } = useSelector((state) => state.recipe);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [rating, setRating] = useState(3);
    const [showShareOption, setShowShareOption] = useState(false);

    // Fetch recipe
    useEffect(() => {
        if (recipeId) {
            dispatch(getRecipe(recipeId)).unwrap().catch(() => console.log("Recipe not found"));
        }
    }, [recipeId, dispatch]);

    // Format date safely
    let formattedDate = "";
    if (recipe?.createdAt) {
        const [year, month, day] = recipe.createdAt.split("T")[0].split("-");
        const mon = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        formattedDate = `${day} ${mon[Number(month) - 1]} ${year}`;
    }

    const [newComment, setNewComment] = useState('');


    const [comments, setComments] = useState([
        {
            id: 1,
            name: 'Anjali Verma',
            text: 'This recipe turned out amazing! I added a pinch of cinnamon.',
            repShow: false,
            replies: [
                {
                    id: 11,
                    name: 'Ravi Kapoor',
                    text: 'Great tip! I’ll try that next time.',

                },
            ],
        },
        {
            id: 2,
            name: 'Meera Singh',
            text: 'Can I substitute almond milk instead of regular milk?',
            repShow: false,
            replies: [],
        },
    ]);

    const showReply = (id) => {
        const updatedComments = comments.map((co) =>
            co.id === id ? { ...co, repShow: true } : co
        );
        setComments(updatedComments);
    };



    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                { id: Date.now(), name: 'You', text: newComment, replies: [] },
            ]);
            setNewComment('');
        }
    };


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
        <>
            <section>
                <div className="recipieDetailsWrapper md:px-8 px-3 py-20">
                    {/* User Info */}
                    <div className="flex lg:flex-row flex-col lg:items-center xl:gap-y-0 gap-y-5 mb-14 justify-between">
                        <div className="left flex flex-col gap-y-10">
                            <h1 className="title sm:text-6xl text-[40px] font-semibold">{recipe.title}</h1>
                            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-x-5 gap-x-3 gap-y-5">
                                <div className="infoGroup flex items-center gap-x-2 sm:border-r-1 sm:border-b-0 border-b-1 sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <img src={recipe.author?.profilePic || "/profile/user.jpg"} alt="author" className="h-12 w-12 rounded-full" />
                                    <div className="pr-2">
                                        <h2>{recipe.author?.username || "Unknown"}</h2>
                                        <p className="whitespace-nowrap">{formattedDate || "-"}</p>
                                    </div>
                                </div>
                                <div className="infoGroup flex items-center gap-x-2 md:border-r-1 sm:border-b-0 border-b-1 sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <FaStopwatch className="text-blue-500" size={20} />
                                    <div>
                                        <h2>Prep Time</h2>
                                        <p>{recipe.prepTime?.value || "-"} {recipe.prepTime?.unit || ""}</p>
                                    </div>
                                </div>
                                <div className="infoGroup flex items-center gap-x-2 sm:border-r-1 sm:border-b-0 border-b-1 sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <FaStopwatch className='text-red-500' size={20} />
                                    <div>
                                        <h2>Cook Time</h2>
                                        <p>{recipe.cookTime?.value || "-"} {recipe.cookTime?.unit || ""}</p>
                                    </div>
                                </div>
                                <div className="infoGroup flex items-center gap-x-2 sm:border-b-0 border-b-1 sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <PiForkKnifeBold className='text-green-500' size={20} />
                                    <div>
                                        <h2>Servings</h2>
                                        <p>{recipe.servings || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right flex gap-x-5">
                            <div className="option group cursor-pointer flex flex-col items-center" onClick={() => window.print()}>
                                <div className="p-3 h-[70px] w-[70px] rounded-full bg-[#E7FAFE] flex items-center justify-center group-hover:shadow-xl">
                                    <FiPrinter size={25} />
                                </div>
                                <p className="uppercase">print</p>
                            </div>
                            <div onClick={() => setShowShareOption(!showShareOption)} className="option group cursor-pointer flex flex-col items-center">
                                <div className="p-3 h-[70px] w-[70px] rounded-full bg-[#E7FAFE] flex items-center justify-center group-hover:shadow-xl">
                                    <GoShare size={30} />
                                </div>
                                <p className="uppercase">share</p>
                            </div>
                        </div>
                    </div>

                    {/* Dish Image / Video + Nutrition Section */}
                    <div className="nutritionSection flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left: Dish Media */}
                        <div className="left lg:w-[60%] w-full rounded-3xl overflow-hidden ">
                            <div className="relative w-full rounded-3xl bg-white shadow-md overflow-hidden">
                                {recipe.dishImage?.resource_type === "video" ? (
                                    <video
                                        src={recipe.dishImage.url}
                                        controls
                                        className="w-full aspect-video object-cover rounded-3xl"
                                    />
                                ) : (
                                    <img
                                        src={recipe.dishImage?.url || "/reciepies/resp3.jpg"}
                                        alt="recipe"
                                        className="w-full aspect-[5/3] object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
                                    />
                                )}
                            </div>
                            <div className="mt-3 flex gap-4 items-center flex-wrap">
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="text-yellow-400 hover:scale-110 transition-transform"
                                        >
                                            <FaStar size={24} className={star <= rating ? 'fill-yellow-500' : 'fill-gray-300'} />
                                        </button>
                                    ))}
                                    {/* <span className="ml-2 text-sm text-gray-600">{rating} / 5</span> */}
                                </div>
                                {/* Like Button */}
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition
          ${liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}
          hover:bg-red-200`}
                                >
                                    <FaHeart />
                                    <span>{liked ? 'Liked' : 'Like'}</span>
                                </button>

                                {/* Save Button */}
                                <button
                                    onClick={() => setSaved(!saved)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition
          ${saved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
          hover:bg-blue-200`}
                                >
                                    <FaBookmark />
                                    <span>{saved ? 'Saved' : 'Save'}</span>
                                </button>


                            </div>
                            {/* Metadata: Tags, Cuisine, Difficulty */}
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                {/* Cuisine */}
                                {recipe.cuisine && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                                        🌍 {recipe.cuisine}
                                    </span>
                                )}

                                {/* Difficulty */}
                                {recipe.difficultyLevel && (
                                    <span className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full font-medium">
                                        ⚙️ {recipe.difficultyLevel}
                                    </span>
                                )}

                                {/* Tags */}
                                {recipe.tags?.length > 0 &&
                                    recipe.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-green-50 text-green-800 rounded-full font-medium"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        {/* Right: Nutrition Info */}
                        <div className="right lg:w-[35%] w-full">
                            <div className="nutrition bg-gradient-to-br from-[#E7FAFE] to-[#DFF4F9] rounded-3xl shadow-md p-6 sm:p-8">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">🥦 Nutrition Information</h3>
                                <div className="details flex flex-col gap-y-4">
                                    {recipe.nutrients?.length ? (
                                        recipe.nutrients.map((nt) => (
                                            <div
                                                key={nt.name}
                                                className="detailGroup flex justify-between items-center border-b border-gray-200 pb-2"
                                            >
                                                <span className="text-gray-600 font-medium">{nt.name}</span>
                                                <span className="text-gray-800">{nt.quantity} {nt.unit}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No nutrition data available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="my-8  text-lg text-gray-700 leading-relaxed max-w-3xl ">
                        {recipe.description}
                    </p>


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
                        <h1 className="title text-3xl font-semibold mb-6">🧑‍🍳 Directions</h1>
                        <div className="directions flex flex-col gap-y-8">
                            {recipe.directions?.length ? (
                                recipe.directions.map((dt) => (
                                    <div
                                        key={dt.stepNumber}
                                        className="direction flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-6"
                                    >
                                        <div className="flex-shrink-0">
                                            <FaCircleCheck size={24} className="text-green-500 mt-1" />
                                        </div>

                                        <div className="">
                                            <h3 className="text-xl font-semibold mb-2">
                                                Step {dt.stepNumber}: {dt.heading}
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">{dt.description}</p>

                                            {/* Media Display */}
                                            {/* Media Display */}
                                            {/* Media Display */}
                                            {(dt?.stepImage?.url || dt?.stepVideo?.url) && (
                                                <div className="mt-4 w-full rounded-xl overflow-hidden">
                                                    {dt?.stepImage?.resource_type === "image" && dt?.stepImage?.url ? (
                                                        <img
                                                            src={dt.stepImage.url}
                                                            alt="step"
                                                            className="w-full max-w-full max-h-[400px] object-contain rounded-xl shadow"
                                                        />
                                                    ) : dt?.stepVideo?.url ? (
                                                        <video
                                                            src={dt.stepVideo.url}
                                                            controls

                                                            className="w-full max-w-full max-h-[400px] object-contain rounded-xl shadow"
                                                        />
                                                    ) : null}
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">Directions not found</p>
                            )}
                        </div>
                    </div>


                    <div className="mt-10">
                        <h2 className="text-4xl font-semibold mb-2">Comments</h2>
                        <hr className="border-t-2 border-gray-300 w-24 mb-6" />



                        {/* Comments List */}
                        <div className="">
                            <div className="">
                                {comments?.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg flex gap-x-4 space-y-2 ">
                                        <div className="">
                                            <img src="/profile/Ellipse 2 (3).jpg" alt="" className='h-8 w-8 object-cover rounded-full' />
                                        </div>
                                        <div className="">
                                            <div className="">
                                                <p className="font-semibold mb-[-5px] p-0">{comment.name}</p>
                                                <span className="text-xs text-gray-400">4s ago</span>

                                            </div>

                                            <p className="text-black my-2.5">{comment.text}</p>

                                            <div className="social flex items-center gap-x-4 text-gray-400">
                                                <div onClick={() => showReply(comment.id)} className="bx flex items-center gap-x-1">
                                                    <FaRegComment />
                                                    <p className='text-sm'>Replies (32)</p>
                                                </div>
                                                <div className="bx flex items-center gap-x-1">
                                                    <FaRegHeart />
                                                    <p className='text-sm'>34</p>
                                                </div>
                                                <div className="bx flex items-center gap-x-1">
                                                    <MdMoreHoriz />
                                                    <p className='text-sm'>More</p>
                                                </div>
                                            </div>

                                            {/* Replies */}
                                            {comment.replies && comment.repShow && comment?.replies.length > 0 && (
                                                <div className="my-8 pl-4 border-l-2 border-gray-200 space-y-3  ">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className='flex gap-x-4'>
                                                            <div className="">
                                                                <img src="/profile/Ellipse 2 (3).jpg" alt="" className='h-8 w-8 object-cover rounded-full' />

                                                            </div>
                                                            <div className="">
                                                                <div className="">
                                                                    <p className="font-semibold mb-[-5px] p-0">{reply.name}</p>
                                                                    <span className="text-xs text-gray-400">10min ago</span>

                                                                </div>

                                                                <p className="text-black my-2.5">{reply.text}</p>
                                                                <div className="social flex items-center gap-x-4 text-gray-400">
                                                                    <div className="bx flex items-center gap-x-1">
                                                                        <FaRegComment />
                                                                        <p className='text-sm'>Replies (32)</p>
                                                                    </div>
                                                                    <div className="bx flex items-center gap-x-1">
                                                                        <FaRegHeart />
                                                                        <p className='text-sm'>34</p>
                                                                    </div>
                                                                    <div className="bx flex items-center gap-x-1">
                                                                        <MdMoreHoriz />
                                                                        <p className='text-sm'>More</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                ))}
                            </div>

                            {/* Comment Input */}
                            <div className="my-6 max-w-3xl">
                                <h3 className='text-3xl mb-2 font-semibold'>Write a Comment</h3>
                                <div className="w-full border border-gray-300 rounded-lg p-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write your comment..."
                                        className="w-full p-1 focus:border-0 focus:outline-0  rounded-lg resize-none"
                                        rows={3}
                                    />
                                    <div className="w-full flex items-center justify-end">
                                        <button
                                            onClick={handleAddComment}
                                            className="mt-2 px-4  py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Post Comment
                                        </button>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* Other recipes */}
                    {/* <div className="rightWrapper mt-10">
                    <h1 className="text-3xl font-semibold mb-5">Other Recipes</h1>
                    <div className="flex flex-col gap-y-4">
                        {dummyRecipes.map((r) => <TastyRecipie key={r.id} />)}
                    </div>
                </div> */}
                    <div className="bottom my-20 no-print">
                        <h1 className="title text-4xl font-semibold text-center my-4">You may like these recipes too</h1>
                        <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                            {dummyRecipes?.map((recp) => (
                                <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                            ))}
                        </div>
                    </div>

                    <MailBox />

                    {/* Recommended */}

                </div>
            </section>

            {showShareOption && <ShareOptions link={"https://fsdf.com"} onClose={() => setShowShareOption(false)} />}



        </>

    );
};

export default RecipeDetails;
