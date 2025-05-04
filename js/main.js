/* ------------------------------
   Variables globales & helpers
--------------------------------*/
export const playerTeam = [];           // inventaire rapide (5 cartes max)

export function calcNotes(c) {
  const ovr = Math.round((c.shoot + c.dribble + c.pass + c.speed + c.defense + c.strength) / 6);
  const atk = Math.round(c.shoot * 0.4 + c.dribble * 0.3 + c.pass * 0.3);
  const def = Math.round(c.defense * 0.6 + c.strength * 0.4);
  return { ovr, atk, def };
}

import cards from "../assets/cards.json" assert { type: "json" };
import GachaPopup from "./GachaPopup.js";

function weightedRandom(pool){
  const total = pool.reduce((s,c)=>s+c.weight,0);
  let r=Math.random()*total;
  return pool.find(c=> (r-=c.weight) < 0 );
}

/* ------------------------------
   Phaser Scenes
--------------------------------*/
class GachaScene extends Phaser.Scene{
  constructor(){ super("GachaScene"); }
  create(){
    this.add.text(110,150,"Tirer une carte",{fontSize:"24px"})
      .setInteractive({useHandCursor:true})
      .on("pointerdown",()=>{
        const pool = cards.map(c=>({...c,weight:{Bronze:60,Silver:25,Gold:15}[c.rarity]}));
        const drawn = weightedRandom(pool);
        new GachaPopup(this, drawn);      // popup animé
      });
  }
}

class MatchScene extends Phaser.Scene{
  constructor(){ super("MatchScene"); }
  init(data){ this.card=data.card; }
  create(){
    const lP = this.card.attackNote/100;
    const lC = this.card.defenseNote/100;
    const poi = l=> Math.round(-Math.log(Math.random())/(l||0.01));
    const sP = poi(lP); const sC = poi(lC);
    this.add.text(200,250,`${sP} – ${sC}`,{fontSize:"48px"});
    this.input.once("pointerdown",()=>this.scene.start("GachaScene"));
  }
}

/* ------------------------------
   Config Phaser
--------------------------------*/
new Phaser.Game({
  type:Phaser.AUTO,
  width:480,
  height:800,
  parent:"game",
  scene:[GachaScene,MatchScene]
});