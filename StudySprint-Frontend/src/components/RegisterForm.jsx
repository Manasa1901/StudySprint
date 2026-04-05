import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

const RegisterForm = ({ darkMode, setDarkMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", { name, email, password });
      
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-xl shadow-md w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"} ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-blue-600"}`}>
          Register
        </h2>

        {error && (
          <p className={`text-center mb-4 ${darkMode ? "text-red-400 bg-red-900/30" : "text-red-500"} p-2 rounded`}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block mb-2 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" : "border-gray-300"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block mb-2 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" : "border-gray-300"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block mb-2 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" : "border-gray-300"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block mb-2 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" : "border-gray-300"}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg disabled:opacity-50 transition font-medium ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className={`text-sm text-center mt-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className={`font-medium hover:underline ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
