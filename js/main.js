/***** Persistance *****/
export let coins = Number(localStorage.getItem('coins') || 0);
export const playerTeam = JSON.parse(localStorage.getItem('team') || '[]');
export const club       = JSON.parse(localStorage.getItem('club') || '[]');
export function saveGame(){
  localStorage.setItem('coins', coins);
  localStorage.setItem('team',  JSON.stringify(playerTeam));
  localStorage.setItem('club',  JSON.stringify(club));
}

/***** Helpers *****/
export function calcNotes(c){
  const ovr=Math.round((c.shoot+c.dribble+c.pass+c.speed+c.defense+c.strength)/6);
  return{ovr, atk:Math.round(c.shoot*0.4+c.dribble*0.3+c.pass*0.3), def:Math.round(c.defense*0.6+c.strength*0.4)};
}
const weightedRandom=p=>{const t=p.reduce((s,c)=>s+c.weight,0);let r=Math.random()*t;return p.find(c=>(r-=c.weight)<0)};

/***** Import jeux *****/
import cards from '../assets/cards.json' assert{type:'json'};
import GachaPopup from './GachaPopup.js';
import TeamGrid   from './TeamGrid.js';
import ReservePanel from './ReservePanel.js';

/***** Scene Pack (tirage) *****/
class PackScene extends Phaser.Scene{
  constructor(){super('PackScene');}
  create(){
    // lance popup dès qu'on clique sur l'onglet Pack (via UIScene)
    this.events.on('invoke-pack',()=>{
      const pool=cards.map(c=>({...c,weight:{Bronze:60,Silver:25,Gold:15}[c.rarity]}));
      new GachaPopup(this, weightedRandom(pool));
    });
    this.teamGrid = new TeamGrid(this);   // terrain masqué par défaut
    this.scene.launch('UIScene');
  }
}

/***** Scene conteneur UI + bandeau *****/
class UIScene extends Phaser.Scene{
  constructor(){super('UIScene');}
  create(){
    const H = this.scale.height;
    // bandeau noir
    this.add.rectangle(this.scale.width/2,H-50,this.scale.width,100,0x000000,0.85).setDepth(5);

    // référence aux éléments montrables
    this.packScene = this.scene.get('PackScene');
    this.teamGrid  = this.packScene.teamGrid;
    this.reserve   = new ReservePanel(this);

    // titre centre menu
    this.menuText = this.add.text(this.scale.width/2,H/2,'Football Gacha Centre',{fontSize:'26px',fontStyle:'bold'}).setOrigin(0.5).setDepth(2);

    /* ---- Onglets bandeau ---- */
    const tabs=[
      {label:'Centre', x:60,  cb:()=>this.showMenu()},
      {label:'Pack',   x:180, cb:()=>this.invokePack()},
      {label:'Équipe', x:300, cb:()=>this.showTeam()},
      {label:'Réserve',x:420, cb:()=>this.showReserve()}
    ];
    tabs.forEach(t=>{
      this.add.text(t.x,H-65,t.label,{fontSize:'16px'})
        .setOrigin(0.5).setDepth(6).setInteractive({useHandCursor:true})
        .on('pointerdown',t.cb);
    });
    this.showMenu();
  }
  hideAll(){
    this.menuText.setVisible(false);
    this.teamGrid.setVisible(false);
    this.reserve.hide();
  }
  showMenu(){ this.hideAll(); this.menuText.setVisible(true);}  // juste le titre
  invokePack(){ this.packScene.events.emit('invoke-pack'); }
  showTeam(){ this.hideAll(); this.teamGrid.setVisible(true); this.teamGrid.refresh(); }
  showReserve(){ this.hideAll(); this.reserve.refresh(); this.reserve.show(); }
}

/***** Phaser config *****/
new Phaser.Game({
  type:Phaser.AUTO,
  width:480,
  height:800,
  parent:'game',
  scene:[PackScene, UIScene]
});