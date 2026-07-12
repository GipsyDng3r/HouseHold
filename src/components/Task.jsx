import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  ChefHat, Sofa, Bath, Bed, Home,
  Check, RotateCcw, Pencil, Trash2, User, Users, Clock,
} from "lucide-react";
import { getFrequencyLabel, formatShortDate, estimateTaskDuration, formatDuration } from "../utils/helpers";

const ROOM_ICON_MAP = {
  Cuisine: ChefHat,
  Salon: Sofa,
  "Salle de bain": Bath,
  Chambre: Bed,
  Autre: Home,
};

function RoomIcon({ room, size }) {
  var Icon = ROOM_ICON_MAP[room] || Home;
  return React.createElement(Icon, { size: size || 20 });
}

var COLOR_CLASSES = {
  green: "bg-green-100 text-green-700 hover:bg-green-200",
  blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  gray: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  red: "bg-red-100 text-red-600 hover:bg-red-200",
  darkGreen: "bg-green-900/40 text-green-400 hover:bg-green-900/60",
  darkBlue: "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60",
  darkGray: "bg-gray-700 text-gray-300 hover:bg-gray-600",
  darkRed: "bg-red-900/40 text-red-400 hover:bg-red-900/60",
};

function ActionButton({ onClick, color, icon, label }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={"flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors " + (COLOR_CLASSES[color] || COLOR_CLASSES.gray)}
    >
      {icon}
      {label}
    </motion.button>
  );
}

const Task = memo(function Task({ task, onDone, onPostpone, onEdit, onDelete, darkMode }) {
  var name = task.name;
  var room = task.room;
  var isDone = task.isDone;
  var lastDoneBy = task.lastDoneBy;
  var lastDone = task.lastDone;
  var assignedTo = task.assignedTo;

  var duration = estimateTaskDuration(task);
  var durationLabel = formatDuration(duration);

  var cardClass = "rounded-2xl px-4 py-3 mb-3 shadow-sm border ";
  if (darkMode) {
    cardClass += isDone ? "bg-green-900/20 border-green-800" : "bg-gray-800 border-gray-700";
  } else {
    cardClass += isDone ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200";
  }

  var nameClass = "font-semibold " + (isDone ? "line-through text-gray-400" : (darkMode ? "text-white" : "text-gray-900"));
  var metaClass = "mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs " + (darkMode ? "text-gray-400" : "text-gray-500");
  var lastDoneClass = "text-xs mt-0.5 " + (darkMode ? "text-gray-500" : "text-gray-400");
  var borderClass = "flex flex-wrap gap-2 mt-3 pt-2 " + (darkMode ? "border-t border-gray-700" : "border-t border-gray-100");

  var greenBtn = darkMode ? "darkGreen" : "green";
  var blueBtn = darkMode ? "darkBlue" : "blue";
  var grayBtn = darkMode ? "darkGray" : "gray";
  var redBtn = darkMode ? "darkRed" : "red";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.25 }}
      className={cardClass}
    >
      <div className="flex items-start gap-3">
        <div className={"mt-0.5 " + (isDone ? "text-green-500" : "text-indigo-500")}>
          <RoomIcon room={room} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={nameClass}>{name}</span>
            {isDone && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
              >
                <Check size={11} />Fait
              </motion.span>
            )}
          </div>

          <div className={metaClass}>
            <span>{room}</span>
            <span>•</span>
            <span>{getFrequencyLabel(task)}</span>
            {assignedTo !== "both" ? (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><User size={11} />{assignedTo}</span>
              </>
            ) : (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><Users size={11} />Les deux</span>
              </>
            )}
          </div>

          {/* Duree estimee */}
          <div className={"inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium " + (darkMode ? "bg-indigo-900/40 text-indigo-300" : "bg-indigo-50 text-indigo-600")}>
            <Clock size={11} />
            ~{durationLabel}
          </div>

          {lastDone && (
            <p className={lastDoneClass}>
              Fait le {formatShortDate(lastDone)} par {lastDoneBy}
            </p>
          )}
        </div>
      </div>

      <div className={borderClass}>
        {!isDone && (
          <ActionButton onClick={function() { onDone(task.id); }} color={greenBtn} icon={React.createElement(Check, { size: 15 })} label="Valider" />
        )}
        {!isDone && task.frequency !== "seasonal" && (
          <ActionButton onClick={function() { onPostpone(task.id); }} color={blueBtn} icon={React.createElement(RotateCcw, { size: 15 })} label="Reporter" />
        )}
        <ActionButton onClick={function() { onEdit(task); }} color={grayBtn} icon={React.createElement(Pencil, { size: 15 })} label="Modifier" />
        <ActionButton onClick={function() { onDelete(task.id); }} color={redBtn} icon={React.createElement(Trash2, { size: 15 })} label="Supprimer" />
      </div>
    </motion.div>
  );
});

export default Task;