import { MdOutlineAdd } from 'react-icons/md';
import { useState } from "react";
import Picker from "emoji-picker-react";
import { RxCross1 } from "react-icons/rx"
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addCategory, getCategories } from '../../features/recipeSlice';
import { useEffect } from 'react';

const AllCategory = () => {
    // const categories = [
    //     {
    //         name: "Breakfast",
    //         description: "Start your day with energy",
    //         image: "/reciepies/resp1.jpg",
    //         icon: "🥞",
    //         count: 12,
    //     },
    //     {
    //         name: "Lunch",
    //         description: "Delicious meals to keep you going",
    //         image: "/reciepies/resp1.jpg",

    //         icon: "🍲",
    //         count: 18,
    //     },
    //     {
    //         name: "Dessert",
    //         description: "Sweet treats for everyone",
    //         image: "/reciepies/resp1.jpg",

    //         icon: "🍰",
    //         count: 9,
    //     },
    // ];

    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const toggleForm = () => {
        setShowForm(!showForm);
    }

     const { error, loading, categories } = useSelector((state) => state.recipe);
    console.log(categories);

    useEffect(() => {
        if (categories.length <= 0) {
            dispatch(getCategories());
        }
    }, []);

    return (
        <section>
            <div className="categoryWrapper h-full w-full">
                <div className="createBtn flex justify-end">
                    <button onClick={toggleForm} className='bg-gray-600/20 rounded-md p-1.5 flex justify-center gap-x-2 cursor-pointer shadow items-center my-2 w-32'>
                        <MdOutlineAdd size={25} />
                        <span className='font-bold'>Add</span>
                    </button>
                </div>
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-4">
                    {categories.map((cat) => (
                        <div
                            key={cat?._id}
                            className="relative rounded-2xl overflow-hidden shadow-lg group hover:scale-105 transform transition-all duration-300 cursor-pointer"
                        >
                            {/* Background Image */}
                            <img
                                src={cat.image?.url}
                                alt={cat.name}
                                className="w-full h-40 object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                            />

                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">{cat.name}</h3>
                                    <span className="text-3xl">{cat.icon}</span>
                                </div>
                                <p className="text-sm mt-1">{cat.description}</p>
                                <p className="text-sm mt-2 bg-yellow-500/80 inline-block px-2 py-1 rounded-full">
                                    {cat.count} recipes
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {showForm &&
                    <div className="flex flex-col my-5 items-center justify-center">
                        <div className="">
                            <h1 className='text-3xl font-semibold mb-3
                        '>Add Category</h1>
                        </div>
                        <CategoryForm toggleForm={toggleForm} />
                    </div>}
            </div>

        </section>

    )
}

export default AllCategory





const CategoryForm = ({ onSubmit, toggleForm }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("😄"); // default icon
    const [showPicker, setShowPicker] = useState(false);
    const [categoryImage, setCategoryImage] = useState("");
    const [categoryImagePreview, setCategoryImagePreview] = useState("");
    const [formError, setFormError] = useState({ name: "", value: "" });

    const handleFilePreview = (file, setFile, setPreview) => {
        setFile(file);
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setFormError({ name: "name", value: "Name is required." });
            return;
        }
        if (!description) {
            setFormError({ name: "description", value: "Description is required." });
            return;
        }
        if (!icon) {
            setFormError({ name: "icon", value: "Icon is required." });
            return;
        }

        try {

            const form = new FormData();
            form.append("name", name);
            form.append("description", description);
            form.append("icon", icon);
            form.append("categoryImage", categoryImage);


            const res = await dispatch(addCategory(form)).unwrap();
            toast.success(res.message || "Category saved.");
            toggleForm();
        } catch (error) {
            toast.error(error.message || "Category saved falied.");
        }
    }

   



    return (
        <form
            onSubmit={handleSubmit}
            encType='multipart/form-data'
            className="flex flex-col gap-4 lg:w-[60%]  w-full shadow p-3 rounded-2xl"
        >
            <div className="createBtn flex justify-end">
                {/* <button onClick={() => setShowForm(!showForm)} className='  cursor-pointer '> */}
                <RxCross1 onClick={toggleForm} size={25} />
                {/* </button> */}
            </div>
            <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded p-2"
            />
            {formError.name === "name" && <p className='text-red-500 text-sm'>{formError.value}</p>}

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded p-2"
            />
            {formError.name === "description" && <p className='text-red-500 text-sm'>{formError.value}</p>}


            <div>

                <p title='select icon' onClick={() => setShowPicker(!showPicker)} className='font-semibold cursor-pointer '>Select Icon: <span className="text-2xl ml-2 p-1 rounded border mb-3">{icon}</span></p>
                {formError.name === "icon" && <p className='text-red-500 text-sm'>{formError.value}</p>}

                {showPicker && <Picker
                    className='top-2'
                    onEmojiClick={(event, emojiObject) => { setIcon(event.emoji); setShowPicker(false) }}
                />}
            </div>

            <div className="  gap-2">
                <label className="block font-medium">Category Image (optional):</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setCategoryImage, setCategoryImagePreview)}
                    className="mt-1 w-full border p-2 rounded-md"
                />
                {categoryImagePreview && (
                    <img src={categoryImagePreview} alt="dish" className="mt-2 h-40 w-full object-cover rounded" />
                )}
            </div>
            <button type="submit" className="bg-blue-500 cursor-pointer text-white px-4 py-2 w-fit rounded">
                Add Category
            </button>
        </form>
    );
};

