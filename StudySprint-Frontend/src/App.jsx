import { Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import Planner from "./components/Planner";
import ProfileSidebar from "./components/ProfileSidebar";
import api from "./api/axios";

const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("studysprintUser"))
  );

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Fetch stats when sidebar opens
  useEffect(() => {
    if (!profileOpen || !user) return;
    api.get("/subjects").then((res) => {
      const data = res.data.data || {};
      const subjects = Object.keys(data).length;
      const allTopics = Object.values(data).flat();
      const completed = allTopics.filter((t) => t.done).length;
      const total = allTopics.length;
      setStats({
        subjects,
        topics: total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }).catch(() => setStats(null));
  }, [profileOpen, user]);

  const handleLogin = (userData) => {
    localStorage.setItem("studysprintUser", JSON.stringify(userData));
    setUser(userData);
    toast.success("Logged in successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("studysprintUser");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    toast.info("Logged out");
  };

  const handleUserUpdate = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem("studysprintUser", JSON.stringify(merged));
    setUser(merged);
  };

  const sharedProps = { darkMode, setDarkMode, onProfileOpen: () => setProfileOpen(true) };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {profileOpen && user && (
        <ProfileSidebar
          user={user}
          onLogout={handleLogout}
          onClose={() => setProfileOpen(false)}
          onUserUpdate={handleUserUpdate}
          darkMode={darkMode}
          stats={stats}
        />
      )}

      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} {...sharedProps} />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} {...sharedProps} />} />
        <Route path="/register" element={<RegisterForm {...sharedProps} />} />
        <Route
          path="/planner"
          element={user ? <Planner user={user} onLogout={handleLogout} {...sharedProps} /> : <Navigate to="/login" />}
        />
        <Route
          path="/home"
          element={user ? <Home user={user} onLogout={handleLogout} {...sharedProps} /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default App;
