import Phaser from 'phaser';

import appConfig from './config/appConfig';

const defaultConfig = {
  timout: 1000, // milliseconds
};

export default class extends Phaser.GameObjects.Image {
  constructor(scene, x, y, score, displayName) {
    let textureName = 'seedling';
    let height = score * 0.9;

    if (score > 90) {
      textureName = 'tree';
      height = score * 1.1;
    }

    super(scene, x, y, textureName);

    // load drop configuration and set defaults
    this.config = appConfig.drop;
    this.config.timout = this.config.timout || defaultConfig.timout;

    // scene initialization
    scene.add.existing(this);

    this.displayHeight = 0;
    this.scaleX = this.scaleY;
    this.setOrigin(0.5, 1);

    this.displayName = scene.add.text(this.x, y, displayName, {
      fontFamily: '"Press Start 2P"',
      fontSize: 16 * ((score / 100) * 1.1),
      color: '#ffffff',
    })
      .setOrigin(0.5)
      .setStroke('#de77ae', 16)
      .setShadow(2, 2, '#333333', 2, true, false);

    // show seedling
    scene.tweens.addCounter({
      from: 0,
      to: height,
      duration: 1000,
      ease: Phaser.Math.Easing.Bounce.Out,
      repeat: 0,
      yoyo: false,
      onStart: () => {
        this.parentContainer.add(this.displayName);
      },
      onUpdate: (tween) => {
        this.displayHeight = tween.getValue();
        this.scaleX = this.scaleY;
        this.displayName.y = this.y - tween.getValue() - 10;
      },
    });

    // hide user name only
    scene.time.addEvent({
      delay: this.config.timout,
      callback: () => {
        scene.tweens.add({
          targets: this.displayName,
          alpha: { from: 1, to: 0 },
          scaleX: 0,
          scaleY: 0,
          delay: 0,
          ease: Phaser.Math.Easing.Expo.InOut,
          duration: 50000,
          repeat: 0,
          yoyo: false,
        });
      },
    });
  }
}

// Phaser.GameObjects.GameObjectFactory.register('seedling', function (x, y, score) {
//   const seedling = new Seedling(this.scene, x, y, score);

//   this.displayList.add(seedling);
//   // this.updateList.add(seedling);
//   return seedling;
// });
