import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { ROOMS, DAYS_OF_WEEK, SEASONS, FREQUENCY_LABELS } from "../utils/constants";

const FREQUENCIES = ["weekly", "biweekly", "monthly", "seasonal"];

const defaultTask = {
  name: "",
  room: ROOMS[0],
  frequency: "weekly",
  day: DAYS_OF_WEEK[0],
  days: ["lundi"],
  assignedTo: "both",
};

export default function AddEditTaskModal({ task, users, onSave, onClose }) {
  const [form, setForm] = useState(defaultTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        name: task.name,
        room: task.room,
        frequency: task.frequency,
        day: task.day,
        days: task.days || [task.day],
        assignedTo: task.assignedTo,
      });
    } else {
      setForm(defaultTask);
    }
    setErrors({});
  }, [task]);

  const set = function(key, val) {
    setForm(function(p) { return Object.assign({}, p, { [key]: val }); });
  };

  const handleFreqChange = function(freq) {
    var newDay = form.day;
    var newDays = form.days;
    if (freq === "weekly" || freq === "biweekly") {
      newDay = DAYS_OF_WEEK[0];
      newDays = ["lundi"];
    }
    if (freq === "monthly") { newDay = 1; newDays = null; }
    if (freq === "seasonal") { newDay = SEASONS[0]; newDays = null; }
    setForm(function(p) {
      return Object.assign({}, p, { frequency: freq, day: newDay, days: newDays });
    });
  };

  const toggleDay = function(day) {
    var current = form.days || [];
    var exists = current.indexOf(day) >= 0;
    var updated;
    if (exists) {
      updated = current.filter(function(d) { return d !== day; });
      if (updated.length === 0) return;
    } else {
      updated = current.concat([day]);
    }
    setForm(function(p) {
      return Object.assign({}, p, { days: updated, day: updated[0] });
    });
  };

  const validate = function() {
    var e = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.room) e.room = "La piece est requise";
    return e;
  };

  const handleSave = function() {
    var e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    var data = Object.assign({}, form, { name: form.name.trim() });
    if (data.frequency === "weekly" || data.frequency === "biweekly") {
      data.day = data.days[0];
    }
    onSave(data);
  };

  var isWeekly = form.frequency === "weekly" || form.frequency === "biweekly";
  var dayOptions = form.frequency === "monthly"
    ? Array.from({ length: 31 }, function(_, i) { return i + 1; })
    : SEASONS;

  var assignOptions = [
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
        className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
        onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
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
              {task ? "Modifier la tache" : "Nouvelle tache"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[70vh]">

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de la tache</label>
              <input
                value={form.name}
                onChange={function(e) { set("name", e.target.value); setErrors(function(p) { return Object.assign({}, p, { name: "" }); }); }}
                placeholder="Ex : Passer l'aspirateur"
                className={"w-full px-4 py-3 rounded-xl border text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 " + (errors.name ? "border-red-400" : "border-gray-200")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Piece */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Piece</label>
              <select value={form.room} onChange={function(e) { set("room", e.target.value); }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {ROOMS.map(function(r) { return <option key={r} value={r}>{r}</option>; })}
              </select>
            </div>

            {/* Frequence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Frequence</label>
              <div className="grid grid-cols-2 gap-2">
                {FREQUENCIES.map(function(f) {
                  return (
                    <button key={f} onClick={function() { handleFreqChange(f); }}
                      className={"py-2 rounded-xl text-sm font-medium border transition-colors " + (form.frequency === f ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600")}>
                      {FREQUENCY_LABELS[f]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jours (weekly / biweekly) */}
            {isWeekly && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jours {form.frequency === "biweekly" ? "(toutes les 2 sem.)" : ""}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DAYS_OF_WEEK.map(function(d) {
                    var selected = form.days && form.days.indexOf(d) >= 0;
                    return (
                      <button key={d} onClick={function() { toggleDay(d); }}
                        className={"py-2 rounded-xl text-xs font-medium border transition-colors capitalize " + (selected ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600")}>
                        {d.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Jour du mois ou saison */}
            {!isWeekly && form.frequency !== "monthly" && form.frequency !== "seasonal" ? null : !isWeekly && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {form.frequency === "monthly" ? "Jour du mois" : "Saison"}
                </label>
                <select
                  value={form.day}
                  onChange={function(e) { set("day", form.frequency === "monthly" ? Number(e.target.value) : e.target.value); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {dayOptions.map(function(d) { return <option key={d} value={d}>{d}</option>; })}
                </select>
              </div>
            )}

            {/* Assigne a */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigne a</label>
              <div className="flex gap-2">
                {assignOptions.map(function(opt) {
                  return (
                    <button key={opt.value} onClick={function() { set("assignedTo", opt.value); }}
                      className={"flex-1 py-2 rounded-xl text-sm font-medium border transition-colors " + (form.assignedTo === opt.value ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600")}>
                      {opt.label}
                    </button>
                  );
                })}
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
              {task ? "Enregistrer" : "Ajouter la tache"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}