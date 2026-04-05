import Header from "./Header";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

const Home = ({ user, onLogout, darkMode, setDarkMode }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // used for simple fade/slide on first render
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Fetch subjects and topics from backend */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await api.get("/subjects");
        setData(res.data.data || {});
      } catch (err) {
        console.error("Failed to fetch subjects:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* Calculate progress from fetched data */
  const getProgress = () => {
    if (!user || Object.keys(data).length === 0) {
      return { subjects: 0, topics: 0, completed: 0, percentage: 0 };
    }
    
    const subjects = Object.keys(data).length;
    const allTopics = Object.values(data).flat();
    const completed = allTopics.filter(topic => topic.done).length;
    const total = allTopics.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { subjects, topics: total, completed, percentage };
  };

  const progress = getProgress();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-100"}`}>
      
      <Header user={user} onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')"
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6">
            <h1 className={`text-5xl font-bold mb-4 transition-all duration-800 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {user ? "Welcome back to StudySprint!" : "Master Your Studies with StudySprint"}
            </h1>
            <p className={`text-xl mb-8 max-w-2xl mx-auto transition-all duration-800 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {user 
                ? "Continue your learning journey and achieve your academic goals."
                : "Organize your subjects, track your progress, and study smarter with our comprehensive learning platform."
              }
            </p>
            {!user && (
              <div className={`flex gap-4 justify-center transition-all duration-800 delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        
        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {user ? "Your Study Dashboard" : "Why Choose StudySprint?"}
          </h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {user 
              ? "Track your progress and manage your study sessions effectively."
              : "Join thousands of students who are achieving better results with our proven study methods."
            }
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className={`p-6 rounded-xl shadow hover:shadow-lg transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${
            darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : ""}`}>📚 Subjects</h3>
            <p className={`mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {user ? `${progress.subjects} subjects added` : "Add and manage all your exam subjects in one place."}
            </p>
            {user && (
              <div className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{progress.subjects}</div>
            )}
          </div>

          <div className={`p-6 rounded-xl shadow hover:shadow-lg transition-all duration-500 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${
            darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : ""}`}>✅ Topics</h3>
            <p className={`mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {user ? `${progress.completed}/${progress.topics} topics completed` : "Break subjects into topics and mark them as completed."}
            </p>
            {user && (
              <div className={`w-full rounded-full h-2 mt-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className={`p-6 rounded-xl shadow hover:shadow-lg transition-all duration-500 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${
            darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : ""}`}>📈 Progress</h3>
            <p className={`mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {user ? `${progress.percentage}% overall completion` : "Track your revision progress and stay motivated."}
            </p>
            {user && (
              <div className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{progress.percentage}%</div>
            )}
          </div>

        </div>

        {user && (
          <div className="text-center mt-12">
            <Link
              to="/planner"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition inline-block"
            >
              Start Planning Your Studies
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
