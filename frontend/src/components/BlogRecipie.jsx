import React from 'react';
import { RiArrowRightWideLine } from 'react-icons/ri'

export const BlogRecipie = () => {
    return (
        <div className="recipGroup items-center xl:flex-row flex-col flex gap-x-6 gap-y-3 sm:px-5 py-3">
            <div className="leftGroup xl:w-auto w-full">
                <img src="/reciepies/image 26.jpg" alt="" className='rounded-2xl h-full w-full' />
            </div>
            <div className="rightGroup lg:w-auto w-full flex flex-col gap-y-2.5 ">
                <h3 className='text-2xl font-semibold'>Crochet Projects for Noodle Lovers</h3>
                <p className='text-[17px]'>Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim </p>
                <div className="formWrapper flex  items-center flex-row     ">
                    <div className="flex    items-center gap-x-3 mr-5  ">
                        <img src="/profile/Ellipse2.jpg" alt="" className="image" />
                        <span className='whitespace-nowrap'>John Smith</span>
                    </div>
                    <div className=" px-5 border-l-2 border-l-[rgba(0,0,0,0.1)]">
                        <p className='whitespace-nowrap'>15 March 2022</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const TastyRecipie = () => {
    return (
        <div className="flex xl:items-center xl:flex-row flex-col  xl:gap-x-6 gap-y-3  py-3">
            <div className="leftGroup lg:w-auto w-full">
                <img src="/reciepies/image 26.jpg" alt="" className='rounded-2xl w-full h-full' />
            </div>
            <div className="rightGroup">
                <h3 className='text-xl font-semibold'>Chicken Meatballs with Cream Cheese </h3>
                <p className='mt-2 lg:text-left sm:text-center '>By Henri</p>

            </div>
        </div>
    );
}


export const Pagination = () => {
    return (
        <div className="paginations flex items-center gap-x-4">
            <div className="buttons h-[40px] w-[40px] flex items-center justify-center text-xl rounded-md border cursor-pointer">1</div>
            <div className="buttons h-[40px] w-[40px] flex items-center justify-center text-xl rounded-md border cursor-pointer">2</div>
            <div className="buttons h-[40px] w-[40px] flex items-center justify-center text-xl rounded-md border cursor-pointer">3</div>
            <div className="buttons">...</div>
            <div className="buttons h-[40px] w-[40px] flex items-center justify-center text-xl rounded-md border cursor-pointer">
                <RiArrowRightWideLine />
            </div>
        </div>
    );
}