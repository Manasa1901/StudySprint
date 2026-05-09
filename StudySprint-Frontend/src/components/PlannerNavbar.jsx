const PlannerNavbar = ({ view, setView, darkMode }) => {
  const tabs = [
    { id: "planner", label: "Study Planner", icon: "📘" },
    { id: "exams", label: "Exam Schedule", icon: "📅" },
  ];

  return (
    <div className={`flex justify-center mb-8`}>
      <div className={`inline-flex rounded-xl p-1 gap-1 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              view === tab.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : darkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-800 hover:bg-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlannerNavbar;
