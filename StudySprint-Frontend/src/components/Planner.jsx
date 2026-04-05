import { useState, useEffect } from "react";
import SubjectForm from "./SubjectForm";
import TopicList from "./TopicList";
import ScheduleExam from "./ScheduleExam";
import ExamList from "./ExamList";
import Header from "./Header";
import PlannerNavbar from "./PlannerNavbar";
import StudyHeatmap from "./StudyHeatmap";
import api from "../api/axios";

const Planner = ({ user, onLogout, darkMode, setDarkMode }) => {
  /* ---------------- ENTRY ANIMATION ---------------- */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- VIEW ---------------- */
  const [view, setView] = useState("planner");

  /* ---------------- STUDY DATA ---------------- */
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  /* ---------------- EXAMS ---------------- */
  const [exams, setExams] = useState([]);
  const [examLoading, setExamLoading] = useState(true);

  /* ---------------- HEATMAP ---------------- */
  const [heatmap, setHeatmap] = useState({});

  /* ---------------- FETCH SUBJECTS ---------------- */
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subjects");
      setData(res.data.data || {});
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH EXAMS ---------------- */
  const fetchExams = async () => {
    try {
      setExamLoading(true);
      const res = await api.get("/exams");
      setExams(res.data.exams || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setExamLoading(false);
    }
  };

  /* ---------------- FETCH HEATMAP ---------------- */
  const fetchHeatmap = async () => {
    try {
      const res = await api.get("/analytics/heatmap");
      setHeatmap(res.data.heatmap || {});
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchExams();
    fetchHeatmap();
  }, []);

  /* Refresh heatmap when study data changes */
  useEffect(() => {
    fetchHeatmap();
  }, [data]);

  /* ---------------- OVERALL PROGRESS ---------------- */
  const getOverallProgress = () => {
    const allTopics = Object.values(data).flat();
    const done = allTopics.filter((t) => t.done).length;
    const total = allTopics.length;
    return {
      done,
      total,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  };
  const overallProgress = getOverallProgress();

  /* ---------------- STUDY STREAK ---------------- */
  const getStudyStreak = () => {
    const dates = [];

    Object.values(data).flat().forEach((topic) => {
      if (topic.done && topic.updatedAt) {
        const day = topic.updatedAt.split("T")[0];
        if (!dates.includes(day)) dates.push(day);
      }
    });

    if (dates.length === 0) return 0;

    dates.sort().reverse();

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };
  const studyStreak = getStudyStreak();

  /* ---------------- ADD EXAM ---------------- */
  const addExam = async (exam) => {
    try {
      const res = await api.post("/exams", exam);
      setExams((prev) => [...prev, res.data.exam]);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to add exam");
    }
  };

  if (loading || examLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-100"}`}>
        <p className={`text-lg font-semibold animate-pulse ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Loading planner...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-100"}`}>
      <Header user={user} onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-4 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
          StudySprint 🚀
        </h1>

        {/* -------- NAV BAR -------- */}
        <PlannerNavbar view={view} setView={setView} darkMode={darkMode} />

        {/* ================= STUDY PLANNER ================= */}
        {view === "planner" && (
          <>
            {/* 🔥 STUDY STREAK */}
            <div className={`p-6 rounded-xl shadow mb-6 flex justify-between items-center transition-colors ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  🔥 Study Streak
                </h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Stay consistent every day
                </p>
              </div>
              <div className="text-4xl font-bold text-orange-500">
                {studyStreak}
              </div>
            </div>

            {/* 📊 STUDY HEATMAP */}
            {Object.keys(heatmap).length > 0 && (
              <StudyHeatmap heatmap={heatmap} darkMode={darkMode} />
            )}

            {/* 📈 OVERALL PROGRESS */}
            {overallProgress.total > 0 && (
              <div className={`p-6 rounded-xl shadow mb-8 transition-colors ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Overall Progress
                </h2>

                <div className="flex justify-between mb-2">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {overallProgress.done} of {overallProgress.total} topics completed
                  </span>
                  <span className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                    {overallProgress.percentage}%
                  </span>
                </div>

                <div className={`w-full rounded-full h-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            <SubjectForm data={data} setData={setData} darkMode={darkMode} />
            <TopicList data={data} setData={setData} darkMode={darkMode} />
          </>
        )}

        {/* ================= EXAMS ================= */}
        {view === "exams" && (
          <>
            <ScheduleExam onAddExam={addExam} darkMode={darkMode} />
            <ExamList exams={exams} setExams={setExams} darkMode={darkMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;
