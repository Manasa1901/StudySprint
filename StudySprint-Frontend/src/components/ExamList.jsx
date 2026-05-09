import ExamCard from "./ExamCard";
import ConfirmDialog from "./ConfirmDialog";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const ExamList = ({ exams, setExams, darkMode }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, examId: null, examName: "" });
  const [pastOpen, setPastOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const upcomingExams = exams
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastExams = exams
    .filter(e => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // most recent first

  const daysLeft = (date) => Math.ceil((new Date(date) - today) / (1000 * 60 * 60 * 24));
  const daysAgo = (date) => Math.floor((today - new Date(date)) / (1000 * 60 * 60 * 24));

  const handleDelete = async () => {
    try {
      await api.delete(`/exams/${deleteDialog.examId}`);
      setExams(prev => prev.filter(e => e._id !== deleteDialog.examId));
      toast.success("Exam deleted");
      setDeleteDialog({ isOpen: false, examId: null, examName: "" });
    } catch {
      toast.error("Failed to delete exam");
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Exam"
        message={`Delete the exam for "${deleteDialog.examName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, examId: null, examName: "" })}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        darkMode={darkMode}
      />

      {/* Upcoming */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"} ${
        darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"
      }`}>
        <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700/60" : "border-gray-50"}`}>
          <div className="flex items-center justify-between">
            <h2 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>📋 Upcoming Exams</h2>
            {upcomingExams.length > 0 && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                {upcomingExams.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          {upcomingExams.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-medium">No upcoming exams</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingExams.map(exam => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  daysLeft={daysLeft(exam.date)}
                  onDelete={(id, name) => setDeleteDialog({ isOpen: true, examId: id, examName: name })}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div className={`mt-4 rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>

          {/* Collapsible header */}
          <button
            onClick={() => setPastOpen(o => !o)}
            className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
              darkMode ? "hover:bg-gray-800/60" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <h2 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>🗂️ Past Exams</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                {pastExams.length}
              </span>
            </div>
            <span className={`text-xs font-medium transition-colors ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {pastOpen ? "▲ Hide" : "▼ Show"}
            </span>
          </button>

          {/* Collapsible body */}
          {pastOpen && (
            <div className={`px-4 pb-4 border-t ${darkMode ? "border-gray-700/60" : "border-gray-50"}`}>
              <div className="space-y-2 pt-4">
                {pastExams.map(exam => (
                  <ExamCard
                    key={exam._id}
                    exam={exam}
                    daysAgo={daysAgo(exam.date)}
                    isPast
                    onDelete={(id, name) => setDeleteDialog({ isOpen: true, examId: id, examName: name })}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ExamList;
