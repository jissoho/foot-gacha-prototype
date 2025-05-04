/* ---------- variables globales & helpers ---------- */
export const playerTeam = JSON.parse(localStorage.getItem('team') || '[]');
export let coins = Number(localStorage.getItem('coins') || 0);

export function saveGame() {
  localStorage.setItem('team', JSON.stringify(playerTeam));
  localStorage.setItem('coins', coins);
}

export function calcNotes(c) {
  const ovr = Math.round((c.shoot + c.dribble + c.pass + c.speed + c.defense + c.strength) / 6);
  return {
    ovr,
    atk: Math.round(c.shoot * 0.4 + c.dribble * 0.3 + c.pass * 0.3),
    def: Math.round(c.defense * 0.6 + c.strength * 0.4)
  };
}

import cards from '../assets/cards.json' assert { type: 'json' };
import GachaPopup from './GachaPopup.js';
import TeamBar from './TeamBar.js';

function weightedRandom(pool){ const t=pool.reduce((s,c)=>s+c.weight,0); let r=Math.random()*t; return pool.find(c=> (r-=c.weight)<0); }

/* ---------- Scenes ---------- */
class GachaScene extends Phaser.Scene{
  constructor(){ super('GachaScene'); }
  create(){
    this.teamBar = new TeamBar(this);     // barre d’équipe
    this.add.text(110,150,'Tirer une carte',{fontSize:'24px'})
      .setInteractive({useHandCursor:true})
      .on('pointerdown',()=>{
        const pool = cards.map(c=>({...c,weight:{Bronze:60,Silver:25,Gold:15}[c.rarity]}));
        new GachaPopup(this, weightedRandom(pool));
      });
  }
}

class MatchScene extends Phaser.Scene{ /* (inchangé) */ }

/* ---------- Config ---------- */
new Phaser.Game({
  type:Phaser.AUTO, width:480, height:800, parent:'game',
  scene:[GachaScene,MatchScene]
});
