export const SEASONS = ["printemps", "été", "automne", "hiver"];
export const ROOMS = ["Cuisine", "Salon", "Salle de bain", "Chambre", "Autre"];
export const DAYS_OF_WEEK = [
  "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"
];

export const ROOM_ICONS = {
  Cuisine: "ChefHat",
  Salon: "Sofa",
  "Salle de bain": "Bath",
  Chambre: "Bed",
  Autre: "Home",
};

export const FREQUENCY_LABELS = {
  weekly: "Hebdomadaire",
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
    day: "été",
    isDone: false,
    lastDone: null,
    lastDoneBy: null,
    assignedTo: "both",
    lastUpdatedAt: new Date().toISOString(),
  },
];