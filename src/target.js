import Phaser from 'phaser';

import Seedling from './seedling';
import appConfig from './config/appConfig';
import { showStatus } from './common/constants';

const defaultConfig = {
  status: 0, // 0: show, 1: auto, 2: hide
  autoTimeout: 90000, // milliseconds
};

export default class { // extends Phaser.GameObjects.Image {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;

    // load target this.configuration and set defaults
    this.config = appConfig.target;
    this.config.status = this.config.status
      && this.config.status < Object.keys(showStatus).length
      ? this.config.status : defaultConfig.status;
    this.config.autoTimeout = this.config.autoTimeout || defaultConfig.autoTimeout;
    this.config.hidden = false;

    // initialization
    /** @type {Phaser.GameObjects.Container} container */
    this.container = scene.add.container(0, 0)
      .setDepth(-1);
    this.surface = scene.physics.add.image(0, 0, 'target');

    this.container.add(this.surface);
    const { width: sceneWidth, height: sceneHeight } = scene.scale;
    Object.assign(this, { sceneWidth, sceneHeight });

    const scale = (sceneWidth * 0.17) / this.surface.width;
    this.surface.setScale(scale, scale);
    // reduce the size of collision area
    this.surface.body.setSize(
      this.surface.body.width - this.surface.body.width * 0.05,
      this.surface.body.height - this.surface.body.height * 0.15,
      true,
    )
      .setImmovable(true)
      .setCollideWorldBounds(true);

    this.container.setSize(this.surface.displayWidth, this.surface.displayHeight);
    this.container.y = sceneHeight - this.container.height / 2;
    this.updatePos(null, 'centerX', false, () => this.updateStatus(this.config.status));
  }

  updateStatus(status) {
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
    this.removeAutoTimer();

    this.config.hidden = false;
    this.updatePos({ y: this.sceneHeight - this.container.height / 4 }, null, null,
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
    this.removeAutoTimer();

    this.config.hidden = true;
    this.move(false, false);
    this.float(false, false);
    this.updatePos({ y: this.sceneHeight + 300 });
  }

  startAutoTimer() {
    this.removeAutoTimer();

    if (!this.autoTimer) {
      this.autoTimer = this.scene.time.delayedCall(
        this.config.autoTimeout,
        () => this.hide(),
      );
    }
  }

  removeAutoTimer() {
    if (this.autoTimer) {
      this.autoTimer.remove();
      this.autoTimer = undefined;
    }
  }

  updatePos(newPos, centerDir, isAnimate = true, callback) {
    let { x = this.container.x, y = this.container.y } = newPos || {};

    if (centerDir) {
      x = centerDir.includes('centerX') ? this.sceneWidth / 2 : x;
      y = centerDir.includes('centerY') ? this.sceneHeight - this.container.height / 4 : y;
    }

    this.scene.tweens.add({
      targets: this.container,
      x,
      y,
      duration: isAnimate ? 500 : 0,
      onComplete: () => {
        if (callback) {
          callback();
        }
      },
    });
  }

  addSeedling(x, score, displayName) {
    const seedling = new Seedling(this.scene, x, -this.container.height / 2, score, displayName);
    this.container.addAt(seedling, this.container.list.length);
  }

  clear() {
    const removed = this.container.list.splice(1, this.container.list.length - 2);
    removed.forEach((child) => child.destroy());
  }

  float(isStart = true, update = true) {
    if (!this.floatTween) {
      this.floatTween = this.scene.tweens.add({
        targets: this.container,
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
        this.updatePos(null, 'centerY');
      }
    }
  }

  move(isStart = true, update = true) {
    if (!this.moveTimer) {
      this.moveTimer = this.scene.time.addEvent({
        delay: 10000,
        startAt: 10000,
        callback: () => {
          if (!this.config.hidden) {
            const rnd = Phaser.Math.RND;
            const newX = rnd.between(this.container.width + 5,
              this.sceneWidth - this.container.width - 5);
            this.updatePos({ x: newX });
          }
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
      this.moveTimer.remove();
      this.moveTimer = undefined;
      this.updatePos(null, 'centerX');
    }
  }
}
