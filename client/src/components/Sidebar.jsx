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
        className={`fixed inset-y-0 left-0 z-30 w-64 text-[var(--text-primary)] shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="h-24 px-4 flex flex-col items-center justify-center border-b cursor-pointer transition-all duration-300 group"
          style={{ borderColor: "var(--bg-accent)" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`transition-all duration-300 ease-in-out flex flex-col items-center justify-center ${
              isHovered ? "-translate-y-1" : ""
            }`}
          >
            <h1
              className="font-black tracking-tighter transition-all duration-300"
              style={{
                color: "var(--brand-primary)",
                fontSize: isHovered ? "2rem" : "2.5rem",
                textShadow: isHovered
                  ? "0 0 20px var(--brand-shimmer)"
                  : "none",
              }}
            >
              MMSC
            </h1>
            <p
              className={`text-center text-xs font-bold tracking-widest transition-all duration-300 overflow-hidden ${
                isHovered ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
              style={{ color: "var(--text-secondary)" }}
            >
              MAHAKAL MOBILE
              <br />
              SERVICE CENTER
            </p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close} // Close sidebar on mobile when link clicked
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "shadow-lg font-bold translate-x-1"
                    : "hover:bg-[var(--bg-accent)] hover:translate-x-1"
                }`}
                style={{
                  backgroundColor: isActive
                    ? "var(--brand-primary)"
                    : "transparent",
                  color: isActive ? "#fff" : "var(--text-primary)",
                }}
              >
                <item.icon
                  className={`text-xl transition-transform group-hover:scale-110`}
                  style={{ color: isActive ? "#fff" : "var(--text-primary)" }}
                />
                <span className="font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 font-bold group"
            style={{
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-accent)";
              e.currentTarget.style.color = "#ef4444"; // Red-500 for hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FaSignOutAlt className="text-lg group-hover:text-red-500 transition-colors" />
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
