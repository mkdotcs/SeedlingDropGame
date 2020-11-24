import Phaser from 'phaser';
import Boot from './Boot';
import World from './World';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  // width: 800, //window.innerWidth,
  // height: 640, //window.innerHeight,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
  scene: [Boot, World],
  physics: {
    default: 'arcade',
    arcade: {
      //gravity: false
      debug: true,
      checkCollision: {
        up: false
      }
    }
  //   matter: {
  //     debug: true,
  //     gravity: { x: 0, y: 0 }
  //   }
  }
};
