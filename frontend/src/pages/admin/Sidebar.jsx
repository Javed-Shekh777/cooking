import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/admin" },
  { name: "Recipes", path: "/admin/recipes" },
  // { name: "Categories", path: "/admin/categories" },
  { name: "Delete Requests", path: "/admin/delreq" },
  { name: "Audit Logs", path: "/admin/auditlog" },
];

const Sidebar = () => (
  <aside className="w-64 bg-white shadow-md">
    <h2 className="text-xl font-bold p-6 border-b">Admin Panel</h2>
    <nav className="flex flex-col gap-2 p-4">
      {links.map(link => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
