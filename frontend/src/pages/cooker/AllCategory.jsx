import { MdDelete, MdEdit, MdOutlineTimer, MdPeopleOutline, MdOutlineAdd } from 'react-icons/md';
import { useState } from "react";
import Picker from "emoji-picker-react";
import { RxCross1 } from "react-icons/rx"
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addCategory, getCategories, getCategory, updateCategory } from '../../features/recipeSlice';
import { useEffect } from 'react';

import { FaEdit } from 'react-icons/fa';
import { FaHeart, FaShare, FaComment, FaEye } from "react-icons/fa6"
import { } from 'react-icons/md';
import { GiCookingPot } from "react-icons/gi";
import { LuUsers } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import DeletionRequestForm from '../../components/DeletionRequestForm';

const AllCategory = () => {

    const [currentMode, setCurrentMode] = useState('add');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();
    const [showDelForm, setShowDelForm] = useState(false);


    const handleEditClick = (id) => {
        setSelectedCategoryId(id);
        setCurrentMode('edit');    // मोड को एडिट पर सेट करें
        setShowForm(true);         // फ़ॉर्म दिखाएँ
    };


    const closeForm = () => setShowForm(false);
    const openForm = () => setShowForm(true);


    const toggleForm = () => {
        setCurrentMode('add');
        setSelectedCategoryId(null);
    };

    const { error, loading, categories } = useSelector((state) => state.recipe);
    console.log(categories);

    useEffect(() => {
        if (categories.length <= 0) {
            dispatch(getCategories());
        }
    }, [categories, dispatch]);

    return (
        <section>
            <div className="categoryWrapper h-full w-full">
                <div className="createBtn flex justify-end">
                    <button onClick={openForm} className='bg-gray-600/20 rounded-md p-1.5 flex justify-center gap-x-2 cursor-pointer shadow items-center my-2 w-32'>
                        <MdOutlineAdd size={25} />
                        <span className='font-bold'>Add</span>
                    </button>
                </div>
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-4">
                    {categories.map((cat) => (
                        <div
                            key={cat?._id}
                            className="relative rounded-2xl overflow-hidden shadow-lg group  duration-300 cursor-pointer"
                        >
                            {/* Background Image */}
                            <img
                                src={cat.categoryImage?.url}
                                alt={cat.name}
                                className="w-full hover:scale-105 transform  h-40 object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                            />

                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4  text-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">{cat.name}</h3>
                                    <span className="text-3xl">{cat.icon}</span>
                                </div>
                                <p className="text-sm mt-1">{cat.description}</p>
                                <p title="Recipe Count" className="text-sm mt-2 bg-yellow-500/80 inline-block w-fit px-2 py-1 rounded-full">
                                    {cat.count}
                                </p>
                            </div>

                            <div className="relative z-[1000] flex gap-3 items-center justify-end m-3">
                                {/* <a
                                    href='/'

                                    title="View"
                                    className="h-9 w-9 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-yellow-500 hover:text-white transition"
                                >
                                    <FaEye size={18} />
                                </a> */}
                                <button
                                    type='button'
                                    title="Edit"
                                    onClick={() => handleEditClick(cat?._id)}
                                    className="h-9 w-9 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-500 hover:text-white transition"
                                >
                                    <MdEdit size={20} />
                                </button>
                                <a
                                    href='#deletionRequestForm'
                                    onClick={() => { setSelectedCategoryId(cat?._id); setShowDelForm(!showDelForm) }}
                                    type='button'
                                    title="Delete"
                                    className="h-9 w-9 cursor-pointer rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-500 hover:text-white transition"
                                >
                                    <MdDelete size={20} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                {showForm &&
                    <div className="flex flex-col my-5 items-center justify-center">
                        <div className="">
                            <h1 className='text-3xl font-semibold mb-3'>{currentMode == "add" ? "Add Category" : "Update Category"}</h1>
                        </div>
                        <CategoryForm
                            mode={currentMode}
                            toggleForm={() => setCurrentMode('add')}
                            id={selectedCategoryId}
                            closeForm={closeForm}
                        />
                    </div>}
            </div>
            {showDelForm && <DeletionRequestForm onClose={() => setShowDelForm(false)} id={selectedCategoryId} type='CATEGORY' />}


        </section>

    )
}

export default AllCategory





// const CategoryForm = ({ onSubmit, toggleForm,mode }) => {
//     const {id} = useParams();
//     console.log(id);

//     const dispatch = useDispatch();
//     const {category,loading} = useSelector((state) => state.recipe);
//     console.log(category);

//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [icon, setIcon] = useState("😄"); // default icon
//     const [showPicker, setShowPicker] = useState(false);
//     const [categoryImage, setCategoryImage] = useState("");
//     const [categoryImagePreview, setCategoryImagePreview] = useState("");
//     const [formError, setFormError] = useState({ name: "", value: "" });

//     const handleFilePreview = (file, setFile, setPreview) => {
//         setFile(file);
//         if (!file) {
//             setPreview(null);
//             return;
//         }
//         const url = URL.createObjectURL(file);
//         setPreview(url);
//     };

//    useEffect(() => {
//        if (mode === "edit" && id) {
//          dispatch(getCategory(id)).unwrap().catch(() => console.log("Category not found"));

//        }
//      }, [mode, id, dispatch]);

//      // Populate form once recipe is fetched
//      useEffect(() => {
//        if (mode === "edit" && category && category._id === id) {
//          setName(category.name || "");
//          setDescription(category.description || "");
//          setIcon(category.icon || "");
//        }
//      }, [mode, category, id]);




//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!name) {
//             setFormError({ name: "name", value: "Name is required." });
//             return;
//         }
//         if (!description) {
//             setFormError({ name: "description", value: "Description is required." });
//             return;
//         }
//         if (!icon) {
//             setFormError({ name: "icon", value: "Icon is required." });
//             return;
//         }

//         try {

//             const form = new FormData();
//             form.append("name", name);
//             form.append("description", description);
//             form.append("icon", icon);
//             form.append("categoryImage", categoryImage);


//             const res = await dispatch(addCategory(form)).unwrap();
//             toast.success(res.message || "Category saved.");
//             toggleForm();
//         } catch (error) {
//             toast.error(error.message || "Category saved falied.");
//         }
//     }

//     return (
//         <form
//             onSubmit={handleSubmit}
//             encType='multipart/form-data'
//             className="flex flex-col gap-4 lg:w-[60%]  w-full shadow p-3 rounded-2xl"
//         >
//             <div className="createBtn flex justify-end">
//                 {/* <button onClick={() => setShowForm(!showForm)} className='  cursor-pointer '> */}
//                 <RxCross1 onClick={toggleForm} size={25} />
//                 {/* </button> */}
//             </div>
//             <input
//                 type="text"
//                 placeholder="Category Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="border rounded p-2"
//             />
//             {formError.name === "name" && <p className='text-red-500 text-sm'>{formError.value}</p>}

//             <input
//                 type="text"
//                 placeholder="Description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border rounded p-2"
//             />
//             {formError.name === "description" && <p className='text-red-500 text-sm'>{formError.value}</p>}


//             <div>

//                 <p title='select icon' onClick={() => setShowPicker(!showPicker)} className='font-semibold cursor-pointer '>Select Icon: <span className="text-2xl ml-2 p-1 rounded border mb-3">{icon}</span></p>
//                 {formError.name === "icon" && <p className='text-red-500 text-sm'>{formError.value}</p>}

//                 {showPicker && <Picker
//                     className='top-2'
//                     onEmojiClick={(event, emojiObject) => { setIcon(event.emoji); setShowPicker(false) }}
//                 />}
//             </div>

//             <div className="  gap-2">
//                 <label className="block font-medium">Category Image (optional):</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setCategoryImage, setCategoryImagePreview)}
//                     className="mt-1 w-full border p-2 rounded-md"
//                 />
//                 {categoryImagePreview && (
//                     <img src={categoryImagePreview} alt="dish" className="mt-2 h-40 w-full object-cover rounded" />
//                 )}
//             </div>
//             <button type="submit" className="bg-blue-500 cursor-pointer text-white px-4 py-2 w-fit rounded">
//                 Add Category
//             </button>
//         </form>
//     );
// };





const CategoryForm = ({ onSubmit, toggleForm, mode, id, closeForm }) => {
    console.log(id);

    const dispatch = useDispatch();
    const { category, loading } = useSelector((state) => state.recipe);
    console.log(category);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("😄"); // default icon
    const [showPicker, setShowPicker] = useState(false);
    const [categoryImage, setCategoryImage] = useState("");
    const [categoryImagePreview, setCategoryImagePreview] = useState("");
    const [formError, setFormError] = useState({ name: "", value: "" });
    const [oldImageUrl, setOldImageUrl] = useState(null);

    // Handle file preview logic (remains the same)
    const handleFilePreview = (file, setFile, setPreview) => {
        setFile(file);
        if (!file) {
            setPreview(null);
            // If editing, you might want to retain the existing image URL here if no new file is selected
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    // 1. Fetch category data if in edit mode
    useEffect(() => {
        if (mode === "edit" && id) {
            dispatch(getCategory(id)).unwrap().catch(() => console.log("Category not found"));
        }
    }, [mode, id, dispatch]);

    // 2. Populate form fields once data is fetched and matches the current ID
    useEffect(() => {
        if (mode === "edit" && category && category._id === id) {
            setName(category.name || "");
            setDescription(category.description || "");
            setIcon(category.icon || "");
            // ✅ यहां पुराना URL सेट करें
            if (category.categoryImage?.url) {
                setCategoryImagePreview(category.categoryImage.url);
                setOldImageUrl(category.categoryImage.url); // पुराना URL सहेजें
            }
        }
    }, [mode, category, id]);



    // 3. Handle Form Submission (Updated for both ADD and UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) { setFormError({ name: "name", value: "Name is required." }); return; }
        if (!description) { setFormError({ name: "description", value: "Description is required." }); return; }
        if (!icon) { setFormError({ name: "icon", value: "Icon is required." }); return; }
        try {
            const form = new FormData();
            form.append("name", name);
            form.append("description", description);
            form.append("icon", icon);
            if (categoryImage instanceof File) {
                form.append("categoryImage", categoryImage);
                if (oldImageUrl) {
                    form.append("oldImageUrl", oldImageUrl);
                }
            } else if (mode === "edit" && !categoryImagePreview && oldImageUrl) {
                form.append("oldImageUrl", oldImageUrl);
                form.append("categoryImage", ""); // बैकएंड को बताएं कि छवि खाली करनी है
            }

            let res;
            if (mode === "edit" && id) {
                res = await dispatch(updateCategory({ id, formData: form })).unwrap();
                toast.success(res.message || "Category updated successfully.");
            } else {
                res = await dispatch(addCategory(form)).unwrap();
                toast.success(res.message || "Category added successfully.");
            }
            closeForm();


        } catch (error) {
            closeForm();
            toast.error(error.message || "Operation failed.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            encType='multipart/form-data'
            className="flex flex-col gap-4 lg:w-[60%] w-full shadow p-3 rounded-2xl"
        >
            <p className="text-red-500 font-bold">
                Once Category created then not can be deleted!!!
            </p>

            <div className="createBtn flex justify-end">
                <RxCross1 onClick={closeForm} size={25} className="cursor-pointer" />
            </div>

            {/* Input Fields (remain the same) */}
            <input type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded p-2" />
            {formError.name === "name" && <p className='text-red-500 text-sm'>{formError.value}</p>}

            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded p-2" />
            {formError.name === "description" && <p className='text-red-500 text-sm'>{formError.value}</p>}

            {/* Icon Picker (remains the same) */}
            <div>
                <p title='select icon' onClick={() => setShowPicker(!showPicker)} className='font-semibold cursor-pointer '>Select Icon: <span className="text-2xl ml-2 p-1 rounded border mb-3">{icon}</span></p>
                {formError.name === "icon" && <p className='text-red-500 text-sm'>{formError.value}</p>}
                {showPicker && <Picker
                    className='top-2' onEmojiClick={(event, emojiObject) => { setIcon(event.emoji); setShowPicker(false) }}
                />}
            </div>

            {/* Image Input (remains the same) */}
            <div className="gap-2">
                <label className="block font-medium">Category Image (optional):</label>
                <input type="file" accept="image/*" onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setCategoryImage, setCategoryImagePreview)} className="mt-1 w-full border p-2 rounded-md" />
                {categoryImagePreview && (
                    <img src={categoryImagePreview} alt="dish" className="mt-2 h-40 w-full object-cover rounded" />
                )}
            </div>

            {/* Submit Button (Dynamic Text) */}
            <button type="submit" className="bg-blue-500 cursor-pointer text-white px-4 py-2 w-fit rounded">
                {mode === "edit" ? "Update Category" : "Add Category"}
            </button>
        </form>
    );
};


