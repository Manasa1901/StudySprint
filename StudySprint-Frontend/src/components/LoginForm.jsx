import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../api/axios";

const LoginForm = ({ onLogin, darkMode, setDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      // save token: persistent or session
      if (remember) localStorage.setItem("token", res.data.token);
      else sessionStorage.setItem("token", res.data.token);

      // set user in parent
      onLogin(res.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-xl shadow-md w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"} ${darkMode ? "bg-gray-900" : "bg-white"}`}>

        <h2 className={`text-2xl font-bold text-center mb-4 ${darkMode ? "text-blue-400 " : "text-blue-600"}`}>
          Login
        </h2>

        {error && (
          <p className={`text-center mb-4 ${darkMode ? "text-red-400" : "text-red-500"}`}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-lg transition ${darkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-white border-gray-300 text-black"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={`w-full px-4 py-2 border rounded-lg transition ${darkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-white border-gray-300 text-black"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className={`absolute right-2 top-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className={`inline-flex items-center text-sm ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm text-blue-600 hover:underline"
            >
              Register
            </button>
          </div>

          <button
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg transition ${loading ? "opacity-70" : "hover:bg-blue-600"}`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            <span>{loading ? "Signing in..." : "Login"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
