import { Outlet } from "react-router-dom";
import Index from "./layout/MainLayout";
import {Toaster} from "react-hot-toast"
import { useDispatch } from "react-redux";
import { refreshTokenApi } from "./features/authSlice";
import { useEffect } from "react";



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshTokenApi());
  }, []);


  return (
    <>
      {/* <Index /> */}
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  )
}

export default App

