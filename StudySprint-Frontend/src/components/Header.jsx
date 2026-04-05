import { Link } from "react-router";
import { useState, useEffect } from "react";

const Header = ({ user, onLogout, darkMode, setDarkMode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className={`transition-colors duration-300 px-6 py-4 flex justify-between items-center ${darkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-md"}`}>
      
      {/* Logo → Home */}
      <Link to="/" className="flex items-center gap-2">
        <span className={`text-2xl font-bold hover:opacity-90 cursor-pointer ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}>
          StudySprint
        </span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-2 rounded-lg transition ${
            darkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <Link
              to="/planner"
              className={`px-4 py-1.5 rounded-lg transition ${
                darkMode
                  ? "text-gray-300 hover:text-blue-400"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Planner
            </Link>

            <span className={`hidden sm:block text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              {user?.email}
            </span>

            <button
              onClick={onLogout}
              className={`px-4 py-1.5 rounded-lg transition ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`px-4 py-1.5 rounded-lg transition ${
                darkMode
                  ? "text-gray-300 hover:text-blue-400"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`px-4 py-1.5 rounded-lg transition ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Register
            </Link>
          </>
        )}
      </div>

    </nav>
  );
};

export default Header;
