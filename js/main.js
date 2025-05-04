// js/main.js

// Variables globales pour la réserve de cartes et l'équipe
let cards = [];  // cartes dans la réserve (tableau d'objets joueurs)
team = loadTeam();  // (la variable team est déclarée dans team.js)

/**
 * Affiche une section du jeu en fonction de l'onglet sélectionné.
 * @param {string} sectionId - l'ID de la section à afficher
 */
function showSection(sectionId) {
  // Masquer toutes les sections et enlever 'active' sur tous les boutons
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
  // Afficher la section demandée
  const sectionElem = document.getElementById(sectionId);
  if (sectionElem) sectionElem.classList.add('active');
  // Activer le bouton de menu correspondant
  const menuBtn = document.querySelector(`.menu-btn[data-section="${sectionId}"]`);
  if (menuBtn) menuBtn.classList.add('active');
}

/**
 * Met à jour l'affichage de la réserve (grille des cartes) en fonction du tableau cards.
 */
function renderReserve() {
  const reserveGrid = document.getElementById('reserveGrid');
  reserveGrid.innerHTML = '';  // vider d'abord
  // Pour chaque carte, créer son élément et l'ajouter à la grille
  cards.forEach(player => {
    const cardElem = createCardElement(player, true);
    reserveGrid.appendChild(cardElem);
  });
}

/**
 * Trie le tableau de cartes 'cards' selon le critère spécifié et réaffiche la grille.
 * @param {string} criterion - "overall", "rarity", "atk" ou "def"
 */
function sortCards(criterion) {
  if (criterion === 'rarity') {
    // Trier par rareté selon l'ordre des raretés défini dans RARITIES
    const rarityOrder = RARITIES.map(r => r.name);  // ex: ["Commun","Rare","Épique","Légendaire"]
    cards.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
  } else if (criterion === 'atk') {
    cards.sort((a, b) => b.atk - a.atk);
  } else if (criterion === 'def') {
    cards.sort((a, b) => b.def - a.def);
  } else {
    // default "overall"
    cards.sort((a, b) => b.overall - a.overall);
  }
  renderReserve();
  renderTeam();  // ré-attacher correctement les cartes d'équipe dans les slots au besoin
  saveCards(cards);
}

// Au chargement de la page, initialisation
window.addEventListener('DOMContentLoaded', () => {
  // Charger les cartes depuis le stockage local
  cards = loadCards();
  // Rendre la réserve initiale
  renderReserve();
  // Rendre l'équipe initiale
  renderTeam();
  // Gérer la navigation du menu
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      showSection(section);
    });
  });
  // Gérer le bouton d'invocation
  const invokeBtn = document.getElementById('invokeBtn');
  invokeBtn.addEventListener('click', () => {
    const resultContainer = document.getElementById('gachaResult');
    resultContainer.innerHTML = '';  // clear previous result
    // Tirer un nouveau joueur via le gacha
    const newPlayer = rollGacha();
    // Ajouter le joueur au tableau de cartes et sauvegarder
    cards.push(newPlayer);
    saveCards(cards);
    // Créer l'élément de carte et l'afficher dans le résultat + l'ajouter à la réserve
    const cardElem = createCardElement(newPlayer, true);
    resultContainer.appendChild(cardElem);
    // Également ajouter la carte dans la grille de réserve
    const reserveGrid = document.getElementById('reserveGrid');
    reserveGrid.appendChild(cardElem.cloneNode(true));  // ajouter une copie dans la réserve
    // Re-bind drag events sur la copie (cloneNode ne copie pas les events)
    const clonedCard = reserveGrid.lastElementChild;
    clonedCard.addEventListener('dragstart', onCardDragStart);
    clonedCard.addEventListener('dragend', onCardDragEnd);
    // Mettre à jour l'affichage (tri éventuellement) - ici on peut simplement re-trier si la liste était triée
    const sortSelect = document.getElementById('sortSelect');
    sortCards(sortSelect.value);
  });
  // Gérer le changement de tri dans la réserve
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    sortCards(e.target.value);
  });
});
