import { useState, useCallback, useEffect } from "react";
import { loadTasks, saveTasks, exportTasksToJSON, importTasksFromJSON, mergeTasksWithConflictDetection } from "../utils/storage";
import { sampleTasks } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";

export function useLocalStorage(householdId) {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!householdId) return;
    const saved = loadTasks(householdId);
    if (saved && saved.length > 0) {
      setTasks(saved);
    } else {
      const defaultTasks = sampleTasks.map((t) => ({
        ...t,
        lastUpdatedAt: new Date().toISOString(),
      }));
      saveTasks(householdId, defaultTasks);
      setTasks(defaultTasks);
    }
    setIsLoaded(true);
  }, [householdId]);

  const persist = useCallback(
    (newTasks) => {
      setTasks(newTasks);
      saveTasks(householdId, newTasks);
    },
    [householdId]
  );

  const addTask = useCallback(
    (taskData) => {
      const newTask = {
        ...taskData,
        id: uuidv4(),
        isDone: false,
        lastDone: null,
        lastDoneBy: null,
        lastUpdatedAt: new Date().toISOString(),
      };
      persist([...tasks, newTask]);
      return newTask;
    },
    [tasks, persist]
  );

  const updateTask = useCallback(
    (id, changes) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? { ...t, ...changes, lastUpdatedAt: new Date().toISOString() }
          : t
      );
      persist(updated);
    },
    [tasks, persist]
  );

  const deleteTask = useCallback(
    (id) => {
      persist(tasks.filter((t) => t.id !== id));
    },
    [tasks, persist]
  );

  const markTaskDone = useCallback(
    (id, userName) => {
      const now = new Date().toISOString();
      const updated = tasks.map((t) =>
        t.id === id
          ? { ...t, isDone: true, lastDone: now, lastDoneBy: userName, lastUpdatedAt: now }
          : t
      );
      persist(updated);
      return updated.find((t) => t.id === id);
    },
    [tasks, persist]
  );

  const postponeTask = useCallback(
    (id, nextDay) => {
      const now = new Date().toISOString();
      const updated = tasks.map((t) =>
        t.id === id
          ? { ...t, isDone: false, day: nextDay ?? t.day, lastUpdatedAt: now }
          : t
      );
      persist(updated);
    },
    [tasks, persist]
  );

  const syncFromStorage = useCallback(() => {
    const saved = loadTasks(householdId);
    if (!saved) return [];
    const { tasks: merged, conflicts } = mergeTasksWithConflictDetection(tasks, saved);
    persist(merged);
    return conflicts;
  }, [householdId, tasks, persist]);

  const exportTasks = useCallback(() => {
    exportTasksToJSON(householdId, tasks);
  }, [householdId, tasks]);

  const importTasks = useCallback(
    async (file) => {
      const { tasks: merged, conflicts } = await importTasksFromJSON(file, tasks);
      persist(merged);
      return conflicts;
    },
    [tasks, persist]
  );

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    markTaskDone,
    postponeTask,
    syncFromStorage,
    exportTasks,
    importTasks,
  };
}