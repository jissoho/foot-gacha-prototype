// js/storage.js

/**
 * Sauvegarde la liste des cartes de la réserve dans localStorage.
 * @param {Array} cards - tableau d'objets joueur
 */
function saveCards(cards) {
    try {
      localStorage.setItem('cards', JSON.stringify(cards));
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des cartes :", e);
    }
  }
  
  /**
   * Charge la liste des cartes depuis localStorage.
   * @return {Array} tableau d'objets joueur (vide si aucune sauvegarde)
   */
  function loadCards() {
    try {
      const data = localStorage.getItem('cards');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erreur lors du chargement des cartes :", e);
      return [];
    }
  }
  
  /**
   * Sauvegarde la composition de l'équipe (tableau team) dans localStorage.
   * @param {Array} teamArray - tableau de 8 éléments (ids ou null)
   */
  function saveTeam(teamArray) {
    try {
      localStorage.setItem('team', JSON.stringify(teamArray));
    } catch (e) {
      console.error("Erreur lors de la sauvegarde de l'équipe :", e);
    }
  }
  
  /**
   * Charge la composition de l'équipe depuis localStorage.
   * @return {Array} tableau de 8 éléments (ids ou null)
   */
  function loadTeam() {
    try {
      const data = localStorage.getItem('team');
      return data ? JSON.parse(data) : [null, null, null, null, null, null, null, null];
    } catch (e) {
      console.error("Erreur lors du chargement de l'équipe :", e);
      return [null, null, null, null, null, null, null, null];
    }
  }
  