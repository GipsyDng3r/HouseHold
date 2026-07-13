import {
  addMonths, addWeeks, setDate,
  nextMonday, nextTuesday, nextWednesday, nextThursday,
  nextFriday, nextSaturday, nextSunday,
  format, parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";
import { DAYS_OF_WEEK } from "./constants";

var DAY_FNS = [
  nextMonday, nextTuesday, nextWednesday, nextThursday,
  nextFriday, nextSaturday, nextSunday,
];

export function getNextOccurrence(task, fromDate) {
  if (!fromDate) fromDate = new Date();
  var frequency = task.frequency;
  var day = task.day;
  var days = task.days;

  if (frequency === "weekly" || frequency === "biweekly") {
    var weeks = frequency === "biweekly" ? 2 : 1;
    if (days && days.length > 0) {
      var candidates = days.map(function(d) {
        var idx = DAYS_OF_WEEK.indexOf(d);
        if (idx < 0) return null;
        var next = DAY_FNS[idx](fromDate);
        if (frequency === "biweekly") next = addWeeks(next, 1);
        return next;
      }).filter(Boolean);
      if (candidates.length === 0) return null;
      candidates.sort(function(a, b) { return a - b; });
      return candidates[0];
    }
    var dayIndex = DAYS_OF_WEEK.indexOf(day);
    if (dayIndex < 0) return null;
    var next = DAY_FNS[dayIndex](fromDate);
    if (frequency === "biweekly") next = addWeeks(next, 1);
    return next;
  }

  if (frequency === "monthly") {
    var next = addMonths(fromDate, 1);
    return setDate(next, Math.min(day, 28));
  }

  return null;
}

export function formatDateFr(date) {
  if (!date) return "";
  var d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE d MMMM", { locale: fr });
}

export function formatShortDate(date) {
  if (!date) return "";
  var d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy");
}

export function getFrequencyLabel(task) {
  var frequency = task.frequency;
  var day = task.day;
  var days = task.days;

  if (frequency === "weekly" || frequency === "biweekly") {
    var prefix = frequency === "biweekly" ? "1 sem. / 2 : " : "Chaque ";
    if (days && days.length > 1) return prefix + days.join(", ");
    return prefix + (days && days[0] ? days[0] : day);
  }
  if (frequency === "monthly") return "Le " + day + " du mois";
  if (frequency === "seasonal") return day.charAt(0).toUpperCase() + day.slice(1);
  return "";
}

export function isTaskScheduledOnDate(task, date) {
  var frequency = task.frequency;
  var day = task.day;
  var days = task.days;

  if (frequency === "weekly" || frequency === "biweekly") {
    var jsDay = date.getDay();
    var mapped = jsDay === 0 ? 6 : jsDay - 1;
    var currentDay = DAYS_OF_WEEK[mapped];

    if (days && days.length > 0) {
      if (days.indexOf(currentDay) < 0) return false;
    } else {
      if (currentDay !== day) return false;
    }

    if (frequency === "biweekly") {
      var weekNum = getWeekNumber(date);
      return weekNum % 2 === 0;
    }
    return true;
  }

  if (frequency === "monthly") {
    return date.getDate() === Number(day);
  }

  if (frequency === "seasonal") {
    var month = date.getMonth();
    var season =
      month >= 2 && month <= 4 ? "printemps" :
      month >= 5 && month <= 7 ? "ete" :
      month >= 8 && month <= 10 ? "automne" : "hiver";
    return season === day;
  }

  return false;
}

function getWeekNumber(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function getCurrentWeekDays() {
  var today = new Date();
  var jsDay = today.getDay();
  var monday = new Date(today);
  monday.setDate(today.getDate() - (jsDay === 0 ? 6 : jsDay - 1));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, function(_, i) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function estimateTaskDuration(task) {
  var name = (task.name || "").toLowerCase();
  var room = (task.room || "").toLowerCase();

  var keywords = [
    { words: ["aspirateur", "passer"], time: 20 },
    { words: ["frigo", "refrigerateur"], time: 30 },
    { words: ["four"], time: 45 },
    { words: ["baignoire", "douche"], time: 20 },
    { words: ["toilettes", "wc"], time: 10 },
    { words: ["vitres", "fenetres", "miroir"], time: 20 },
    { words: ["sol", "balayer", "serpillere"], time: 25 },
    { words: ["vaisselle", "lave vaisselle", "vider"], time: 10 },
    { words: ["linge", "machine", "laver"], time: 15 },
    { words: ["etendre", "plier"], time: 20 },
    { words: ["poussiere"], time: 15 },
    { words: ["courses", "liste"], time: 60 },
    { words: ["barbecue"], time: 40 },
    { words: ["litiere", "caca"], time: 10 },
    { words: ["fontaine", "filtre"], time: 15 },
    { words: ["hotte"], time: 25 },
    { words: ["serviettes", "remplacer"], time: 5 },
    { words: ["draps", "changer draps"], time: 15 },
    { words: ["rangement", "ranger"], time: 30 },
    { words: ["evier"], time: 10 },
    { words: ["cafe"], time: 15 },
    { words: ["canape"], time: 15 },
    { words: ["milbemax", "credelio", "donner"], time: 5 },
  ];

  var best = null;
  var bestScore = 0;

  keywords.forEach(function(k) {
    var score = 0;
    k.words.forEach(function(word) {
      if (name.indexOf(word) >= 0) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = k;
    }
  });

  if (best) return best.time;

  if (room === "cuisine") return 20;
  if (room === "salle de bain") return 15;
  if (room === "salon") return 20;
  if (room === "chambre") return 15;

  return 15;
}

export function formatDuration(minutes) {
  if (minutes < 60) return minutes + " min";
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  if (m === 0) return h + "h";
  return h + "h" + m;
}