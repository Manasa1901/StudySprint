import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import ConfirmDialog from "./ConfirmDialog";
import confetti from "canvas-confetti";

const fireConfetti = () => {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"] });
};

/* ─── Topic Row ─── */
const TopicRow = ({ topic, subject, darkMode, onToggle, onDelete, onNotesSaved, onRenamed }) => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState(topic.notes || "");
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(topic.name);
  const [renaming, setRenaming] = useState(false);
  const inputRef = useRef(null);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await api.patch(`/topics/notes/${topic._id}`, { notes });
      onNotesSaved(topic._id, subject, notes);
      toast.success("Notes saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async () => {
    if (!editName.trim()) { toast.error("Topic name cannot be empty"); return; }
    if (editName.trim() === topic.name) { setEditing(false); return; }
    setRenaming(true);
    try {
      await api.patch(`/topics/rename/${topic._id}`, { name: editName.trim() });
      onRenamed(topic._id, subject, editName.trim());
      setEditing(false);
      toast.success("Topic renamed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rename topic");
    } finally {
      setRenaming(false);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") { setEditName(topic.name); setEditing(false); }
  };

  const hasNotes = (topic.notes || "").trim().length > 0;

  return (
    <div className={`rounded-xl transition-colors ${darkMode ? "hover:bg-gray-800/60" : "hover:bg-gray-50"}`}>
      <div className="flex items-center gap-3 px-2 py-2.5">
        <input
          type="checkbox"
          checked={topic.done}
          onChange={() => onToggle(topic._id, subject)}
          className="w-4 h-4 rounded accent-blue-500 cursor-pointer shrink-0"
        />

        {/* Inline rename */}
        {editing ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              ref={inputRef}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              autoFocus
              className={`flex-1 px-2 py-1 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
              }`}
            />
            <button
              onClick={handleRename}
              disabled={renaming}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-60 transition-all"
            >
              {renaming ? "…" : "Save"}
            </button>
            <button
              onClick={() => { setEditName(topic.name); setEditing(false); }}
              className={`px-2 py-1 rounded-lg text-xs transition-colors ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              ✕
            </button>
          </div>
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
            className={`flex-1 text-sm transition-colors cursor-default ${
              topic.done
                ? darkMode ? "line-through text-gray-600" : "line-through text-gray-400"
                : darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {topic.name}
          </span>
        )}

        {/* Edit pencil button */}
        {!editing && (
          <button
            onClick={() => { setEditName(topic.name); setEditing(true); }}
            title="Rename topic"
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
              darkMode ? "text-gray-600 hover:text-blue-400 hover:bg-blue-900/20" : "text-gray-300 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            ✏️
          </button>
        )}

        {/* Notes toggle */}
        {!editing && (
          <button
            onClick={() => setNotesOpen(o => !o)}
            title={notesOpen ? "Hide notes" : "Add notes"}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              notesOpen
                ? darkMode ? "bg-indigo-900/40 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                : hasNotes
                ? darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"
                : darkMode ? "text-gray-600 hover:text-gray-400 hover:bg-gray-700" : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
            }`}
          >
            📝
            {hasNotes && !notesOpen && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />}
          </button>
        )}

        {/* Delete */}
        {!editing && (
          <button
            onClick={() => onDelete(topic._id, topic.name, subject)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${
              darkMode ? "text-gray-600 hover:text-red-400 hover:bg-red-900/20" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
            }`}
            title="Delete topic"
          >
            ✕
          </button>
        )}
      </div>

      {/* Notes panel */}
      {notesOpen && (
        <div className={`mx-2 mb-2 rounded-xl border overflow-hidden ${darkMode ? "border-gray-700/60 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}>
          <div className={`flex items-center justify-between px-3 py-2 border-b ${darkMode ? "border-gray-700/60" : "border-gray-100"}`}>
            <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Revision Notes</span>
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 transition-all"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Write key points, formulas, or summaries…"
            rows={4}
            className={`w-full px-3 py-2.5 text-sm resize-none outline-none ${darkMode ? "bg-transparent text-gray-200 placeholder-gray-600" : "bg-transparent text-gray-700 placeholder-gray-400"}`}
          />
        </div>
      )}
    </div>
  );
};

/* ─── Main TopicList ─── */
const TopicList = ({ data, setData, darkMode }) => {
  const [deleteTopicDialog, setDeleteTopicDialog] = useState({ isOpen: false, topicId: null, topicName: "", subject: "" });
  const [deleteSubjectDialog, setDeleteSubjectDialog] = useState({ isOpen: false, subjectName: "", subjectId: null });
  const [deletingSubject, setDeletingSubject] = useState(false);

  const getProgress = (topics) => {
    const done = topics.filter(t => t.done).length;
    const total = topics.length;
    return { done, total, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const toggleDone = async (topicId, subjectName) => {
    try {
      const res = await api.patch(`/topics/toggle/${topicId}`);
      setData(prev => {
        const updated = {
          ...prev,
          [subjectName]: prev[subjectName].map(t => t._id === res.data.topic._id ? { ...t, ...res.data.topic } : t),
        };
        // Fire confetti if subject just hit 100%
        const topics = updated[subjectName];
        const wasComplete = prev[subjectName].every(t => t.done);
        const nowComplete = topics.every(t => t.done);
        if (!wasComplete && nowComplete) {
          setTimeout(fireConfetti, 100);
          toast.success(`🎉 "${subjectName}" is 100% complete!`);
        }
        return updated;
      });
    } catch {
      toast.error("Failed to update topic");
    }
  };

  const handleNotesSaved = (topicId, subjectName, notes) => {
    setData(prev => ({
      ...prev,
      [subjectName]: prev[subjectName].map(t => t._id === topicId ? { ...t, notes } : t),
    }));
  };

  const handleTopicRenamed = (topicId, subjectName, newName) => {
    setData(prev => ({
      ...prev,
      [subjectName]: prev[subjectName].map(t => t._id === topicId ? { ...t, name: newName } : t),
    }));
  };

  const handleDeleteTopic = async () => {
    try {
      await api.delete(`/topics/${deleteTopicDialog.topicId}`);
      setData(prev => ({
        ...prev,
        [deleteTopicDialog.subject]: prev[deleteTopicDialog.subject].filter(t => t._id !== deleteTopicDialog.topicId),
      }));
      toast.success("Topic deleted");
      setDeleteTopicDialog({ isOpen: false, topicId: null, topicName: "", subject: "" });
    } catch {
      toast.error("Failed to delete topic");
    }
  };

  const handleDeleteSubject = async () => {
    setDeletingSubject(true);
    try {
      await api.delete(`/subjects/${deleteSubjectDialog.subjectId}`);
      setData(prev => {
        const updated = { ...prev };
        delete updated[deleteSubjectDialog.subjectName];
        return updated;
      });
      toast.success(`"${deleteSubjectDialog.subjectName}" deleted`);
      setDeleteSubjectDialog({ isOpen: false, subjectName: "", subjectId: null });
    } catch {
      toast.error("Failed to delete subject");
    } finally {
      setDeletingSubject(false);
    }
  };

  return (
    <div>
      {/* Delete topic dialog */}
      <ConfirmDialog
        isOpen={deleteTopicDialog.isOpen}
        title="Delete Topic"
        message={`Delete "${deleteTopicDialog.topicName}"? This cannot be undone.`}
        onConfirm={handleDeleteTopic}
        onCancel={() => setDeleteTopicDialog({ isOpen: false, topicId: null, topicName: "", subject: "" })}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        darkMode={darkMode}
      />

      {/* Delete subject dialog */}
      <ConfirmDialog
        isOpen={deleteSubjectDialog.isOpen}
        title="Delete Subject"
        message={`Delete "${deleteSubjectDialog.subjectName}" and all its topics? This cannot be undone.`}
        onConfirm={handleDeleteSubject}
        onCancel={() => setDeleteSubjectDialog({ isOpen: false, subjectName: "", subjectId: null })}
        confirmText={deletingSubject ? "Deleting…" : "Delete All"}
        cancelText="Cancel"
        isDangerous
        darkMode={darkMode}
      />

      {Object.keys(data).length === 0 && (
        <div className={`text-center py-12 rounded-2xl border ${darkMode ? "border-gray-700/60 text-gray-500" : "border-gray-100 text-gray-400"}`}>
          <div className="text-4xl mb-3">📚</div>
          <p className="font-medium">No subjects yet</p>
          <p className="text-sm mt-1">Add your first subject and topic above</p>
        </div>
      )}

      {Object.entries(data).map(([subject, topics]) => {
        const { done, total, percentage } = getProgress(topics);
        const subjectId = topics[0]?.subjectId;

        return (
          <div key={subject} className={`rounded-2xl border shadow-sm mb-4 overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>
            {/* Subject header */}
            <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700/60" : "border-gray-50"}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{subject}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    percentage === 100 ? "bg-green-100 text-green-700" : darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                  }`}>
                    {done}/{total} · {percentage}%
                  </span>
                  {/* Delete subject button */}
                  <button
                    onClick={() => setDeleteSubjectDialog({ isOpen: true, subjectName: subject, subjectId })}
                    title="Delete subject"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      darkMode ? "text-gray-600 hover:text-red-400 hover:bg-red-900/20" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                    }`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className={`w-full rounded-full h-1.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    percentage === 100 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Topics */}
            <div className="px-4 py-2">
              {topics.map(topic => (
                <TopicRow
                  key={topic._id}
                  topic={topic}
                  subject={subject}
                  darkMode={darkMode}
                  onToggle={toggleDone}
                  onDelete={(id, name, sub) => setDeleteTopicDialog({ isOpen: true, topicId: id, topicName: name, subject: sub })}
                  onNotesSaved={handleNotesSaved}
                  onRenamed={handleTopicRenamed}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopicList;
