import { FaHeart, FaStopwatch } from "react-icons/fa6";
import { PiForkKnifeBold } from "react-icons/pi";

const RecipieCard = ({ url, isLiked, title, time, type }) => {
    return (
        <div className="group cursor-pointer relative rounded-3xl overflow-hidden px-3.5
        pt-2 pb-7  "
            style={{
                background: `linear-gradient(180deg, rgba(231, 249, 253, 0) 0%, #E7F9FD 100%)`
            }}
        >
            {/* Image */}
            <div className="relative  flex ">
                <img
                    src={url}
                    alt={`${title} Receipie`}
                    className="rounded-xl
                      duration-300 w-full"
                />
                <div className="likeBox absolute right-6 top-6
                 h-[40px] w-[40px] rounded-full flex items-center justify-center bg-white ">
                    <FaHeart style={{color:isLiked ? '#FF0000' : '#DBE2E5' }} className={`inline-block  `} size={20} />
                </div>
            </div>

            {/* Title */}
            <div className="mt-4">
                <h3 className='title text-xl sm:w-[80%] w-full'>{title}</h3>
                <div className="flex items-center gap-x-3.5 mt-3">
                    <div className="time flex items-center gap-x-1">
                        <FaStopwatch size={16} />
                        <span>{time}</span>
                    </div>
                    <div className="type flex items-center gap-x-1"><PiForkKnifeBold size={16} className='font-bold' /><span>{type}</span></div>
                </div>
            </div>
        </div>
    );
}

export default RecipieCard
