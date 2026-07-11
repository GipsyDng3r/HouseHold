import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, Key, ArrowRight } from "lucide-react";
import { saveConfig } from "../utils/storage";

export default function SetupScreen({ onComplete }) {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [householdId, setHouseholdId] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!user1.trim()) e.user1 = "Requis";
    if (!user2.trim()) e.user2 = "Requis";
    if (!householdId.trim()) e.householdId = "Requis";
    if (householdId.trim().length < 4) e.householdId = "Minimum 4 caractères";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const config = {
      user1: user1.trim(),
      user2: user2.trim(),
      householdId: householdId.trim().toUpperCase(),
      currentUser: user1.trim(),
    };
    saveConfig(config);
    onComplete(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Home size={32} color="#fff" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Tâches Ménagères</h1>
          <p className="text-gray-500 mt-2">Configurez votre foyer pour commencer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <Users size={18} />
            <span>Les membres du foyer</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Votre prénom</label>
            <input
              type="text"
              value={user1}
              onChange={(e) => { setUser1(e.target.value); setErrors((p) => ({ ...p, user1: "" })); }}
              placeholder="Ex : Paul"
              className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.user1 ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.user1 && <p className="text-red-500 text-xs mt-1">{errors.user1}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom de votre partenaire</label>
            <input
              type="text"
              value={user2}
              onChange={(e) => { setUser2(e.target.value); setErrors((p) => ({ ...p, user2: "" })); }}
              placeholder="Ex : Marie"
              className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.user2 ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.user2 && <p className="text-red-500 text-xs mt-1">{errors.user2}</p>}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-3">
              <Key size={18} />
              <span>Identifiant du foyer</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Code unique à partager avec votre partenaire (ex : DUPONT2024).
            </p>
            <input
              type="text"
              value={householdId}
              onChange={(e) => { setHouseholdId(e.target.value); setErrors((p) => ({ ...p, householdId: "" })); }}
              placeholder="Ex : FAMILLE123"
              className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono ${errors.householdId ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.householdId && <p className="text-red-500 text-xs mt-1">{errors.householdId}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            Commencer
            <ArrowRight size={20} />
          </motion.button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Toutes les données restent sur votre appareil.
        </p>
      </motion.div>
    </div>
  );
}