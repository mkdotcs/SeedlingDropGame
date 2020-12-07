import Phaser from 'phaser';
import Boot from '../Boot';
import World from '../World';

// Phaser engine's configuration

export default {
  type: Phaser.AUTO,
  parent: 'game',
  renderer: { mipmapFilter: 'LINEAR_MIPMAP_LINEAR' },
  backgroundColor: '#000',
  // width: 800, //window.innerWidth,
  // height: 640, //window.innerHeight,
  // pixelArt: true,
  // scale: {
  //   mode: Phaser.Scale.RESIZE,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  // },
  width: 1280,
  height: 800,
  // resolution: window.devicePixelRatio,
  // banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
  scene: [Boot, World],
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      checkCollision: {
        up: false,
        down: false,
      },
    },
  },
};
