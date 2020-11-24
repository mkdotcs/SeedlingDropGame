import Phaser from 'phaser';
// import images from './assets/*.png';

export default class Boot extends Phaser.Scene {
  constructor () {
    super({ key: 'boot' });
  }

  preload () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    // console.table(images);

    // this.load.image('bg', images.bg);
    // this.load.image('logo', images.logo);
    // this.load.image('red', images.red);
    // this.load.image('grass', images.grass);
    // this.load.image('grass1', images.grass1);

    this.load.image('bg', 'images/bg.png');
    this.load.image('red', 'images/red.png');
    this.load.image('grass', 'images/grass.png');

    const test = [
      'https://static-cdn.jtvnw.net/emoticons/v1/303046121/2.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/302039277/2.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/301988022/2.0',
      'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/2x',
      'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/5abc0096a05ad63caeccbe58/2x',
      'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/59f06613ba7cdd47e9a4cad2/2x'
    ].map((url, index) => this.load.image(`test${index}`, url));

    this.load.on('progress', function (progress) {
      bar.setScale(progress, 1);
    });
  }

  update () {
    // this.scene.start('menu');
    this.scene.start('world');
    // this.scene.remove();
  }
}
