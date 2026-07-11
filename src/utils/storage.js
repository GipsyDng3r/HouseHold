const CONFIG_KEY = "householdConfig";
const MAX_STORAGE_BYTES = 5 * 1024 * 1024;

export function getStorageKey(householdId) {
  return `householdTasks_${householdId}`;
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadTasks(householdId) {
  try {
    const raw = localStorage.getItem(getStorageKey(householdId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTasks(householdId, tasks) {
  const key = getStorageKey(householdId);
  const payload = JSON.stringify(tasks);
  if (payload.length > MAX_STORAGE_BYTES) {
    console.warn("LocalStorage: limite de 5 Mo atteinte.");
    return false;
  }
  localStorage.setItem(key, payload);
  return true;
}

export function exportTasksToJSON(householdId, tasks) {
  const data = {
    householdId,
    exportedAt: new Date().toISOString(),
    tasks,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taches_${householdId}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTasksFromJSON(file, existingTasks) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.tasks || !Array.isArray(data.tasks)) {
          reject(new Error("Format JSON invalide."));
          return;
        }
        const merged = mergeTasksWithConflictDetection(existingTasks, data.tasks);
        resolve(merged);
      } catch {
        reject(new Error("Erreur de lecture du fichier JSON."));
      }
    };
    reader.onerror = () => reject(new Error("Erreur lors de la lecture."));
    reader.readAsText(file);
  });
}

export function mergeTasksWithConflictDetection(localTasks, remoteTasks) {
  const map = new Map();
  const conflicts = [];

  localTasks.forEach((t) => map.set(t.id, t));

  remoteTasks.forEach((remote) => {
    const local = map.get(remote.id);