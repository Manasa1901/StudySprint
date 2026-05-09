import Header from "./Header";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

const StatCard = ({ icon, label, value, sub, darkMode, delay = "" }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 ${delay} ${
    darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"
  } shadow-sm`}>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{icon}</span>
      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{label}</h3>
    </div>
    <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{sub}</p>
    {value !== undefined && (
      <div className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{value}</div>
    )}
  </div>
);

const Home = ({ user, onLogout, darkMode, setDarkMode, onProfileOpen }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) { setLoading(false); return; }
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

  const getProgress = () => {
    if (!user || Object.keys(data).length === 0)
      return { subjects: 0, topics: 0, completed: 0, percentage: 0 };
    const subjects = Object.keys(data).length;
    const allTopics = Object.values(data).flat();
    const completed = allTopics.filter(t => t.done).length;
    const total = allTopics.length;
    return { subjects, topics: total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const progress = getProgress();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-slate-50"}`}>
      <Header user={user} onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} onProfileOpen={onProfileOpen} />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=60')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 flex items-center justify-center min-h-[420px] px-6 py-20">
          <div className={`text-center text-white max-w-3xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {user ? `Welcome back, ${user.name || user.email}` : "Start your study journey today"}
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              {user ? "Your Study Dashboard" : "Master Your Studies with StudySprint"}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">
              {user
                ? "Track progress, manage subjects, and crush your academic goals."
                : "Organize subjects, track topics, and study smarter with a platform built for students."}
            </p>
            {!user && (
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/register" className="px-8 py-3 rounded-xl font-semibold bg-white text-blue-600 hover:bg-blue-50 transition shadow-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="px-8 py-3 rounded-xl font-semibold border-2 border-white/60 text-white hover:bg-white/10 transition">
                  Sign In
                </Link>
              </div>
            )}
            {user && (
              <Link to="/planner" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-white text-blue-600 hover:bg-blue-50 transition shadow-lg">
                Open Planner →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {user ? "Your Progress at a Glance" : "Everything You Need to Succeed"}
          </h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {user ? "Keep the momentum going." : "Join thousands of students achieving better results."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            icon="📚" label="Subjects" darkMode={darkMode}
            sub={user ? `${progress.subjects} subjects added` : "Add and manage all your exam subjects in one place."}
            value={user ? progress.subjects : undefined}
          />
          <StatCard
            icon="✅" label="Topics" darkMode={darkMode} delay="delay-75"
            sub={user ? `${progress.completed} of ${progress.topics} completed` : "Break subjects into topics and mark them done."}
            value={user ? undefined : undefined}
          >
            {user && (
              <div className={`w-full rounded-full h-2 mt-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${progress.percentage}%` }} />
              </div>
            )}
          </StatCard>
          <StatCard
            icon="📈" label="Progress" darkMode={darkMode} delay="delay-150"
            sub={user ? `${progress.percentage}% overall completion` : "Track revision progress and stay motivated."}
            value={user ? `${progress.percentage}%` : undefined}
          />
        </div>

        {!user && (
          <div className={`mt-12 p-8 rounded-2xl border text-center ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"} shadow-sm`}>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Ready to start?</h3>
            <p className={`text-sm mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Create a free account and begin organizing your studies today.</p>
            <Link to="/register" className="inline-block px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition shadow-md">
              Create Free Account
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
