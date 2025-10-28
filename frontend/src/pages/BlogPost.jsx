import React from 'react';
import { FaBars, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";

import { useParams } from 'react-router-dom';
import MailBox from '../components/MailBox';
import RecipieCard from '../components/RecipieCard';


const BlogPost = () => {

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

    ];

    const { id } = useParams();
    return (
        <section>
            <div className="blogWrapper md:px-8 px-4 py-20">
                <div className="flex flex-col items-center justify-center gap-y-5">
                    <h1 className="title text-5xl font-semibold text-center">Full Guide to Becoming a Professional Chef</h1>

                    <div className="formWrapper flex   items-center justify-center  mt-6   flex-row     ">
                        <div className="flex w-1/2 flex-wrap  items-center gap-x-3  mx-5  ">
                            <img src="/profile/Ellipse2.jpg" alt="" className="image" />
                            <span className='whitespace-nowrap'>John Smith</span>
                        </div>
                        <div className="w-1/2 px-5 border-l-2 border-l-[rgba(0,0,0,0.1)]">
                            <p className='whitespace-nowrap'>15 March 2022</p>
                        </div>
                    </div>
                    <p className='text-center mt-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio. Nulla at congue diam, at dignissim turpis. Ut vehicula sed velit a faucibus. In feugiat vestibulum velit vel pulvinar.</p>

                    <div className="sm:h-auto h-[200px]">
                        <img src="/profile/image 29.jpg" alt="" className='sm:rounded-4xl rounded-2xl sm:my-5 h-full' />

                    </div>

                    <div className="steps mt-10 flex sm:flex-row flex-col sm:gap-y-0 gap-y-7 xl:mx-32 md:mx-14 justify-between  gap-x-10">
                        <div className="left am:w-[65%] w-full">
                            <div className="quesandans flex flex-col gap-y-10">
                                <div className="qansgroup flex flex-col gap-y-4">
                                    <div className="question font-semibold text-2xl">How did you start out in the food industry?</div>
                                    <div className="ans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio. Nulla at congue diam, at dignissim turpis. Ut vehicula sed velit a faucibus. In feugiat vestibulum velit vel pulvinar. Fusce id mollis ex. Praesent feugiat elementum ex ut suscipit.</div>
                                </div>
                                <div className="qansgroup flex flex-col gap-y-4">
                                    <div className="question font-semibold text-2xl">What do you like most about your job?</div>
                                    <div className="ans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio. Nulla at congue diam, at dignissim turpis. Ut vehicula sed velit a faucibus. In feugiat vestibulum velit vel pulvinar. Fusce id mollis ex. Praesent feugiat elementum ex ut suscipit.</div>
                                </div>
                                <div className="qansgroup flex flex-col gap-y-4">
                                    <div className="question font-semibold text-2xl">Do you cook at home on your days off?</div>
                                    <img src="/reciepies/Rectangle 23.jpg" alt="" className='sm:h-auto  ' />
                                    <div className="ans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio. Nulla at congue diam, at dignissim turpis. Ut vehicula sed velit a faucibus. In feugiat vestibulum velit vel pulvinar. Fusce id mollis ex. Praesent feugiat elementum ex ut suscipit.</div>
                                </div>
                                <div className="qansgroup flex flex-col gap-y-4">
                                    <div className="question font-semibold text-2xl">What would your advice be to young people looking to get their foot in the door?</div>
                                    <div className="ans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio. Nulla at congue diam, at dignissim turpis. Ut vehicula sed velit a faucibus. In feugiat vestibulum velit vel pulvinar. Fusce id mollis ex. Praesent feugiat elementum ex ut suscipit.</div>
                                </div>
                                <div className="qansgroup flex flex-col gap-y-4">
                                    <div className="question font-semibold text-2xl">What is the biggest misconception that people have about being a professional chef?</div>
                                    <div className="ans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio. Nulla at congue diam, at dignissim turpis. Ut vehicula sed velit a faucibus. In feugiat vestibulum velit vel pulvinar. Fusce id mollis ex. Praesent feugiat elementum ex ut suscipit.</div>
                                </div>
                            </div>

                        </div>
                        <div className="right">
                            <div className="">
                                <p className='uppercase whitespace-nowrap'>Share this on:</p>
                                <div className="items-center gap-4 flex sm:flex-col flex-row">
                                    <FaFacebookF className='h-[30px] w-[30px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                                    <FaTwitter className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                                    <FaInstagram className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <section className="max-w-screen">
                <div className="chefWrapper  md:px-8 sm:px-4  mb-14
                 ">
                    <MailBox />

                    <div className="bottom mt-20 mx-3">
                        <h1 className='title text-4xl font-semibold text-center mb-10'>Check out the delicious recipe </h1>
                        <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                            {recipes.map((recp) => (
                                <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default BlogPost
