export default class GachaPopup extends Phaser.GameObjects.Container {
    constructor(scene, cardData) {
      super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
  
      // 1) overlay pleine‑écran
      this.overlay = scene.add.graphics()
        .fillStyle(0x000000, 0.6)
        .fillRect(0, 0, scene.game.config.width, scene.game.config.height)
        .setInteractive()
        .on('pointerdown', () => this.close()); // clic hors popup
      scene.add.existing(this.overlay);         // sous le container
  
      // 2) cadre du popup
      const bg = scene.add.rectangle(0, 0, 280, 380, 0x222222, 0.95)
        .setStrokeStyle(4, 0xffffff)
        .setOrigin(0.5);
  
      // 3) texte et stats
      const title = scene.add.text(0, -150, cardData.name, {
        fontSize: '22px', color: '#ffd700'
      }).setOrigin(0.5);
      const rarity = scene.add.text(0, -115, cardData.rarity, {
        fontSize: '18px', color: '#ffddaa'
      }).setOrigin(0.5);
  
      // 4) sprite carte (placeholder rectangle)
      const cardSprite = scene.add.rectangle(0, 0, 160, 200, 0x4444aa)
        .setStrokeStyle(2, 0xffffff);
  
      // 5) bouton OK
      const btn = scene.add.text(0, 155, 'OK', {
        fontSize: '20px', backgroundColor: '#008cff', padding: {x: 20, y: 8}
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.close());
  
      // 6) packer dans le container
      this.add([bg, title, rarity, cardSprite, btn]);
      this.setScale(0).setAlpha(0);             // départ invisible
      scene.add.existing(this);
  
      // 7) animation d’apparition
      scene.tweens.add({
        targets: this,
        alpha: 1,
        scale: 1,
        ease: 'Back.out', duration: 350
      });
    }
  
    close() {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scale: 0,
        duration: 200,
        onComplete: () => { this.overlay.destroy(); this.destroy(); }
      });
    }
  }
  