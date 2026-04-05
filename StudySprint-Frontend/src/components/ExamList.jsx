import ExamCard from "./ExamCard";
import ConfirmDialog from "./ConfirmDialog";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const ExamList = ({ exams, setExams }) => {
  const today = new Date();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, examId: null, examName: "" });

  const upcomingExams = exams
    .filter(exam => new Date(exam.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const calculateDaysLeft = (date) => {
    const diff = new Date(date) - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleDeleteExam = async () => {
    try {
      await api.delete(`/exams/${deleteDialog.examId}`);
      
      setExams((prev) => prev.filter((e) => e._id !== deleteDialog.examId));
      toast.success("Exam deleted successfully");
      setDeleteDialog({ isOpen: false, examId: null, examName: "" });
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("Failed to delete exam");
    }
  };

  const openDeleteDialog = (examId, examName) => {
    setDeleteDialog({ isOpen: true, examId, examName });
  };

  if (upcomingExams.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-xl shadow mb-8 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <h2 className="text-xl font-semibold mb-4">📋 Upcoming Exams</h2>
        <p className="text-gray-500">No upcoming exams 🎉</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Exam"
        message={`Are you sure you want to delete the exam for "${deleteDialog.examName}"? This action cannot be undone.`}
        onConfirm={handleDeleteExam}
        onCancel={() => setDeleteDialog({ isOpen: false, examId: null, examName: "" })}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />

      <div className={`bg-white p-6 rounded-xl shadow mb-8 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <h2 className="text-xl font-semibold mb-4">📋 Upcoming Exams</h2>

        <div className="space-y-3">
          {upcomingExams.map(exam => (
            <ExamCard
              key={exam._id}
              exam={exam}
              daysLeft={calculateDaysLeft(exam.date)}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ExamList;
