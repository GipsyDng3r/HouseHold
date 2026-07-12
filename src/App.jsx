import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadConfig } from "./utils/storage";
import { useTasks } from "./hooks/useTasks";
import { useGamification } from "./hooks/useGamification";

import SetupScreen from "./components/SetupScreen";
import TaskList from "./components/TaskList";
import CalendarView from "./components/CalendarView";
import SyncPage from "./components/SyncPage";
import Navbar from "./components/Navbar";
import AddEditTaskModal from "./components/AddEditTaskModal";
import ConfirmationModal from "./components/ConfirmationModal";
import LevelUpModal from "./components/LevelUpModal";
import StatsBar from "./components/StatsBar";

export default function App() {
  const [config, setConfig] = useState(function() { return loadConfig(); });
  const [activeTab, setActiveTab] = useState("home");
  const [editingTask, setEditingTask] = useState(undefined);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingTaskName, setDeletingTaskName] = useState("");
  const [vacationMode, setVacationMode] = useState(function() {
    return localStorage.getItem("vacationMode") === "true";
  });

  const {
    tasks, isLoaded, postponeInfo,
    addTask, updateTask, deleteTask,
    markTaskDone, confirmPostpone, cancelPostpone,
    syncFromStorage, exportTasks, importTasks,
  } = useTasks(config);

  const {
    stats, levelTitle, progress,
    levelUpInfo, waifuUrl,
    addPoints, dismissLevelUp,
  } = useGamification();

  const handleMarkDone = useCallback(function(taskId) {
    const task = tasks.find(function(t) { return t.id === taskId; });
    if (!task) return;
    markTaskDone(taskId);
    const pts = addPoints(task.frequency);
    toast.success(
      "+" + pts + " pts ! Tache \"" + task.name + "\" validee !",
      {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "#4F46E5",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          borderRadius: 12,
        },
      }
    );
  }, [tasks, markTaskDone, addPoints]);

  const handleSaveTask = useCallback(function(formData) {
    if (editingTask && editingTask.id) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setEditingTask(undefined);
  }, [editingTask, addTask, updateTask]);

  const handleDeleteRequest = useCallback(function(id) {
    const task = tasks.find(function(t) { return t.id === id; });
    setDeletingTaskId(id);
    setDeletingTaskName(task ? task.name : "");
  }, [tasks]);

  const handleDeleteConfirm = useCallback(function() {
    deleteTask(deletingTaskId);
    setDeletingTaskId(null);
  }, [deleteTask, deletingTaskId]);

  const toggleVacation = useCallback(function() {
    const next = !vacationMode;
    setVacationMode(next);
    localStorage.setItem("vacationMode", String(next));
  }, [vacationMode]);

  if (!config) {
    return <SetupScreen onComplete={setConfig} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">Taches Menageres</h1>
            <p className="text-xs text-gray-400">{config.user1} & {config.user2} · {config.householdId}</p>
          </div>
          <div className="flex gap-1">
            {[config.user1, config.user2].map(function(user) {
              return (
                <button
                  key={user}
                  onClick={function() { setConfig(function(c) { return Object.assign({}, c, { currentUser: user }); }); }}
                  className={"px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors " + (config.currentUser === user ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500")}
                >
                  {user}
                </button>
              );
            })}
          </div>
        </div>

        {/* Barre de stats */}
        <div className="mt-2 -mx-4">
          <StatsBar stats={stats} levelTitle={levelTitle} progress={progress} />
        </div>

        {/* Mode vacances */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={toggleVacation}
          className={"w-full mt-2 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors " + (vacationMode ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-500")}
        >
          <span>{vacationMode ? "🏖️" : "🏠"}</span>
          {vacationMode ? "Mode vacances actif — Appuyer pour reprendre" : "Activer le mode vacances"}
        </motion.button>
      </header>

      {/* Contenu */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              {isLoaded && (
                vacationMode ? (
                  <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
                    <div className="text-6xl mb-4">🏖️</div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Bonnes vacances !</h2>
                    <p className="text-gray-400 text-sm">Les taches sont en pause.</p>
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onDone={handleMarkDone}
                    onPostpone={function() {}}
                    onEdit={function(task) { setEditingTask(task); }}
                    onDelete={handleDeleteRequest}
                  />
                )
              )}
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              {vacationMode ? (
                <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
                  <div className="text-6xl mb-4">🏖️</div>
                  <h2 className="text-xl font-bold text-gray-700 mb-2">Mode vacances actif</h2>
                  <p className="text-gray-400 text-sm">Le calendrier est en pause.</p>
                </div>
              ) : (
                <CalendarView tasks={tasks} onMarkDone={handleMarkDone} />
              )}
            </motion.div>
          )}

          {activeTab === "sync" && (
            <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              <SyncPage
                config={config}
                onSync={syncFromStorage}
                onExport={exportTasks}
                onImport={importTasks}
                onReset={function() { localStorage.clear(); window.location.reload(); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAB */}
      {activeTab === "home" && !vacationMode && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={function() { setEditingTask(null); }}
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
          onClose={function() { setEditingTask(undefined); }}
        />
      )}

      {deletingTaskId && (
        <ConfirmationModal
          type="delete"
          title="Supprimer la tache"
          message={"Supprimer \"" + deletingTaskName + "\" ?"}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={function() { setDeletingTaskId(null); }}
        />
      )}

      {postponeInfo && (
        <ConfirmationModal
          type="postpone"
          title="Reporter la tache"
          message={"Reportee au " + postponeInfo.nextDayLabel + ". Valider ?"}
          confirmLabel="Oui, reporter"
          cancelLabel="Non"
          onConfirm={confirmPostpone}
          onCancel={cancelPostpone}
        />
      )}

      {/* Modal Level Up avec waifu */}
      <LevelUpModal
        levelUpInfo={levelUpInfo}
        waifuUrl={waifuUrl}
        onClose={dismissLevelUp}
      />

      <ToastContainer />
    </div>
  );
}