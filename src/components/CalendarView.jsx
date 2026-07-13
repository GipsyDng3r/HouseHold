import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, Sofa, Bath, Bed, Home, Check, Clock } from "lucide-react";
import { getCurrentWeekDays, isTaskScheduledOnDate, formatDateFr, estimateTaskDuration, formatDuration } from "../utils/helpers";
import { DAYS_OF_WEEK } from "../utils/constants";

const ROOM_ICONS = {
  Cuisine: ChefHat,
  Salon: Sofa,
  "Salle de bain": Bath,
  Chambre: Bed,
  Autre: Home,
};

const SHORT_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

const CalendarView = memo(function CalendarView({ tasks, onMarkDone, darkMode }) {
  const days = getCurrentWeekDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDay, setSelectedDay] = useState(null);

  const getTasksForDay = function(date) {
    return tasks.filter(function(t) { return isTaskScheduledOnDate(t, date); });
  };

  const hasTasksOn = function(date) { return getTasksForDay(date).length > 0; };
  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  const totalMinutes = selectedTasks
    .filter(function(t) { return !t.isDone; })
    .reduce(function(acc, t) { return acc + estimateTaskDuration(t); }, 0);

  var cardClass = "rounded-2xl shadow-sm border p-4 mb-4 " + (darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100");
  var titleClass = "font-bold mb-3 " + (darkMode ? "text-white" : "text-gray-800");
  var noTaskClass = "text-sm text-center py-8 " + (darkMode ? "text-gray-500" : "text-gray-400");
  var hintClass = "text-center text-sm mt-4 " + (darkMode ? "text-gray-600" : "text-gray-400");

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      <div className={cardClass}>
        <h2 className={titleClass}>Cette semaine</h2>
        <div className="grid grid-cols-7 gap-1">
          {days.map(function(day, i) {
            const isToday = day.getTime() === today.getTime();
            const hasTasks = hasTasksOn(day);
            const isSelected = selectedDay && selectedDay.getTime() === day.getTime();
            const dayTasks = getTasksForDay(day);
            const dayMinutes = dayTasks
              .filter(function(t) { return !t.isDone; })
              .reduce(function(acc, t) { return acc + estimateTaskDuration(t); }, 0);

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={function() { setSelectedDay(isSelected ? null : day); }}
                className={"flex flex-col items-center py-2 px-1 rounded-xl transition-colors " + (
                  isSelected ? "bg-indigo-600 text-white" :
                  isToday ? (darkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-50 text-indigo-700") :
                  hasTasks ? (darkMode ? "bg-gray-700 text-gray-200" : "bg-blue-50 text-blue-800") :
                  (darkMode ? "text-gray-500" : "text-gray-500")
                )}
              >
                <span className="text-xs font-medium">{SHORT_DAYS[i]}</span>
                <span className={"text-sm font-bold mt-0.5 " + (isToday && !isSelected ? "text-indigo-500" : "")}>
                  {day.getDate()}
                </span>
                {hasTasks && (
                  <div className={"w-1.5 h-1.5 rounded-full mt-1 " + (isSelected ? "bg-white" : "bg-indigo-400")} />
                )}
                {/* Temps estimé sous le jour */}
                {dayMinutes > 0 && (
                  <span className={"text-[9px] mt-0.5 " + (isSelected ? "text-indigo-200" : (darkMode ? "text-gray-500" : "text-gray-400"))}>
                    {formatDuration(dayMinutes)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-7 gap-1 mt-1">
          {DAYS_OF_WEEK.map(function(d) {
            return (
              <span key={d} className={"text-center text-[10px] capitalize " + (darkMode ? "text-gray-600" : "text-gray-400")}>
                {d.slice(0, 3)}
              </span>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={selectedDay.toISOString()}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1 overflow-y-auto pb-24"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={"font-semibold capitalize " + (darkMode ? "text-white" : "text-gray-800")}>
                {formatDateFr(selectedDay)}
              </h3>
              <button onClick={function() { setSelectedDay(null); }} className={"p-1.5 rounded-full " + (darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}>
                <X size={16} className={darkMode ? "text-gray-400" : "text-gray-400"} />
              </button>
            </div>

            {/* Temps total du jour */}
            {totalMinutes > 0 && (
              <div className={"inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full mb-3 " + (darkMode ? "bg-indigo-900/40 text-indigo-300" : "bg-indigo-50 text-indigo-600")}>
                <Clock size={12} />
                Temps total : {formatDuration(totalMinutes)}
              </div>
            )}

            {selectedTasks.length === 0 ? (
              <p className={noTaskClass}>Aucune tache prevue ce jour-la.</p>
            ) : (
              selectedTasks.map(function(task) {
                const Icon = ROOM_ICONS[task.room] || Home;
                const duration = estimateTaskDuration(task);

                return (
                  <motion.div
                    key={task.id}
                    className={"flex items-center gap-3 p-3 rounded-xl mb-2 " + (
                      task.isDone
                        ? (darkMode ? "bg-green-900/20" : "bg-green-50")
                        : (darkMode ? "bg-gray-800" : "bg-blue-50")
                    )}
                  >
                    <Icon size={18} className={task.isDone ? "text-green-500" : "text-indigo-500"} />
                    <div className="flex-1 min-w-0">
                      <p className={"font-medium text-sm " + (task.isDone ? "line-through text-gray-400" : (darkMode ? "text-white" : "text-gray-900"))}>
                        {task.name}
                      </p>
                      <div className={"flex items-center gap-2 text-xs " + (darkMode ? "text-gray-500" : "text-gray-400")}>
                        <span>{task.room}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          ~{formatDuration(duration)}
                        </span>
                      </div>
                    </div>
                    {!task.isDone ? (
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={function() { onMarkDone(task.id); }}
                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        <Check size={16} />
                      </motion.button>
                    ) : (
                      <span className="text-xs text-green-500 font-medium">✓ Fait</span>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedDay && (
        <p className={hintClass}>Touchez un jour pour voir ses taches</p>
      )}
    </div>
  );
});

export default CalendarView;