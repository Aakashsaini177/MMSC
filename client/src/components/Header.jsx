import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSearch,
  FaMoon,
  FaSun,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeProvider";
import api from "../api";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setLoading(true);
        setShowResults(true);
        try {
          const { data } = await api.get(`/search?q=${searchQuery}`);
          setSearchResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (link) => {
    navigate(link);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between backdrop-blur-xl border-b px-6 py-4 shadow-sm transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--bg-accent)",
        color: "var(--text-primary)",
      }}
    >
      {/* Left: Toggler & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-600 dark:text-gray-300 lg:hidden hover:text-brand-primary transition-colors focus:outline-none"
        >
          <FaBars />
        </button>
        <div className="hidden sm:block">
          <h2
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Dashboard
          </h2>
          <p
            className="text-xs font-medium tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Overview
          </p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl px-8 hidden md:block" ref={searchRef}>
        <div className="relative group">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            placeholder="Search clients, invoices, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm rounded-2xl py-3 pl-12 pr-10 outline-none transition-all shadow-sm focus:shadow-md"
            style={{
              backgroundColor: "var(--bg-accent)",
              color: "var(--text-primary)",
              borderColor: "transparent",
            }}
          />
          {loading && (
            <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary animate-spin" />
          )}
          {searchQuery && !loading && (
            <FaTimes
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
            />
          )}

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="max-h-80 overflow-y-auto no-scrollbar">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.link)}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-50 dark:border-slate-700 last:border-none flex justify-between items-center group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-primary transition-colors">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-400">
                        {result.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400 rounded-md">
                      {result.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showResults &&
            searchQuery.length > 1 &&
            searchResults.length === 0 &&
            !loading && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 text-center text-gray-500 dark:text-slate-400 text-sm animate-in fade-in">
                No results found for "{searchQuery}"
              </div>
            )}
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-gray-400 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-lightest/50 dark:hover:bg-slate-800 transition-all transform hover:rotate-12 focus:outline-none"
          title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}
        >
          {isDarkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-full text-gray-400 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-lightest/50 dark:hover:bg-slate-800 transition-all group focus:outline-none">
          <FaBell className="text-xl group-hover:swing" />
          <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-6 sm:border-l border-gray-100 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">
              {user?.username || "Admin User"}
            </p>
            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
              {user?.role || "Super Admin"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-700 shadow-md cursor-pointer hover:ring-brand-primary/20 transition-all overflow-hidden bg-gradient-to-tr from-brand-primary to-blue-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
