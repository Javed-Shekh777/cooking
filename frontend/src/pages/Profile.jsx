

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

  const [formData, setFormData] = useState({ fullName: "", username: "", email: "", mobile: "", bio: "", dateOfBirth: "", location: "", role: "", gender: "" });
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
        email: profile.email || "",
        bio: profile?.bio || "",
        role: profile?.role || "",
        dateOfBirth: profile?.dateOfBirth || "",
        location: profile?.location || "",
        mobile: profile?.mobile || "",
        gender: profile?.gender || "",


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
      form.append("role", formData.role);
      form.append("location", formData.location);
      form.append("bio", formData.bio);
      form.append("mobile", formData.mobile);
      form.append("dateOfBirth", formData.dateOfBirth);
      form.append("gender", formData.gender);


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
      <form className="space-y-6">

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                type="text"
                value={formData.mobile || ""}
                onChange={handleChange}
                name="mobile"
                id="mobile"
                disabled
                className="w-full px-4 py-2 bg-gray-200 cursor-not-allowed border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

                placeholder="Your mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth ? formData.dateOfBirth.slice(0, 10) : ""}
                onChange={handleChange}
                name="dateOfBirth"
                id="dateOfBirth"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={handleChange}
              name="location"
              id="location"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.location?.city || ""}
                onChange={handleChange}
                name="city"
                id="city"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.location?.country || ""}
                onChange={handleChange}
                name="country"
                id="country"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio || ""}
              onChange={handleChange}
              name="bio"
              id="bio"
              rows="3"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write something about yourself"
            />
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
                id="role"
                name="role"
                disabled
                value={profile?.role?.toUpperCase() || ""}
                className="w-full px-4 py-2 bg-gray-200 cursor-not-allowed border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.role === "CHEF" && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Chef Profile
              </h3>

              <div className="bg-gray-50 rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Experience</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formData.chefProfile?.experienceYears || "N/A"} Years
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Specialization</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formData.chefProfile?.specialization?.join(", ") || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Certifications</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formData.chefProfile?.certifications?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}



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
            onSuccess={() => { dispatch(clearOtpState()); }}
            onClose={() => setShowOtp(false)}

          />
        )}
      </form>

    </section >
  );
};

export default Profile;