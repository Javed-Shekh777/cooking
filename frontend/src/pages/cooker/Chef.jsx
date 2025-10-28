import { MdOutlineArrowOutward } from "react-icons/md";
import { MdHome, MdAddCircle, MdCategory } from 'react-icons/md';
import { FcLike, FcShare } from 'react-icons/fc';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { dashboard } from "../../features/recipeSlice";



const Chef = () => {
    const dispatch = useDispatch();
    const { dashboardData, error } = useSelector((state) => state.recipe);
    console.log(dashboardData);

    const getDashboard = async () => {
        try {
            const res = await dispatch(dashboard()).unwrap();
            console.log("Response DD:", res);
        } catch (error) {
           toast.error(error?.message || "Something went wrong");

        }
    }
    useEffect(() => {
        getDashboard();
    }, []);


    const boxes = [
        {
            id: 1,
            title: "Total Category",
            url: "",
            value: "100",
            bg: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
            icon: MdCategory
        },
        {
            id: 2,
            title: "Total Recipes",
            url: "",
            value: "50",
            bg: "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600",
            icon: MdCategory

        },
        {
            id: 3,
            title: "Total Likes",
            url: "",
            value: "200",
            bg: "bg-gradient-to-r from-pink-400 via-red-500 to-orange-500",
            icon: FcLike
        },
        {
            id: 4,
            title: "Total Shares",
            url: "",
            value: "30K",
            bg: "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600",
            icon: FcShare
        },
    ];


    return (
        <section className="w-full">
            <ul className="boxes grid lg:grid-cols-4 my-3 sm:grid-cols-2 w-full gap-5 text-white">
                {/* {[1,2,3,4].map((box,i) => ( */}
                    <li   className={`box rounded-2xl hover:scale-98 transition-all duration-300 p-5 hover:shadow flex flex-col sm:items-start items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 `}>
                        <a href='#'>
                            <h1 className="title mb-2">Total Category</h1>
                            <div className="flex items-center gap-x-2">
                                <p className="text-5xl">{dashboardData?.cat}</p>
                                <p className="p-1.5 rounded-full bg-white shadow text-black flex items-center justify-center"><MdCategory size={20} /></p>
                            </div>
                        </a>

                    </li>
                    <li   className={`box rounded-2xl hover:scale-98 transition-all duration-300 p-5 hover:shadow flex flex-col sm:items-start items-center bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600`}>
                        <a href='#'>
                            <h1 className="title mb-2">{"Total Recipes"}</h1>
                            <div className="flex items-center gap-x-2">
                                <p className="text-5xl">{dashboardData?.recipe}</p>
                                <p className="p-1.5 rounded-full bg-white shadow text-black flex items-center justify-center"><MdCategory size={20} /></p>
                            </div>
                        </a>

                    </li>
                    <li   className={`box rounded-2xl hover:scale-98 transition-all duration-300 p-5 hover:shadow flex flex-col sm:items-start items-center bg-gradient-to-r from-pink-400 via-red-500 to-orange-500`}>
                        <a href='#'>
                            <h1 className="title mb-2">{"Total Likes"}</h1>
                            <div className="flex items-center gap-x-2">
                                <p className="text-5xl">{dashboardData?.likes}</p>
                                <p className="p-1.5 rounded-full bg-white shadow text-black flex items-center justify-center"><FcLike size={20} /></p>
                            </div>
                        </a>

                    </li>
                    <li   className={`box rounded-2xl hover:scale-98 transition-all duration-300 p-5 hover:shadow flex flex-col sm:items-start items-center bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600`}>
                        <a href='#'>
                            <h1 className="title mb-2">{"Total Shares"}</h1>
                            <div className="flex items-center gap-x-2">
                                <p className="text-5xl">{dashboardData?.shares}</p>
                                <p className="p-1.5 rounded-full bg-white shadow text-black flex items-center justify-center"><FcShare size={20} /></p>
                            </div>
                        </a>

                    </li>
                {/* ))} */}

            </ul>
        </section>

    )
}

export default Chef
