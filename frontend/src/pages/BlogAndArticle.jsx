import React from 'react';
import { FaBars, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";
import MailBox from '../components/MailBox';
import { BlogRecipie, Pagination, TastyRecipie } from '../components/BlogRecipie';


const BlogAndArticle = () => {
    const recipes = [
        {
            id: 1,
            imgUrl: "reciepies/resp1.jpg",
            isLiked: true,
            title: "Big and Juicy Wagyu Beef Cheeseburger",
            type: "Breakfast",
            time: "30 Minutes"
        },
        {
            id: 2,
            imgUrl: "reciepies/resp2.jpg",
            isLiked: false,
            title: "Fresh Lime Roasted Salmon with Ginger Sauce",
            type: "Fish",
            time: "30 Minutes"
        },
        {
            id: 3,
            imgUrl: "reciepies/resp3.jpg",
            isLiked: false,
            title: "Strawberry Oatmeal Pancake with Honey Syrup",
            type: "Breakfast",
            time: "30 Minutes"
        },
        {
            id: 4,
            imgUrl: "reciepies/resp4.jpg",
            isLiked: true,
            title: "Fresh and Healthy Mixed Mayonnaise Salad",
            type: "Healthy",
            time: "30 Minutes"
        },

    ]

    return (

       <section>
  <div className="blogWrapper px-4 md:px-8 py-20">
    {/* Header Section */}
    <div className="flex flex-col items-center justify-center gap-y-5 mb-14 text-center">
      <h1 className="text-5xl font-semibold">Blog & Article</h1>
      <hr className="border-t-2 border-gray-300 w-80 mx-auto" />
      <p className="max-w-2xl text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
      </p>
    </div>

    {/* Blog Content */}
    <div className="text-gray-700 leading-relaxed space-y-6 text-justify max-w-5xl mx-auto mb-10">
      <p>
        Cooking is more than just preparing meals — it's a form of expression, a way to connect with culture and creativity. Whether you're a seasoned chef or a curious beginner, the kitchen is a place where magic happens.
      </p>
      <p>
        In this post, we explore how ingredients, techniques, and personal flair come together to create unforgettable dishes. From the sizzle of spices to the aroma of fresh herbs, every detail matters.
      </p>
      <p>
        Join us as we dive into the stories behind recipes, the science of taste, and the joy of sharing food with loved ones.
      </p>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-3 justify-center text-sm mb-10">
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">#Cooking</span>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">#Flavor</span>
      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">#FoodCulture</span>
    </div>

    {/* Search Form */}
    <div className="formWrapper z-20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-y-0 xl:w-[50%] w-full mx-auto border border-gray-200 bg-white rounded-3xl p-3 mb-20">
      <input
        type="text"
        placeholder="Search article, news or recipe..."
        className="w-full p-2 outline-none border-none"
      />
      <button className="bg-black text-white px-10 py-3 rounded-2xl shadow hover:bg-gray-800 transition">
        Search
      </button>
    </div>

    {/* Blog Recipes Section */}
    <div className="recipes my-20">
      <div className="recipesWrapper">
        <div className="top flex flex-col sm:flex-row gap-10">
          {/* Left: Blog Recipes */}
          <div className="left lg:w-[70%] w-full">
            <div className="leftWrapper flex flex-col gap-y-6">
              {[1, 2, 3, 4].map((_, i) => (
                <BlogRecipie key={i} />
              ))}
            </div>
          </div>

          {/* Right: Tasty Recipes */}
          <div className="right lg:w-[30%] w-full">
            <div className="rightWrapper">
              <h2 className="text-3xl font-semibold mb-5">Tasty Recipes</h2>
              <div className="flex flex-col gap-y-10">
                {[1, 2, 3].map((_, i) => (
                  <TastyRecipie key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="bottom pagination mt-10 flex items-center justify-center">
          <Pagination />
        </div>
      </div>
    </div>

    {/* Mailbox Section */}
    <MailBox />
  </div>
</section>




    )

}

export default BlogAndArticle
