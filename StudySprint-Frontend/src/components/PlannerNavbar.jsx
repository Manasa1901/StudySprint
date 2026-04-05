const PlannerNavbar = ({ view, setView, darkMode }) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => setView("planner")}
        className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${
          view === "planner"
            ? "bg-blue-500 text-white"
            : `${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
        }`}
      >
        📘 Study Planner
      </button>

      <button
        onClick={() => setView("exams")}
        className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${
          view === "exams"
            ? "bg-green-500 text-white"
            : `${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
        }`}
      >
        📅 Exam Schedule
      </button>
    </div>
  );
};

export default PlannerNavbar;
