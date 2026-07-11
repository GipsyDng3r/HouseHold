import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadConfig } from "./utils/storage";
import { useTasks } from "./hooks/useTasks";

import SetupScreen from "./components/SetupScreen";
import TaskList from "./components/TaskList";
import CalendarView from "./components/CalendarView";
import SyncPage from "./components/SyncPage";
import Navbar from "./components/Navbar";
import AddEditTaskModal from "./components/AddEditTaskModal";
import ConfirmationModal from "./components/ConfirmationModal";

export default function App() {
  const [config, setConfig] = useState(() => loadConfig());
  const [activeTab, setActiveTab] = useState("home");
  const [editingTask, setEditingTask] = useState(undefined);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingTaskName, setDeletingTaskName] = useState("");

  const {
    tasks,
    isLoaded,
    postponeInfo,
    addTask,
    updateTask,
    deleteTask,
    markTaskDone,
    confirmPostpone,
    cancelPostpone,
    syncFromStorage,
    exportTasks,
    importTasks,
  } = useTasks(config);

  const handleSaveTask = useCallback(
    (formData) => {
      if (editingTask?.id) {
        updateTask(editingTask.id, formData);
      } else {
        addTask(formData);
      }
      setEditingTask(undefined);
    },
    [editingTask, addTask, updateTask]
  );

  const handleDeleteRequest = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    setDeletingTaskId(id);
    setDeletingTaskName(task?.name ?? "");
  }, [tasks]);

  const handleDeleteConfirm = useCallback(() => {
    deleteTask(deletingTaskId);
    setDeletingTaskId(null);
  }, [deleteTask, deletingTaskId]);

  if (!config) {
    return <SetupScreen onComplete={setConfig} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col max-w-md mx-auto relative">
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">Tâches Ménagères</h1>
          <p className="text-xs text-gray-400">{config.user1} & {config.user2} · {config.householdId}</p>
        </div>
        <div className="flex gap-1">
          {[config.user1, config.user2].map((user) => (
            <button
              key={user}
              onClick={() => setConfig((c) => ({ ...c, currentUser: user }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                config.currentUser === user ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {user}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              {isLoaded && (
                <TaskList
                  tasks={tasks}
                  onDone={markTaskDone}
                  onPostpone={() => {}}
                  onEdit={(task) => setEditingTask(task)}
                  onDelete={handleDeleteRequest}
                />
              )}
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              <CalendarView tasks={tasks} onMarkDone={markTaskDone} />
            </motion.div>
          )}

          {activeTab === "sync" && (
            <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              <SyncPage
                config={config}
                onSync={syncFromStorage}
                onExport={exportTasks}
                onImport={importTasks}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {activeTab === "home" && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setEditingTask(null)}
          className="fixed bottom-20 right-5 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center text-3xl font-light z-30 hover:bg-indigo-700 transition-colors"
        >
          +
        </motion.button>
      )}

      <Navbar activeTab={activeTab} onChange={setActiveTab} />

      {editingTask !== undefined && (
        <AddEditTaskModal
          task={editingTask}
          users={[config.user1, config.user2]}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(undefined)}
        />
      )}

      {deletingTaskId && (
        <ConfirmationModal
          type="delete"
          title="Supprimer la tâche"
          message={`Êtes-vous sûr de vouloir supprimer "${deletingTaskName}" ?`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}

      {postponeInfo && (
        <ConfirmationModal
          type="postpone"
          title="Reporter la tâche"
          message={`Reportée au ${postponeInfo.nextDayLabel}. Valider ?`}
          confirmLabel="Oui, reporter"
          cancelLabel="Non"
          onConfirm={confirmPostpone}
          onCancel={cancelPostpone}
        />
      )}

      <ToastContainer />
    </div>
  );
}