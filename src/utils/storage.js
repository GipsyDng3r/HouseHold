const CONFIG_KEY = "householdConfig";
const MAX_STORAGE_BYTES = 5 * 1024 * 1024;

export function getStorageKey(householdId) {
  return "householdTasks_" + householdId;
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
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
  } catch (e) {
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
    householdId: householdId,
    exportedAt: new Date().toISOString(),
    tasks: tasks,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "taches_" + householdId + "_" + Date.now() + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importTasksFromJSON(file, existingTasks) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.tasks || !Array.isArray(data.tasks)) {
          reject(new Error("Format JSON invalide."));
          return;
        }
        const merged = mergeTasksWithConflictDetection(existingTasks, data.tasks);
        resolve(merged);
      } catch (err) {
        reject(new Error("Erreur de lecture du fichier JSON."));
      }
    };
    reader.onerror = function() {
      reject(new Error("Erreur lors de la lecture."));
    };
    reader.readAsText(file);
  });
}

export function mergeTasksWithConflictDetection(localTasks, remoteTasks) {
  const map = new Map();
  const conflicts = [];

  localTasks.forEach(function(t) { map.set(t.id, t); });

  remoteTasks.forEach(function(remote) {
    const local = map.get(remote.id);
    if (!local) {
      map.set(remote.id, remote);
    } else {
      const localTs = new Date(local.lastUpdatedAt || 0).getTime();
      const remoteTs = new Date(remote.lastUpdatedAt || 0).getTime();
      if (remoteTs > localTs) {
        map.set(remote.id, remote);
        conflicts.push(remote.name);
      }
    }
  });

  return {
    tasks: Array.from(map.values()),
    conflicts: conflicts,
  };
}