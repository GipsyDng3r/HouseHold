import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { ROOMS, DAYS_OF_WEEK, SEASONS, FREQUENCY_LABELS } from "../utils/constants";

const FREQUENCIES = ["weekly", "monthly", "seasonal"];

const defaultTask = {
  name: "",
  room: ROOMS[0],
  frequency: "weekly",
  day: DAYS_OF_WEEK[0],
  assignedTo: "both",
};

export default function AddEditTaskModal({ task, users, onSave, onClose }) {
  const [form, setForm] = useState(defaultTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({ name: task.name, room: task.room, frequency: task.frequency, day: task.day, assignedTo: task.assignedTo });
    } else {
      setForm(defaultTask);
    }
    setErrors({});
  }, [task]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleFreqChange = (freq) => {
    let newDay = form.day;
    if (freq === "weekly") newDay = DAYS_OF_WEEK[0];
    if (freq === "monthly") newDay = 1;
    if (freq === "seasonal") newDay = SEASONS[0];
    setForm((p) => ({ ...p, frequency: freq, day: newDay }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.room) e.room = "La pièce est requise";
    if (!form.assignedTo) e.assignedTo = "L'assignation est requise";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form, name: form.name.trim() });
  };

  const dayOptions =
    form.frequency === "weekly" ? DAYS_OF_WEEK :
    form.frequency === "monthly" ? Array.from({ length: 31 }, (_, i) => i + 1) :
    SEASONS;

  const assignOptions = [
    { value: "both", label: "Les deux" },
    { value: users[0], label: users[0] },
    { value: users[1], label: users[1] },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center px-0 sm:px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">
              {task ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de la tâche</label>
              <input
                value={form.name}
                onChange={(e) => { set("name", e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="Ex : Passer l'aspirateur"
                className={`w-full px-4 py-3 rounded-xl border text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pièce</label>
              <select value={form.room} onChange={(e) => set("room", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fréquence</label>
              <div className="flex gap-2">
                {FREQUENCIES.map((f) => (
                  <button key={f} onClick={() => handleFreqChange(f)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      form.frequency === f ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600"
                    }`}>
                    {FREQUENCY_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {form.frequency === "weekly" ? "Jour" : form.frequency === "monthly" ? "Jour du mois" : "Saison"}
              </label>
              <select
                value={form.day}
                onChange={(e) => set("day", form.frequency === "monthly" ? Number(e.target.value) : e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {dayOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigné à</label>
              <div className="flex gap-2">
                {assignOptions.map(({ value, label }) => (
                  <button key={value} onClick={() => set("assignedTo", value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      form.assignedTo === value ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-100">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <Save size={18} />
              {task ? "Enregistrer les modifications" : "Ajouter la tâche"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}