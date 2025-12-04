import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartLine,
  FaFolderOpen,
  FaTruck,
  FaShoppingCart,
  FaReceipt,
  FaBox,
  FaCog,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";

const Sidebar = ({ isOpen, close }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: FaTachometerAlt },
    { path: "/clients", name: "Clients", icon: FaUsers },
    { path: "/gst-filing", name: "GST Filing", icon: FaFileInvoiceDollar },
    { path: "/tax-returns", name: "Tax Returns", icon: FaChartLine },
    { path: "/documents", name: "Documents", icon: FaFolderOpen },
    { path: "/suppliers", name: "Suppliers", icon: FaTruck },
    { path: "/purchases", name: "Purchases", icon: FaShoppingCart },
    { path: "/sales", name: "Sales", icon: FaReceipt },
    { path: "/products", name: "Products", icon: FaBox },
    { path: "/inventory", name: "Inventory", icon: FaClipboardList },
    { path: "/settings", name: "Settings", icon: FaCog },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-brand-dark to-brand-primary text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="p-6 flex justify-center border-b border-white/10 cursor-pointer transition-all duration-500 ease-in-out hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1
            className={`font-extrabold text-transparent bg-clip-text bg-[linear-gradient(to_right,#F6B1CE,#1581BF,#FFD700,#3DB6B1,#CCE5CF,#F6B1CE)] animate-shine tracking-wider drop-shadow-sm transition-all duration-500 ease-in-out text-center ${
              isHovered ? "text-lg leading-tight" : "text-3xl"
            }`}
          >
            {isHovered ? "MAHAKAL MOBILE SERVICE CENTER RAMSER" : "MMSC"}
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close} // Close sidebar on mobile when link clicked
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-brand-lightest text-brand-primary shadow-lg shadow-brand-lightest/20 font-bold"
                    : "text-brand-lightest/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon
                  className={`text-lg transition-transform group-hover:scale-110 ${
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-lightest/60 group-hover:text-white"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-white/10 hover:text-red-200 transition-all duration-200 font-bold"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>

        <div className="p-4 text-center text-xs text-slate-500">
          &copy; 2025 MMSC System
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
