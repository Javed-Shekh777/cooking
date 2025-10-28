import { Outlet } from "react-router-dom";
import Index from "./layout";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import {Toaster} from "react-hot-toast"



function App() {

  return (
    <>
      {/* <Index /> */}
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  )
}

export default App

