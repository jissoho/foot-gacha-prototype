import cards from "../assets/cards.json" assert { type: "json" };

/* ---------- helpers ---------- */
function weightedRandom(pool) {
  const total = pool.reduce((s, c) => s + c.weight, 0);
  let rnd = Math.random() * total;
  return pool.find(c => (rnd -= c.weight) < 0);
}

/* ---------- phaser scenes ---------- */
class GachaScene extends Phaser.Scene {
  constructor() { super("GachaScene"); }
  create() {
    this.add.text(120, 150, "Tirer une carte", { fontSize: "24px" })
      .setInteractive()
      .on("pointerdown", () => {
        const pool = cards.map(c => ({ ...c, weight: {Bronze:60,Silver:25,Gold:15}[c.rarity] }));
        const drawn = weightedRandom(pool);
        alert(`${drawn.name} (${drawn.rarity})\nOVR ${drawn.ovr}`);
        this.scene.start("MatchScene", { card: drawn });
      });
  }
}

class MatchScene extends Phaser.Scene {
  constructor() { super("MatchScene"); }
  init(data) { this.card = data.card; }
  create() {
    /* mini‑simulation : nombre de buts ~ Poisson */
    const lambdaPlayer = this.card.attackNote / 100;
    const lambdaCPU = this.card.defenseNote / 100;
    const poisson = l => Math.round(-Math.log(Math.random()) / (l || 0.01));
    const scoreP = poisson(lambdaPlayer);
    const scoreC = poisson(lambdaCPU);
    this.add.text(200, 250, `${scoreP} – ${scoreC}`, { fontSize: "48px" });
    const res = scoreP > scoreC ? "Victoire" : scoreP < scoreC ? "Défaite" : "Nul";
    this.add.text(200, 330, res, { fontSize: "32px" });
    this.input.once("pointerdown", () => this.scene.start("GachaScene"));
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 800,
  parent: "game",
  scene: [GachaScene, MatchScene]
});
