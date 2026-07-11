import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CalendarClock } from "lucide-react";

export default function ConfirmationModal({
  type = "delete",
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}) {
  const isPostpone = type === "postpone";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className={`flex items-center justify-center py-6 ${isPostpone ? "bg-blue-50" : "bg-red-50"}`}>
            {isPostpone
              ? <CalendarClock size={40} className="text-blue-500" />
              : <AlertTriangle size={40} className="text-red-500" />
            }
          </div>

          <div className="px-5 py-4 text-center">
            <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm">{message}</p>
          </div>

          <div className="flex gap-3 px-5 pb-5">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors ${
                isPostpone ? "bg-blue-600 hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {confirmLabel}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}