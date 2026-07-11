import React, { useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Download, Upload, Info, Users, Key } from "lucide-react";

export default function SyncPage({ config, onSync, onExport, onImport }) {
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <div className="px-4 pt-6 pb-24 space-y-5 overflow-y-auto h-full">
      <h2 className="text-xl font-bold text-gray-900">Synchronisation</h2>

      <div className="bg-indigo-50 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
          <Info size={16} />
          Votre foyer
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={15} className="text-indigo-400" />
          <span>{config.user1} &amp; {config.user2}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Key size={15} className="text-indigo-400" />
          <span className="font-mono font-semibold">{config.householdId}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Utilisateur actif : <strong>{config.currentUser}</strong>
        </p>
      </div>

      <SyncCard
        title="Synchroniser"
        description="Met à jour les données depuis le stockage local. Utile si votre partenaire a modifié des tâches sur le même appareil."
        buttonLabel="↻ Synchroniser maintenant"
        buttonColor="indigo"
        Icon={RefreshCw}
        onClick={onSync}
      />

      <SyncCard
        title="Exporter les données"
        description="Télécharge un fichier JSON de toutes vos tâches à partager avec votre partenaire."
        buttonLabel="Télécharger le fichier JSON"
        buttonColor="green"
        Icon={Download}
        onClick={onExport}
      />

      <SyncCard
        title="Importer des données"
        description="Chargez un fichier JSON exporté par votre partenaire. Les conflits sont résolus automatiquement."
        buttonLabel="Choisir un fichier JSON"
        buttonColor="blue"
        Icon={Upload}
        onClick={() => fileRef.current?.click()}
      />
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Comment ça marche ?</strong><br />
          Même navigateur → Synchroniser.<br /><br />
          Appareils différents → Exporter depuis l'un, Importer dans l'autre.<br /><br />
          En cas de conflit, la version la plus récente est conservée.
        </p>
      </div>
    </div>
  );
}

function SyncCard({ title, description, buttonLabel, buttonColor, Icon, onClick }) {
  const colorClasses = {
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
    green: "bg-green-600 hover:bg-green-700 shadow-green-200",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 font-semibold text-gray-900 mb-1.5">
        <Icon size={17} className="text-gray-500" />
        {title}
      </div>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`w-full py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-colors ${colorClasses[buttonColor]}`}
      >
        {buttonLabel}
      </motion.button>
    </div>
  );
}