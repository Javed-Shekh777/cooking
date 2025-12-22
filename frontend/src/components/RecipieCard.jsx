import { FaHeart, FaStopwatch } from "react-icons/fa6";
import { PiForkKnifeBold } from "react-icons/pi";
import {  FaStar} from 'react-icons/fa';


const RecipieCard = ({ link="#",imgUrl, isLiked, title, cookTime, prepTime, difficultyLevel,avgRating,showRating=false }) => {

    return (
        <a href={link} className="group cursor-pointer relative rounded-3xl overflow-hidden px-3.5
        pt-2 pb-7  "
            style={{
                background: `linear-gradient(180deg, rgba(231, 249, 253, 0) 0%, #E7F9FD 100%)`
            }}
        >
            {/* Image */}
            <div className="relative flex aspect-square sm:aspect-[5/3] overflow-hidden">
                <img
                    src={imgUrl}
                    alt={`${title} Recipe`}
                    className="rounded-xl duration-300 w-full h-full 
                  object-cover transform hover:scale-105 transition-transform"
                />
                <div className="likeBox absolute right-6 top-6 h-[40px] w-[40px] rounded-full flex items-center justify-center bg-white shadow-md">
                    <FaHeart
                        style={{ color: isLiked ? '#FF0000' : '#DBE2E5' }}
                        className={`inline-block`}
                        size={20}
                    />
                </div>
            </div>

            {/* Title */}
            <div className="mt-4">
                {/* <div className="flex items-center gap-x-1.5">{[1,2,3,4,5].map((starIndex) => (<FaStar size={20} className="text-yellow-400 inline-block mb-2" />))}</div> */}

                <h3 className='title text-xl sm:w-[80%] w-full'>{title}</h3>
                {difficultyLevel && <span className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full font-medium">
                    ⚙️ {difficultyLevel}
                </span>}
                {showRating && <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="text-yellow-400 hover:scale-110 transition-transform"
                        >
                            <FaStar
                                size={24}
                                // ✅ local 'rating' state की जगह currentUserRating का उपयोग करें
                                className={star <= avgRating ? "fill-yellow-500" : "fill-gray-300"}
                            />
                        </button>
                    ))}
                </div>}
                <div className="flex items-center gap-x-3.5 mt-3">
                    <div className="time flex items-center gap-x-1">
                        <FaStopwatch size={16} />
                        <span>{prepTime?.value}{prepTime?.unit}</span>
                    </div>
                    <div className="type flex items-center gap-x-1"><PiForkKnifeBold size={16} className='font-bold' /><span>{cookTime?.value}{cookTime?.unit}</span></div>
                </div>
            </div>
        </a>
    );
}

export default RecipieCard
