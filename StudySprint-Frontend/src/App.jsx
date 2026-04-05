import { Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import Planner from "./components/Planner";


const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("studysprintUser"))
  );

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogin = (userData) => {
    localStorage.setItem("studysprintUser", JSON.stringify(userData));
    setUser(userData);
    toast.success("Logged in successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("studysprintUser");
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={<Home user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />}
        />

        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />}
        />

        <Route
          path="/register"
          element={<RegisterForm darkMode={darkMode} setDarkMode={setDarkMode} />}
        />

        <Route
          path="/planner"
          element={
            user ? (
              <Planner user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/home"
          element={
            user ? (
              <Home user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
