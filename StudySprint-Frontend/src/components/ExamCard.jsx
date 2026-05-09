const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const ExamCard = ({ exam, daysLeft, daysAgo, isPast = false, onDelete, darkMode }) => (
  <div className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all hover:shadow-md ${
    isPast
      ? darkMode
        ? "bg-gray-800/30 border-gray-700/40 opacity-70 hover:opacity-90"
        : "bg-gray-50/60 border-gray-100 opacity-70 hover:opacity-90"
      : darkMode
      ? "bg-gray-800/60 border-gray-700/60 hover:bg-gray-800"
      : "bg-gray-50 border-gray-100 hover:bg-white"
  }`}>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className={`font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{exam.subject}</h3>
        {isPast && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            Completed
          </span>
        )}
      </div>
      <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        📅 {formatDate(exam.date)} &nbsp;⏰ {exam.time}
      </p>
    </div>

    <div className="flex items-center gap-2 ml-3 shrink-0">
      {isPast ? (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
          {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
        </span>
      ) : (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          daysLeft <= 2
            ? "bg-red-100 text-red-600"
            : daysLeft <= 7
            ? "bg-amber-100 text-amber-600"
            : "bg-blue-100 text-blue-600"
        }`}>
          {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
        </span>
      )}

      <button
        onClick={() => onDelete(exam._id, exam.subject)}
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${
          darkMode ? "text-gray-600 hover:text-red-400 hover:bg-red-900/20" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
        }`}
        title="Delete exam"
      >
        ✕
      </button>
    </div>
  </div>
);

export default ExamCard;
