import React, { useState, memo } from "react";
import { AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";
import Task from "./Task";
import RoomFilter from "./RoomFilter";
import { ROOMS } from "../utils/constants";

const TaskList = memo(function TaskList({ tasks, onDone, onPostpone, onEdit, onDelete }) {
  const [roomFilter, setRoomFilter] = useState(null);

  const filtered = roomFilter ? tasks.filter((t) => t.room === roomFilter) : tasks;

  const groups = ROOMS.reduce((acc, room) => {
    const roomTasks = filtered.filter((t) => t.room === room);
    if (roomTasks.length > 0) acc.push({ room, tasks: roomTasks });
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <RoomFilter selected={roomFilter} onChange={setRoomFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ClipboardList size={48} className="mb-3 opacity-40" />
            <p className="font-medium">Aucune tâche</p>
            <p className="text-sm mt-1">Appuyez sur + pour en ajouter une</p>
          </div>
        ) : (
          groups.map(({ room, tasks: roomTasks }) => (
            <div key={room} className="mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
                {room}
              </h2>
              <AnimatePresence mode="popLayout">
                {roomTasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onDone={onDone}
                    onPostpone={onPostpone}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default TaskList;