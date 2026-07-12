/**
 * Estime le temps pour faire une tache en minutes.
 * Basé sur des mots-clés dans le nom de la tache.
 */
export function estimateTaskDuration(task) {
  var name = (task.name || "").toLowerCase();
  var room = (task.room || "").toLowerCase();

  // Table de correspondance mots-cles -> minutes
  var keywords = [
    { words: ["aspirateur", "passer"], time: 20 },
    { words: ["frigo", "refrigerateur", "nettoyer frigo"], time: 30 },
    { words: ["four", "nettoyer four"], time: 45 },
    { words: ["baignoire", "douche", "laver douche"], time: 20 },
    { words: ["toilettes", "wc"], time: 10 },
    { words: ["vitres", "fenetres", "miroir"], time: 20 },
    { words: ["sol", "balayer", "serpillere", "balai"], time: 25 },
    { words: ["vaisselle", "lave vaisselle", "vider"], time: 10 },
    { words: ["linge", "machine", "laver"], time: 15 },
    { words: ["etendre", "plier"], time: 20 },
    { words: ["poussiere", "enlever poussiere"], time: 15 },
    { words: ["courses", "faire courses", "liste"], time: 60 },
    { words: ["barbecue", "nettoyer barbecue"], time: 40 },
    { words: ["litiere", "caca"], time: 10 },
    { words: ["fontaine", "filtre"], time: 15 },
    { words: ["hotte"], time: 25 },
    { words: ["serviettes", "remplacer"], time: 5 },
    { words: ["draps", "changer draps"], time: 15 },
    { words: ["rangement", "ranger"], time: 30 },
    { words: ["evier", "laver evier"], time: 10 },
    { words: ["cafe", "machine cafe"], time: 15 },
    { words: ["canape", "sous canape"], time: 15 },
    { words: ["milbemax", "credelio", "medicament", "donner"], time: 5 },
  ];

  // Cherche le meilleur match
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

  // Fallback par piece
  if (room === "cuisine") return 20;
  if (room === "salle de bain") return 15;
  if (room === "salon") return 20;
  if (room === "chambre") return 15;

  return 15; // defaut
}

/**
 * Formate la duree en texte lisible.
 * Ex: 90 -> "1h30", 20 -> "20 min"
 */
export function formatDuration(minutes) {
  if (minutes < 60) return minutes + " min";
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  if (m === 0) return h + "h";
  return h + "h" + m;
}