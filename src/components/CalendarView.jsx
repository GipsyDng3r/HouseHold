import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, Sofa, Bath, Bed, Home, Check } from "lucide-react";
import { getCurrentWeekDays, isTaskScheduledOnDate, formatDateFr } from "../utils/helpers";
import { DAYS_OF_WEEK } from "../utils/constants";

const ROOM_ICONS = {
  Cuisine: ChefHat,
  Salon: Sofa,
  "Salle de bain": Bath,
  Chambre: Bed,
  Autre: Home,
};

const SHORT_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

const CalendarView = memo(function CalendarView({ tasks, onMarkDone }) {
  const days = getCurrentWeekDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDay, setSelectedDay] = useState(null);

  const getTasksForDay = (date) => tasks.filter((t) => isTaskScheduledOnDate(t, date));
  const hasTasksOn = (date) => getTasksForDay(date).length > 0;
  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Cette semaine</h2>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isToday = day.getTime() === today.getTime();
            const hasTasks = hasTasksOn(day);
            const isSelected = selectedDay?.getTime() === day.getTime();

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-colors ${
                  isSelected ? "bg-indigo-600 text-white" :
                  isToday ? "bg-indigo-50 text-indigo-700" :
                  hasTasks ? "bg-blue-50 text-blue-800" : "text-gray-500"
                }`}
              >
                <span className="text-xs font-medium">{SHORT_DAYS[i]}</span>
                <span className={`text-sm font-bold mt-0.5 ${isToday && !isSelected ? "text-indigo-600" : ""}`}>
                  {day.getDate()}
                </span>
                {hasTasks && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-indigo-400"}`} />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-7 gap-1 mt-1">
          {DAYS_OF_WEEK.map((d) => (
            <span key={d} className="text-center text-[10px] text-gray-400 capitalize">
              {d.slice(0, 3)}
            </span>
          ))}
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 capitalize">
                {formatDateFr(selectedDay)}
              </h3>
              <button onClick={() => setSelectedDay(null)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                Aucune tâche prévue ce jour-là.
              </p>
            ) : (
              selectedTasks.map((task) => {
                const Icon = ROOM_ICONS[task.room] ?? Home;
                return (
                  <motion.div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 ${task.isDone ? "bg-green-50" : "bg-blue-50"}`}
                  >
                    <Icon size={18} className={task.isDone ? "text-green-500" : "text-indigo-500"} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${task.isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-400">{task.room}</p>
                    </div>
                    {!task.isDone ? (
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => onMarkDone(task.id)}
                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        <Check size={16} />
                      </motion.button>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">✓ Fait</span>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedDay && (
        <p className="text-center text-gray-400 text-sm mt-4">
          Touchez un jour pour voir ses tâches
        </p>
      )}
    </div>
  );
});

export default CalendarView;