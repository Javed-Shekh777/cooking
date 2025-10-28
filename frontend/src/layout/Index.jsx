import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Category from '../components/CategoryCard'
import Contact from '../pages/Contact'
import { Outlet } from 'react-router-dom'

const Index = () => {
  return (
   <div className="">
    <Navbar />
    {/* Pages or sections  */}
    {/* <Category /> */}
    {/* <Contact /> */}
    <Outlet />
    <Footer />
   </div>
  )
}

export default Index
