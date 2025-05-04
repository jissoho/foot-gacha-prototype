import { playerTeam, calcNotes, saveGame } from './main.js';
import TeamBar from './TeamBar.js';

export default class GachaPopup extends Phaser.GameObjects.Container {
  constructor(scene, cardData){
    super(scene, scene.scale.width/2, scene.scale.height/2);
    this.scene = scene; this.cardData = cardData;

    const n = calcNotes(cardData);
    Object.assign(cardData, { ovr:n.ovr, attackNote:n.atk, defenseNote:n.def });

    this.overlay = scene.add.graphics().fillStyle(0x000000,0.6)
      .fillRect(0,0,scene.scale.width,scene.scale.height)
      .setInteractive().on('pointerdown',()=>this.close());
    scene.add.existing(this.overlay);

    const bg = scene.add.rectangle(0,0,300,440,0x222222,0.95)
      .setStrokeStyle(4,0xffffff);
    const title = scene.add.text(0,-180,cardData.name,{fontSize:'22px',color:'#ffd700'}).setOrigin(0.5);
    const cardRect = scene.add.rectangle(0,-20,170,220,0x4455aa).setStrokeStyle(2,0xffffff);
    const notes = scene.add.text(0,110,`OVR ${n.ovr}\\nATK ${n.atk}   DEF ${n.def}`,{fontSize:'18px',align:'center'}).setOrigin(0.5);

    const addBtn = scene.add.text(0,175,'Ajouter à l’équipe',{fontSize:'18px',backgroundColor:'#00b347',padding:{x:12,y:6}})
      .setOrigin(0.5).setInteractive({useHandCursor:true})
      .on('pointerdown',()=>this.addToTeam());

    this.add([bg,title,cardRect,notes,addBtn]);
    this.setScale(0).setAlpha(0); scene.add.existing(this);
    scene.tweens.add({targets:this,alpha:1,scale:1,ease:'Back.out',duration:300});
  }

  addToTeam(){
    if (playerTeam.length >= 5){ this.toast('Équipe pleine !',0xff3333); return; }
    playerTeam.push(this.cardData); saveGame();
    this.scene.teamBar.refresh();               // mettre à jour la barre
    this.toast('Ajouté !'); this.close();
  }

  toast(msg,color=0x008cff){
    const t=this.scene.add.text(this.x,this.y+230,msg,{fontSize:'18px',backgroundColor:Phaser.Display.Color.IntegerToColor(color).rgba,padding:{x:10,y:4}}).setOrigin(0.5);
    this.scene.tweens.add({targets:t,alpha:0,y:'-=40',duration:1200,onComplete:()=>t.destroy()});
  }

  close(){ this.scene.tweens.add({targets:this,alpha:0,scale:0,duration:200,onComplete:()=>{this.overlay.destroy();this.destroy();}}); }
}
