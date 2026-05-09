import { useState } from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel", isDangerous = true, darkMode = false }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative rounded-2xl shadow-2xl border p-6 w-full max-w-sm transition-all duration-200 scale-100 ${
        darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"
      }`}>
        <h2 className={`text-base font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h2>
        <p className={`text-sm mb-6 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
              darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60 shadow-sm ${
              isDangerous
                ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
