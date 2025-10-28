import { Link } from "react-router-dom";
import {FaHome} from "react-icons/fa"; // You can switch to other icon packs
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
                <h2 className="sm:text-3xl text-xl font-bold text-gray-800">🍽️ All Recipe Categories</h2>
                <Link
                    to="/"
                    className="bg-blue-100 sm:hidden flex items-center justify-center text-blue-600 hover:bg-blue-200 transition sm:px-4 px-1.5 py-2 rounded-md "
                >
                    <FaHome className="inline-block mr-2" size={20} /> 
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories?.length > 0 ? (
                    categories.map((cat) => (
                        <Link
                            to={`/category/${cat.name.toLowerCase()}`}
                            className="group block rounded-lg p-3 overflow-hidden shadow hover:shadow-lg transition duration-300"
                        >
                            <div className="relative w-full h-48 ">
                                <img
                                    src={cat.image?.url || "/placeholder.jpg"}
                                    alt={cat.name}
                                    className="w-full h-[200px] object-cover rounded-lg"
                                />
                                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-blue-500 text-xl">
                                    {cat.icon}
                                </div>
                            </div>

                            <div className="bg-white p-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{cat.count} recipes</p>
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
