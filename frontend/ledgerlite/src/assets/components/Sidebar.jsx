import { NavLink } from "react-router-dom";
import { Home, List, BarChart2, Settings, User, FileText } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/transactions", label: "Transactions", icon: <List size={20} /> },
    { to: "/registers", label: "Registers", icon: <FileText size={20} /> },
    { to: "/reports", label: "Reports", icon: <BarChart2 size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
    { to: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <aside className="w-64 bg-marine-700 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="p-4 text-2xl font-bold border-b border-marine-500">
        LedgerLite
      </div>
      <nav className="flex-1 p-4 space-y-3">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-marine-500 font-semibold" : "hover:bg-marine-600"
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
