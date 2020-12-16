import Phaser from 'phaser';
import Seedling from './seedling';
import appConfig from './config/appConfig';
import { showStatus } from './common/constants';

const defaultConfig = {
  status: 0, // 0: show, 1: auto, 2: hide
  autoTimeout: 90000, // milliseconds
};

export default class extends Phaser.GameObjects.Image {
  /** @param {Phaser.Scene} scene */
  constructor(scene, x, y, texture) {
    super(scene, x, y, 'target');

    // load target this.configuration and set defaults
    this.config = appConfig.target;
    this.config.status = this.config.status
      && this.config.status < Object.keys(showStatus).length
      ? this.config.status : defaultConfig.status;
    this.config.autoTimeout = this.config.autoTimeout || defaultConfig.autoTimeout;
    this.config.hidden = false;

    // scene initialization
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setImmovable(true)
      .setCollideWorldBounds(true);

    this.displayWidth = scene.scale.width * 0.17;
    this.scaleY = this.scaleX;
    this.body.setSize(
      this.body.width - this.body.width * 0.1,
      this.body.height - this.body.height * 0.2,
      true,
    );

    /** @type {Phaser.GameObjects.Container} container */
    this.container = scene.add.container(0, 0)
      .setDepth(-1);

    this.y = scene.scale.height + this.displayHeight;
    this.center('x');
    this.updateStatus(this.config.status);
  }

  updateStatus(status) {
    this.removeTimer();

    this.config.status = status;
    if (status === showStatus.show) {
      this.show();
    } else if (status === showStatus.auto) {
      if (this.scene.dropGroup.countActive() === 0) {
        this.startAutoTimer();
      } else {
        this.show();
      }
    } else {
      this.hide();
    }
  }

  show() {
    this.removeTimer();

    this.config.hidden = false;
    this.updateYPos(this.scene.scale.height - this.displayHeight / 4,
      () => {
        if (this.config.move) {
          this.move(true, this.config.status !== showStatus.auto);
        }
        if (this.config.float) {
          this.float(true, this.config.status !== showStatus.auto);
        }
      });
  }

  hide() {
    this.removeTimer();

    this.config.hidden = true;
    this.move(false, false);
    this.float(false, false);
    this.updateYPos(this.scene.scale.height + 300);
  }

  startAutoTimer() {
    if (!this.autoTimer) {
      this.autoTimer = this.scene.time.delayedCall(
        this.config.autoTimeout,
        () => this.hide(),
      );
    }
  }

  removeTimer() {
    if (this.autoTimer) {
      this.autoTimer.remove();
      this.autoTimer = undefined;
    }
  }

  updateYPos(y, callback) {
    this.scene.tweens.add({
      targets: this,
      y,
      duration: 500,
      onUpdate: () => { this.container.y = y + 5; },
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

    if (dir === 'x') {
      y = this.config.hidden ? this.y : y;
    } else if (dir === 'y') {
      x = this.x;
    }

    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: animate ? 200 : 0,
      onUpdate: () => { this.container.setPosition(x, y + 5); },
    });

    return { x, y };
  }

  addSeedling(x, score, displayName) {
    const seedling = new Seedling(this.scene, x, -30, score, displayName);
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
      this.config.float = isStart;
    }

    if (isStart && !this.config.hidden) {
      this.floatTween.resume();
    } else {
      this.floatTween.pause();
      if (!this.config.hidden) {
        this.center('y', true);
      }
    }
  }

  move(isStart = true, update = true) {
    if (!this.moveTimer) {
      this.moveTimer = this.scene.time.addEvent({
        delay: 10000,
        startAt: 10000,
        callback: () => {
          const rnd = Phaser.Math.RND;
          const newX = rnd.between(this.displayWidth + 5,
            this.scene.scale.width - this.displayWidth - 5);

          this.scene.tweens.add({
            targets: [this, this.container],
            x: newX,
            duration: 1000,
            ease: Phaser.Math.Easing.Sine.InOut,
          });
        },
        callbackScope: this,
        loop: true,
        paused: true,
      });
    }

    if (update) {
      this.config.move = isStart;
    }
    if (isStart) {
      this.moveTimer.paused = false;
    } else {
      this.moveTimer.paused = true;
      this.center('x', true);
    }
  }
}
