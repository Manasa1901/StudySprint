import { useState, useEffect } from "react";

const ExamCard = ({ exam, daysLeft, onDelete }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`border p-4 rounded flex justify-between items-center transition-transform duration-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} hover:shadow-lg hover:scale-105`}>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{exam.subject}</h3>
        <p className="text-sm text-gray-600">
          📅 {exam.date} ⏰ {exam.time}
        </p>
        <p className="text-sm text-gray-500">
          🔔 Reminder: {exam.reminder}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            daysLeft <= 2
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {daysLeft} days left
        </span>

        <button
          onClick={() => onDelete(exam._id, exam.subject)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition text-lg"
          title="Delete exam"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
