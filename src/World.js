import Phaser from 'phaser';

import Target from './Target';
import LeaderBoard from './LeaderBoard';
import {
  globalCommands, modCommands, showStatus,
} from './helpers/constants';
import globalConfig from './config/globalConfig';
import TestMode from './TestMode';
import LiveMode from './LiveMode';

export default class World extends Phaser.Scene {
  constructor() {
    super({
      key: 'world',
    });
  }

  create() {
    /* (test: true) in config */
    if (globalConfig.test) {
      this.testMode = new TestMode(this);
    } else {
      this.liveMode = new LiveMode(this);
    }

    this.leaderBoard = new LeaderBoard(this);
    this.target = new Target(this, 0, 0);
    this.laserBounce = true;
    this.dropTrail = 0;

    /** @type {Phaser.GameObjects.Group} dropGroup */
    this.dropGroup = this.add.group({
      removeCallback: () => {
        if (this.dropGroup.countActive() === 0
          && this.target.status.showStatus === showStatus.auto) {
          this.target.startAutoShowTimer();
        }
      },
    });

    this.physics.add.collider(this.dropGroup);
    this.physics.add.collider(this.target, this.dropGroup, (target, drop) => {
      if (target.body.touching.up) {
        const {
          left: dropLeft,
          right: dropRight,
        } = drop.getBounds();
        let dropX = drop.x;

        if (drop.x < target.body.left) {
          dropX = target.body.left + ((dropRight - target.body.left) / 2);
        } else if (drop.x > target.body.right) {
          dropX = target.body.right - ((target.body.right - dropLeft) / 2);
        }
        const seedlingX = dropX - target.x;
        const score = ((1 - Math.abs(seedlingX) / (this.target.displayWidth / 2)) * 100).toFixed(2);
        let username;
        if (globalCommands.test) {
          username = this.testMode.createRandomUsername();
        } else {
          // username = World.createRandomUsername();
        }

        drop.landed(true, dropX, () => target.addSeedling(seedlingX, score, username));
        this.leaderBoard.addHighScore({
          score,
          username,
        });
      }
    });
  }

  fireLaser() {
    const laserBeam = this.physics.add.image(this.scale.width, Phaser.Math.Between(20, this.scale.height - 100), 'flares', 'laser');
    laserBeam
      .setAlpha(0)
      .setScale(1, 2)
      .setImmovable(true);
    laserBeam.body.setSize(1, 1);

    const collider = this.laserBounce
      ? this.physics.add.collider(laserBeam, this.dropGroup)
      : this.physics.add.overlap(laserBeam, this.dropGroup, (laser, drop) => {
        drop.explode();
      });

    this.tweens.timeline({
      targets: laserBeam,
      ease: Phaser.Math.Easing.Linear.In,
      tweens: [
        {
          alpha: 1,
          scaleY: 10,
          duration: 1000,
          onComplete: () => {
            this.cameras.main.shake(800, 0.01);
            laserBeam.setScale(150, 2);
            laserBeam.body.setSize(laserBeam.width, 5);
          },
        },
        {
          x: this.scale.width * -2,
          alpha: 0,
          duration: 1000,
          onUpdate: () => {
            if (laserBeam.alpha < 0.8) {
              laserBeam.body.setSize(1, 1);
            }
          },
          onComplete: () => {
            this.physics.world.removeCollider(collider);
            laserBeam.destroy();
          },
        },
      ],
    });
  }
}
