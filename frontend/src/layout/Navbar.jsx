import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBars, FaFacebookF, FaImage, FaInstagram, FaTwitter } from "react-icons/fa6";
import { MdLightMode, MdModeNight } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/authSlice';

const Navbar = () => {

    const [showProfilebar, setShowProfileBar] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [mode, setMode] = useState("light");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { pathname } = useLocation();
    const [activeNav, setActiveNav] = useState("/");
    const { user, error } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (mode === "light") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [mode]);

    const changeMode = () => {
        if (mode === "dark") {
            setMode("light")
        } else {
            setMode("dark")
        }
    }


    const logouthandler = async () => {
        if (loading) return;
        setLoading(true);

        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logout successfully.");
            navigate("/");
        } catch (err) {
            toast.error(err?.message || "Logout failed.");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };




    return (
        <header className='max-w-screen border-b-[#E4E6F1] border-b no-print'>
            <div className="headerWrapper flex items-center justify-between md:px-8 px-4 md:py-5 py-3.5">
                <div className="headerLeft ">
                    <a href="#" className='text-3xl  font-bold whitespace-nowrap'>Foodie<span className='text-[#FF7426] inline-block '>.</span></a>
                </div>
                <div className="headermid">
                    <ul className="menu md:flex hidden items-center xl:gap-x-10 sm:gap-x-6 font-medium whitespace-nowrap">
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md  hover:text-[#FF7967] duration-300 transition-all ${pathname === '/' && 'text-[#FF7967]'}`}><a href="/">Home</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/recipes' && 'text-[#FF7967]'} `}><a href="/recipes">Recipes</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/blog' && 'text-[#FF7967]'}`}><a href="/blog">Blog</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/contact' && 'text-[#FF7967]'}`}><a href="/contact">Contact</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/about' && 'text-[#FF7967]'}`}><a href="/about">About us</a></li>
                        {user
                            ? <li onClick={() => setShowProfileBar(!showProfilebar)} className={`memuItem p-1.5 relative hover:bg-gray-300 rounded-full duration-300 transition-all cursor-pointer ${pathname === '/f' && 'text-[#FF7967]'}`}>
                                <img src={user?.profileImage?.url || "/profile/user.jpg"} alt="Profile" className='rounded-full h-10 w-10' />
                                {showProfilebar && <ul className='absolute left-0 top-[110%]  bg-white p-1 w-40 rounded-md shadow gap-y-1'>
                                    <li className='memuItem px-4 py-2 hover:bg-gray-300 rounded-md   duration-300 transition-all'><a href="/profile">Profile</a></li>
                                    {['chef', 'admin'].includes(user?.role) && (
                                        <>
                                            <li className="memuItem px-4 py-2 hover:bg-gray-300 rounded-md duration-300 transition-all">
                                                <a href="/chef">Settings</a>
                                            </li>
                                            <li className="memuItem px-4 py-2 hover:bg-gray-300 rounded-md duration-300 transition-all">
                                                <a href="/chef">Services</a>
                                            </li>
                                        </>
                                    )}


                                    {user?.role === "user" && <li className='memuItem px-4 py-2 hover:bg-gray-300 rounded-md  duration-300 transition-all'><a href="/favourites">Favourites</a></li>}
                                    <li className={`memuItem px-4 py-2 bg-gray-300 rounded-md mt-2 duration-300 transition-all cursor-pointer   hover:bg-black/70  text-white `}>
                                        <button
                                            onClick={logouthandler}
                                            disabled={loading}
                                            className="cursor-pointer"
                                        >
                                            {loading ? "Logging out..." : "Logout"}
                                        </button>
                                    </li>

                                </ul>}
                                {/* <FaImage size={22} /> */}
                            </li>
                            : <li className={`memuItem px-4 py-2   rounded-md  duration-300 transition-all ${pathname === '/sign-up' && 'text-[#FF7967]'} bg-black/70 hover:bg-black text-white `}><a href="/sign-in ">Sign In</a></li>
                        }

                    </ul>
                </div>
                <div className="headerRight flex items-center space-x-0">
                    <div className="">
                        {mode == "dark" ? <MdModeNight onClick={changeMode} title='change mode' className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} /> : <MdLightMode onClick={changeMode} title='change mode' className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />}
                    </div>
                    <div className="">
                        {user
                            ? <li onClick={() => setShowProfileBar(!showProfilebar)} className={`memuItem p-1.5 md:hidden relative hover:bg-gray-300 rounded-full duration-300 transition-all cursor-pointer ${pathname === '/f' && 'text-[#FF7967]'}`}>
                                <img src="/profile/user.jpg" alt="" className='rounded-full h-10 w-10' />
                                {showProfilebar && <ul className='absolute left-0 top-[110%] z-[1000]  bg-white p-1 w-40 rounded-md shadow gap-y-1'>
                                    <li className='memuItem px-4 py-2 hover:bg-gray-300 rounded-md   duration-300 transition-all'><a href="/profile">Profile</a></li>
                                    {['chef', 'admin','superadmin'].includes(user?.role) && (
                                        <>
                                            <li className="memuItem px-4 py-2 hover:bg-gray-300 rounded-md duration-300 transition-all">
                                                <a href="/chef">Settings</a>
                                            </li>
                                            <li className="memuItem px-4 py-2 hover:bg-gray-300 rounded-md duration-300 transition-all">
                                                <a href="/chef">Services</a>
                                            </li>
                                        </>
                                    )}

                                    {user?.role ==="user" && <li className='memuItem px-4 py-2 hover:bg-gray-300 rounded-md  duration-300 transition-all'><a href="/favourites">Favourites</a></li>}
                                    <li className={`memuItem px-4 py-2 bg-gray-300 rounded-md mt-2 duration-300 transition-all cursor-pointer   hover:bg-black/70  text-white `}>
                                        <button
                                            onClick={logouthandler}
                                            disabled={loading}
                                            className="cursor-pointer"
                                        >
                                            {loading ? "Logging out..." : "Logout"}
                                        </button>
                                    </li>

                                </ul>}
                                {/* <FaImage size={22} /> */}
                            </li>
                            : <li className={`memuItem px-4 py-2   rounded-md  duration-300 transition-all ${pathname === '/sign-up' && 'text-[#FF7967]'} bg-black/70 hover:bg-black text-white `}><a href="/sign-in ">Sign In</a></li>
                        }
                    </div>
                    <div className="md:hidden relative ">
                        {isMobileNavOpen ? <RxCross1 size={20} onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] cursor-pointer' /> :

                            <FaBars size={20} onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] cursor-pointer' />}
                    </div>
                    <div className="items-center gap-4 lg:flex hidden">
                        <FaFacebookF className='h-[30px] w-[30px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                        <FaTwitter className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                        <FaInstagram className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                    </div>
                </div>
            </div>

            {isMobileNavOpen &&
                <div className="mobileNav md:hidden  fixed bg-[#eee]  w-full z-50 ">
                    <ul className="menu  flex flex-col items-center justify-evenly space-y-3.5 font-medium whitespace-nowrap py-2 border  ">
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md  hover:text-[#FF7967] duration-300 transition-all ${pathname === '/' && 'text-[#FF7967]'}`}><a href="/">Home</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/recipes' && 'text-[#FF7967]'} `}><a href="/recipes">Recipes</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/blog' && 'text-[#FF7967]'}`}><a href="/blog">Blog</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/contact' && 'text-[#FF7967]'}`}><a href="/contact">Contact</a></li>
                        <li className={`memuItem px-4 py-2 hover:bg-gray-300 rounded-md hover:text-[#FF7967] duration-300 transition-all ${pathname === '/about' && 'text-[#FF7967]'}`}><a href="/about">About us</a></li>
                    </ul>
                </div>
            }

        </header>
    )
}

export default Navbar
