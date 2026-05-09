import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const ProfileSidebar = ({ user, onLogout, onClose, onUserUpdate, darkMode, stats }) => {
  const sidebarRef = useRef(null);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSaveName = async () => {
    if (!nameValue.trim()) { toast.error("Name cannot be empty"); return; }
    if (nameValue.trim() === user?.name) { setEditingName(false); return; }
    setSavingName(true);
    try {
      const res = await api.patch("/auth/update-name", { name: nameValue.trim() });
      onUserUpdate(res.data.user);
      setEditingName(false);
      toast.success("Username updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNameValue(user?.name || "");
    setEditingName(false);
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const inputCls = `flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900"
  }`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col shadow-2xl border-l transition-colors duration-300 ${
          darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shrink-0" />

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b shrink-0 ${darkMode ? "border-gray-700/60" : "border-gray-100"}`}>
          <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Profile</span>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-3">
              <span className="text-white text-2xl font-bold">{initials}</span>
            </div>
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {user?.name || "Student"}
            </h2>
            <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>

          </div>

          <div className={`border-t ${darkMode ? "border-gray-700/60" : "border-gray-100"}`} />

          {/* Stats */}
          {stats && (
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Study Stats
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Subjects", value: stats.subjects, icon: "📚" },
                  { label: "Topics", value: stats.topics, icon: "📝" },
                  { label: "Done", value: stats.completed, icon: "✅" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className={`rounded-xl p-3 text-center border ${darkMode ? "bg-gray-800 border-gray-700/60" : "bg-gray-50 border-gray-100"}`}>
                    <div className="text-lg mb-1">{icon}</div>
                    <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</div>
                    <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{label}</div>
                  </div>
                ))}
              </div>
              {stats.topics > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Overall completion</span>
                    <span className={`text-xs font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{stats.percentage}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${stats.percentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={`border-t ${darkMode ? "border-gray-700/60" : "border-gray-100"}`} />

          {/* Account */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Account
            </p>
            <div className={`rounded-xl border overflow-hidden divide-y ${darkMode ? "border-gray-700/60 divide-gray-700/60" : "border-gray-100 divide-gray-100"}`}>

              {/* Username row */}
              <div className={`px-4 py-3 ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Username</span>
                  {!editingName && (
                    <button
                      onClick={() => { setNameValue(user?.name || ""); setEditingName(true); }}
                      className={`text-xs font-medium transition-colors ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"}`}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingName ? (
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") handleCancelEdit(); }}
                      className={inputCls}
                      autoFocus
                      maxLength={40}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 transition-all shrink-0"
                    >
                      {savingName ? "…" : "Save"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={savingName}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className={`text-xs font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{user?.name || "—"}</p>
                )}
              </div>

              {/* Email row — read only */}
              <div className={`flex justify-between items-center px-4 py-3 ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
                <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</span>
                <span className={`text-xs font-semibold truncate max-w-[160px] ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{user?.email || "—"}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-4 border-t shrink-0 ${darkMode ? "border-gray-700/60" : "border-gray-100"}`}>
          <button
            onClick={() => { onClose(); onLogout(); }}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
