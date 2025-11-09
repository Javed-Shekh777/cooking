import React from 'react'

const MailBox = () => {
    return (
        <div className="bg-[#E7F9FD] relative rounded-4xl py-20 sm:mx-10 sm:px-5 px-2 flex items-center flex-col sm:gap-y-5 gap-y-10 no-print ">
            <h1 className='title text-4xl font-semibold text-center  relative z-20 '>Deliciousness to your inbox</h1>
            <p className='text-center sm:w-[50%] self-center  relative z-20'>Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim </p>

            <div className="form mt-4 relative z-20 sm:w-auto w-full shadow-2xl bg-white rounded-3xl
                         p-2.5">
                <div className="formWrapper flex items-center sm:flex-row flex-col sm:gap-y-0 gap-y-4
                        ">
                    <input type="text" placeholder='Your email address...' className='sm:mx-5 mx-10
                             p-2 outline-0 border-0 sm:w-auto w-full  ' />
                    <button className='text-white cursor-pointer bg-black px-10 py-3 rounded-2xl shadow'>Subscribe</button>
                </div>
            </div>

            <div className="images ">
                <img src="/contact/kisspng-salad-salad-fresh.jpg" alt="" className="image1 absolute bottom-0
                             left-0 mix-blend-multiply rounded-4xl" />
                <img src="/contact/rucola-png.jpg" alt="" className="image1 absolute bottom-16
                             right-64 mix-blend-multiply" />
                <img src="/contact/Photo-plate.png" alt="" className="image1 absolute bottom-0
                             right-0 mix-blend-multiply rounded-4xl" />
            </div>
        </div>
    )
}

export default MailBox
