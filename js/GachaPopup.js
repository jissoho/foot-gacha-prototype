import { playerTeam, club, calcNotes, saveGame } from './main.js';
import CardSprite from './CardSprite.js';

export default class GachaPopup extends Phaser.GameObjects.Container {
  constructor (scene, card) {
    super(scene, scene.scale.width / 2, scene.scale.height / 2);
    scene.add.existing(this);
    this.scene = scene; this.card = card;

    /* notes calculées */
    const n = calcNotes(card);
    Object.assign(card, { ovr: n.ovr, attackNote: n.atk, defenseNote: n.def });

    /* overlay noir (non cliquable) */
    this.overlay = scene.add.rectangle(
      scene.scale.width / 2, scene.scale.height / 2,
      scene.scale.width,     scene.scale.height,
      0x000000, 0.6
    );
    this.overlay.setDepth(8);

    /* Carte complète */
    const sprite = new CardSprite(scene, card, 1);
    sprite.setDepth(9);

    /* Boutons */
    const addBtn = scene.add.text(0, 160, `Ajouter à l'équipe`, {
      fontSize: '18px', backgroundColor: '#00b347', padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.addTeam()).setDepth(9);

    const resBtn = scene.add.text(0, 195, `Réserve`, {
      fontSize: '16px', backgroundColor: '#0066ff', padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.addReserve()).setDepth(9);

    this.add([sprite, addBtn, resBtn]);
    this.setDepth(9).setAlpha(0).setScale(0);
    scene.tweens.add({ targets: this, alpha: 1, scale: 1, duration: 300, ease: 'Back.out' });
  }

  /* ---------- logique ---------- */
  addTeam () {
    if (playerTeam.length >= 8) { this.toast('Équipe pleine', 0xff3333); return; }
    playerTeam.push(this.card); saveGame();
    this.scene.scene.get('UIScene').teamGrid.refresh();
    this.close();
  }
  addReserve () {
    if (club.length >= 1000) { this.toast('Réserve pleine', 0xff3333); return; }
    club.push(this.card); saveGame();
    this.close();
  }

  toast (msg, color = 0x008cff) {
    const t = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 + 240,
      msg,
      { fontSize: '18px',
        backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
        padding: { x: 10, y: 4 } }
    ).setOrigin(0.5).setDepth(10);

    this.scene.tweens.add({ targets: t, alpha: 0, y: '-=40', duration: 1200, onComplete: () => t.destroy() });
  }

  close () {
    this.scene.tweens.add({
      targets: this, alpha: 0, scale: 0, duration: 200,
      onComplete: () => { this.overlay.destroy(); this.destroy(); }
    });
  }
}
