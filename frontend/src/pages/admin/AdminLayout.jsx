import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* <Topbar /> */}
        {/* <main className="p-6">{children}</main> */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
