import React, { useEffect } from 'react'
import Category from '../components/CategoryCard'
import CategoryCard from '../components/CategoryCard'
import RecipieCard from '../components/RecipieCard';
import MailBox from '../components/MailBox';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";

import { getCategories } from '../features/recipeSlice';

const Home = () => {
    const categoryImages = [
        {
            id: 1,
            title: "Breakfast",
            imgUrl: "/category/image 25.jpg",
            bgColor: "#708246"
        },
        {
            id: 2,
            title: "Vegan",
            imgUrl: "/category/image 20.jpg",
            bgColor: "#6CC63F"

        },
        {
            id: 3,
            title: "Meat",
            imgUrl: "/category/image 21.jpg",
            bgColor: "#CC261B"

        },
        {
            id: 4,
            title: "Dessert",
            imgUrl: "/category/image 22.png",
            bgColor: "#F09E00"

        },
        {
            id: 5,
            title: "Lunch",
            imgUrl: "/category/image 23.jpg",
            bgColor: "#000000"

        },
        {
            id: 6,
            title: "Chocolate",
            imgUrl: "/category/image 24.jpg",
            bgColor: "#000000"

        },
    ];

    const recipes = [
        {
            id: 1,
            imgUrl: "/reciepies/resp1.jpg",
            isLiked: true,
            title: "Big and Juicy Wagyu Beef Cheeseburger",
            type: "Breakfast",
            time: "30 Minutes"
        },
        {
            id: 2,
            imgUrl: "/reciepies/resp2.jpg",
            isLiked: false,
            title: "Fresh Lime Roasted Salmon with Ginger Sauce",
            type: "Fish",
            time: "30 Minutes"
        },
        {
            id: 3,
            imgUrl: "/reciepies/resp3.jpg",
            isLiked: false,
            title: "Strawberry Oatmeal Pancake with Honey Syrup",
            type: "Breakfast",
            time: "30 Minutes"
        },
        {
            id: 4,
            imgUrl: "/reciepies/resp4.jpg",
            isLiked: true,
            title: "Fresh and Healthy Mixed Mayonnaise Salad",
            type: "Healthy",
            time: "30 Minutes"
        },
        {
            id: 5,
            imgUrl: "/reciepies/resp5.jpg",
            isLiked: false,
            title: "Chicken Meatballs with Cream Cheese",
            type: "Meat",
            time: "30 Minutes"
        },
        {
            id: 6,
            imgUrl: "/reciepies/resp6.jpg",
            isLiked: true,
            title: "Fruity Pancake with Orange & Blueberry",
            type: "Sweet",
            time: "30 Minutes"
        },

        {
            id: 7,
            imgUrl: "/reciepies/resp7.jpg",
            isLiked: true,
            title: "The Best Easy One Pot Chicken and Rice",
            type: "Snack",
            time: "30 Minutes"
        },

        {
            id: 8,
            imgUrl: "/reciepies/resp8.jpg",
            isLiked: true,
            title: "The Creamiest Creamy Chicken and Bacon Pasta",
            type: "Noodles",
            time: "30 Minutes"
        },
    ]

    const dispatch = useDispatch();
    const { error, loading, categories } = useSelector((state) => state.recipe);
    console.log(categories);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await dispatch(getCategories()).unwrap(); // backend endpoint (see below)
                if (!mounted) return;
            } catch (err) {
                console.error(err);
            }
        })();
        return () => (mounted = false);
    }, []);

    return (
        <main>
            <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="sm:text-3xl text-lg font-bold text-gray-800">🍽️ Explore Categories</h2>
                    <Link
                        to="/all-category"
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition sm:px-4 px-2.5 py-2 rounded-md text-sm font-medium"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                     {categories?.length > 0 ? (
                    categories.map((cat) => (
                        <Link
                            to={`/category/${cat.name.toLowerCase()}`}
                            className="group block rounded-lg p-3 overflow-hidden shadow hover:shadow-lg transition duration-300"
                        >
                            <div className="relative w-full h-48 ">
                                <img
                                    src={cat.image?.url || "/placeholder.jpg"}
                                    alt={cat.name}
                                    className="w-full h-[200px] object-cover rounded-lg"
                                />
                                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-blue-500 text-xl">
                                    {cat.icon}
                                </div>
                            </div>

                            <div className="bg-white p-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{cat.count} recipes</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">No categories found.</p>
                )}
                </div>
            </section>



            <section className='max-w-screen'>
                <div className="recipesWrapper md:px-8 px-4 py-10">
                    <div className="top my-10 flex flex-col items-center gap-y-3 justify-center">
                        <h1 className="title text-center text-3xl font-semibold">Simple and tasty recipes</h1>
                        <p className='text-center sm:w-[50%]'>Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim </p>
                    </div>
                    <div className="bottom mt-20">
                        <div className="recipesCards w-full grid lg:grid-cols-3 sm:grid-cols-2 lg:gap-14 gap-10">
                            {recipes.map((recp) => (
                                <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                    <h2 className="text-4xl font-bold leading-tight">
                        Everyone can be a chef in their own kitchen
                    </h2>
                    <p className="text-gray-600 mt-6 mb-8">
                        Learn the secrets of great cooking and bring restaurant-quality meals to your home.
                    </p>
                    <Link
                        to="/learn"
                        className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
                    >
                        Learn More
                    </Link>
                </div>

                <div className="lg:w-1/2">
                    <div className="rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-[#E7F9FD] p-4">
                        <img
                            src="/profile/male-chef.jpg"
                            alt="Chef"
                            className="w-full h-auto object-cover mix-blend-multiply"
                        />
                    </div>
                </div>
            </section>
            




            <section className="max-w-screen ">
                <div className="chefWrapper flex items-center lg:flex-row flex-col
                 flex-wrap md:px-8 px-4 py-10  lg:gap-y-0 sm:gap-y-14 gap-y-10
                 ">
                    <div className="left lg:w-1/2 w-full sm:px-5 py-3 ">
                        <h1 className="title text-4xl w-full font-semibold  ">Try this delicious recipe
                            to make your day</h1>

                    </div>
                    <div className="right lg:w-1/2 w-full">
                        <p className='sm:w-[60%]'>Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim </p>
                    </div>
                    <div className="bottom mt-6">
                        <div className="recipesCards  grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 lg:gap-14 gap-10">
                            {recipes.map((recp) => (
                                <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                            ))}
                        </div>
                    </div>

                </div>
                <MailBox />


            </section>
        </main>
    )
}

export default Home



