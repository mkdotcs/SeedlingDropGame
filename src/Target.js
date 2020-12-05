import Phaser from 'phaser';
import Seedling from './Seedling';

export const TargetShowStatus = {
  hide: 0,
  show: 1,
  auto: 2,
};

export default class Target extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, 'target');

    this.status = {
      currentMoving: false,
      currentFloating: true,
      lastMoving: false,
      lastFloating: true,
      showStatus: TargetShowStatus.show,
      saveCurrentValues() {
        this.lastMoving = this.currentMoving;
        this.lastFloating = this.currentFloating;
      },
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

    this.autoTimer = this.scene.time.addEvent({
      delay: 2000,
      paused: true,
      loop: true,
      callback: () => {
        this.status.saveCurrentValues();
        this.move(false);
        this.float(false);
        this.updateYPos(this.scene.scale.height + 300);
        this.autoTimer.paused = true;
      },
    });

    this.y = scene.scale.height + this.displayHeight;
    this.center('x');
    this.updateShowStatus(TargetShowStatus.show);
  }

  updateShowStatus(status) {
    this.autoTimer.paused = true;

    switch (status) {
      case TargetShowStatus.hide:
        if (this.status.showStatus === TargetShowStatus.show) {
          this.status.saveCurrentValues();
        }
        this.move(false);
        this.float(false);
        this.updateYPos(this.scene.scale.height + 300);
        break;

      case TargetShowStatus.show:
        this.updateYPos(this.scene.scale.height - this.displayHeight / 4,
          () => {
            if (this.status.lastMoving) {
              this.move();
            }
            if (this.status.lastFloating) {
              this.float();
            }
          });
        break;
      default:
        this.autoTimer.paused = false;
        break;
    }
    this.status.showStatus = status;
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
      y = dir === 'x' ? this.y : y;
    }

    this.scene.tweens.add({
      targets: [this, this.container],
      x,
      y,
      duration: animate ? 200 : 0,
    });

    // this.setPosition(x, y);

    // const { x: targetX, y: targetY } = this.getTopCenter();
    // this.container.setPosition(targetX, targetY);

    return { x, y };
  }

  addSeedling(x, score, username) {
    // const graphics = this.scene.add.graphics({ lineStyle: {width: 1, color: 0xff0000 } });
    // const line = new Phaser.Geom.Line(dropX, this.getBounds().top, dropX, this.getBounds().top - 300);
    // graphics.strokeLineShape(line);

    // const username = this.createRandomUsername();

    const seedling = new Seedling(this.scene, x, -30, score, username);
    this.container.add(seedling);
  }

  clear() {
    this.container.removeAll(true);
  }

  float(isStart = true) {
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

    this.status.currentFloating = isStart;
    if (isStart) {
      this.floatTween.resume();
    } else {
      this.floatTween.pause();
      this.center('y', true);
    }
  }

  move(isStart = true) {
    if (!this.moveTimer) {
      this.moveTimer = this.scene.time.addEvent({
        delay: 10000,
        callback: this.move,
        callbackScope: this,
        loop: true,
        paused: true,
      });
    }

    this.status.currentMoving = isStart;
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
}
