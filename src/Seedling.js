import Phaser from 'phaser';

export default class Seedling extends Phaser.GameObjects.Image {
  constructor(scene, x, y, score, username) {
    let textureName = 'seedling';
    let height = score * 0.9;

    if (score > 90) {
      textureName = 'tree';
      height = score * 1.1;
    }

    super(scene, x, y, textureName);

    scene.add.existing(this);

    this.displayHeight = 0;
    this.scaleX = this.scaleY;
    this.setOrigin(0.5, 1);

    this.displayUsername = scene.add.text(this.x, y, username,{
      fontFamily: '"Press Start 2P"',
      fontSize: 16 * ((score / 100) * 1.1),
      color: '#ffffff',
    })
      .setOrigin(0.5)
      .setStroke('#de77ae', 16)
      .setShadow(2, 2, '#333333', 2, true, false);

    /* show seedling */
    scene.tweens.addCounter({
      from: 0,
      to: height,
      duration: 1000,
      ease: Phaser.Math.Easing.Bounce.Out,
      repeat: 0,
      yoyo: false,
      onStart: () => {
        this.parentContainer.add(this.displayUsername);
      },
      onUpdate: (tween) => {
        this.displayHeight = tween.getValue();
        this.scaleX = this.scaleY;
        this.displayUsername.y = this.y - tween.getValue() - 10;
      },
    });

    /* hide username only after 1 sec. */
    scene.time.addEvent({
      delay: 1000,
      callback: () => {
        scene.tweens.add({
          targets: this.displayUsername,
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
