// Formation 3‑3‑1 + GK
import { playerTeam } from './main.js';
export default class TeamGrid{
  constructor(scene){
    this.scene=scene;
    this.slots=[];
    const pos=[
      {x:240,y:650},                 // GK
      {x:120,y:500},{x:240,y:500},{x:360,y:500},     // DEF3
      {x:80,y:350},{x:240,y:330},{x:400,y:350},      // MID3
      {x:240,y:200}                                  // ST1
    ];
    pos.forEach(p=>{
      const r=scene.add.rectangle(p.x,p.y,50,65,0x222222,0.5).setStrokeStyle(2,0xffffff).setDepth(2);
      this.slots.push(r);
    });
    this.refresh();
    this.setVisible(false);
  }
  setVisible(v){this.slots.forEach(s=>s.setVisible(v));}
  refresh(){this.slots.forEach((s,i)=>s.setFillStyle(i<playerTeam.length?0x4455aa:0x222222,0.8));}
}