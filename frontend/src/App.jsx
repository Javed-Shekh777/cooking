import { Outlet } from "react-router-dom";
import Index from "./layout/MainLayout";
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

