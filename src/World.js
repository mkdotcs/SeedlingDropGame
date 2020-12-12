import Phaser from 'phaser';

import Target from './target';
import LeaderBoard from './leaderBoard';
import {
  showStatus, globalCommands, modCommands,
} from './helpers/constants';
import globalConfig from './config/globalConfig';
import TestMode from './testMode';
import LiveMode from './liveMode';

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'world',
    });
  }

  create() {
    // setup game mode
    let mode;
    if (globalConfig.testMode) {
      mode = new TestMode(this);
      this.fireLaser();

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
        const score = ((1 - Math.abs(seedlingX) / (this.target.displayWidth / 2)) * 100).toFixed(2);

        drop.landed(true, dropX, () => {
          target.addSeedling(seedlingX, score, drop.displayName);
          this.leaderBoard.addHighScore({ score, displayName: drop.displayName });
        });
      }
    });
  }

  fireLaser() {
    const { width } = this.scale;
    const particles = this.add.particles('flares');
    const line = new Phaser.Geom.Line(width + 10, 300, -10, 300);

    const emitter = particles.createEmitter({
      frame: 'blue',
      quantity: 80,
      scale: { start: 0.1, end: 0 },
      blendMode: 'SCREEN',
      emitZone: { type: 'edge', source: line, quantity: 400 }
    });
    
    // const laserBeam = this.physics.add.image(this.scale.width, Phaser.Math.Between(20, this.scale.height - 100), 'flares', 'laser');
    // laserBeam
    //   .setAlpha(0)
    //   .setScale(1, 2)
    //   .setImmovable(true);
    // laserBeam.body.setSize(1, 1);

    // globalConfig.laserCollision (0: Bounce, 1: Destroy)
    // const collider = globalConfig.laserCollision === 0
    //   ? this.physics.add.collider(laserBeam, this.dropGroup)
    //   : this.physics.add.overlap(laserBeam, this.dropGroup, (laser, drop) => {
    //     drop.explode();
    //   });

    // this.tweens.timeline({
    //   targets: laserBeam,
    //   ease: Phaser.Math.Easing.Linear.In,
    //   tweens: [
    //     {
    //       alpha: 1,
    //       scaleY: 10,
    //       duration: 1000,
    //       onComplete: () => {
    //         this.cameras.main.shake(800, 0.01);
    //         laserBeam.setScale(150, 2);
    //         laserBeam.body.setSize(laserBeam.width, 5);
    //       },
    //     },
    //     {
    //       x: this.scale.width * -2,
    //       alpha: 0,
    //       duration: 1000,
    //       onUpdate: () => {
    //         if (laserBeam.alpha < 0.8) {
    //           laserBeam.body.setSize(1, 1);
    //         }
    //       },
    //       onComplete: () => {
    //         this.physics.world.removeCollider(collider);
    //         laserBeam.destroy();
    //       },
    //     },
    //   ],
    // });
  }

  updateConfig() {
    this.globalConfig.drop.trail = 7;
  }
}
