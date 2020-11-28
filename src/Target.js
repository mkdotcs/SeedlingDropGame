import Phaser from 'phaser';
import Seedling from './Seedling';

export default class Target extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setImmovable(true)
      .setCollideWorldBounds(true);

    const { width: sceneWidth, height: sceneHeight } = scene.scale;
    const scale = (sceneWidth * 0.2) / this.width;

    this.setScale(scale)
      .setPosition(sceneWidth / 2, sceneHeight - this.displayHeight / 4);
    
    this.body.setSize(this.width - 80 * scale, this.height)
      .setOffset(40 * scale, 30 * scale);

    const { x: targetX, y: targetY } = this.getTopCenter();
    this.container = scene.add.container(targetX, targetY + 5)
      .setDepth(-1);

    this.floatTween = scene.tweens.add({
      targets: [this, this.container],
      y: '-=10',
      duration: 1000,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
    });

    this.moveTimer = scene.time.addEvent({
      delay: 5000,
      callback: this.move,
      callbackScope: this,
      loop: true,
      paused: true,
    });
  }

  addSeedling(dropX) {
    // const graphics = this.scene.add.graphics({ lineStyle: {width: 1, color: 0xff0000 } });
    // const line = new Phaser.Geom.Line(dropX, this.getBounds().top, dropX, this.getBounds().top - 300);
    // graphics.strokeLineShape(line);

    const username = this.createRandomUsername();

    const score = (1 - Math.abs(dropX - this.x) / (this.displayWidth / 2)) * 100;
    const seedling = new Seedling(this.scene, dropX - this.x, 0, score, username);
    this.container.add(seedling);
  }

  startMove() {
    this.move();
    this.moveTimer.paused = false;
  }

  stopMove() {
    this.moveTimer.paused = true;
    this.setPosition(this.scene.scale.width / 2, this.scene.scale.height - this.displayHeight / 4);
  }

  startFloat() {
    this.floatTween.start();
  }

  stopFloat() {
    this.floatTween.stop();
    this.setPosition(this.scene.scale.width / 2, this.scene.scale.height - this.displayHeight / 4);
  }

  move() {
    // const halfWidth = this.displayWidth / 2;
    // const leftX1 = halfWidth + 5;
    // const leftX2 = this.x - halfWidth;
    // const rightX1 = this.x + halfWidth;
    // const rightX2 = this.scene.scale.width - this.displayWidth - 5;

    const rnd = Phaser.Math.RND;
    // let isLeft = rnd.frac() < 0.5;

    // isLeft = (isLeft && leftX1 < leftX2) || (!isLeft && rightX1 > rightX2);

    // const startX = isLeft ? leftX1 : rightX1;
    // const endX = isLeft ? leftX2 : rightX2;
    // const newX = Phaser.Math.Between(this.displayWidth + 5,
    const newX = rnd.between(this.displayWidth + 5, this.scene.scale.width - this.displayWidth - 5);

    this.scene.tweens.add({
      targets: [this, this.container],
      x: newX,
      duration: 1000,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
  }

  // for testing purpose only
  // eslint-disable-next-line class-methods-use-this
  createRandomUsername() {
    const name1 = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable', 'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept', 'admirable', 'admired'];
    const name2 = ['people', 'history', 'way', 'art', 'world', 'information', 'map', 'family', 'government', 'health', 'system', 'computer', 'meat', 'year', 'thanks', 'music', 'person', 'reading', 'method', 'data', 'food', 'understanding'];
    return `${name1[Phaser.Math.Between(0, name1.length + 1)]} ${name2[Phaser.Math.Between(0, name2.length + 1)]}`;
  }
}
