import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe, clearSuggestTag, getCategories, getRecipe, suggestTags, updateRecipe } from "../../features/recipeSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const timeMap = {
  sec: "sec",
  min: "min",
  h: "h"
};


const nutrientMap = ["cal", "kcal", "g", "kg", "mg"];
const ingredientMap = ["mg", "g", "kg", "l", 'ml', 'cup', 'tbsp', 'tsp', 'pcs'];


export default function AddReceipie({ mode = "add" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { suggestTags: suggestions, error, recipe, loading, categories } = useSelector((state) => state.recipe);

  console.log(categories);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const [dishImage, setDishImage] = useState(null);
  const [dishVideo, setDishVideo] = useState(null);
  const [dishMediaType, setDishMediaType] = useState("");
  const [dishImagePreview, setDishImagePreview] = useState(null);
  const [dishVideoPreview, setDishVideoPreview] = useState(null);

  const [nutrients, setNutrients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);

  const [directions, setDirections] = useState([
    { heading: "", description: "", imageFile: null, imagePreview: null, existingPublicId: null }
  ]);


  const [category, setCategory] = useState("");
  console.log(category);
  const [cuisine, setCuisine] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [prepTimeUnit, setPrepTimeUnit] = useState("");

  const [cookTime, setCookTime] = useState("");
  const [cookTimeUnit, setCookTimeUnit] = useState("");

  const [servings, setServings] = useState(1);

  const [createdAt] = useState(new Date().toISOString());

  const [previewJSON, setPreviewJSON] = useState(null);


  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  console.log("Suggestion : ", suggestions, category);


  // Fetch categories if not loaded
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  // Fetch recipe if in edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      dispatch(getRecipe(id)).unwrap().catch(() => console.log("Recipe not found"));

    }
  }, [mode, id, dispatch]);

  // Populate form once recipe is fetched
  useEffect(() => {
    if (mode === "edit" && recipe && recipe._id === id) {
      setTitle(recipe.title || "");
      setDescription(recipe.description || "");
      setCategory(recipe.categoryId || "");
      setCuisine(recipe.cuisine || "");
      setPrepTime(recipe.prepTime?.value || "");
      setPrepTimeUnit(timeMap[recipe.prepTime?.unit] || "");
      setCookTime(recipe.cookTime?.value || "");
      setCookTimeUnit(timeMap[recipe.cookTime?.unit] || "");
      console.log(timeMap[recipe.cookTime?.unit]);

      setServings(recipe.servings || 1);
      setNutrients(recipe.nutrients || []);
      setIngredients(recipe.ingredients || []);
      setDirections(
        recipe.directions?.map((d) => ({
          heading: d.heading,
          description: d.description,
          imageFile: null, // user replace karega to yeh change hoga
          imagePreview: d.image?.url || null,
          existingPublicId: d.image?.public_id || null, // 🔑 important for backend
        })) || []
      );
      setTags(recipe.tags || []);
      setDishImagePreview(recipe.dishImage?.url || null);
      setDishMediaType(recipe.dishImage?.resource_type || "");
    }
  }, [mode, recipe, id]);


  // Tag Suggestion handler
  const handleSuggestTags = (e) => {
    const value = e.target.value;
    setTagInput(value);
    console.log("Tah Enter:", tagInput);

    if (value.length > 1) {
      dispatch(suggestTags(value)); // ✅ API call
    }
  };

  // Add tag manually
  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    dispatch(clearSuggestTag());
  };

  // Remove tag
  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

 



  // helpers for file previews
  const handleFilePreview = (file, setFile, setPreview) => {
    setFile(file);
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  // Nutriants handlers

  const addNutrient = () =>
    setNutrients((s) => [...s, { name: "", quantity: "", unit: "" }]);
  const removeNutrient = (i) =>
    setNutrients((s) => s.filter((_, idx) => idx !== i));
  const updateNutrient = (i, key, val) =>
    setNutrients((s) => s.map((itm, idx) => (idx === i ? { ...itm, [key]: val } : itm)));

  // Ingredients handlers
  const addIngredient = () =>
    setIngredients((s) => [...s, { name: "", quantity: "", unit: "" }]);
  const removeIngredient = (i) =>
    setIngredients((s) => s.filter((_, idx) => idx !== i));
  const updateIngredient = (i, key, val) =>
    setIngredients((s) => s.map((itm, idx) => (idx === i ? { ...itm, [key]: val } : itm)));

  // Directions handlerss
  const addDirection = () =>
    setDirections((s) => [...s, { heading: "", description: "", directionImages: null, imagePreview: null }]);
  const removeDirection = (i) =>
    setDirections((s) => s.filter((_, idx) => idx !== i));
  const updateDirection = (i, key, val) =>
    setDirections((s) => s.map((itm, idx) => (idx === i ? { ...itm, [key]: val } : itm)));
 const handleDirectionImage = (i, file) => {
  setDirections((s) =>
    s.map((itm, idx) => {
      if (idx !== i) return itm;
      if (!file) return { ...itm, imageFile: null, imagePreview: null };
      return { ...itm, imageFile: file, imagePreview: URL.createObjectURL(file) };
    })
  );
};


  const chooseFinalDishMedia = (type) => {
    setDishMediaType(type);
    setDishImage(null);
    setDishVideo(null);
    setDishImagePreview(null);
    setDishVideoPreview(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryObjectId", category);
    formData.append("cuisine", cuisine);
    formData.append("prepTime", JSON.stringify({ value: prepTime, unit: prepTimeUnit }));
    formData.append("cookTime", JSON.stringify({ value: cookTime, unit: cookTimeUnit }));
    formData.append("servings", servings);
    formData.append("nutrients", JSON.stringify(nutrients.filter(n => n.name.trim() !== "")));
    formData.append("ingredients", JSON.stringify(ingredients.filter(i => i.name.trim() !== "")));
    formData.append(
  "directions",
  JSON.stringify(
    directions.map((d, idx) => ({
      stepNumber: idx + 1,
      heading: d.heading,
      description: d.description,
      existingPublicId: d?.existingPublicId, // backend ko old image ka pata chale
    }))
  )
);
    formData.append("tags", JSON.stringify(tags.filter(Boolean)));

    if (dishImage) formData.append("dishImage", dishImage);
    if (dishVideo) formData.append("dishVideo", dishVideo);
    directions.forEach((d, i) => {
      if (d.imageFile) formData.append(`directionImages`, d.imageFile);
    });

    try {
      let res;
      if (mode === "edit" && id) {
        res = await dispatch(updateRecipe({ id, formData })).unwrap();
        toast.success(res?.message || "Recipe updated successfully");
      } else {
        res = await dispatch(addRecipe(formData)).unwrap();
        toast.success(res?.message || "Recipe added successfully");
      }
        navigate("/chef/all-recipes");

    } catch (error) {
      if (Array.isArray(error?.errors)) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error?.message || "Something went wrong");
      }
    }
  };


  return (
    <div className="max-w-4xl mx-auto sm:p-6 p-3 rounded-2xl border shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Add / Edit Recipe</h1>
        <div>
          {user && (
            <><img src={user?.profilePic?.url || "/profile/user.jpg"} alt="author" className="mt-2 h-15 w-15 object-cover rounded" />
              <label className="block font-medium text-center">{user?.username}</label></>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">


        <div>
          <label className="block font-medium">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Paneer Butter Masala"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 resize-none"
            placeholder="A creamy tomato-based paneer curry"
          />
        </div>


        {/* <div>

          <div className="flex items-center gap-2">
            <label className="block font-medium">Final Dish Media:</label>
            <button type="button" className="rounded-md px-3 py-1 bg-gray-400/60 cursor-pointer" onClick={() => chooseFinalDishMedia("image")}>Image</button>
            <button type="button" className="rounded-md px-4 py-1 bg-gray-400/60 cursor-pointer" onClick={() => chooseFinalDishMedia("video")}>Video</button>
          </div>
          {dishMediaType === "image" && <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setDishImage, setDishImagePreview)}
            className="mt-1 w-full border p-2 rounded-md"
          />}
          {dishMediaType === "video" && <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setDishVideo, setDishImagePreview)}
            className="mt-1 w-full border p-2 rounded-md"
          />}
          {dishImagePreview && dishMediaType === "image" && (
            <img src={dishImagePreview} alt="dish" className="mt-2 h-40 w-full object-cover rounded" />
          )}
          {dishImagePreview && dishMediaType === "video" && (
            <video src={dishImagePreview} alt="dish" className="mt-2 h-50 w-full object-cover rounded" ></video>
          )}
        </div> */}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="block font-medium">Final Dish Media:</label>
            <button
              type="button"
              className={`rounded-md px-3 py-1 ${dishMediaType === "image" ? "bg-blue-400 text-white" : "bg-gray-400/60"} cursor-pointer`}
              onClick={() => chooseFinalDishMedia("image")}
            >
              Image
            </button>
            <button
              type="button"
              className={`rounded-md px-4 py-1 ${dishMediaType === "video" ? "bg-blue-400 text-white" : "bg-gray-400/60"} cursor-pointer`}
              onClick={() => chooseFinalDishMedia("video")}
            >
              Video
            </button>
          </div>

          {/* Image Upload */}
          {dishMediaType === "image" && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setDishImage, setDishImagePreview)}
              className="w-full border p-2 rounded-md"
            />
          )}

          {/* Video Upload */}
          {dishMediaType === "video" && (
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFilePreview(e.target.files?.[0] ?? null, setDishVideo, setDishVideoPreview)}
              className="w-full border p-2 rounded-md"
            />
          )}

          {/* Image Preview */}
          {dishMediaType === "image" && dishImagePreview && (
            <img src={dishImagePreview} alt="dish preview" className="h-40 w-full object-cover rounded" />
          )}

          {/* Video Preview */}
          {dishMediaType === "video" && dishVideoPreview && (
            <video src={dishVideoPreview} controls className="h-48 w-full object-cover rounded" />
          )}
        </div>



        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Category</label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded w-full mt-1 px-3 py-2.5"
            >
              <option value="">Select Category</option>
              {categories && categories?.map((ct) => (
                <option value={ct._id} selected={ct?._id === category}>{ct.name}</option>
              ))}

            </select>

          </div>
          <div>
            <label className="block font-medium">Cuisine</label>
            <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="block font-medium" htmlFor="prepTime">Prep Time</label>
            <div className="border rounded px-3 py-1 gap-x-1 flex items-center">
              <input value={prepTime} type="number" id="prepTime" onChange={(e) => setPrepTime(e.target.value)} className="mt-1 w-full py-1 focus:outline-0" placeholder="15 min" />

              <select
                id="prepTimeUnit"
                value={prepTimeUnit}
                onChange={(e) => setPrepTimeUnit(e.target.value)}
                className="border p-2 bg-[#eee] rounded w-full"
              >
                <option value="">--Select Time Unit--</option>
                <option value="sec">Seconds</option>
                <option value="min">Minutes</option>
                <option value="h">Hours</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium" htmlFor="cookTime">Cook Time</label>
            <div className="border rounded px-3 py-1 gap-x-1 flex items-center">
              <input value={cookTime} type="number" id="cookTime" onChange={(e) => setCookTime(e.target.value)} className="mt-1 w-full py-1 focus:outline-0" placeholder="30 min" />

              <select
                value={cookTimeUnit}
                onChange={(e) => setCookTimeUnit(e.target.value)}
                className="border-0 p-2 focus:outline-0 bg-[#eee] rounded"
              >
                <option value="">--Time--</option>
                <option value="sec">seconds</option>
                <option value="min">minutes</option>
                <option value="h">hours</option>

              </select>
            </div>

          </div>
          <div>
            <label className="block font-medium">Servings</label>
            <input type="number" min={1} value={servings} onChange={(e) => setServings(Number(e.target.value))} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block font-medium">Tags</label>
          <div className="border rounded px-2 py-1 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 text-red-500 cursor-pointer">x</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={handleSuggestTags}
              onKeyDown={(e) => e.key === "Enter" && addTag(tagInput)}
              className="flex-1 outline-none px-1"
              placeholder="Type and press Enter"
            />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="border rounded mt-1 bg-white max-h-40 overflow-y-auto">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => addTag(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Nutritional Info</h2>
          {nutrients.map((nut, i) => (
            <div key={i} className="sm:flex-row  items-center justify-between flex-col  space-y-2  mb-2">
              <input value={nut.name} onChange={(e) => updateNutrient(i, "name", e.target.value)} placeholder="Nutrient name" className="flex-1 border rounded px-3 py-2" />
              <input value={nut.quantity} type="number" onChange={(e) => updateNutrient(i, "quantity", e.target.value)} placeholder="Quantity(eg. 200cal)" className="flex-1  border rounded px-3 py-2 sm:m-1" />
              <select
                value={nutrients.unit}
                onChange={(e) => updateNutrient(i, "unit", e.target.value)}
                className="border p-2.5 m-1 rounded "
              >
                <option value="">--unit--</option>
                {nutrientMap?.map((n, i) => (
                  <option key={i} value={n} selected={n === nut?.unit}>{n}</option>
                ))}
              </select>
              <button type="button" onClick={() => removeNutrient(i)} className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded">Remove</button>

            </div>
          ))}
          <button type="button" onClick={addNutrient} className="px-4 py-2 bg-green-600 text-white cursor-pointer rounded">+ Add Ingredient</button>
        </section>

        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          {ingredients.map((ing, i) => (
            <div key={i} className="sm:flex-row  items-center justify-between flex-col  space-y-2  mb-2">
              <input value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)} placeholder="Ingredient name" className="flex-1 border rounded px-3 py-2" />
              <input value={ing.quantity} type="number" onChange={(e) => updateIngredient(i, "quantity", e.target.value)} placeholder="Quantity(eg. 200g)" className="flex-1  border rounded px-3 py-2 sm:m-1" />
              <select
                value={ingredients.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                className="border p-2.5 m-1 rounded "
              >
                <option value="">--unit--</option>
                {ingredientMap?.map((n, i) => (
                  <option key={i} value={n} selected={n === ing?.unit}>{n}</option>
                ))}
              </select>
              <button type="button" onClick={() => removeIngredient(i)} className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded">Remove</button>

            </div>
          ))}
          <button type="button" onClick={addIngredient} className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded">+ Add Ingredient</button>
        </section>

        {/* Directions  */}
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Directions / Steps</h2>
          {directions.map((d, i) => (
            <div key={i} className="border rounded sm:p-4 p-2 mb-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Step {i + 1}</h3>
                <button type="button" onClick={() => removeDirection(i)} className="px-2 cursor-pointer py-1 bg-red-500 text-white rounded">Remove</button>
              </div>
              <input value={d.heading} onChange={(e) => updateDirection(i, "heading", e.target.value)} placeholder="Heading (optional)" className="w-full border rounded px-3 py-2 mb-2" />
              <textarea rows={5} value={d.description} onChange={(e) => updateDirection(i, "description", e.target.value)} placeholder="Description" className="w-full border rounded px-3 py-2 mb-2" />
              <div>
                <label className="block">Step Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => handleDirectionImage(i, e.target.files?.[0] ?? null)} className="mt-1 border py-2 px-1 w-fit rounded-md" />
                {d.imagePreview && <img src={d.imagePreview} alt={`step-${i}`} className="mt-2 h-36 w-full object-cover rounded" />}
              </div>
            </div>
          ))}
          <button type="button" onClick={addDirection} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">+ Add Step</button>
        </section>



        <div className="flex gap-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded cursor-pointer">Save Recipe</button>
          <button type="button" onClick={() => {
            // reset form quickly
            setTitle(""); setShortInfo("");
            setDishImage(null); setDishVideo(null); setDishImagePreview(null); setNutrients({ calories: "", totalFat: "", protein: "", carbohydrates: "", cholesterol: "" });
            setIngredients([{ name: "", quantity: "", unit: "" }]); setDirections([{ heading: "", description: "", imageFile: null, imagePreview: null }]); setCategory(""); setCuisine(""); setPrepTime(""); setCookTime(""); setServings(1); setTags(""); setPreviewJSON(null);
          }} className="px-6 py-2 bg-gray-300 rounded cursor-pointer">Reset</button>
        </div>
      </form>

      {/* {previewJSON && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">JSON Preview</h2>
          <pre className="bg-black text-white p-4 rounded max-h-96 overflow-auto">{JSON.stringify(previewJSON, null, 2)}</pre>
        </div>
      )} */}

    </div>
  );
}




// const formData = new FormData();
// formData.append("title", title);
// formData.append("description", description);
// formData.append("category", category);
// formData.append("cuisine", cuisine);
// formData.append("nutrients", {
//   calories: nutrients.calories,
//   totalFat: nutrients.totalFat,
//   protein: nutrients.protein,
//   carbohydrates: nutrients.carbohydrates,
//   cholesterol: nutrients.cholesterol,
// });
// formData.append("ingredients", ingredients.filter((ing) => ing.name.trim() !== ""));
// formData.append("directions", directions.map((d, idx) => ({
//   stepNumber: idx + 1,
//   heading: d.heading,
//   description: d.description,
//   directionImages: d.imageFile ? d.imageFile.name : null,
// })));
// formData.append("dishImage", dishImage ? dishImage.name : null);
// formData.append("dishVideo", dishVideo ? dishVideo.name : null);
// formData.append("prepTime", `${prepTime}${prepTimeUnit}`);
// formData.append("cookTime", `${cookTime}${cookTimeUnit}`);
// formData.append("servings", servings);
// formData.append("tags", tags
//   .map((t) => t.trim())
//   .filter(Boolean));