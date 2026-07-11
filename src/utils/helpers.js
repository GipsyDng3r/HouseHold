import {
  addMonths, setDate,
  nextMonday, nextTuesday, nextWednesday, nextThursday,
  nextFriday, nextSaturday, nextSunday,
  format, parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";
import { DAYS_OF_WEEK } from "./constants";

export function getNextOccurrence(task, fromDate) {
  if (!fromDate) fromDate = new Date();
  var frequency = task.frequency;
  var day = task.day;

  if (frequency === "weekly") {
    var dayIndex = DAYS_OF_WEEK.indexOf(day);
    var fns = [
      nextMonday, nextTuesday, nextWednesday, nextThursday,
      nextFriday, nextSaturday, nextSunday,
    ];
    if (dayIndex < 0 || dayIndex >= fns.length) return null;
    return fns[dayIndex](fromDate);
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
  if (frequency === "weekly") return "Chaque " + day;
  if (frequency === "monthly") return "Le " + day + " du mois";
  if (frequency === "seasonal") return day.charAt(0).toUpperCase() + day.slice(1);
  return "";
}

export function isTaskScheduledOnDate(task, date) {
  var frequency = task.frequency;
  var day = task.day;

  if (frequency === "weekly") {
    var jsDay = date.getDay();
    var mapped = jsDay === 0 ? 6 : jsDay - 1;
    return DAYS_OF_WEEK[mapped] === day;
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