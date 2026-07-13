import React, { useState, memo } from "react";
import { AnimatePresence } from "framer-motion";
import { ClipboardList, Clock } from "lucide-react";
import Task from "./Task";
import RoomFilter from "./RoomFilter";
import { ROOMS } from "../utils/constants";
import { estimateTaskDuration, formatDuration } from "../utils/helpers";

const TaskList = memo(function TaskList({ tasks, onDone, onPostpone, onEdit, onDelete, darkMode }) {
  const [roomFilter, setRoomFilter] = useState(null);

  const filtered = roomFilter ? tasks.filter(function(t) { return t.room === roomFilter; }) : tasks;

  const groups = ROOMS.reduce(function(acc, room) {
    const roomTasks = filtered.filter(function(t) { return t.room === room; });
    if (roomTasks.length > 0) acc.push({ room: room, tasks: roomTasks });
    return acc;
  }, []);

  // Temps total estime pour toutes les taches a faire
  const totalMinutes = filtered
    .filter(function(t) { return !t.isDone; })
    .reduce(function(acc, t) { return acc + estimateTaskDuration(t); }, 0);

  var emptyClass = "flex flex-col items-center justify-center py-20 " + (darkMode ? "text-gray-600" : "text-gray-400");
  var titleClass = "text-xs font-semibold uppercase tracking-widest mb-2 px-1 " + (darkMode ? "text-gray-500" : "text-gray-400");
  var totalClass = "flex items-center gap-1.5 text-xs font-medium px-4 pb-2 " + (darkMode ? "text-indigo-400" : "text-indigo-500");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <RoomFilter selected={roomFilter} onChange={setRoomFilter} darkMode={darkMode} />
      </div>

      {/* Temps total */}
      {totalMinutes > 0 && (
        <div className={totalClass}>
          <Clock size={13} />
          Temps total estimé : <strong>{formatDuration(totalMinutes)}</strong>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {groups.length === 0 ? (
          <div className={emptyClass}>
            <ClipboardList size={48} className="mb-3 opacity-40" />
            <p className="font-medium">Aucune tache</p>
            <p className="text-sm mt-1">Appuyez sur + pour en ajouter une</p>
          </div>
        ) : (
          groups.map(function(group) {
            var roomTime = group.tasks
              .filter(function(t) { return !t.isDone; })
              .reduce(function(acc, t) { return acc + estimateTaskDuration(t); }, 0);

            return (
              <div key={group.room} className="mb-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h2 className={titleClass}>{group.room}</h2>
                  {roomTime > 0 && (
                    <span className={"text-xs flex items-center gap-1 " + (darkMode ? "text-gray-500" : "text-gray-400")}>
                      <Clock size={11} />
                      {formatDuration(roomTime)}
                    </span>
                  )}
                </div>
                <AnimatePresence mode="popLayout">
                  {group.tasks.map(function(task) {
                    return (
                      <Task
                        key={task.id}
                        task={task}
                        onDone={onDone}
                        onPostpone={onPostpone}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        darkMode={darkMode}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default TaskList;