import React, { useEffect, useState } from 'react'
import Sidemenu from './Sidemenu'
import { Outlet } from 'react-router-dom'
import Spinner from '../../../components/Spinner';

const ChefLayout = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => { setLoading(false) }, 1000);
    })
    return (
        <section className='flex   w-full  '>
            <Sidemenu />
            <div className="relative lg:ml-64 sm:ml-52 ml-0 sm:p-5 p-3 w-full">
                {loading ? <Spinner /> : <Outlet />}
            </div>
        </section>
    )
}

export default ChefLayout
