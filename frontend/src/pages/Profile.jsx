

import React from 'react';
import { useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userProfile, updateProfile, logoutUser, clearOtpState, mailChangeReq } from '../features/authSlice';
import toast from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import NewVerifyMail from '../components/NewVerifyMail';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { otpSent, loading, error, profile, emailChangeSuccess } = useSelector((state) => state.auth);
    const [showOtp, setShowOtp] = useState(false);

    const [formData, setFormData] = useState({ fullName: "", username: "", email: "" });
    const [oldImage, setOldImage] = useState(null); // from profile
    const [newImage, setNewImage] = useState(null); // selected by user

    const [verifyActive, setVerifyActive] = useState(false);





    useEffect(() => {
        document.title = "Profile - Cooking App";
        dispatch(userProfile());
    }, [emailChangeSuccess]);

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || "",
                username: profile.username || "",
                email: profile.email || ""
            });
            setOldImage(profile.profileImage?.url || null); // assuming profileImage has a url
            setVerifyActive(false);
        }
    }, [profile]);




    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            // Check if email changed from original profile
            if (name === "email") {
                setVerifyActive(value !== profile?.email);
            }

            return updated;
        });
    };




    const saveProfile = async () => {
        try {
            const form = new FormData();
            form.append("fullName", formData.fullName);
            form.append("username", formData.username);
            form.append("email", formData.email);
            form.append("oldImage", oldImage);

            if (newImage) {
                form.append("profileImage", newImage);
            }

            await dispatch(updateProfile(form)).unwrap();
            toast.success("Profile saved successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to save profile. Please try again.");
        }
    };

    const logouthandler = async () => {
        if (loading) return;

        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logout successfully.");
            navigate("/");
        } catch (err) {
            toast.error(err?.message || "Logout failed.");
            navigate("/");
        }
    };
    const handleNewMail = async () => {
        const yes = confirm("Are you sure to change mail");

        if (!yes) return;

        try {
            const res = await dispatch(
                mailChangeReq({ newEmail: formData.email })
            ).unwrap();

            toast.success(res.message);
            setTimeout(() => { setShowOtp(true); }, 2000);


        } catch (error) {
            console.log(error);
            // toast.error(JSON.stringify(error) || "Failed to change mail.");
        }
    };


    return (
        <section className="max-w-4xl mx-auto px-4 py-14">

            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
                <button type='button' onClick={saveProfile} className="px-8 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
                    Save
                </button>
            </div>

            {loading && <p>Loading profile...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {profile && (<>
                {/* Profile Image Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <img
                            src={
                                newImage
                                    ? URL.createObjectURL(newImage)
                                    : oldImage || "/default-avatar.jpg"
                            }
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                        <div className="flex sm:flex-row flex-col sm:gap-x-6 gap-y-2 items-start">
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                id="profileImageInput"
                                className="hidden"
                                onChange={(e) => { setNewImage(e.target.files[0]); }}
                            />

                            {/* Trigger File Picker */}
                            <button
                                type="button"
                                onClick={() => document.getElementById("profileImageInput").click()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                            >
                                Change Image
                            </button>

                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    // Handle image delete logic here
                                    console.log("Delete image clicked");
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                            >
                                Delete Image
                            </button>
                        </div>

                    </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div >
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            name='fullName'
                            id='fullName'
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            name='username'
                            id='username'
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your username"
                        />
                    </div>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />

                        {/* Show verify button if email changed */}
                        {verifyActive && (
                            <button
                                onClick={handleNewMail}
                                type="button"
                                className="py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded mt-2 cursor-pointer"
                            >
                                Verify Email
                            </button>
                        )}

                        {/* Show verified badge if email is unchanged and verified */}
                        {!verifyActive && profile?.isVerified && (
                            <div className="flex items-center gap-2 text-green-600 mt-2">
                                <FaCheckCircle />
                                <span>Verified</span>
                            </div>
                        )}
                    </div>



                    <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            disabled
                            value={profile?.role || ""}
                            className="w-full px-4 py-2 bg-gray-200 cursor-not-allowed border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your full name"
                        />
                    </div>
                </div>




                {/* Password Section */}
                <div className="flex justify-end mb-10">
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer">
                        Change Password
                    </button>
                </div>

                {/* Connected Account */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">Connected Account</h2>
                    <div className="flex items-center justify-between bg-gray-100 p-4 rounded">
                        <div>
                            <p className="font-medium">Facebook</p>
                            <p className="text-sm text-gray-600">@yourfbusername</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
                            Disconnect
                        </button>
                    </div>
                </div>
            </>)
            }



            {/* Footer Actions */}
            <div className="flex justify-between mt-10">
                <button type='button' onClick={logouthandler} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer">
                    Sign Out
                </button>
                <button type='button' className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer">
                    Delete Account
                </button>
            </div>




            {showOtp && (
                <NewVerifyMail
                    onSuccess={() => {dispatch(clearOtpState());}}
                    onClose={() => setShowOtp(false)}

                />
            )}




        </section >
    );
};

export default Profile;