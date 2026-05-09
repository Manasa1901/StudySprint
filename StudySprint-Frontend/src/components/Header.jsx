import { Link } from "react-router";

const Header = ({ user, onLogout, darkMode, setDarkMode, onProfileOpen }) => {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className={`sticky top-0 z-40 px-6 py-3 flex justify-between items-center backdrop-blur-md border-b transition-colors duration-300 ${
      darkMode ? "bg-gray-900/80 border-gray-700/60" : "bg-white/80 border-gray-200/60"
    } shadow-sm`}>

      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
          </svg>
        </div>
        <span className={`text-lg font-bold tracking-tight transition-colors ${
          darkMode ? "text-white group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600"
        }`}>
          StudySprint
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            darkMode ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <Link
              to="/planner"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Planner
            </Link>

            {/* Avatar button → opens profile sidebar */}
            <button
              onClick={onProfileOpen}
              title="View profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow hover:shadow-md hover:scale-105 transition-all"
            >
              {initials}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm"
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
