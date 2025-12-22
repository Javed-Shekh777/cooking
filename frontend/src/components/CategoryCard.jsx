import React from 'react';
import { Link } from 'react-router-dom';
import { FaStopwatch, FaHeart } from "react-icons/fa6";
// import ChefImage from "profile/male-chef.jpg";
import {
    PiForkKnifeBold

} from 'react-icons/pi';
 


 



const CategoryCard = ({ title, url, bgColor }) => {

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex?.slice(1, 3), 16);
        const g = parseInt(hex?.slice(3, 5), 16);
        const b = parseInt(hex?.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    };

    const gradient = `linear-gradient(180deg, ${hexToRgba(bgColor, 0)} 0%, ${hexToRgba(bgColor, 0.1)} 100%)`;
    return (
        <div
            // flex flex-col items-center justify-end
            className="group hover:shadow-2xl duration-300 transition-all cursor-pointer relative rounded-3xl overflow-hidden
     w-full min-w-[180px] h-[220px] sm:h-[250px] md:h-[280px] aspect-square flex flex-col items-center justify-end">
            {/* Background gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{ background: gradient, filter: "brightness(0.95) contrast(1.2)" }}
            ></div>

            {/* Image */}
            <div className="absolute top-2 flex justify-center w-full">
                <img
                    src={url}
                    alt={title}
                    className="object-contain h-fit sm:h-24 md:h-28 lg:h-32   z-50 
                     mix-blend-multiply group-hover:scale-90 transition-all
                      duration-300"
                    style={{ background: "transparent", filter: "brightness(1.1)" }}
                />
                <img
                    src={url}
                    alt={`${title} reflection`}
                    className="  object-contain h-fit
                     sm:h-24 md:h-28 lg:h-32 opacity-30 absolute top-10"
                    style={{
                        transform: "scaleY(-1)",
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)"
                    }}
                />
            </div>

            {/* Title */}
            <p className="z-10 mb-3 text-black font-bold">{title}</p>
        </div>
    );
};

export default CategoryCard







//  style={{
// background: `linear-gradient(180deg, rgba(112, 130, 70, 0) 0%, rgba(112, 130, 70, 0.1) 100%)`
// background: linear-gradient(180deg, rgba(108, 198, 63, 0) 0%, rgba(108, 198, 63, 0.1) 100%)
// background: linear-gradient(180deg, rgba(204, 38, 27, 0) 0%, rgba(204, 38, 27, 0.1) 100%)
// background: linear-gradient(180deg, rgba(240, 158, 0, 0) 0%, rgba(240, 158, 0, 0.1) 100%)
// background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%)
// background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%
// }}

/* Rectangle 8 */



