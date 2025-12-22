import React, { useEffect, useState } from 'react'
import Sidemenu from './Sidemenu'
import { Outlet } from 'react-router-dom'
import Spinner from '../../../components/Spinner';



// AdminLayout.jsx

const ChefLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => { setLoading(false) }, 1000);
    })

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidemenu isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content */}
            <div className="flex-1 h-screen flex flex-col">
                {/* Topbar */}
                <div className="bg-white shadow px-4 py-3 flex items-center justify-between md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 focus:outline-none"
                    >
                        {/* Hamburger Icon */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold">Chef Panel</h1>
                </div>

                <div className="flex-1 h-screen overflow-y-auto p-4">
                    <Outlet />
                </div>
                {/* <div className="relative lg:ml-64 sm:ml-52 ml-0 sm:p-5 p-3 w-full">
                // {/* {loading ? <Spinner /> : <Outlet />} 
                <Outlet />
            </div> */}
            </div>
        </div>
    );
};

export default ChefLayout;

