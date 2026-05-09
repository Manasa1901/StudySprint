import { useState, useEffect } from "react";
import SubjectForm from "./SubjectForm";
import TopicList from "./TopicList";
import ScheduleExam from "./ScheduleExam";
import ExamList from "./ExamList";
import Header from "./Header";
import PlannerNavbar from "./PlannerNavbar";
import StudyHeatmap from "./StudyHeatmap";
import api from "../api/axios";

/* ── Reminder Banner ── */
const ReminderBanner = ({ exams, darkMode }) => {
  const [dismissed, setDismissed] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = exams.filter((exam) => {
    if (dismissed.includes(exam._id)) return false;
    const examDate = new Date(exam.date);
    examDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= Number(exam.reminder);
  });

  if (due.length === 0) return null;

  return (
    <div className="space-y-2 mb-5">
      {due.map((exam) => {
        const examDate = new Date(exam.date);
        examDate.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
        const isToday = daysLeft === 0;
        const isTomorrow = daysLeft === 1;

        const label = isToday ? "TODAY" : isTomorrow ? "TOMORROW" : `IN ${daysLeft} DAYS`;
        const urgent = daysLeft <= 1;

        return (
          <div
            key={exam._id}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
              urgent
                ? darkMode
                  ? "bg-red-900/30 border-red-700/50 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
                : darkMode
                ? "bg-amber-900/30 border-amber-700/50 text-amber-300"
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{urgent ? "🚨" : "🔔"}</span>
              <span>
                <span className="font-bold">{exam.subject}</span> exam is {label} — {exam.date?.slice(0, 10)} at {exam.time}
              </span>
            </div>
            <button
              onClick={() => setDismissed((p) => [...p, exam._id])}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};

const Planner = ({ user, onLogout, darkMode, setDarkMode, onProfileOpen }) => {
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
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-slate-50"}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-slate-50"}`}>
      <Header user={user} onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} onProfileOpen={onProfileOpen} />

      <div className="px-4 py-8 max-w-3xl mx-auto">

        <ReminderBanner exams={exams} darkMode={darkMode} />

        <PlannerNavbar view={view} setView={setView} darkMode={darkMode} />

        {view === "planner" && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Study Streak</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Stay consistent</p>
                </div>
                <div className="text-3xl font-bold text-orange-500">{studyStreak} 🔥</div>
              </div>

              {overallProgress.total > 0 && (
                <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Overall Progress</p>
                    <span className={`text-lg font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{overallProgress.percentage}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${overallProgress.percentage}%` }} />
                  </div>
                  <p className={`text-xs mt-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{overallProgress.done}/{overallProgress.total} topics</p>
                </div>
              )}
            </div>

            {Object.keys(heatmap).length > 0 && (
              <StudyHeatmap heatmap={heatmap} darkMode={darkMode} />
            )}

            <SubjectForm data={data} setData={setData} darkMode={darkMode} />
            <TopicList data={data} setData={setData} darkMode={darkMode} />
          </>
        )}

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
