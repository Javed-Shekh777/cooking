import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6'

const Footer = () => {
    return (
        <footer>
            <div className="footerWrapper md:px-8 px-4 md:py-5 py-3.5">
                <div className="footerTop py-4 flex sm:flex-row flex-col  items-center  flex-wrap justify-between border-b-[#E4E6F1] border-b">
                    <div className=" inline">
                        <a href="" className='text-3xl sm:text-left text-center font-bold whitespace-nowrap'>Foodie<span className='text-[#FF7426] inline-block '>.</span></a>
                        <p className='mt-2.5'>Lorem ipsum dolor sit amet.</p>
                    </div>
                    <ul className="menu flex  flex-wrap items-center gap-x-6  mt-5 font-medium whitespace-nowrap">
                        <li className="memuItem px-2 py-2  hover:underline hover:text-[#FF7967] duration-300 transition-all"><a href="/">Home</a></li>
                        <li className="memuItem px-3 py-2  hover:underline hover:text-[#FF7967] duration-300 transition-all"><a href="/recipie">Recipes</a></li>
                        <li className="memuItem px-2 py-2  hover:underline hover:text-[#FF7967] duration-300 transition-all"><a href="/blog">Blog</a></li>
                        <li className="memuItem px-2 py-2  hover:underline hover:text-[#FF7967] duration-300 transition-all"><a href="/contact">Contact</a></li>
                        <li className="memuItem px-2 py-2  hover:underline hover:text-[#FF7967] duration-300 transition-all"><a href="">About us</a></li>
                    </ul>
                </div>
                <div className="footerBottom py-4 flex flex-wrap items-center justify-between">
                    <div className="md:block hidden"></div>
                    <p className=''>&copy; 2020 Flowbase. Powered by <span className='text-[#FF7426] inline-block '>Webflow</span></p>
                    <div className="items-center gap-3 flex">
                        <FaFacebookF className='h-[30px] w-[30px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                        <FaTwitter className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                        <FaInstagram className='h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] duration-300 transition-colors cursor-pointer' size={20} />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
