import { playerTeam, club, calcNotes, saveGame } from './main.js';

export default class GachaPopup extends Phaser.GameObjects.Container {
  constructor(scene, cardData) {
    super(scene, scene.scale.width / 2, scene.scale.height / 2);

    this.scene = scene;
    this.cardData = cardData;

    /* ---------- notes ---------- */
    const n = calcNotes(cardData);
    Object.assign(cardData, {
      ovr: n.ovr,
      attackNote: n.atk,
      defenseNote: n.def
    });

    /* ---------- overlay (non‑cliquable) ---------- */
    this.overlay = scene.add.rectangle(
      scene.scale.width / 2,
      scene.scale.height / 2,
      scene.scale.width,
      scene.scale.height,
      0x000000,
      0.6
    );
    scene.add.existing(this.overlay);

    /* ---------- cadre ---------- */
    const bg = scene.add.rectangle(0, 0, 300, 450, 0x222222, 0.95)
      .setStrokeStyle(4, 0xffffff);
    const title = scene.add.text(0, -190, cardData.name, { fontSize: '22px', color: '#ffd700' }).setOrigin(0.5);
    const cardRect = scene.add.rectangle(0, -30, 170, 220, 0x4455aa).setStrokeStyle(2, 0xffffff);
    const txt = scene.add.text(0, 110, `OVR ${n.ovr}\nATK ${n.atk}   DEF ${n.def}`, { fontSize: '18px', align: 'center' }).setOrigin(0.5);

    /* ---------- boutons ---------- */
    const addBtn = scene.add.text(0, 185, `Ajouter à l'équipe`, {
      fontSize: '18px',
      backgroundColor: '#00b347',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.addToTeam());

    const resBtn = scene.add.text(0, 225, `Réserve`, {
      fontSize: '16px',
      backgroundColor: '#0066ff',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.addToReserve());

    /* ---------- ajout au container ---------- */
    this.add([bg, title, cardRect, txt, addBtn, resBtn]);
    this.setScale(0).setAlpha(0);
    scene.add.existing(this);

    scene.tweens.add({ targets: this, alpha: 1, scale: 1, duration: 300, ease: 'Back.out' });
  }

  /* ===== Logic ===== */
  addToTeam() {
    if (playerTeam.length >= 8) {
      this.toast('Équipe pleine !', 0xff3333);
      return;
    }
    playerTeam.push(this.cardData);
    saveGame();
    this.scene.scene.get('UIScene').teamGrid.refresh();
    this.toast('Ajouté !');
    this.close();
  }

  addToReserve() {
    if (club.length >= 1000) {
      this.toast('Réserve pleine !', 0xff3333);
      return;
    }
    club.push(this.cardData);
    saveGame();
    this.scene.scene.get('UIScene').reserve.refresh();
    this.toast('Envoyé !');
    this.close();
  }

  toast(msg, color = 0x008cff) {
    const t = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 + 240,
      msg,
      {
        fontSize: '18px',
        backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
        padding: { x: 10, y: 4 }
      }
    ).setOrigin(0.5).setDepth(9);

    this.scene.tweens.add({
      targets: t,
      alpha: 0,
      y: '-=40',
      duration: 1200,
      onComplete: () => t.destroy()
    });
  }

  close() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0,
      duration: 200,
      onComplete: () => {
        this.overlay.destroy();
        this.destroy();
      }
    });
  }
}