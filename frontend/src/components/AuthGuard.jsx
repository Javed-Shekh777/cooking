import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const { user, authChecked } = useSelector((state) => state.auth);

  // ⏳ wait until refresh check finishes
  if (!authChecked) {
    return <div>Loading...</div>; // or spinner
  }

  console.log(user);


  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }



  return <Outlet />;
};


export default AuthGuard;
