import { NavLink, useLocation } from "react-router-dom";




const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();

  const links = [

    { name: "Dashboard", path: "/admin", isActive: pathname === "/admin/" },
    { name: "Recipes", path: "/admin/recipes", isActive: pathname === "/admin/recipes" },
    { name: "Requests", path: "/admin/requests", isActive: pathname === "/admin/requests" },
    { name: "Audit Logs", path: "/admin/auditlog", isActive: pathname === "/admin/auditlog" },
    { name: "Users", path: "/admin/users", isActive: pathname === "/admin/users" },
    // Add more links if needed
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed h-full inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-xl font-bold p-6 border-b">Admin Panel</h2>
        <nav className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100%-5rem)]">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // close sidebar on mobile
              className={({ isActive }) =>
                `p-2 rounded ${link.isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );

}
export default Sidebar;
