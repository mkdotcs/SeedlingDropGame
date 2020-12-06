import Phaser from 'phaser';

export default class Drop extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, trail) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.onWorldBounds = true;
    this.body
      .setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(70, 250))
      // .setVelocity(0, Phaser.Math.Between(70, 250))
      .setBounce(1)
      .setCollideWorldBounds(true)
      .setAllowRotation();
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

    this.trail = scene.add.particles(texture).createEmitter({
      // frame: this.getTrailFrames(trail),
      speed: 50,
      // x: this.x,
      // y: this.y,
      speedX: 200,
      speedY: 200,
      lifespan: 400,
      blendMode: 'SCREEN',
      follow: this,
    });
    // this.trail = scene.add.particles('flares').createEmitter({
    //   frame: this.getTrailFrames(trail),
    //   speed: 50,
    //   lifespan: {
    //     onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300) * 1000,
    //   },
    //   alpha: {
    //     onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300),
    //   },
    //   scale: { start: 0.6, end: 0 },
    //   blendMode: 'SCREEN',
    //   follow: this,
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  getTrailFrames(trail) {
    switch (trail) {
      case 1:
        return ['red', 'blue', 'green', 'yellow'];

      case 2:
        return 'red';

      case 3:
        return 'blue';

      case 4:
        return 'green';

      case 5:
        return 'yellow';

      default:
        return '';
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y + this.displayHeight / 2 > this.scene.scale.height) {
      this.landed(false);
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
    emitter.onParticleDeath((particle) => {
      if (emitter.dead.length === emitter.quantity.propertyValue) {
        this.cleanUp();
        this.destroy();
      }
    });
  }

  cleanUp() {
    this.wobbleTween.stop();
    this.trail.stop();
    if (this.body) {
      this.body.enable = false;
      this.body.setVelocity(0);
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
        delay: 1000, // config.dropTimeout
        duration: 5000,
        repeat: 0,
        yoyo: false,
        onComplete: () => this.destroy(),
      });
    }
  }
}
