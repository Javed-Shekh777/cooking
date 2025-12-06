import React from 'react';

const teams = [
    { id: 1, url: "./profile/Ellipse 2 (4).jpg", name: "Anjali Verma", designation: "Pastry Chef" },
    { id: 2, url: "./profile/Ellipse 2 (3).jpg", name: "Ravi Kapoor", designation: "Grill Master" },
    { id: 3, url: "./profile/Ellipse 2 (1).jpg", name: "Meera Singh", designation: "Food Blogger" },
    { id: 4, url: "./profile/Ellipse 2 (4).jpg", name: "Arjun Das", designation: "Recipe Curator" },
    { id: 5, url: "./profile/Ellipse 2 (5).jpg", name: "Neha Sharma", designation: "Nutritionist" },
    { id: 6, url: "./profile/Ellipse 2 (3).jpg", name: "Karan Mehta", designation: "Sous Chef" },
    { id: 7, url: "./profile/Ellipse 2 (1).jpg", name: "Priya Nair", designation: "Culinary Instructor" },
    { id: 8, url: "./profile/Ellipse 2 (4).jpg", name: "Amit Joshi", designation: "Food Photographer" },
    { id: 9, url: "./profile/Ellipse 2 (5).jpg", name: "Sneha Kulkarni", designation: "Recipe Developer" },
    { id: 10, url: "./profile/Ellipse 2 (3).jpg", name: "Rahul Bhatia", designation: "Kitchen Manager" },
    { id: 11, url: "./profile/Ellipse 2 (1).jpg", name: "Divya Rao", designation: "Home Chef" },
    { id: 12, url: "./profile/Ellipse 2 (4).jpg", name: "Manish Patel", designation: "Food Critic" },
    { id: 13, url: "./profile/Ellipse 2 (5).jpg", name: "Isha Malhotra", designation: "Baking Expert" },
    { id: 14, url: "./profile/Ellipse 2 (3).jpg", name: "Siddharth Jain", designation: "Catering Specialist" },
    { id: 15, url: "./profile/Ellipse 2 (1).jpg", name: "Tanya Bhargava", designation: "Vegan Chef" },
];


const About = () => {
    return (
        <div className="max-w-screen-xl mx-auto ">
            <div className="w-full sm:px-10 px-5 mx-auto border-b border-b-[rgba(0,0,0,0.2)] py-14">

                {/* <!-- Main Heading --> */}
                <h1 class="sm:text-4xl text-3xl font-bold  mb-2 w-full">About</h1>
                <hr class="border-t-2 border-gray-300 w-24  mb-10" />

                {/* <!-- Big Heading + Image + Description --> */}
                <div class=" mb-16">
                    <h2 class="md:text-6xl text-[35px] md:leading-[80px] mb-4 font-semibold">We're group of foodies who love cooking and the internet</h2>
                    <img src="./reciepies/image 26 (1).jpg" alt="Cooking" class="mx-auto rounded-xl shadow-md mb-6 w-full h-[450px] object-cover" />
                    <p class="text-gray-700 max-w-3xl  text-lg leading-relaxed">
                        We believe food is more than just sustenance — it's a celebration of culture, creativity, and connection.
                        Our mission is to bring you the best recipes, tips, and inspiration from kitchens around the world.
                    </p>
                </div>

                {/* <!-- Left Text + Right Image Section --> */}
                <div class="flex flex-col lg:flex-row gap-10 mb-16">
                    <div class="lg:w-1/2">
                        <h3 class="sm:text-5xl text-4xl font-semibold mb-4">Simple, Easy Recipes for all</h3>
                        <p class="text-gray-700 text-lg leading-relaxed">
                            From humble beginnings to a thriving community of food lovers, our journey has been fueled by passion and flavor.
                            We’ve curated thousands of recipes, hosted cooking challenges, and built a space where chefs and foodies unite.
                        </p>
                    </div>
                    <div class="lg:w-1/2">
                        <img src="./reciepies/image 26 (3).jpg" alt="Chef" class="rounded-xl shadow-md w-full" />
                    </div>
                </div>

                {/* <!-- Talented Chefs Heading --> */}
                <h3 class="sm:text-6xl text-4xl font-semibold sm:leading-[80px] leading-[45px]  mb-10">
                    An incredible team of talented chefs and foodies
                </h3>

                {/* <!-- Team Section --> */}
                <div class="grid grid-cols-2 sm:grid-cols-4   xl:grid-cols-6 sm:gap-8 gap-5 ">
                    {teams?.map((t) => (
                        <div key={t.id} className='rounded hover:shadow-xl py-2'>
                            <img src={t.url || "./profile/Ellipse 2 (5).jpg"} alt="Chef" class="sm:w-36 sm:h-36 w-28 h-28 mx-auto rounded-full object-cover mb-3" />
                            <h4 class="font-semibold text-center">{t.name}</h4>
                            <p class="text-sm text-gray-500 text-center">{t.designation}</p>
                        </div>
                    ))}




                </div>
            </div>
        </div>

    )
}

export default About
