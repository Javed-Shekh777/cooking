import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // You can switch to other icon packs
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCategories } from "../features/recipeSlice";
import MailBox from "../components/MailBox";






const AllCategories = () => {
    const dispatch = useDispatch();
    const { error, loading, categories } = useSelector((state) => state.recipe);
    console.log(categories);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await dispatch(getCategories()).unwrap(); // backend endpoint (see below)
                if (!mounted) return;
            } catch (err) {
                console.error(err);
            }
        })();
        return () => (mounted = false);
    }, []);


    return (
        <>
            <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">🍽️ Categories</h2>
                    <Link
                        to="/"
                        className="bg-blue-100 sm:hidden flex items-center justify-center text-blue-600 hover:bg-blue-200 transition sm:px-4 px-1.5 py-2 rounded-md "
                    >
                        <FaHome className="inline-block  " size={25} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-14">
                    {categories?.length > 0 ? (
                        categories.map((cat) => (
                            <Link
                                key={cat.name}
                              to={`/category/${cat._id}`}
                                className="group flex flex-col items-center text-center gap-5"
                            >
                                <div className="w-full max-w-[140px] sm:max-w-[180px] aspect-square rounded-full overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                                    <img
                                        src={cat.categoryImage?.url || "/placeholder.jpg"}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex items-center hover:shadow-2xl rounded p-2 bg-slate-100/50 group-hover:bg-slate-200 gap-3">
                                    <div className="bg-white p-2 rounded-full shadow text-blue-500 text-lg">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                        {cat.name}
                                    </h3>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-500">No categories found.</p>
                    )}
                </div>



            </section>
            <section className="max-w-screen ">
                <MailBox />




            </section>
        </>

    );
};

export default AllCategories;
