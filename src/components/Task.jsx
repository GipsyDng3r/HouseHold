import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  ChefHat, Sofa, Bath, Bed, Home,
  Check, RotateCcw, Pencil, Trash2, User, Users,
} from "lucide-react";
import { getFrequencyLabel, formatShortDate } from "../utils/helpers";

const ROOM_ICON_MAP = {
  Cuisine: ChefHat,
  Salon: Sofa,
  "Salle de bain": Bath,
  Chambre: Bed,
  Autre: Home,
};

function RoomIcon({ room, size = 20 }) {
  const Icon = ROOM_ICON_MAP[room] ?? Home;
  return <Icon size={size} />;
}

const COLOR_CLASSES = {
  green: "bg-green-100 text-green-700 hover:bg-green-200",
  blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  gray: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  red: "bg-red-100 text-red-600 hover:bg-red-200",
};

function ActionButton({ onClick, color, icon, label }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${COLOR_CLASSES[color]}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

const Task = memo(function Task({ task, onDone, onPostpone, onEdit, onDelete }) {
  const { name, room, isDone, lastDoneBy, lastDone, assignedTo } = task;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl px-4 py-3 mb-3 shadow-sm border ${
        isDone ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${isDone ? "text-green-600" : "text-indigo-500"}`}>
          <RoomIcon room={room} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-gray-900 ${isDone ? "line-through text-gray-400" : ""}`}>
              {name}
            </span>
            {isDone && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
              >
                <Check size={11} />
                Fait
              </motion.span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
            <span>{room}</span>
            <span>•</span>
            <span>{getFrequencyLabel(task)}</span>
            {assignedTo !== "both" ? (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User size={11} />{assignedTo}
                </span>
              </>
            ) : (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users size={11} />Les deux
                </span>
              </>
            )}
          </div>

          {lastDone && (
            <p className="text-xs text-gray-400 mt-0.5">
              Fait le {formatShortDate(lastDone)} par {lastDoneBy}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
        {!isDone && (
          <ActionButton onClick={() => onDone(task.id)} color="green" icon={<Check size={15} />} label="Valider" />
        )}
        {!isDone && task.frequency !== "seasonal" && (
          <ActionButton onClick={() => onPostpone(task.id)} color="blue" icon={<RotateCcw size={15} />} label="Reporter" />
        )}
        <ActionButton onClick={() => onEdit(task)} color="gray" icon={<Pencil size={15} />} label="Modifier" />
        <ActionButton onClick={() => onDelete(task.id)} color="red" icon={<Trash2 size={15} />} label="Supprimer" />
      </div>
    </motion.div>
  );
});

export default Task;