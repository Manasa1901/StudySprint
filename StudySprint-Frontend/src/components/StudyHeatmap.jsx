import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./StudyHeatmap.css";

const StudyHeatmap = ({ heatmap, darkMode }) => {
  const values = Object.keys(heatmap).map(date => ({
    date,
    count: heatmap[date],
  }));

  if (!values || values.length === 0) {
    return (
      <div className={`p-6 rounded-xl shadow mb-8 transition-colors ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>📊 Study Consistency</h2>
        <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No study data yet. Start marking topics as done!</p>
      </div>
    );
  }

  const maxCount = Math.max(...values.map(v => v.count || 0));
  const totalDays = values.length;
  const totalStudy = values.reduce((sum, v) => sum + (v.count || 0), 0);

  return (
    <div className={`p-6 rounded-xl shadow mb-8 transition-colors ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>📊 Study Consistency</h2>
      <div className="flex justify-between items-center mb-4">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Last 6 months activity</p>
        <div className="flex gap-4 text-sm">
          <div><span className={`font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{totalDays}</span> active days</div>
          <div><span className={`font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>{totalStudy}</span> topics completed</div>
        </div>
      </div>

      <div className="heatmap-container overflow-x-auto">
        <CalendarHeatmap
          startDate={new Date(new Date().setMonth(new Date().getMonth() - 6))}
          endDate={new Date()}
          values={values}
          classForValue={(value) => {
            if (!value) return "color-empty";
            const ratio = (value.count / maxCount);
            if (ratio >= 0.75) return "color-scale-4";
            if (ratio >= 0.5) return "color-scale-3";
            if (ratio >= 0.25) return "color-scale-2";
            return "color-scale-1";
          }}
          tooltipDataAttrs={
            value =>
              value.date ? { "data-tooltip": `${value.count || 0} topics on ${value.date}` } : {}
          }
        />
      </div>

      <div className={`flex gap-2 justify-center mt-4 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <span>Less</span>
        <div className="flex gap-1">
          <div className={`w-3 h-3 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border border-gray-300"}`}></div>
          <div className={`w-3 h-3 ${darkMode ? "bg-green-700 border-green-600" : "bg-green-100 border border-green-300"}`}></div>
          <div className={`w-3 h-3 ${darkMode ? "bg-green-500 border-green-400" : "bg-green-400 border border-green-500"}`}></div>
          <div className={`w-3 h-3 ${darkMode ? "bg-green-400 border-green-300" : "bg-green-600 border border-green-700"}`}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default StudyHeatmap;