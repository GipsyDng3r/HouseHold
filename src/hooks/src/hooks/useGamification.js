import { useState, useCallback } from "react";

const POINTS_PER_FREQUENCY = {
  weekly: 10,
  biweekly: 15,
  monthly: 20,
  seasonal: 50,
};

const LEVEL_THRESHOLD = 100;

const LEVEL_TITLES = [
  "Stagiaire du foyer",
  "Apprenti menager",
  "Agent de proprete",
  "Maitre des taches",
  "Legende du balai",
  "Dieu du logis",
];

function loadStats() {
  try {
    var raw = localStorage.getItem("gamification");
    return raw ? JSON.parse(raw) : { points: 0, level: 1, totalPoints: 0 };
  } catch (e) {
    return { points: 0, level: 1, totalPoints: 0 };
  }
}

function saveStats(stats) {
  localStorage.setItem("gamification", JSON.stringify(stats));
}

export function useGamification() {
  const [stats, setStats] = useState(function() { return loadStats(); });
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [waifuUrl, setWaifuUrl] = useState(null);

  const fetchWaifu = useCallback(async function() {
    try {
      var res = await fetch("https://api.waifu.pics/sfw/waifu");
      var data = await res.json();
      setWaifuUrl(data.url);
    } catch (e) {
      setWaifuUrl(null);
    }
  }, []);

  const addPoints = useCallback(function(frequency) {
    var pts = POINTS_PER_FREQUENCY[frequency] || 10;

    setStats(function(prev) {
      var newTotal = prev.totalPoints + pts;
      var newPoints = prev.points + pts;
      var newLevel = prev.level;
      var leveledUp = false;

      while (newPoints >= LEVEL_THRESHOLD) {
        newPoints -= LEVEL_THRESHOLD;
        newLevel += 1;
        leveledUp = true;
      }

      var next = { points: newPoints, level: newLevel, totalPoints: newTotal };
      saveStats(next);

      if (leveledUp) {
        var title = LEVEL_TITLES[Math.min(newLevel - 1, LEVEL_TITLES.length - 1)];
        setLevelUpInfo({ level: newLevel, title: title, pts: pts });
        fetchWaifu();
      }

      return next;
    });

    return pts;
  }, [fetchWaifu]);

  const dismissLevelUp = useCallback(function() {
    setLevelUpInfo(null);
    setWaifuUrl(null);
  }, []);

  var levelTitle = LEVEL_TITLES[Math.min(stats.level - 1, LEVEL_TITLES.length - 1)];
  var progress = Math.round((stats.points / LEVEL_THRESHOLD) * 100);

  return {
    stats: stats,
    levelTitle: levelTitle,
    progress: progress,
    levelUpInfo: levelUpInfo,
    waifuUrl: waifuUrl,
    addPoints: addPoints,
    dismissLevelUp: dismissLevelUp,
  };
}