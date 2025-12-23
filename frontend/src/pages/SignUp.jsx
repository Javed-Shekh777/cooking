import React, { useState } from 'react';
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { localregisterUser } from '../features/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: "", email: "", password: "", conPassword: "", role: "", fullName: "" });
    const [formError, setFormError] = useState({ field: "", value: "" });
    const [experienceYears, setExperienceYears] = useState(null);
    const [specialization, setSpecialization] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [specInput, setSpecInput] = useState("");
    const [certInput, setCertInput] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);


    console.log(experienceYears, certifications, specialization);

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
        if (!formData.fullName) {
            setFormError({ field: "fullname", value: "Fullname is required." });
            return;
        }
        if (!formData.email) {
            setFormError({ field: "email", value: "Email is required." });
            return;
        }
        if (!formData.password) {
            setFormError({ field: "password", value: "Password is required." });
            return;
        }
        if (!formData.conPassword) {
            setFormError({ field: "conPassword", value: "Confirm Password is required." });
            return;
        }
        if (formData.password !== formData.conPassword) {
            setFormError({ field: "password", value: "Password does not match." });
            return;
        }

        if (formData.role === "CHEF") {
            if (experienceYears === undefined || experienceYears === null) {
                setFormError({ field: "experienceYears", value: "Experience Years is required." });
                return;
            }

            if (!Array.isArray(specialization) || specialization.length === 0) {
                setFormError({ field: "specialization", value: "Specialization is required." });
                return;
            }
            if (!Array.isArray(certifications) || certifications.length === 0) {
                setFormError({ field: "certifications", value: "Certifications is required." });
                return;
            }
        }


        console.log(formData);
        setFormError({ field: "", value: "" });

        try {



            const result = await dispatch(localregisterUser({ ...formData, experienceYears, specialization, certifications })).unwrap();
            toast.success(result?.message || "User registered successfully!");
            navigate(`/verify-mail?email=${formData.email}&username=${formData.username}`);
        } catch (err) {
            console.log("Errr catch:", err);
            toast.error(err.message || "Registration failed");
        }

    }

    const addSpec = () => {
        const val = specInput.trim();
        if (val && !specialization.includes(val)) {
            setSpecialization([...specialization, val]);
            setSpecInput("");
            setFormError({ field: "", value: "" });

        }
    };
    const removeSpec = (val) => {
        setSpecialization(specialization.filter((s) => s !== val));
        setFormError({ field: "", value: "" });

    };
    const addCert = () => {
        const val = certInput.trim();
        if (val && !certifications.includes(val)) {
            setCertifications([...certifications, val]);
            setCertInput("");
            setFormError({ field: "", value: "" });

        }
    };
    const removeCert = (val) => {
        setCertifications(certifications.filter((c) => c !== val));
        setFormError({ field: "", value: "" });

    };


    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    console.log(GOOGLE_CLIENT_ID);




    // const initializeGoogleSignIn = () => {
    //     window.google.accounts.id.initialize({
    //         client_id: GOOGLE_CLIENT_ID,
    //         callback: handleGoogleResponse,
    //     });
    // }

    // const handleGoogleResponse = async (response) => {
    //     console.log(response);
    //     const res = await fetch("http://localhost:5000/api/auth/google", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ token: response.credential })
    //     });

    //     const data = await res.json();
    //     console.log(data);

    //     if (data.success) {
    //         localStorage.setItem("token", data.token);
    //         alert("Login Success ✅");
    //     }
    // };

    // useEffect(() => {
    //     initializeGoogleSignIn();
    // }, []);

    // const googleLogin = () => {
    //     // Only call prompt here → NO initialize again
    //     window.google.accounts.id.prompt();

    // };





    return (
        <section className=" py-6 flex items-center justify-center bg-gray-100">
            {/* Main Card */}
            <div className="xl:flex   rounded-2xl shadow-2xl mx-2 my-1 overflow-hidden xl:w-[800px] w-[400px]  bg-white">

                {/* Left Side - Form */}
                <div className="xl:w-1/2 w-full flex sm:p-6 p-5  ">
                    <div className="w-full max-w-sm flex flex-col justify-between h-full">
                        {/* Title */}
                        <h1 className="text-xl font-bold mb-3">Cooking Web</h1>

                        {/* Center Content */}
                        <div className="flex flex-col items-center flex-grow mt-4">
                            <h2 className="text-2xl font-semibold ">Sign Up to Cooking</h2>

                            {/* Social Icons */}
                            <div className="flex gap-4 my-4">
                                <div
                                    // onClick={googleLogin} 
                                    className="w-12 h-12 flex items-center cursor-pointer justify-center rounded-full bg-[#E7F9FD]/40 text-red-500 text-xl hover:shadow-md transition-all duration-300">
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
                                    placeholder="Your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    name='fullName'
                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "fullname" && <span className='text-sm text-red-500'>{formError.value}</span>}
                                <input
                                    type="text"
                                    placeholder="Your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    name='username'
                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "username" && <span className='text-sm text-red-500'>{formError.value}</span>}
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    name='email'
                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "email" && <span className='text-sm text-red-500'>{formError.value}</span>}
                                <input
                                    type="password"
                                    placeholder="Your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    name='password'
                                    autoComplete={"off"}

                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "password" && <span className='text-sm text-red-500'>{formError.value}</span>}
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.conPassword}
                                    onChange={handleChange}
                                    name='conPassword'
                                    autoComplete={"off"}

                                    className="px-5 py-3 rounded-4xl   bg-[#E7F9FD]/40 focus:outline-none  focus:shadow"
                                />
                                {formError.field === "conPassword" && <span className='text-sm text-red-500'>{formError.value}</span>}

                                {/* Role Selection */}
                                <div className="flex items-center justify-around mt-2">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="role" value="CHEF" className='h-5 w-5' checked={formData.role === "CHEF"}
                                            onChange={handleChange} />
                                        Chef
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="role" value="USER" className='h-5 w-5' checked={formData.role === "USER"} onChange={handleChange} />
                                        User
                                    </label>
                                </div>

                                {/* If role is chef then show  */}
                                {formData.role === "CHEF" && <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                                        <input type="number" min={0} max={60} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)}
                                            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 5"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Enter whole years of experience (0–60).</p>
                                        {formError.field === "experienceYears" && <span className='text-sm text-red-500'>{formError.value}</span>}

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Specializations</label>
                                        <div className="mt-1 flex gap-2">
                                            <select
                                                value={specInput}
                                                onChange={(e) => setSpecInput(e.target.value)}
                                                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Select specialization</option>
                                                <option value="Indian">Indian</option>
                                                <option value="Chinese">Chinese</option>
                                                <option value="Italian">Italian</option>
                                                <option value="Mexican">Mexican</option>
                                                <option value="Japanese">Japanese</option>
                                                <option value="French">French</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addSpec}
                                                className="bg-purple-600 text-white px-4 py-2 rounded"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {formError.field === "specialization" && (
                                            <span className="text-sm text-red-500">{formError.value}</span>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {specialization.map((spec) => (
                                                <span
                                                    key={spec}
                                                    className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {spec}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSpec(spec)}
                                                        className="ml-2 text-purple-700 hover:text-purple-900"
                                                        aria-label={`Remove ${spec}`}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Certifications</label>
                                        <div className="mt-1 flex gap-2">
                                            <select
                                                value={certInput}
                                                onChange={(e) => setCertInput(e.target.value)}
                                                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="">Select certification</option>
                                                <option value="Diploma in Culinary Arts">Diploma in Culinary Arts</option>
                                                <option value="Food Safety & Hygiene">Food Safety & Hygiene</option>
                                                <option value="Professional Chef Training">Professional Chef Training</option>
                                                <option value="House Keeping">House Keeping</option>
                                                <option value="Catering">Catering</option>
                                                <option value="Chefing">Chefing</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addCert}
                                                className="bg-green-600 text-white px-4 py-2 rounded"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {formError.field === "certifications" && (
                                            <span className="text-sm text-red-500">{formError.value}</span>
                                        )}

                                        <ul className="mt-3 space-y-2">
                                            {certifications.map((cert) => (
                                                <li
                                                    key={cert}
                                                    className="flex items-center justify-between bg-green-50 px-3 py-2 rounded"
                                                >
                                                    <span className="text-sm text-green-800">{cert}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCert(cert)}
                                                        className="text-green-700 hover:text-green-900"
                                                        aria-label={`Remove ${cert}`}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </>

                                }


                                {/* Submit Button */}
                                <button
                                    type='submit'
                                    className="mt-4 cursor-pointer bg-[#FF7967]/80 text-white py-3 rounded-xl hover:bg-[#FF7967] transition"
                                >
                                    {loading ? "Registering..." : "Sign Up"}
                                </button>
                            </form>
                        </div>

                        {/* Bottom */}
                        <p className="mt-6">
                            Have an account?{" "}
                            <a href="/sign-in" className="text-[#FF7967] font-semibold underline">
                                Sign in
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
