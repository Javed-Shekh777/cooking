import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RoleGuard = ({ allowedRoles }) => {
    const { user, authChecked } = useSelector((state) => state.auth);
    console.log(user, authChecked);

    if ((!authChecked || !user) || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
