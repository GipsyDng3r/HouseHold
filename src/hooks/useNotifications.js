import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { isTaskScheduledOnDate } from "../utils/helpers";

const toastOptions = {
  position: "top-right",
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  style: {
    background: "#fff",
    color: "#111",
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
};

export function useNotifications(tasks) {
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (notifiedRef.current || !tasks || tasks.length === 0) return;
    notifiedRef.current = true;

    const today = new Date();
    const todayTasks = tasks.filter(
      (t) => !t.isDone && isTaskScheduledOnDate(t, today)
    );

    todayTasks.forEach((t) => {
      toast.info(
        `🔔 Rappel : "${t.name}" est prévue aujourd'hui dans le ${t.room} !`,
        toastOptions
      );
    });
  }, [tasks]);

  const notifyDone = (taskName, userName) => {
    toast.success(
      `✅ ${userName} a validé la tâche "${taskName}" !`,
      toastOptions
    );
  };

  const notifyPostponed = (taskName, dateLabel) => {
    toast.info(
      `🔄 La tâche "${taskName}" a été reportée au ${dateLabel}.`,
      toastOptions
    );
  };

  const notifyConflict = (taskName, userName) => {
    toast.warn(
      `⚠️ Conflit : La tâche "${taskName}" a été modifiée par ${userName}.`,
      { ...toastOptions, autoClose: false }
    );
  };

  const notifySync = (count) => {
    if (count === 0) {
      toast.success("✅ Données à jour, aucun changement détecté.", toastOptions);
    } else {
      toast.info(`🔄 ${count} tâche(s) mise(s) à jour.`, toastOptions);
    }
  };

  const notifyImport = (conflictCount) => {
    if (conflictCount === 0) {
      toast.success("✅ Import réussi.", toastOptions);
    } else {
      toast.warn(
        `⚠️ Import terminé. ${conflictCount} conflit(s) résolu(s).`,
        toastOptions
      );
    }
  };

  return { notifyDone, notifyPostponed, notifyConflict, notifySync, notifyImport };
}