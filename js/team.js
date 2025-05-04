// js/team.js

// Tableau représentant l'équipe actuelle de 8 joueurs (identifiants de carte ou null si slot vide)
let team = [null, null, null, null, null, null, null, null];
// Ordre des positions correspondant aux index du tableau team:
const TEAM_POSITIONS = ["GK", "DEF1", "DEF2", "DEF3", "MID1", "MID2", "MID3", "FWD"];

/**
 * Gère le drop d'une carte sur un slot de l'équipe.
 * Cet handler est assigné aux éléments .team-slot via ondrop dans le HTML.
 */
function onDropTeam(event) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData("text/plain");  // Récupère l'ID de la carte draggée
  if (!cardId) return;
  const slotElem = event.currentTarget;                     // Slot cible du drop
  const position = slotElem.getAttribute('data-position');  // ex: "DEF2"
  // Trouver l'élément de carte correspondant à l'ID
  const cardElem = document.querySelector(`.card[data-id="${cardId}"]`);
  if (!cardElem) return;
  // Retirer toute carte actuellement dans le slot cible (si on veut remplacer)
  if (slotElem.firstElementChild && slotElem.firstElementChild.classList.contains('card')) {
    // Si une carte était déjà placée, on la renvoie dans la réserve
    const oldCardElem = slotElem.firstElementChild;
    moveCardToReserve(oldCardElem);
  }
  // Ajouter la carte dans le slot de l'équipe (DOM)
  slotElem.appendChild(cardElem);
  slotElem.classList.add('filled');
  // Marquer dans le tableau team le nouveau joueur
  const teamIndex = TEAM_POSITIONS.indexOf(position);
  team[teamIndex] = cardId;
  // Mettre à jour les données sauvegardées de l'équipe
  saveTeam(team);
}

/**
 * Déplace une carte depuis un slot d'équipe vers la réserve.
 * Appelée par onDropTeam si un slot est déjà occupé et qu'on le remplace.
 */
function moveCardToReserve(cardElem) {
  // Retirer la classe filled du slot parent
  const slot = cardElem.parentElement;
  if (slot) slot.classList.remove('filled');
  // Retirer la carte du slot
  slot.removeChild(cardElem);
  // Réinsérer la carte dans la grille de la réserve
  const reserveGrid = document.getElementById('reserveGrid');
  reserveGrid.appendChild(cardElem);
  // Mettre à jour le tableau de team (en mettant null à l'ancienne position)
  const position = slot.getAttribute('data-position');
  const teamIndex = TEAM_POSITIONS.indexOf(position);
  team[teamIndex] = null;
  saveTeam(team);
}

/**
 * Met à jour l'affichage de l'équipe en fonction du tableau `team`.
 * Cette fonction vide tous les slots et réinsère les cartes correspondantes.
 * À utiliser lors du chargement initial ou pour réafficher après un tri de réserve par ex.
 */
function renderTeam() {
  team.forEach((cardId, index) => {
    const pos = TEAM_POSITIONS[index];
    const slotElem = document.querySelector(`.team-slot[data-position="${pos}"]`);
    // Vider le slot d'équipe d'abord
    while (slotElem.firstChild) {
      slotElem.removeChild(slotElem.firstChild);
    }
    slotElem.classList.remove('filled');
    if (cardId) {
      // Si un joueur est assigné à ce slot, on le retrouve dans la réserve
      const cardElem = document.querySelector(`.card[data-id="${cardId}"]`);
      if (cardElem) {
        slotElem.appendChild(cardElem);
        slotElem.classList.add('filled');
      } else {
        // Cas où la carte n'existe pas dans la réserve (données inconsistantes) -> on ignore
        team[index] = null;
      }
    }
  });
}
