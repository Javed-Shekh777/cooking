import React, { useState } from 'react';
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { localloginUser } from '../features/authSlice';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [formError, setFormError] = useState({ field: "", value: "" });
    const dispatch = useDispatch();
    const { error, loading,user,authChecked  } = useSelector((state) => state.auth);


    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!formData.username) {
            setFormError({ field: "username", value: "Username is required." });
            return;
        }
        if (!formData.password) {
            setFormError({ field: "password", value: "Password is required." });
            return;
        }


        console.log(formData);
        setFormError({ field: "", value: "" });


        try {
            console.log("FprmData:", formData);
            const result = await dispatch(localloginUser(formData)).unwrap();
            toast.success(result?.message || "User Login successfully!");
            navigate("/");
        } catch (err) {
            console.log("Errr catch:", err);
            setFormData({ username: "", password: "" });
            toast.error( err || "Login failed");
        }

    }



    return (
        <section className="h-screen w-screen flex items-center justify-center bg-gray-100">
            {/* Main Card */}
            <div className="xl:flex   rounded-2xl shadow-2xl mx-2 my-1 overflow-hidden xl:w-[800px] w-[400px]  bg-white">

                {/* Left Side - Form */}
                <div className="xl:w-1/2 w-full flex sm:p-6 p-5  ">
                    <div className="w-full max-w-sm flex flex-col justify-between h-full">

                        {/* Title */}
                        <h1 className="text-xl font-bold mb-3">Cooking Web</h1>

                        {/* Center Content */}
                        <div className="flex flex-col items-center flex-grow mt-4">
                            <h2 className="text-2xl font-semibold ">Again Welcome to Cooking</h2>

                            {/* Social Icons */}
                            <div className="flex gap-4 my-4">
                                <div className="w-12 h-12 flex items-center cursor-pointer justify-center rounded-full bg-[#E7F9FD]/40 text-red-500 text-xl hover:shadow-md transition-all duration-300">
                                    <FcGoogle size={25} />
                                </div>
                                <div className="w-12 h-12 flex items-center cursor-pointer  justify-center rounded-full bg-[#E7F9FD]/40 text-blue-600 text-xl hover:shadow-md transition-all duration-300">
                                    <FaFacebook size={22} />
                                </div>
                                <div className="w-12 h-12 flex items-center cursor-pointer  justify-center rounded-full bg-[#E7F9FD]/40 text-sky-500 text-xl hover:shadow-md transition-all duration-300">
                                    <FaTwitter size={22} />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center w-full my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="px-2 text-gray-500 text-sm">or do via email</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>

                            {/* Form */}
                            <form onSubmit={submitHandler} method='post' className="flex flex-col gap-3 w-full">
                                <input
                                    type="text"
                                    placeholder="Your username or email"
                                    value={formData.username}
                                    onChange={handleChange}
                                    name='username'
                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "username" && <span className='text-sm text-red-500'>{formError.value}</span>}

                                <input
                                    type="password"
                                    placeholder="Your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    name='password'
                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "password" && <span className='text-sm text-red-500'>{formError.value}</span>}


                                {/* Submit Button */}
                                <button
                                    type='submit'
                                    className="mt-4 cursor-pointer bg-[#FF7967]/80 text-white py-3 rounded-xl hover:bg-[#FF7967] transition"
                                >
                                    Sign In
                                </button>
                            </form>
                        </div>

                        {/* Bottom */}
                        <p className="mt-6">
                            Create an account?{" "}
                            <a href="/sign-up" className="text-[#FF7967] font-semibold underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="w-1/2 xl:block hidden">
                    <img
                        src="/reciepies/image 26 (1).jpg"
                        alt="Cooking"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>
    )
}

export default SignUp
