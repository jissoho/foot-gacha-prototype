// js/gacha.js

// Définition des raretés disponibles dans le gacha
const RARITIES = [
    { name: "Commun", className: "common", chance: 0.50, statRange: [30, 60] },     // 50% de chances
    { name: "Rare", className: "rare", chance: 0.30, statRange: [50, 75] },         // 30% de chances
    { name: "Épique", className: "epic", chance: 0.15, statRange: [70, 90] },       // 15% de chances
    { name: "Légendaire", className: "legendary", chance: 0.05, statRange: [90, 100] } // 5% de chances
  ];
  
  // Listes de noms pour générer des joueurs aléatoires
  const FIRST_NAMES = ["Alex", "Jordan", "Chris", "Sam", "Taylor", "Max", "Nico", "Leo", "Robin", "Jean"];
  const LAST_NAMES  = ["Martin", "Durand", "Dupont", "Smith", "Doe", "Brown", "Lee", "Garcia", "Muller", "Lopez"];
  
  /**
   * Génère un nom de joueur aléatoire en combinant un prénom et un nom.
   */
  function generateRandomName() {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
  }
  
  /**
   * Tire une nouvelle carte joueur via le gacha.
   * Renvoie un objet représentant le joueur (avec id, nom, rareté, stats).
   */
  function rollGacha() {
    // Déterminer la rareté selon les probabilités définies
    const rand = Math.random();
    let chosenRarity = RARITIES[RARITIES.length - 1]; // par défaut, la plus rare
    let cumulative = 0;
    for (let r of RARITIES) {
      cumulative += r.chance;
      if (rand < cumulative) {
        chosenRarity = r;
        break;
      }
    }
    // Générer les stats aléatoires en fonction de la rareté
    const [minStat, maxStat] = chosenRarity.statRange;
    const atk = getRandomInt(minStat, maxStat);
    const def = getRandomInt(minStat, maxStat);
    const overall = Math.floor((atk + def) / 2);  // Note globale = moyenne arrondie des deux
    // Générer un nom de joueur
    const name = generateRandomName();
    // Créer l'objet joueur
    const newPlayer = {
      id: generatePlayerId(),
      name: name,
      rarity: chosenRarity.name,
      rarityClass: chosenRarity.className,
      atk: atk,
      def: def,
      overall: overall
    };
    return newPlayer;
  }
  
  /**
   * Crée et renvoie l'élément DOM (div.card) correspondant à une carte joueur.
   * @param {Object} player - Objet joueur avec id, name, rarity, atk, def, overall.
   * @param {boolean} draggable - Si true, la carte sera draggable (par défaut true pour les cartes en réserve).
   */
  function createCardElement(player, draggable = true) {
    // Créer l'élément principal de la carte
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', player.rarityClass);
    cardDiv.setAttribute('data-id', player.id);
    // Rendre la carte draggable si nécessaire
    if (draggable) {
      cardDiv.setAttribute('draggable', 'true');
      // Événements de drag & drop pour la carte
      cardDiv.addEventListener('dragstart', onCardDragStart);
      cardDiv.addEventListener('dragend', onCardDragEnd);
    }
    // Remplir le contenu de la carte
    cardDiv.innerHTML = `
      <span class="name">${player.name}</span>
      <span class="overall">${player.overall}</span>
      <div class="stats">
        <span class="atk">ATK ${player.atk}</span> | 
        <span class="def">DEF ${player.def}</span>
      </div>
      <span class="rarity-label">${player.rarity}</span>
    `;
    return cardDiv;
  }
  
  /* ====== Fonctions utilitaires ====== */
  
  /** Génère un entier aléatoire entre min et max (inclus). */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /** Génère un nouvel identifiant de joueur unique. */
  function generatePlayerId() {
    // On utilise un compteur stocké dans le localStorage pour persister l'ID suivant
    let nextId = localStorage.getItem('nextId');
    if (nextId === null) {
      nextId = 1;
    } else {
      nextId = parseInt(nextId, 10);
    }
    localStorage.setItem('nextId', nextId + 1);
    return nextId;
  }
  
  /** Handlers drag & drop pour les cartes (déplacement vers l'équipe) **/
  function onCardDragStart(event) {
    // Ajouter une classe pour feedback visuel
    event.target.classList.add('dragging');
    // Stocker l'ID de la carte dans les données transférées
    event.dataTransfer.setData("text/plain", event.target.getAttribute('data-id'));
  }
  function onCardDragEnd(event) {
    event.target.classList.remove('dragging');
  }
  