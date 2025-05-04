// TeamBar.js  —  affiche 5 emplacements minis

import { playerTeam } from './main.js';

export default class TeamBar extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, scene.scale.height - 90); // collé en bas
    scene.add.existing(this);

    // slot visuel : 5 rectangles gris
    this.slots = [...Array(5)].map((_, i) => {
      const x = 40 + i * 60;
      const slot = scene.add.rectangle(x, 30, 48, 60, 0x333333, 0.6)
        .setStrokeStyle(2, 0xffffff);
      this.add(slot);
      return slot;
    });
    this.refresh();
  }

  refresh() {
    // nettoie les mini‑cartes précédentes
    this.list.filter(o => o.name === 'cardMini').forEach(o => o.destroy());

    playerTeam.forEach((card, idx) => {
      const mini = this.scene.add.rectangle(
        40 + idx * 60, 30, 48, 60, 0x4455aa
      ).setStrokeStyle(1, 0xffff00).setName('cardMini');
      this.add(mini);
    });
  }
}
