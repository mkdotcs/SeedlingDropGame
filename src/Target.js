import Phaser from 'phaser';
import Seedling from './Seedling';

export default class Target extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setImmovable(true)
      .setCollideWorldBounds(true);

    const scale = (scene.scale.width * 0.2) / this.width;

    this.setScale(scale);
    this.body.setSize(this.width - 80 * scale, this.height)
      .setOffset(40 * scale, 30 * scale);

    this.container = scene.add.container(0, 0 + 5)
      .setDepth(-1);

    this.centerTarget();

    this.floatTween = scene.tweens.add({
      targets: [this, this.container],
      y: '-=10',
      duration: 1000,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
    });

    this.moveTimer = scene.time.addEvent({
      delay: 10000,
      callback: this.move,
      callbackScope: this,
      loop: true,
      paused: true,
    });
  }

  centerTarget(centerYOnly) {
    const { width: sceneWidth, height: sceneHeight } = this.scene.scale;
    this.setPosition(centerYOnly ? this.x : sceneWidth / 2, sceneHeight - this.displayHeight / 4);

    const { x: targetX, y: targetY } = this.getTopCenter();
    this.container.setPosition(targetX, targetY);
  }

  addSeedling(x) {
    // const graphics = this.scene.add.graphics({ lineStyle: {width: 1, color: 0xff0000 } });
    // const line = new Phaser.Geom.Line(dropX, this.getBounds().top, dropX, this.getBounds().top - 300);
    // graphics.strokeLineShape(line);

    const username = this.createRandomUsername();

    const score = (1 - Math.abs(x) / (this.displayWidth / 2)) * 100;
    const seedling = new Seedling(this.scene, x, 0, score, username);
    this.container.add(seedling);
  }

  clear() {
    this.container.removeAll(true);
  }

  float(isStart = true) {
    if (isStart) {
      this.floatTween.resume();
    } else {
      this.floatTween.pause();
      this.centerTarget(true);
    }
  }

  move(isStart = true) {
    if (isStart) {
      const rnd = Phaser.Math.RND;
      const newX = rnd.between(this.displayWidth + 5,
        this.scene.scale.width - this.displayWidth - 5);

      this.scene.tweens.add({
        targets: [this, this.container],
        x: newX,
        duration: 1000,
        ease: Phaser.Math.Easing.Sine.InOut,
      });
      this.moveTimer.paused = false;
    } else {
      this.moveTimer.paused = true;
      this.centerTarget();
    }
  }

  // for testing purpose only
  // eslint-disable-next-line class-methods-use-this
  createRandomUsername() {
    const name1 = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable', 'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept', 'admirable', 'admired'];
    const name2 = ['people', 'history', 'way', 'art', 'world', 'information', 'map', 'family', 'government', 'health', 'system', 'computer', 'meat', 'year', 'thanks', 'music', 'person', 'reading', 'method', 'data', 'food', 'understanding'];
    return `${name1[Phaser.Math.Between(0, name1.length + 1)]} ${name2[Phaser.Math.Between(0, name2.length + 1)]}`;
  }
}
