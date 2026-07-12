import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";

export default function LevelUpModal({ levelUpInfo, waifuUrl, onClose }) {
  if (!levelUpInfo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
        onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-5 py-6 text-center relative">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 10 }}
              className="text-5xl mb-2"
            >
              🎉
            </motion.div>
            <h2 className="text-white font-bold text-2xl">Niveau {levelUpInfo.level} !</h2>
            <p className="text-indigo-200 text-sm mt-1">{levelUpInfo.title}</p>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Waifu */}
          <div className="relative bg-gray-100 flex items-center justify-center overflow-hidden"
            style={{ minHeight: 280 }}>
            {waifuUrl ? (
              <motion.img
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={waifuUrl}
                alt="Waifu reward"
                className="w-full object-cover"
                style={{ maxHeight: 320 }}
              />
            ) : (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-3 border-indigo-300 border-t-indigo-600 rounded-full mb-3"
                  style={{ borderWidth: 3 }}
                />
                <p className="text-sm">Chargement...</p>
              </div>
            )}

            {/* Badge points */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-bold text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg"
            >
              <Star size={12} />
              +{levelUpInfo.pts} pts
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4">
            <p className="text-center text-sm text-gray-500 mb-3">
              Ta recompense pour tes efforts ! 💪
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold"
            >
              Continuer
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}