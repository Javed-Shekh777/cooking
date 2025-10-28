import React from 'react';
import { FaBars, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";
import RecipieCard from '../components/RecipieCard';
import MailBox from '../components/MailBox';
import { BlogRecipie, Pagination, TastyRecipie } from '../components/BlogRecipie';


const BlogAndArticle = () => {
    const recipes = [
        {
            id: 1,
            imgUrl: "reciepies/resp1.jpg",
            isLiked: true,
            title: "Big and Juicy Wagyu Beef Cheeseburger",
            type: "Breakfast",
            time: "30 Minutes"
        },
        {
            id: 2,
            imgUrl: "reciepies/resp2.jpg",
            isLiked: false,
            title: "Fresh Lime Roasted Salmon with Ginger Sauce",
            type: "Fish",
            time: "30 Minutes"
        },
        {
            id: 3,
            imgUrl: "reciepies/resp3.jpg",
            isLiked: false,
            title: "Strawberry Oatmeal Pancake with Honey Syrup",
            type: "Breakfast",
            time: "30 Minutes"
        },
        {
            id: 4,
            imgUrl: "reciepies/resp4.jpg",
            isLiked: true,
            title: "Fresh and Healthy Mixed Mayonnaise Salad",
            type: "Healthy",
            time: "30 Minutes"
        },

    ]

    return (

        <section>
            <div className="blogWrapper md:px-8 px-4 py-20">
                <div className="flex flex-col mb-14 items-center justify-center gap-y-5">
                    <h1 className="title text-5xl font-semibold text-center">Blog & Article</h1>
                    <p className='text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</p>

                        <div className="formWrapper z-20 mt-10 flex sm:flex-row flex-col items-center justify-between  sm:gap-y-0 gap-y-4  xl:w-[50%] w-full  border-1 border-[rgba(0,0,0,0.1)]   bg-white rounded-3xl p-2.5">
                            <input type="text" placeholder='Search article, news or recipe...' className='sm:mx-5 lg:mx-5 p-2 outline-0 border-0   w-full  ' />
                            <button className='text-white cursor-pointer bg-black px-10 py-3 rounded-2xl shadow'>Search</button>
                        </div>
                </div>

                <div className="recipes sm:mt-2 my-20">
                    <div className="recipesWrapper">
                        <div className="top flex sm:flex-row flex-col  gap-x-8 sm:gap-y-0 gap-y-10 ">
                            <div className="left  lg:w-[70%]">
                                <div className="leftWrapper gap-y-6 flex flex-col">
                                   
                                    {[1, 2, 3, 4].map(() => (
                                        <BlogRecipie />
                                    ))}
                                </div>
                            </div>
                            <div className="right lg:w-[30%]">
                                <div className="rightWrapper">
                                    <h1 className='text-3xl font-semibold mb-5
                                    '>Tasty recipe</h1>
                                    <div className="flex flex-col gap-y-10">
                                         
                                        {[1,2,3].map(()=>(
                                            <TastyRecipie />
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="bottom pagination mt-10 flex items-center justify-center">
                            <Pagination />
                        </div>

                    </div>
                </div>

                <MailBox />


            </div>
        </section>



    )

}

export default BlogAndArticle
