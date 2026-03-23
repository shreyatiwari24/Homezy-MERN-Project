import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, collapsed }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-indigo-500 text-white shadow-md"
            : "text-gray-200 hover:bg-blue-700"
        }`
      }
    >
      <span className="text-lg">{item.icon}</span>

      {!collapsed && <span>{item.name}</span>}

      {/* Tooltip */}
      {collapsed && (
        <span className="absolute left-full ml-3 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          {item.name}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;