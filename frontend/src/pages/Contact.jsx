import React from 'react'
import RecipieCard from '../components/RecipieCard'
import MailBox from '../components/MailBox'
import { useState } from 'react';
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux';
import { contactUs } from '../features/authSlice';
import { fetchRecommendations } from '../features/recipeSlice';

import { useEffect } from 'react';

const Contact = () => {

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

    ]

    const dispatch = useDispatch();
    // const { loading } = useSelector((state) => state.auth);
    const { error, recommendRecipes, loading } = useSelector((state) => state.recipe);


    const enqType = ["General", "Support", "Feedback", "Other"];
    console.log(recommendRecipes, error);



    const [contactForm, setContactForm] = useState({
        username: "",
        email: "",
        subject: "",
        enquiryType: "",
        message: ""
    });
    const [contactErros, setContactErrors] = useState({ key: "", value: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactForm({ ...contactForm, [name]: value });
    }

    useEffect(() => {
        dispatch(fetchRecommendations({
            recipeId: null,
            categoryId: null,
            limit: 8,
        }));

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contactForm.username) {
            return setContactErrors({ key: "username", value: "Username is required." });
        }
        if (!contactForm.email) {
            return setContactErrors({ key: "email", value: "Email is required." });
        }
        if (!contactForm.enquiryType) {
            return setContactErrors({ key: "enquiryType", value: "Enquiry Type is required." });
        }
        if (!contactForm.subject) {
            return setContactErrors({ key: "subject", value: "Subject is required." });
        }
        if (!contactForm.message) {
            return setContactErrors({ key: "message", value: "Message is required." });
        }
        setContactErrors({ key: "", value: "" });
        console.log(contactForm);


        try {
            const result = await dispatch(contactUs(contactForm)).unwrap();
            toast.success(result?.message || "Contact saved successfully!");
        } catch (err) {
            console.log("Errr catch:", err);
            toast.error(err.message || "Contact failed");
        }

    }



    return (
        <>
            <section className="max-w-screen">
                <div className="contactWrapper md:px-8 px-4 mt-10">
                    <h1 className="title text-center text-4xl font-semibold">Contact us</h1>
                    <div className="contact flex gap-x-5
                     mt-20 sm:flex-row flex-col sm:gap-y-0 gap-y-20">
                        <div className="left flex-[1]"
                        >
                            <div className="sm:mx-10 mx-4"
                                style={{
                                    background: `linear-gradient(180deg, rgba(231, 249, 253, 0) 0%, #E7F9FD 100%)`
                                }}
                            >
                                <img src="/profile/Layer.jpg" alt="" className='mix-blend-multiply' />

                            </div>

                        </div>
                        <div className="right flex-[1.8]">
                            <form className="contactForm" onSubmit={handleSubmit}>
                                <div className="group grid sm:grid-cols-2 gap-y-10 gap-x-4">
                                    <div className="inputGroup flex flex-col">
                                        <label htmlFor="username" className='uppercase mb-2'>NAME</label>
                                        <input type="text" value={contactForm.username} id='username' name='username' onChange={handleChange} placeholder='Enter your name...' className='py-3 px-3 rounded-2xl border-1 border-[rgba(0,0,0,0.1)] ' />
                                        {contactErros.key === "username" && <p className='text-red-500 text-sm'>{contactErros.value}</p>}

                                    </div>
                                    <div className="inputGroup flex flex-col">
                                        <label htmlFor="email" className='mb-2'>EMAIL ADDEESS</label>
                                        <input type="text" value={contactForm.email} id='email' name='email' onChange={handleChange} placeholder='Enter your address...' className='py-3 px-3 rounded-2xl border-1 border-[rgba(0,0,0,0.1)] ' />
                                        {contactErros.key === "email" && <p className='text-red-500 text-sm'>{contactErros.value}</p>}

                                    </div>

                                    <div className="inputGroup flex flex-col">
                                        <label htmlFor="subject" className='mb-2'>SUBJECT</label>
                                        <input type="text" value={contactForm.subject} id='subject' name='subject' onChange={handleChange} placeholder='Enter your subject...' className='py-3 px-3 rounded-2xl border-1 border-[rgba(0,0,0,0.1)] ' />
                                        {contactErros.key === "subject" && <p className='text-red-500 text-sm'>{contactErros.value}</p>}

                                    </div>

                                    <div className="inputGroup flex flex-col">
                                        <label htmlFor="enquiryType" className='mb-2'>ENQUIRY TYPE</label>
                                        <select
                                            id='enquiryType'
                                            name='enquiryType'
                                            value={contactForm.enquiryType} onChange={handleChange}
                                            className="border border-[rgba(0,0,0,0.1)]  p-2 rounded w-full mt-1 px-3 py-2.5"
                                        >
                                            <option value="">--Select--</option>
                                            {enqType && enqType?.map((eq, i) => (
                                                <option key={i} value={eq}>{eq}</option>
                                            ))}

                                        </select>
                                        {contactErros.key === "enquiryType" && <p className='text-red-500 text-sm'>{contactErros.value}</p>}

                                    </div>

                                </div>
                                <div className="inputGroup flex flex-col mt-5">
                                    <label htmlFor="enquiryType" className='mb-2'>MESSAGE</label>
                                    <textarea
                                        id='message' name='message'
                                        onChange={handleChange}
                                        value={contactForm.message}
                                        style={{
                                        }}
                                        rows={5} placeholder='Enter your messages...' className='py-5 px-3 rounded-2xl resize-none border-1 border-[rgba(0,0,0,0.1)] ' ></textarea>
                                </div>
                                {contactErros.key === "message" && <p className='text-red-500 text-sm'>{contactErros.value}</p>}


                                <button type='submit' className='px-10 py-2.5 text-white bg-black rounded-xl mt-8 cursor-pointer'>Submit</button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-screen">
                <div className="chefWrapper  md:px-8 sm:px-4  mb-14 mt-20
                 ">
                    <MailBox />

                    {/* 
                    <div className="bottom mt-20 mx-3">
                        <h1 className='title text-4xl font-semibold text-center my-4'>Check out the delicious recipe </h1>
                        <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                            {recipes.map((recp) => (
                                <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                            ))}

                            {recommendRecipes?.length > 0 && recommendRecipes.map((recp) => (
                                <RecipieCard key={recp._id} title={recp.title} prepTime={recp.prepTime} cookTime={recp.cookTime} url={recp?.dishImage?.url} difficultyLevel={recp?.difficultyLevel} />

                                // <RecipieCard key={recp.id} title={recp.title} time={recp.time} type={recp.time} url={recp.imgUrl} isLiked={recp.isLiked} />
                            ))}
                        </div>
                    </div> */}


                    <div className="bottom my-20 no-print">
                        <h1 className="title text-4xl font-semibold text-center my-4">You may like these recipes too</h1>
                        <div className="recipesCards w-full grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-14 gap-10">
                            {recommendRecipes?.length > 0 && recommendRecipes?.map((recp) => (
                                <RecipieCard key={recp._id} title={recp.title} prepTime={recp.prepTime} cookTime={recp.cookTime} url={recp?.dishImage?.url} />
                            ))}
                        </div>
                    </div>

                </div>
            </section>


        </>

    )
}

export default Contact
