import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
  constructor () {
    super({ key: 'boot' });
  }

  preload () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    this.load.crossOrigin = 'anonymous';

    this.load.image('bg', 'images/bg.png');
    this.load.image('red', 'images/red.png');
    this.load.image('grass', 'images/grass.png');
    this.load.image('target', 'images/target.png');
    this.load.image('leaf', 'images/leaf.png');

    [
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
    this.scene.start('world');
  }
}
