import {
  addMonths, setDate,
  nextMonday, nextTuesday, nextWednesday, nextThursday,
  nextFriday, nextSaturday, nextSunday,
  format, parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";
import { DAYS_OF_WEEK } from "./constants";

export function getNextOccurrence(task, fromDate = new Date()) {
  const { frequency, day } = task;

  if (frequency === "weekly") {
    const dayIndex = DAYS_OF_WEEK.indexOf(day);
    const fns = [
      nextMonday, nextTuesday, nextWednesday, nextThursday,
      nextFriday, nextSaturday, nextSunday,
    ];
    if (dayIndex < 0 || dayIndex >= fns.length) return null;
    return fns[dayIndex](fromDate);
  }

  if (frequency === "monthly") {
    const next = addMonths(fromDate, 1);
    return setDate(next, Math.min(day, 28));
  }

  return null;
}

export function formatDateFr(date) {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE d MMMM", { locale: fr });
}

export function formatShortDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy");
}

export function getFrequencyLabel(task) {
  const { frequency, day } = task;
  if (frequency === "weekly") return `Chaque ${day}`;
  if (frequency === "monthly") return `Le ${day} du mois`;
  if (frequency === "seasonal") return day.charAt(0).toUpperCase() + day.slice(1);
  return "";
}

export function isTaskScheduledOnDate(task, date) {
  const { frequency, day } = task;

  if (frequency === "weekly") {
    const jsDay = date.getDay();
    const mapped = jsDay === 0 ? 6 : jsDay - 1;
    return DAYS_OF_WEEK[mapped] === day;
  }

  if (frequency === "monthly") {
    return date.getDate() === Number(day);
  }

  if (frequency === "seasonal") {
    const month = date.getMonth();
    const season =
      month >= 2 && month <= 4 ? "printemps" :
      month >= 5 && month <= 7 ? "été" :
      month >= 8 && month <= 10 ? "automne" : "hiver";
    return season === day;
  }

  return false;
}

export function getCurr