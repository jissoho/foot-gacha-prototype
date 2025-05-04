import { club } from './main.js';
import CardSprite from './CardSprite.js';

export default class ReservePanel extends Phaser.GameObjects.Container {
  constructor (scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.bg = scene.add.graphics().setDepth(7);
    this.cardsCont = scene.add.container(0, 0).setDepth(8);
    this.add([this.bg, this.cardsCont]);

    this.setVisible(false);
  }

  drawTiles () {
    this.bg.clear();
    this.bg.fillStyle(0x333333, 1);
    for (let y = 0; y < 800; y += 40) {
      for (let x = 0; x < 480; x += 40) {
        this.bg.fillRect(x, y, 39, 39);
      }
    }
  }

  refresh () {
    this.drawTiles();
    this.cardsCont.removeAll(true);

    club.forEach((card, idx) => {
      const col = idx % 4, row = Math.floor(idx / 4);
      const x = 60 + col * 110, y = 100 + row * 140;
      const s = new CardSprite(this.scene, card, 0.45)
        .setPosition(x, y);
      this.cardsCont.add(s);
    });
  }

  hide () { this.setVisible(false); }
  show () { this.setVisible(true); }
}
