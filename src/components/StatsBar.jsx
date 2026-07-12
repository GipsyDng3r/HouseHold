import React, { memo } from "react";
import { motion } from "framer-motion";
import { Star, Trophy } from "lucide-react";

const StatsBar = memo(function StatsBar({ stats, levelTitle, progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-yellow-300" />
          <span className="text-white text-xs font-semibold">
            Niv. {stats.level} — {levelTitle}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-300" />
          <span className="text-yellow-200 text-xs font-bold">
            {stats.points} / 100 pts
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: progress + "%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
        />
      </div>

      <p className="text-indigo-200 text-[10px] mt-1 text-right">
        Total : {stats.totalPoints} pts gagnes
      </p>
    </motion.div>
  );
});

export default StatsBar;