import { club } from './main.js';
export default class ReservePanel extends Phaser.GameObjects.Container{
  constructor(scene){
    super(scene,0,0);this.scene=scene;scene.add.existing(this);
    this.bg=scene.add.rectangle(scene.scale.width/2,scene.scale.height/2,scene.scale.width,scene.scale.height,0x000000,0.9).setVisible(false).setDepth(7);
    this.grid=scene.add.container(0,0).setDepth(8);
    this.add([this.bg,this.grid]);
    this.setVisible(false);
  }
  refresh(){
    this.grid.removeAll(true);
    club.forEach((card,idx)=>{
      const col=idx%4,row=Math.floor(idx/4);
      const x=60+col*110,y=100+row*140;
      const rect=this.scene.add.rectangle(x,y,90,120,0x4455aa).setStrokeStyle(2,0xffffff);
      const name=this.scene.add.text(x,y+70,card.name,{fontSize:'12px',align:'center'}).setOrigin(0.5);
      this.grid.add([rect,name]);
    });
  }
  hide(){this.setVisible(false);this.bg.setVisible(false);}
  show(){this.setVisible(true);this.bg.setVisible(true);}
}