import Phaser from 'phaser';

import Target from './target';
import LeaderBoard from './leaderBoard';
import appConfig from './config/appConfig';
import TestMode from './testMode';
import LiveMode from './liveMode';
import { showStatus, laserCollisions } from './common/constants';

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'world',
    });
  }

  create() {
    // this.getProfileImageUrl('mrbencoder');

    // setup game mode
    let mode;
    if (appConfig.testMode) {
      mode = new TestMode(this);
    } else {
      mode = new LiveMode(this);
    }

    // initialize the scene
    /** @type {Phaser.GameObjects.Group} dropGroup */
    this.dropGroup = this.add.group({
      createCallback: () => {
        if (this.target.config.status === showStatus.auto) {
          this.target.updateStatus(showStatus.auto);
        }
      },
      removeCallback: () => {
        if (this.dropGroup.countActive() === 0
          && this.target.config.status === showStatus.auto) {
          this.target.startAutoTimer();
        }
      },
    });

    this.leaderBoard = new LeaderBoard(this);
    this.target = new Target(this, 0, 0);

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
        const score = +((1 - Math.abs(seedlingX) / (this.target.displayWidth / 2)) * 100)
          .toFixed(2);

        drop.landed(true, dropX, () => {
          target.addSeedling(seedlingX, score, drop.displayName);
          this.leaderBoard.addHighScore({ score, displayName: drop.displayName });
        });
      }
    });
  }

  fireLaser() {
    const { width } = this.scale;

    const collisionRect = this.add.rectangle(width + 10,
      Phaser.Math.Between(20, this.scale.height - 100), 10, 10)
      .setOrigin(1);
    this.physics.add.existing(collisionRect);
    collisionRect.body.setImmovable(true);

    const beam = this.add.image(width, collisionRect.y - collisionRect.width / 2, 'flares', 'blue')
      .setScale(1, 0.4)
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setBlendMode('SCREEN');

    const collider = this.physics.add.overlap(collisionRect, this.dropGroup,
      (laser, collideDrop) => {
        const drop = collideDrop;
        if (appConfig.laserCollision === laserCollisions.bounce) {
          if (drop.body.touching.right || drop.body.touching.right) {
            drop.body.velocity.x *= -1;
          }
          if (drop.body.touching.up || drop.body.touching.down) {
            drop.body.velocity.y *= -1;
          }
        } else {
          drop.explode();
        }
      });

    this.tweens.timeline({
      ease: Phaser.Math.Easing.Expo.Out,
      tweens: [
        {
          targets: beam,
          alpha: 1,
          scaleY: 1.5,
          duration: 1000,
          onComplete: () => {
            this.cameras.main.shake(800, 0.01);
            beam.setScale(0.4);
          },
        },
        {
          targets: beam,
          scaleX: 45,
          duration: 200,
          onUpdate: (tween) => {
            collisionRect.scaleX = tween.getValue() * 3;
          },
          onComplete: () => {
            beam.displayWidth = width * 1.5;
          },
        },
        {
          targets: collisionRect,
          x: -collisionRect.displayWidth,
          duration: 200,
          onUpdate: () => {
            beam.x = collisionRect.x - beam.displayWidth / 4;
          },
          onComplete: () => {
            this.physics.world.removeCollider(collider);
            beam.destroy();
            collisionRect.destroy();
          },
        },
      ],
    });
  }
}
