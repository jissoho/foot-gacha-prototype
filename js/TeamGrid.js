import { playerTeam } from './main.js';
import CardSprite from './CardSprite.js';

export default class TeamGrid {
  constructor (scene) {
    this.scene = scene;

    /* Terrain vert */
    this.pitch = scene.add.rectangle(
      scene.scale.width / 2, scene.scale.height / 2,
      scene.scale.width,     scene.scale.height - 100,
      0x0a6622
    ).setDepth(1);

    const g = scene.add.graphics().setDepth(1).lineStyle(3, 0xffffff);
    g.strokeRect(20, 70, 440, 580);
    g.strokeCircle(240, 360, 60);
    g.lineBetween(240, 70, 240, 650);

    /* Positions slots 3‑3‑1 + GK */
    this.positions = [
      { x: 240, y: 650 },
      { x: 120, y: 500 }, { x: 240, y: 500 }, { x: 360, y: 500 },
      { x: 80,  y: 350 }, { x: 240, y: 330 }, { x: 400, y: 350 },
      { x: 240, y: 200 }
    ];

    this.cardSprites = [];
    this.setVisible(false);
  }

  refresh () {
    this.cardSprites.forEach(c => c.destroy());
    this.cardSprites = [];

    playerTeam.forEach((card, i) => {
      const p = this.positions[i];
      const s = new CardSprite(this.scene, card, 0.35)
        .setPosition(p.x, p.y)
        .setDepth(2);
      this.cardSprites.push(s);
    });
  }

  setVisible (v) {
    this.pitch.setVisible(v);
    this.cardSprites.forEach(c => c.setVisible(v));
  }
}
