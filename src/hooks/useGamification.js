import { useState, useCallback } from "react";

var POINTS_PER_FREQUENCY = {
  weekly: 10,
  biweekly: 15,
  monthly: 20,
  seasonal: 50,
};

var LEVEL_THRESHOLD = 100;

var LEVEL_TITLES = [
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
  var init = useState(function() { return loadStats(); });
  var stats = init[0];
  var setStats = init[1];

  var initLU = useState(null);
  var levelUpInfo = initLU[0];
  var setLevelUpInfo = initLU[1];

  var initW = useState(null);
  var waifuUrl = initW[0];
  var setWaifuUrl = initW[1];

  var fetchWaifu = useCallback(async function() {
    try {
      var res = await fetch("https://api.waifu.pics/sfw/waifu");
      var data = await res.json();
      setWaifuUrl(data.url);
    } catch (e) {
      setWaifuUrl(null);
    }
  }, []);

  var addPoints = useCallback(function(frequency) {
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

  var dismissLevelUp = useCallback(function() {
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