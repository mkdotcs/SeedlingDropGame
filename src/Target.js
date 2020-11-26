import Phaser from 'phaser';

export default class Target extends Phaser.GameObjects.Image {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setImmovable(true);

    const { width, height } = scene.scale;
    const scale = width * 0.2 / this.width;
    
    this.setScale(scale)
      .setPosition(width / 2, height - this.displayHeight / 2);
    
    this.body.setSize(this.width - 80 * scale, this.height)
      .setOffset(40 * scale, 30 * scale);
    // scene.tweens.add({
    //   targets: this,
    //   y: '-=10',
    //   duration: 1000,
    //   ease: Phaser.Math.Easing.Sine.InOut,
    //   repeat: -1,
    //   yoyo: true
    // });
  }

  addSeedling (dropX) {
    const graphics = this.scene.add.graphics({ lineStyle: {width: 1, color: 0xff0000 } });
    const line = new Phaser.Geom.Line(dropX, this.getBounds().top, dropX, this.getBounds().top - 100);
    graphics.strokeLineShape(line);

    // this.scene.add.image(dropX, this.body.y, 'leaf');
    this.scene.add.image(dropX, this.body.y, 'leaf')
      .setScale(0.3)
      .setOrigin(0.5, 1);
  }
}
