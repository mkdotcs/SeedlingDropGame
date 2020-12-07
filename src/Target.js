import Phaser from 'phaser';
import Seedling from './Seedling';
import { targetShowStatus } from './helpers/constants';

export default class Target extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, 'target');

    this.status = {
      currentMoving: false,
      currentFloating: true,
      hidden: false,
      showStatus: targetShowStatus.show,
    };

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setImmovable(true)
      .setCollideWorldBounds(true);

    this.displayWidth = scene.scale.width * 0.2;
    this.scaleY = this.scaleX;
    this.body.setSize(
      this.body.width - this.body.width * 0.1,
      this.body.height - this.body.height * 0.2,
      true,
    );

    /** @type {Phaser.GameObjects.Container} container */
    this.container = scene.add.container(0, 0 + 5)
      .setDepth(-1);

    this.y = scene.scale.height + this.displayHeight;
    this.center('x');
    this.show();
  }

  show() {
    this.removeTimer();

    this.status.hidden = false;
    this.updateYPos(this.scene.scale.height - this.displayHeight / 4,
      () => {
        if (this.status.currentMoving) {
          this.move(true, this.status.showStatus !== targetShowStatus.auto);
        }
        if (this.status.currentFloating) {
          this.float(true, this.status.showStatus !== targetShowStatus.auto);
        }
      });
  }

  hide() {
    this.removeTimer();

    this.status.hidden = true;
    this.move(false, false);
    this.float(false, false);
    this.updateYPos(this.scene.scale.height + 300);
  }

  startAutoShowTimer() {
    if (!this.autoTimer) {
      this.autoTimer = this.scene.time.addEvent({
        delay: 3000,
        callback: () => {
          this.hide();
        },
      });
    }
  }

  updateYPos(y, callback) {
    this.scene.tweens.add({
      targets: [this, this.container],
      y,
      duration: 500,
      onComplete: () => {
        if (callback) {
          callback();
        }
      },
    });
  }

  center(dir, animate) {
    const { width: sceneWidth, height: sceneHeight } = this.scene.scale;
    let x = sceneWidth / 2;
    let y = sceneHeight - this.displayHeight / 4;
    if (dir) {
      x = dir === 'y' ? this.x : x;
      y = dir === 'x' || this.status.hidden ? this.y : y;
    }

    this.scene.tweens.add({
      targets: [this, this.container],
      x,
      y,
      duration: animate ? 200 : 0,
    });

    return { x, y };
  }

  addSeedling(x, score, username) {
    const seedling = new Seedling(this.scene, x, -30, score, username);
    this.container.add(seedling);
  }

  clear() {
    this.container.removeAll(true);
  }

  float(isStart = true, update = true) {
    if (!this.floatTween) {
      this.floatTween = this.scene.tweens.add({
        targets: [this, this.container],
        y: '-=10',
        duration: 1000,
        ease: Phaser.Math.Easing.Sine.InOut,
        repeat: -1,
        yoyo: true,
        paused: true,
      });
    }

    if (update) {
      this.status.currentFloating = isStart;
    }

    if (isStart && !this.status.hidden) {
      this.floatTween.resume();
    } else {
      this.floatTween.pause();
      this.center('y', true);
    }
  }

  move(isStart = true, update = true) {
    if (!this.moveTimer) {
      this.moveTimer = this.scene.time.addEvent({
        delay: 10000,
        callback: this.move,
        callbackScope: this,
        loop: true,
        paused: true,
      });
    }

    if (update) {
      this.status.currentMoving = isStart;
    }
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
      this.center('x', true);
    }
  }

  removeTimer() {
    if (this.autoTimer) {
      this.autoTimer.remove();
      this.autoTimer = undefined;
    }
  }
}
