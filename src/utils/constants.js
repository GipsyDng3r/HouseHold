export const SEASONS = ["printemps", "ete", "automne", "hiver"];
export const ROOMS = ["Cuisine", "Salon", "Salle de bain", "Chambre", "Autre"];
export const DAYS_OF_WEEK = [
  "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"
];

export const FREQUENCY_LABELS = {
  weekly: "Hebdomadaire",
  biweekly: "Toutes les 2 semaines",
  monthly: "Mensuel",
  seasonal: "Saisonnier",
};

export const sampleTasks = [
  {
    id: "a1b2c3d4",
    name: "Passer l'aspirateur",
    room: "Salon",
    frequency: "weekly",
    day: "mercredi",
    days: ["mercredi"],
    isDone: false,
    lastDone: null,
    lastDoneBy: null,
    assignedTo: "both",
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: "e5f6g7h8",
    name: "Nettoyer le frigo",
    room: "Cuisine",
    frequency: "monthly",
    day: 15,
    days: null,
    isDone: false,
    lastDone: null,
    lastDoneBy: null,
    assignedTo: "both",
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: "i9j0k1l2",
    name: "Laver les rideaux",
    room: "Chambre",
    frequency: "seasonal",
    day: "ete",
    days: null,
    isDone: false,
    lastDone: null,
    lastDoneBy: null,
    assignedTo: "both",
    lastUpdatedAt: new Date().toISOString(),
  },
];