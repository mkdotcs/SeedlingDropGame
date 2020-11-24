import Phaser from 'phaser';
import Drop from './Drop';

export default class Init extends Phaser.Scene {
  constructor () {
    super({ key: 'init' });
  }

  init () {
    Phaser.GameObjects.GameObjectFactory.register('drop', function (x, y)
    {
      let sprite = new Drop(this.scene, x, y);

      this.displayList.add(sprite);
      this.updateList.add(sprite);


      return sprite;
    });
  }

  update () {
    this.scene.start('boot');
  }
}
