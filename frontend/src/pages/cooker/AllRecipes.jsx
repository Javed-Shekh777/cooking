import React from 'react'
import { FaEdit } from 'react-icons/fa';
import { FaHeart, FaShare, FaComment, FaEye } from "react-icons/fa6"
import { MdDelete, MdEdit, MdOutlineTimer, MdPeopleOutline } from 'react-icons/md';
import { GiCookingPot } from "react-icons/gi";
import { LuUsers } from "react-icons/lu";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipes } from '../../features/recipeSlice';
import { useState } from 'react';
import DeletionRequestForm from '../../components/DeletionRequestForm';

const tagColors = [
    "bg-red-200 text-red-700",
    "bg-green-200 text-green-700",
    "bg-blue-200 text-blue-700",
    "bg-yellow-200 text-yellow-700",
    "bg-purple-200 text-purple-700",
    "bg-pink-200 text-pink-700",
    "bg-indigo-200 text-indigo-700",
];


const AllRecipes = () => {

    // const recipess = [
    //     {
    //         id: 1,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    //     {
    //         id: 2,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    //     {
    //         id: 3,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    //     {
    //         id: 4,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    //     {
    //         id: 5,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    //     {
    //         id: 6,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    //     {
    //         id: 7,
    //         title: "Milk shake",
    //         prepTime: "20 min",
    //         cookTime: "30 min",
    //         tags: ["Jeera", 'Bread'],
    //         likes: 200,
    //         share: 100,
    //         comment: 300,
    //         pic: "/reciepies/resp1.jpg"
    //     },
    // ];

    const { recipes, loading } = useSelector((state) => state.recipe);
    const [showDelForm, setShowDelForm] = useState(false);

    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(null);
    console.log(recipes);



    useEffect(() => {
        dispatch(getRecipes());
    }, [dispatch]);


    return (
        <section className='w-full h-full'>
            <div className="recipesWrapper py-6">


                <div className="recipes grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    {
                        recipes.length > 0 ? recipes.map((recp) => (
                            <div
                                key={recp._id}
                                className="recipe group rounded-2xl shadow-md  hover:bg-slate-50 cursor-pointer transition-all duration-300 bg-white overflow-hidden"
                            >
                                {/* Dish Image with overlay */}
                                <div className="relative h-48 w-full group">
                                    {recp?.dishImage ? (
                                        <img
                                            src={recp.dishImage?.url}
                                            alt={recp.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <video
                                            ref={(videoEl) => {
                                                if (videoEl) {
                                                    // 🧠 Add hover listeners (simple vanilla JS way)
                                                    videoEl.onmouseenter = () => videoEl.play();
                                                    videoEl.onmouseleave = () => {
                                                        videoEl.pause();
                                                        videoEl.currentTime = 0; // reset to start
                                                    };
                                                }
                                            }}
                                            src={recp.dishVideo?.url}
                                            muted
                                            playsInline
                                            loop
                                            preload="metadata"
                                            className="h-full w-full object-cover   transition-transform duration-300"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                    <h3 className="absolute bottom-2 left-3 text-white font-bold text-lg">
                                        {recp.title}
                                    </h3>
                                </div>


                                {/* Content */}
                                <div className="p-4 space-y-3">
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

                                    {/* Stats */}
                                    <div className="flex items-center flex-wrap justify-between text-gray-600 text-sm">
                                        <p className='flex items-center gap-x-1 whitespace-nowrap text-yellow-600'><MdOutlineTimer size={18} /> {`${recp.prepTime.value} ${recp.prepTime.unit}`}</p>
                                        <p className='flex items-center gap-x-1 whitespace-nowrap text-orange-600'><GiCookingPot size={18} /> {`${recp.cookTime.value} ${recp.cookTime.unit}`}</p>
                                        <p className='flex items-center gap-x-1 whitespace-nowrap text-blue-600'><LuUsers size={18} /> {recp.servings || 1} Servings</p>
                                    </div>

                                    {/* Interactions */}
                                    <div className="flex justify-around items-center border-t pt-3 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1">
                                            <FaHeart className="text-red-500" size={22} />
                                            <span>{recp.likes?.length}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaComment size={22} />
                                            <span>{recp?.commentsCount || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaShare size={22} />
                                            <span>{recp.shares.length}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 items-center justify-end mt-3">
                                        {/* <a
                                            href='/'

                                            title="View"
                                            className="h-9 w-9 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-yellow-500 hover:text-white transition"
                                        >
                                            <FaEye size={18} />
                                        </a> */}
                                        <a
                                            href={`/chef/recipe/edit/${recp._id}`}
                                            title="Edit"
                                            className="h-9 w-9 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-500 hover:text-white transition"
                                        >
                                            <MdEdit size={20} />
                                        </a>
                                        <a
                                            href='#deletionRequestForm'
                                            onClick={() => { setSelectedItem(recp?._id); setShowDelForm(!showDelForm) }}
                                            type='button'
                                            title="Delete"
                                            className="h-9 w-9 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-500 hover:text-white transition"
                                        >
                                            <MdDelete size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )) : "No recipes found"
                    }
                </div>

            </div>
            {showDelForm && <DeletionRequestForm onClose={() => setShowDelForm(false)} id={selectedItem} type='RECIPE' />}
        </section>
    )
}

export default AllRecipes





