import ReservePanel from './ReservePanel.js';
import TeamGrid     from './TeamGrid.js';

/**
 * UIScene  – gère le bandeau inférieur et la navigation
 * Onglets : Centre | Pack | Équipe | Réserve
 */
export default class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); }

  create () {
    const H = this.scale.height;

    /* Bandeau noir */
    this.add.rectangle(
      this.scale.width / 2, H - 50,
      this.scale.width, 100,
      0x000000, 0.85
    ).setDepth(5);

    /* Références */
    this.packScene = this.scene.get('PackScene');   // tirage
    this.teamGrid  = this.packScene.teamGrid;       // terrain
    this.reserve   = new ReservePanel(this);        // réserve

    /* Titre Centre */
    this.menuText = this.add.text(
      this.scale.width / 2, H / 2,
      'Football Gacha Centre',
      { fontSize: '26px', fontStyle: 'bold' }
    ).setOrigin(0.5).setDepth(2);

    /* Onglets */
    const tabs = [
      { label: 'Centre',  x:  60, cb: () => this.showMenu()    },
      { label: 'Pack',    x: 180, cb: () => this.invokePack()  },
      { label: 'Équipe',  x: 300, cb: () => this.showTeam()    },
      { label: 'Réserve', x: 420, cb: () => this.showReserve() }
    ];

    tabs.forEach(t => {
      this.add.text(t.x, H - 65, t.label, { fontSize: '16px' })
        .setOrigin(0.5)
        .setDepth(6)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', t.cb);
    });

    this.showMenu();  // état initial
  }

  /* Helpers */
  hideAll () {
    this.menuText.setVisible(false);
    this.teamGrid.setVisible(false);
    this.reserve.hide();
  }

  /* Centre */
  showMenu () {
    this.hideAll();
    this.menuText.setVisible(true);
  }

  /* Pack */
  invokePack () {
    this.packScene.events.emit('invoke-pack');
  }

  /* Équipe */
  showTeam () {
    this.hideAll();
    this.teamGrid.setVisible(true);
    this.teamGrid.refresh();
  }

  /* Réserve */
  showReserve () {
    this.hideAll();
    this.reserve.refresh();
    this.reserve.show();
  }
}
