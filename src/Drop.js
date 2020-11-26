import Phaser from 'phaser';

export default class Drop extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture) {
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
      yoyo: true,
      onUpdate: tween => {
        this.setAngle(tween.getValue());
        this.body.angle = tween.getValue();
      }
    });

    this.trail = scene.add.particles('red').createEmitter({
      speed: 50,
      lifespan: {
        onEmit: (particle, key, t, value) => {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 1000;
        }
      },
      alpha: {
        onEmit: (particle, key, t, value) => {
          return Phaser.Math.Percent(this.body.speed, 0, 300);
        }
      },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      follow: this
    });
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta);
  }

  landed (onTarget) {
    this.wobbleTween.stop();
    this.body.setVelocity(0);
    this.body.enable = false;
    this.trail.stop();
    this.setAngle(0);

    return;

    if (onTarget) {

    } else {
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0 },
        y: '+=50',
        scaleX: 0,
        scaleY: 0,
        angle: -360,
        ease: 'Power2',
        delay: 1000, //config.dropTimeout
        duration: 5000,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          this.destroy();
        }
      });
    }
  }
}
