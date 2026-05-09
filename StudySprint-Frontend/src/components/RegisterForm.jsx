import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../api/axios";

const RegisterForm = ({ darkMode, setDarkMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) { setError("Please fill in all fields"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
    <div className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-slate-50"}`}>
      <div className={`w-full max-w-md transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className={`rounded-2xl shadow-xl border overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>
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

            <h2 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>Create account</h2>
            <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Start organizing your studies for free</p>

            {error && (
              <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 ${
                darkMode ? "bg-red-900/30 text-red-400 border border-red-800/40" : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Full Name", type: "text", placeholder: "Enter your Name", value: name, onChange: setName },
                { label: "Email", type: "email", placeholder: "you@example.com", value: email, onChange: setEmail },
                { label: "Password", type: "password", placeholder: "Create a password", value: password, onChange: setPassword },
                { label: "Confirm Password", type: "password", placeholder: "Repeat your password", value: confirmPassword, onChange: setConfirmPassword },
              ].map(({ label, type, placeholder, value, onChange }) => (
                <div key={label}>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={inputCls}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-md"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className={`text-sm text-center mt-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="font-medium text-blue-500 hover:text-blue-600" disabled={loading}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
