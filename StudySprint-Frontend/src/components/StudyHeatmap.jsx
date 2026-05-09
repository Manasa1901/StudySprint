import { useState, useRef } from "react";

const RANGES = [
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "1 Year",   months: 12 },
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/* Build a full grid of weeks from startDate to today */
const buildGrid = (months) => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  // rewind to the Sunday of that week
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cursor = new Date(start);

  while (cursor <= end) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
};

/* Month label positions */
const getMonthLabels = (weeks) => {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = week[0].getMonth();
    if (month !== lastMonth) {
      labels.push({ index: i, label: week[0].toLocaleDateString("en-US", { month: "short" }) });
      lastMonth = month;
    }
  });
  return labels;
};

const CELL = 13; // px per cell
const GAP  = 3;  // px gap

const StudyHeatmap = ({ heatmap, darkMode }) => {
  const [range, setRange] = useState(6);
  const [tooltip, setTooltip] = useState(null); // { x, y, date, count }
  const containerRef = useRef(null);

  const values = heatmap || {};
  const weeks = buildGrid(range);
  const monthLabels = getMonthLabels(weeks);

  /* Stats */
  const allEntries = Object.entries(values);
  const totalTopics = allEntries.reduce((s, [, c]) => s + c, 0);
  const activeDays  = allEntries.length;
  const bestDay     = allEntries.sort((a, b) => b[1] - a[1])[0];
  const maxCount    = bestDay ? bestDay[1] : 1;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const thisWeek = allEntries
    .filter(([d]) => new Date(d) >= weekStart)
    .reduce((s, [, c]) => s + c, 0);

  /* Cell color */
  const cellColor = (count) => {
    if (!count) return darkMode ? "#1f2937" : "#f1f5f9";
    const ratio = count / maxCount;
    if (darkMode) {
      if (ratio >= 0.75) return "#6366f1";
      if (ratio >= 0.5)  return "#4f46e5";
      if (ratio >= 0.25) return "#3730a3";
      return "#312e81";
    } else {
      if (ratio >= 0.75) return "#6366f1";
      if (ratio >= 0.5)  return "#818cf8";
      if (ratio >= 0.25) return "#a5b4fc";
      return "#c7d2fe";
    }
  };

  const toKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleMouseEnter = (e, date, count) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const cellRect = e.target.getBoundingClientRect();
    setTooltip({
      x: cellRect.left - rect.left + CELL / 2,
      y: cellRect.top  - rect.top  - 8,
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      count,
    });
  };

  const gridWidth  = weeks.length * (CELL + GAP);
  const gridHeight = 7 * (CELL + GAP);

  return (
    <div className={`rounded-2xl border shadow-sm mb-5 overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>

      {/* Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? "border-gray-700/60" : "border-gray-50"}`}>
        <div>
          <h2 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>📊 Study Consistency</h2>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Topics completed per day</p>
        </div>
        {/* Range selector */}
        <div className={`flex rounded-lg p-0.5 gap-0.5 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          {RANGES.map(r => (
            <button
              key={r.months}
              onClick={() => setRange(r.months)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                range === r.months
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                  : darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className={`grid grid-cols-4 divide-x ${darkMode ? "divide-gray-700/60 border-b border-gray-700/60" : "divide-gray-100 border-b border-gray-50"}`}>
        {[
          { label: "Active Days",   value: activeDays,  color: darkMode ? "text-blue-400"   : "text-blue-600"   },
          { label: "Topics Done",   value: totalTopics, color: darkMode ? "text-indigo-400" : "text-indigo-600" },
          { label: "This Week",     value: thisWeek,    color: darkMode ? "text-purple-400" : "text-purple-600" },
          { label: "Best Day",      value: bestDay ? `${bestDay[1]} topics` : "—", color: darkMode ? "text-green-400" : "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`px-4 py-3 text-center ${darkMode ? "bg-gray-800/40" : "bg-gray-50/60"}`}>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
            <div className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="px-6 py-5">
        <div ref={containerRef} className="relative overflow-x-auto">
          <div style={{ minWidth: gridWidth + 28 }}>

            {/* Month labels */}
            <div className="flex mb-1" style={{ paddingLeft: 28 }}>
              {monthLabels.map(({ index, label }) => (
                <div
                  key={label + index}
                  className={`text-xs absolute ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  style={{ left: 28 + index * (CELL + GAP) }}
                >
                  {label}
                </div>
              ))}
              <div style={{ height: 16 }} />
            </div>

            <div className="flex gap-0" style={{ marginTop: 4 }}>
              {/* Day labels */}
              <div className="flex flex-col shrink-0" style={{ gap: GAP, marginRight: GAP, width: 24 }}>
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={i}
                    className={`text-xs flex items-center justify-end pr-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
                    style={{ height: CELL }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="flex" style={{ gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                    {week.map((date, di) => {
                      const key   = toKey(date);
                      const count = values[key] || 0;
                      const isFuture = date > today;
                      return (
                        <div
                          key={di}
                          onMouseEnter={isFuture ? undefined : (e) => handleMouseEnter(e, date, count)}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            width: CELL,
                            height: CELL,
                            borderRadius: 3,
                            backgroundColor: isFuture ? "transparent" : cellColor(count),
                            cursor: isFuture ? "default" : "pointer",
                            transition: "transform 0.1s",
                          }}
                          className={isFuture ? "" : "hover:scale-125"}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className={`absolute z-10 px-3 py-2 rounded-lg text-xs shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full border ${
                darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100 text-gray-800"
              }`}
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="font-semibold">{tooltip.date}</div>
              <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
                {tooltip.count > 0 ? `${tooltip.count} topic${tooltip.count > 1 ? "s" : ""} completed` : "No activity"}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className={`flex items-center gap-2 mt-4 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.2, 0.45, 0.7, 1].map((ratio, i) => (
              <div
                key={i}
                style={{ width: CELL, height: CELL, borderRadius: 3, backgroundColor: cellColor(ratio === 0 ? 0 : Math.ceil(ratio * maxCount)) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default StudyHeatmap;
