import Phaser from 'phaser';

import appConfig from './config/appConfig';

const defaultConfig = {
  scale: 1, // 0.5: half size, 1: actual size, 2: double size, etc
  timeout: 10000, // milliseconds
};

const colors = ['red', 'blue', 'green', 'yellow'];

export default class extends Phaser.GameObjects.Sprite {
  /** @param {Phaser.Scene} scene */
  constructor(scene, texture, displayName, trail) {
    super(scene, 0, 0, texture);

    // load drop configuration and set defaults
    this.config = appConfig.drop;
    this.config.hideTimeout = this.config.hideTimeout || defaultConfig.timeout;
    this.config.scale = this.config.scale || 1;

    // scene initialization
    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.dropGroup.add(this);

    this.displayName = displayName;
    this.setScale(this.config.scale);
    if (this.displayWidth > 56) {
      this.displayWidth = 56;
      this.scaleY = this.scaleX;
    }

    // this.setPosition(Phaser.Math.Between(0, this.scene.scale.width), -100);
    // this.setPosition(this.scene.scale.width / 2, -100);
    this.setPosition(100 + Math.floor(Math.random() * (scene.scale.width - 2 * 100)), -100 - (Math.random() * 200));
    this.body.onWorldBounds = true;
    this.body
      .setVelocity((Math.random() * 4 + 2) * (Math.random() > 0.5 ? -1 : 1), Math.random() * 2 + 0.5)
      // .setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(70, 250))
      // .setVelocity(0, 300)
      .setBounce(1)
      .setCollideWorldBounds(true);

    this.setDepth(1);

    this.speed = 200;

    this.wobbleTween = scene.tweens.addCounter({
      from: Phaser.Math.Between(-20, -30),
      to: Phaser.Math.Between(20, 30),
      duration: 800,
      repeat: -1,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      onUpdate: (tween) => {
        this.setAngle(tween.getValue());
      },
    });

    const selectedTrail = trail === 1 ? Phaser.Math.Between(2, 7) : trail;
    if (selectedTrail === 2) {
      this.trail = scene.add.particles(texture).createEmitter({
        speed: 0,
        scale: { start: 1, end: 0 },
        alpha: { start: 0.3, end: 0 },
        frequency: 100,
        lifespan: 1000,
        follow: this,
      });
    } else if (selectedTrail > 2) {
      this.trail = scene.add.particles('flares').createEmitter({
        frame: selectedTrail === 3 ? colors : colors[selectedTrail - 4],
        speed: 50,
        lifespan: {
          onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300) * 1000,
        },
        alpha: {
          onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300),
        },
        scale: { start: 0.6, end: 0 },
        blendMode: 'SCREEN',
        follow: this,
      });
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y + this.displayHeight / 2 > this.scene.scale.height) {
      this.landed(false);
    }
    if (this.body.velocity.y < 0 && this.y < -100) {
      this.cleanUp(true);
    }
  }

  explode() {
    this.visible = false;
    const emitter = this.scene.add.particles('flares').createEmitter({
      frame: 'red',
      x: this.x,
      y: this.y,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 200,
      gravityY: 100,
      quantity: 40,
      on: false,
    });
    emitter.explode();
    emitter.onParticleDeath(() => {
      if (emitter.dead.length === emitter.quantity.propertyValue) {
        this.cleanUp(true);
        this.destroy();
      }
    });
  }

  cleanUp(destroy) {
    this.wobbleTween.stop();
    if (this.trail) {
      this.trail.stop();
    }
    if (this.body) {
      this.body.enable = false;
      this.body.setVelocity(0);
    }
    if (destroy) {
      this.destroy();
    }
  }

  landed(onTarget, dropX, callback) {
    this.cleanUp();
    this.setAngle(0);

    if (onTarget) {
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0 },
        y: '+=30',
        x: dropX,
        scaleX: 0,
        scaleY: 0,
        ease: Phaser.Math.Easing.Expo.InOut,
        duration: 500,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          callback();
          this.destroy();
        },
      });
    } else {
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0 },
        y: '+=50',
        scaleX: 0,
        scaleY: 0,
        angle: -360,
        ease: Phaser.Math.Easing.Cubic.Out,
        delay: this.config.hideTimeout,
        duration: 1000,
        repeat: 0,
        yoyo: false,
        onComplete: () => this.destroy(),
      });
    }
  }
}
