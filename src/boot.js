import Phaser from 'phaser';

import WebFontFile from './common/webFontFile';
import appConfig from './config/appConfig';

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  preload() {
    // Loading indicator
    const { width, height } = this.scale;
    const bg = this.add.rectangle(width / 2, height / 2 + 80, 500, 10, 0x666666);
    const bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);
    const loadingText = this.add.text(width / 2, height / 2, 'LOADING...(0%)', {
      fontSize: '60px',
      fontFamily: 'Arial',
      align: 'center',
    })
      .setOrigin(0.5);

    // Loading assets
    this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');

    this.load.svg('target', 'assets/target.svg');
    this.load.svg('seedling', 'assets/seedling.svg', { scale: 0.5 });
    this.load.svg('tree', 'assets/tree.svg');
    this.load.svg('whiteFlower', 'assets/white-flower.svg');
    this.load.svg('blueFlower', 'assets/blue-flower.svg');
    this.load.svg('board', 'assets/board.svg');

    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'));

    this.load.crossOrigin = 'anonymous';
    this.load.setCORS('anonymous');
    this.load.setCORS('Anonymous');

    if (appConfig.testMode) {
      this.load.image('bg', 'assets/bg.jpg');

      [
        'https://static-cdn.jtvnw.net/emoticons/v1/303046121/2.0',
        'https://static-cdn.jtvnw.net/emoticons/v1/302039277/2.0',
        'https://static-cdn.jtvnw.net/emoticons/v1/301988022/2.0',
        'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/2x',
        'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/5abc0096a05ad63caeccbe58/2x',
        'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/59f06613ba7cdd47e9a4cad2/2x',
      ].map((url, index) => this.load.image(`test${index}`, url));
    }

    this.load.on('progress', (progress) => {
      bar.setScale(progress, 1);

      const p = progress * 100;
      loadingText.setText(`LOADING...(${p.toFixed(0)}%)`);
    });
  }

  update() {
    this.scene.start('world');
  }
}
