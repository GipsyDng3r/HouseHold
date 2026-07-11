import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useNotifications } from "./useNotifications";
import { getNextOccurrence, formatDateFr } from "../utils/helpers";
import { DAYS_OF_WEEK } from "../utils/constants";

export function useTasks(config) {
  const householdId = config?.householdId ?? "";
  const currentUser = config?.currentUser ?? "Moi";

  const storage = useLocalStorage(householdId);
  const notifs = useNotifications(storage.tasks);

  const [postponeInfo, setPostponeInfo] = useState(null);

  const handleMarkDone = useCallback(
    (taskId) => {
      const task = storage.tasks.find((t) => t.id === taskId);
      if (!task) return;

      storage.markTaskDone(taskId, currentUser);
      notifs.notifyDone(task.name, currentUser);

      if (task.frequency !== "seasonal") {
        const nextDate = getNextOccurrence(task);
        if (nextDate) {
          const nextDayLabel = formatDateFr(nextDate);
          const nextDay =
            task.frequency === "weekly"
              ? DAYS_OF_WEEK[nextDate.getDay() === 0 ? 6 : nextDate.getDay() - 1]
              : nextDate.getDate();
          setPostponeInfo({ task, nextDate, nextDayLabel, nextDay });
        }
      }
    },
    [storage, notifs, currentUser]
  );

  const confirmPostpone = useCallback(() => {
    if (!postponeInfo) return;
    storage.postponeTask(postponeInfo.task.id, postponeInfo.nextDay);
    notifs.notifyPostponed(postponeInfo.task.name, postponeInfo.nextDayLabel);
    setPostponeInfo(null);
  }, [postponeInfo, storage, notifs]);

  const cancelPostpone = useCallback(() => setPostponeInfo(null), []);

  const handleSync = useCallback(() => {
    const conflicts = storage.syncFromStorage();
    if (conflicts.length > 0) {
      conflicts.forEach((name) =>
        notifs.notifyConflict(name, "un autre utilisateur")
      );
    } else {
      notifs.notifySync(0);
    }
  }, [storage, notifs]);

  const handleImport = useCallback(
    async (file) => {
      const conflicts = await storage.importTasks(file);
      notifs.notifyImport(conflicts.length);
      if (conflicts.length > 0) {
        conflicts.forEach((name) =>
          notifs.notifyConflict(name, "le fichier importé")
        );
      }
    },
    [storage, notifs]
  );

  return {
    tasks: storage.tasks,
    isLoaded: storage.isLoaded,
    postponeInfo,
    addTask: storage.addTask,
    updateTask: storage.updateTask,
    deleteTask: storage.deleteTask,
    markTaskDone: handleMarkDone,
    confirmPostpone,
    cancelPostpone,
    syncFromStorage: handleSync,
    exportTasks: storage.exportTasks,
    importTasks: handleImport,
  };
}