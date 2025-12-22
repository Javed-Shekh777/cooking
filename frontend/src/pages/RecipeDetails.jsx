import React, { useEffect } from 'react';
import { FiPrinter } from 'react-icons/fi';
import { PiForkKnifeBold } from "react-icons/pi";
import { FaCircleCheck, FaStopwatch } from "react-icons/fa6";
import { GoShare } from 'react-icons/go';
import { MdMoreHoriz } from 'react-icons/md';

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addComment, deleteComment, fetchRecommendations, getComments, getRecipe, recipeLikeDish, recipeSave, recipeShare, submitRating, toggleCommentLike } from '../features/recipeSlice';
import Spinner from '../components/Spinner';
import MailBox from '../components/MailBox';
import RecipieCard from '../components/RecipieCard';
import { TastyRecipie } from '../components/BlogRecipie';
import "./recipeDetails.css";
import { FaBookmark, FaHeart, FaStar, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';
import ShareOptions from '../components/ShareOptions';
import CommentsSection from '../components/CommentSection';
import { FRONTEND_URL } from '../constans';
import { IsUserLikedRecipe } from '../services/features';
import toast from 'react-hot-toast'

const RecipeDetails = () => {
    const { categoryId, recipeId } = useParams();
    console.log("Catefkdfndsj", categoryId);
    const dispatch = useDispatch();
    const { recipe, recipeMeta, loading, comments, recommendRecipes } = useSelector((state) => state.recipe);
    const { user } = useSelector((state) => state.auth);


    console.log(comments,recommendRecipes);

    // ✅ Local state initialize from Redux meta
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [rating, setRating] = useState(3);
    const [showShareOption, setShowShareOption] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [openMenu, setOpenMenu] = useState({ id: null, type: null });

    const [shownReplies, setShownReplies] = useState([]);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    console.log(newCommentText, replyingToCommentId, recipeId, "Hello", shownReplies);

    console.log(user?._id, saved);
    // Fetch recipe
    useEffect(() => {
        setPageLoading(true);
        if (recipeId) {
            dispatch(getRecipe(recipeId));
            dispatch(getComments(recipeId));
            dispatch(fetchRecommendations({ recipeId, limit: 10, categoryId }));
        }
        setPageLoading(false);
    }, [recipeId, categoryId]);

    // Sync liked/saved with backend
    useEffect(() => {
        if (recipeMeta && user?._id) {
            const { isLiked, isSaved } = IsUserLikedRecipe(recipe, user._id);
            setLiked(isLiked);
            setSaved(isSaved);
        }
    }, [recipeMeta, user]);




    // Format date safely
    let formattedDate = "";
    if (recipe?.createdAt) {
        const [year, month, day] = recipe.createdAt.split("T")[0].split("-");
        const mon = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        formattedDate = `${day} ${mon[Number(month) - 1]} ${year}`;
    }




    const toggleMoreMenu = (id, type) => {
        setOpenMenu(prev =>
            prev.id === id && prev.type === type
                ? { id: null, type: null }
                : { id, type }
        );
    };


    // ✅ Toggle visibility of replies for a specific comment
    const startReply = (commentId) => {
        setReplyingToCommentId(commentId);
    };


    const toggleReplies = (commentId) => {
        setShownReplies(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        );
    };

    const handleAddComment = async () => {

        try {
            if (!newCommentText.trim()) return;


            const res = await dispatch(addComment({
                recipeId,
                text: newCommentText,
                parentId: replyingToCommentId // null = comment, id = reply
            })).unwrap();
            setNewCommentText("");
            setReplyingToCommentId(null);
            toast.success(res.message);


        } catch (error) {
            toast.error(error.message);
        }

    };



    const handleLikeComment = (commentId) => {
        console.log(commentId);
        dispatch(toggleCommentLike(commentId));
    };


    // const toggleMoreMenu = (id) => openMenu === id ? setOpenMenu(null) : setOpenMenu(id);


    // const isMenuOpen = openMenu === comment._id;
    // const isReplyMenuOpen = openMenu === reply._id;









    if (pageLoading) return <Spinner />;

    if (!recipe) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">Recipe not found 😕</h2>
                <p>Check the URL or go back to the homepage.</p>
            </div>
        );
    }

    // ✅ Handlers
    const handleLike = async () => {
        if (!user) return alert("Please login first!");

        setLiked(prev => !prev);
        try {
            const res = await dispatch(recipeLikeDish(recipeId)).unwrap();
            setLiked(res.data.isLiked);
            toast.success(res.message);
        } catch (err) {
            toast.error(err.message);

            console.log(err);
        }
    };

    const handleSave = async () => {
        if (!user) return alert("Please login first!");

        setSaved(prev => !prev);
        try {
            const res = await dispatch(recipeSave(recipeId)).unwrap();
            setSaved(res.data.isSaved);
            toast.success(res.message);

        } catch (err) {
            toast.error(err.message);

            console.log(err);
        }
    };


    // ... inside your RecipeDetails component ...
    const handleShare = async () => {
        // Optional: Make a backend call to increment share count
        setShowShareOption(true);

        try {
            const res = await dispatch(recipeShare(recipeId)).unwrap();
            console.log(res);
            setShowShareOption(false);

        } catch (err) {
            console.log(err);
        }
    };


    // Placeholder functions for More menu actions
    const handleDeleteComment = async (commentId) => {
        try {
            await dispatch(deleteComment(commentId)).unwrap();

            // 🔒 close menu to avoid stale reference
            setOpenMenu({ id: null, type: null });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    };

    const handleReportComment = (commentId) => { console.log("Reporting:", commentId); setOpenMenu(null); };


    const handleRatingClick = (starValue) => {
        dispatch(submitRating({ recipeId: recipe._id, rating: starValue }));
    };



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


                    <div className="flex lg:flex-row flex-col lg:items-center xl:gap-y-0 gap-y-8 mb-14 justify-between">
                        {/* Left Section */}
                        <div className="left flex flex-col gap-y-10">
                            <h1 className="title sm:text-6xl text-[40px] font-semibold">{recipe.title}</h1>
                            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-x-5 gap-x-3 gap-y-5">

                                {/* Author */}
                                <div className="infoGroup flex items-center gap-x-2 sm:border-r sm:border-b-0 border-b sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <img
                                        src={recipe.author?.profileImage || "/profile/user.jpg"}
                                        alt={recipe.author?.username ? `${recipe.author.username}'s profile picture` : "author"}
                                        className="h-12 w-12 rounded-full"
                                    />
                                    <div className="pr-2">
                                        <h2>{recipe.author?.username || "Unknown"}</h2>
                                        <p className="whitespace-nowrap">{formattedDate || "-"}</p>
                                    </div>
                                </div>

                                {/* Prep Time */}
                                <div className="infoGroup flex items-center gap-x-2 md:border-r sm:border-b-0 border-b sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <FaStopwatch className="text-blue-500" size={20} />
                                    <div>
                                        <h2>Prep Time</h2>
                                        <p>{recipe.prepTime?.value || "-"} {recipe.prepTime?.unit || ""}</p>
                                    </div>
                                </div>

                                {/* Cook Time */}
                                <div className="infoGroup flex items-center gap-x-2 sm:border-r sm:border-b-0 border-b sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <FaStopwatch className="text-red-500" size={20} />
                                    <div>
                                        <h2>Cook Time</h2>
                                        <p>{recipe.cookTime?.value || "-"} {recipe.cookTime?.unit || ""}</p>
                                    </div>
                                </div>

                                {/* Servings */}
                                <div className="infoGroup flex items-center gap-x-2 sm:border-b-0 border-b sm:py-0 py-2 border-[rgba(0,0,0,0.1)]">
                                    <PiForkKnifeBold className="text-green-500" size={20} />
                                    <div>
                                        <h2>Servings</h2>
                                        <p>{recipe.servings || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="right flex gap-x-5">
                            {/* Print */}
                            <div className="option group cursor-pointer flex flex-col items-center" onClick={() => window.print()}>
                                <div className="p-3 h-[70px] w-[70px] rounded-full bg-[#E7FAFE] flex items-center justify-center group-hover:shadow-xl">
                                    <FiPrinter size={25} />
                                </div>
                                <p className="uppercase">print</p>
                            </div>

                            {/* Share */}
                            <div
                                onClick={() => {
                                    setShowShareOption(!showShareOption);
                                }}
                                className="option group cursor-pointer flex flex-col items-center"
                            >
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
                        <div className="left lg:w-[60%] w-full rounded-3xl overflow-hidden">
                            <div className="relative w-full rounded-3xl bg-white shadow-md overflow-hidden">
                                {recipe.video?.url ? (
                                    <video
                                        src={recipe.video.url}
                                        controls
                                        className="w-full aspect-video object-cover rounded-3xl"
                                    />
                                ) : (
                                    <img
                                        src={recipe.dishImage?.url || "/reciepies/resp3.jpg"}
                                        alt={recipe.title || "recipe"}
                                        className="w-full aspect-[5/3] object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
                                    />
                                )}
                            </div>

                            {/* Actions */}

                            <div className="mt-3 flex gap-4 items-center flex-wrap">
                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            // ✅ onClick हैंडलर को बदलें
                                            onClick={() => handleRatingClick(star)}
                                            className="text-yellow-400 hover:scale-110 transition-transform"
                                        >
                                            <FaStar
                                                size={24}
                                                // ✅ local 'rating' state की जगह currentUserRating का उपयोग करें
                                                className={star <= recipe?.avgRating ? "fill-yellow-500" : "fill-gray-300"}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Like Button */}
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition
    ${liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}
    hover:bg-red-200`}
                                >
                                    <FaHeart className={`${liked ? "text-red-500" : "text-gray-800"}`} />
                                    <span>{liked ? "Liked" : "Like"} ({recipeMeta?.likesCount || 0})</span>
                                </button>

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition
    ${saved ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
    hover:bg-blue-200`}
                                >
                                    <FaBookmark className={`${saved ? "text-blue-600" : "text-gray-800"}`} />
                                    <span>{saved ? "Saved" : "Save"} ({recipeMeta?.savesCount || 0})</span>
                                </button>

                            </div>

                            {/* Metadata */}
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                {recipe.cuisine && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                                        🌍 {recipe.cuisine}
                                    </span>
                                )}
                                {recipe.difficultyLevel && (
                                    <span className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full font-medium">
                                        ⚙️ {recipe.difficultyLevel}
                                    </span>
                                )}
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
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                    🥦 Nutrition Information
                                </h3>
                                <div className="details flex flex-col gap-y-4">
                                    {recipe.nutrients?.length ? (
                                        recipe.nutrients.map((nt) => (
                                            <div
                                                key={nt.name}
                                                className="detailGroup flex justify-between items-center border-b border-gray-200 pb-2"
                                            >
                                                <span className="text-gray-600 font-medium">{nt.name}</span>
                                                <span className="text-gray-800">
                                                    {nt.quantity || "-"} {nt.unit || ""}
                                                </span>
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
                    <p className="my-8 text-lg text-gray-700 leading-relaxed max-w-3xl">
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

                    <CommentsSection
                        comments={comments}
                        user={user}
                        handleAddComment={handleAddComment}
                        newCommentText={newCommentText}
                        setNewCommentText={setNewCommentText}
                        handleLikeComment={handleLikeComment}
                        startReply={startReply}
                        shownReplies={shownReplies}
                        replyingToCommentId={replyingToCommentId}
                        toggleMoreMenu={toggleMoreMenu}
                        toggleReplies={toggleReplies}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        handleDeleteComment={handleDeleteComment}
                    />


 
                    <div className="bottom my-20 no-print">
                        <h1 className="title text-4xl font-semibold text-center my-4">You may like these recipes too</h1>
                        <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                            {recommendRecipes?.length > 0 && recommendRecipes?.map((recp) => (
                                <RecipieCard key={recp._id} title={recp.title} prepTime={recp.prepTime} cookTime={recp.cookTime} difficultyLevel={recp.difficultyLevel} link={`/category/${recp?.categoryId}/recipe/${recp?._id}`} imgUrl={recp?.dishImage?.url} />
                            ))}
                        </div>
                    </div>
                    <MailBox />
                </div>
            </section>

            {showShareOption && <ShareOptions handleShare={handleShare} link={`${FRONTEND_URL}/category/${categoryId}/recipe/${recipeId}`} onClose={() => setShowShareOption(false)} />}



        </>

    );
};

export default RecipeDetails;
