/***** Save & helpers *****/
export let coins = Number(localStorage.getItem('coins') || 0);
export const playerTeam = JSON.parse(localStorage.getItem('team') || '[]');
export const club = JSON.parse(localStorage.getItem('club') || '[]');

export function saveGame(){
  localStorage.setItem('coins',coins);
  localStorage.setItem('team',JSON.stringify(playerTeam));
  localStorage.setItem('club',JSON.stringify(club));
}

export function calcNotes(c){
  const ovr=Math.round((c.shoot+c.dribble+c.pass+c.speed+c.defense+c.strength)/6);
  return{ovr,atk:Math.round(c.shoot*0.4+c.dribble*0.3+c.pass*0.3),def:Math.round(c.defense*0.6+c.strength*0.4)};
}

import cards from '../assets/cards.json' assert{type:'json'};
import GachaPopup from './GachaPopup.js';
import TeamGrid from './TeamGrid.js';
import ReservePanel from './ReservePanel.js';

const weightedRandom=p=>{const t=p.reduce((s,c)=>s+c.weight,0);let r=Math.random()*t;return p.find(c=>(r-=c.weight)<0)};

/***** Scenes *****/
class UIScene extends Phaser.Scene{
  constructor(){super('UIScene');}
  create(){
    // Nav bar fond
    this.add.rectangle(this.scale.width/2,this.scale.height-50,this.scale.width,100,0x000000,0.8).setDepth(5);
    // Onglets
    const tabs=[
      {key:'menu',label:'Menu',x:80,cb:()=>this.showMenu()},
      {key:'team',label:'Équipe',x:240,cb:()=>this.showTeam()},
      {key:'club',label:'Réserve',x:400,cb:()=>this.showReserve()}
    ];
    tabs.forEach(t=>{
      this.add.text(t.x,this.scale.height-65,t.label,{fontSize:'18px'})
        .setOrigin(0.5).setDepth(6).setInteractive({useHandCursor:true}).on('pointerdown',t.cb);
    });
    // panels
    this.teamGrid=this.scene.get('GachaScene').teamGrid;
    this.reserve=new ReservePanel(this);
    this.showMenu();
  }
  showMenu(){this.teamGrid.setVisible(false);this.reserve.hide();}
  showTeam(){this.teamGrid.setVisible(true);this.teamGrid.refresh();this.reserve.hide();}
  showReserve(){this.teamGrid.setVisible(false);this.reserve.refresh();this.reserve.show();}
}

class GachaScene extends Phaser.Scene{
  constructor(){super('GachaScene');}
  create(){
    this.add.text(110,150,'Invoquer', {fontSize:'24px'})
      .setInteractive({useHandCursor:true})
      .on('pointerdown',()=>{
        const pool=cards.map(c=>({...c,weight:{Bronze:60,Silver:25,Gold:15}[c.rarity]}));
        new GachaPopup(this,weightedRandom(pool));
      });
    this.teamGrid=new TeamGrid(this);
    this.scene.launch('UIScene');
  }
}

class MatchScene extends Phaser.Scene{/* stub pour plus tard */}

new Phaser.Game({type:Phaser.AUTO,width:480,height:800,parent:'game',scene:[GachaScene,UIScene,MatchScene]});