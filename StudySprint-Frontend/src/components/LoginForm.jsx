import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import api from "../api/axios";

const LoginForm = ({ onLogin, darkMode, setDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Please enter email and password"); return; }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      if (remember) localStorage.setItem("token", res.data.token);
      else sessionStorage.setItem("token", res.data.token);
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

  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-slate-50"}`}>
      <div className={`w-full max-w-md transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        {/* Card */}
        <div className={`rounded-2xl shadow-xl border overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>StudySprint</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
                  darkMode ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                }`}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>

            <h2 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>Welcome back</h2>
            <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sign in to continue your study session</p>

            {error && (
              <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 ${
                darkMode ? "bg-red-900/30 text-red-400 border border-red-800/40" : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</label>
                <input type="email" placeholder="you@example.com" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className={inputCls}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className={`inline-flex items-center gap-2 text-sm cursor-pointer ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded" />
                  Remember me
                </label>
                <button type="button" onClick={() => navigate("/register")} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                  Create account
                </button>
              </div>

              <button
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
