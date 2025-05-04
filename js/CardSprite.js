/**
 * CardSprite — composant carte autonome.
 * OVR (haut‑droite) • ATK/DEF (haut‑gauche) • nom au centre
 * 6 stats alignées sur 2 lignes en bas.
 */
export default class CardSprite extends Phaser.GameObjects.Container {
    constructor (scene, card, scale = 1) {
      super(scene, 0, 0);
      scene.add.existing(this);          // ajoute le container à la display‑list
  
      const W = 180, H = 250;
      this.setScale(scale);
  
      /* Fond de carte */
      const base = scene.add.rectangle(0, 0, W, H, 0xffffff)
                         .setStrokeStyle(3, 0x000000);
      this.add(base);
  
      /* OVR haut‑droite */
      this.add(scene.add.text(W/2 - 50, -H/2 + 15, `OVR ${card.ovr}`, {
        fontSize: '16px', color: '#000000', fontStyle: 'bold'
      }).setOrigin(0.5));
  
      /* ATK / DEF haut‑gauche */
      this.add(scene.add.text(-W/2 + 50, -H/2 + 15, `ATK ${card.attackNote}`, {
        fontSize: '14px', color: '#ff3333'
      }).setOrigin(0.5));
  
      this.add(scene.add.text(-W/2 + 50, -H/2 + 35, `DEF ${card.defenseNote}`, {
        fontSize: '14px', color: '#3366ff'
      }).setOrigin(0.5));
  
      /* Nom joueur */
      this.add(scene.add.text(0, -30, card.name, {
        fontSize: '14px', color: '#000000',
        align: 'center', wordWrap: { width: 160 }
      }).setOrigin(0.5));
  
      /* Stats en deux lignes alignées */
      const labels = 'DRI SPD PAS SHO STR DEF';
      const values = `${card.dribble}  ${card.speed}  ${card.pass}  ${card.shoot}  ${card.strength}  ${card.defense}`;
      this.add(scene.add.text(0,  60, labels, { fontSize: '12px', color: '#000000' }).setOrigin(0.5));
      this.add(scene.add.text(0,  80, values, { fontSize: '12px', color: '#000000' }).setOrigin(0.5));
    }
  }
  