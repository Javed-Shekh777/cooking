import React, { useState } from 'react'
import { MdHome, MdAddCircle, MdCategory } from 'react-icons/md';
import { PiChefHatFill } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi"
import { LuSettings } from 'react-icons/lu';
import { FaCodePullRequest } from "react-icons/fa6";

// const Sidemenu = () => {
//     const { pathname } = useLocation();

//     const { user, error } = useSelector((state) => state.auth);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();


//     const logouthandler = async () => {
//         if (loading) return;
//         setLoading(true);

//         try {
//             await dispatch(logoutUser()).unwrap();
//             toast.success("Logout successfully.");
//             navigate("/");
//         } catch (err) {
//             toast.error(err?.message || "Logout failed.");
//             navigate("/");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const navItems = [
//         {
//             id: 1,
//             title: "Home",
//             icon: MdHome,
//             isActive: pathname === "/chef",
//             url: "/chef"
//         },
//         {
//             id: 2,
//             title: "Add Recipe",
//             icon: MdAddCircle,
//             isActive: pathname === "/chef/recipe/add",
//             url: "/chef/recipe/add",
//         },
//         {
//             id: 3,
//             title: "Category",
//             icon: MdCategory,
//             isActive: pathname === "/chef/all-category",
//             url: "/chef/all-category"
//         },
//         {
//             id: 4,
//             title: "Recipes",
//             icon: MdHome,
//             isActive: pathname === "/chef/all-recipes",
//             url: "/chef/all-recipes"
//         },
//         {
//             id: 5,
//             title: "Setting",
//             icon: LuSettings,
//             isActive: pathname === "/chef/setting",
//             url: "/chef/setting"
//         },
//         {
//             id: 6,
//             title: "Requests",
//             icon: FaCodePullRequest,
//             isActive: pathname === "/requests",
//             url: "/chef/requests"
//         }
//     ];


//     return (
//         <div className="leftPart  p-3 bg-gray-50 max-h-[100vh] h-[100vh] lg:w-64 fixed sm:block sm:w-52 hidden">
//             <aside className="sideMenu   relative h-full">
//                 <div className="logo my-3">
//                     <a href="/" className='flex items-center border-b py-1.5 whitespace-nowrap border-b-gray-500 gap-x-2 text-2xl'>
//                         <PiChefHatFill size={25} />
//                         <p>DASHBOARD</p>
//                     </a>
//                 </div>
//                 <div className="menu ">
//                     <ul className="menus flex flex-col gap-y-2 overflow-y-auto h-[75vh]">
//                         {
//                             navItems.map((nav) => (
//                                 <li key={nav.id} className={`menuItem hover:bg-gray-200/60 p-2 rounded transition-all duration-300 ${nav.isActive && "text-[#FF7967] bg-gray-300/80 border-r-8 border-r-[#FF7967]"} `}>
//                                     <a href={nav.url} className='flex items-center gap-x-2'>
//                                         <nav.icon size={25} />
//                                         <p>{nav.title}</p>
//                                     </a>
//                                 </li>
//                             ))
//                         }
//                     </ul>
//                 </div>
//                 <div className={`absolute bottom-3 w-full left-0 memuItem px-4 py-2 bg-gray-300 rounded-md mt-2 duration-300 transition-all cursor-pointer   hover:bg-black/70  text-white `}>
//                     <button
//                         onClick={logouthandler}
//                         disabled={loading}
//                         className="cursor-pointer flex items-center gap-x-2"
//                     >
//                         <FiLogOut size={22} />   {loading ? "Logging out..." : "Logout"}
//                     </button>
//                 </div>
//             </aside>
//         </div>
//     )
// }






const Sidemenu = ({ isOpen, setIsOpen }) => {
    const { pathname } = useLocation();

    const { user, error } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


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

    const navItems = [
        {
            id: 1,
            title: "Home",
            icon: MdHome,
            isActive: pathname === "/chef",
            url: "/chef"
        },
        {
            id: 2,
            title: "Add Recipe",
            icon: MdAddCircle,
            isActive: pathname === "/chef/recipe/add",
            url: "/chef/recipe/add",
        },
        {
            id: 3,
            title: "Category",
            icon: MdCategory,
            isActive: pathname === "/chef/all-category",
            url: "/chef/all-category"
        },
        {
            id: 4,
            title: "Recipes",
            icon: MdHome,
            isActive: pathname === "/chef/all-recipes",
            url: "/chef/all-recipes"
        },
        {
            id: 5,
            title: "Setting",
            icon: LuSettings,
            isActive: pathname === "/chef/setting",
            url: "/chef/setting"
        },
        {
            id: 6,
            title: "Requests",
            icon: FaCodePullRequest,
            isActive: pathname === "/requests",
            url: "/chef/requests"
        }
    ];


    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div className="logo my-3 p-4 border-b">
                    <a href="/" className='flex items-center border-b py-1.5 whitespace-nowrap border-b-gray-500 gap-x-2 text-2xl'>
                        <PiChefHatFill size={25} />
                        <p>DASHBOARD</p>
                    </a>
                </div>


                <nav className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100%-4rem)]">

                    {
                        navItems.map((nav) => (
                            <NavLink
                                key={nav.id}
                                to={nav.url}
                                onClick={() => setIsOpen(false)} // close sidebar on mobile
                                className={({ isActive }) =>
                                    `p-2  flex gap-x-2 rounded ${nav.isActive
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`
                                }
                            >
                                <nav.icon size={25} />
                                <p>{nav.title}</p>
                            </NavLink>
                        ))
                    }
                </nav>

                <div className={`fixed bottom-3 w-full left-0 memuItem px-4 py-2 bg-gray-300 rounded-md mt-2 duration-300 transition-all cursor-pointer   hover:bg-black/70  text-white `}>
                    <button
                        onClick={logouthandler}
                        disabled={loading}
                        className="cursor-pointer flex items-center gap-x-2"
                    >
                        <FiLogOut size={22} />   {loading ? "Logging out..." : "Logout"}
                    </button>
                </div>

            </aside>
        </>
    );
}

export default Sidemenu;

