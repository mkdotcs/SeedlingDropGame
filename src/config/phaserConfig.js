import Phaser from 'phaser';
import Boot from '../boot';
import World from '../world';

// Phaser engine's configuration

export default {
  type: Phaser.AUTO,
  parent: 'game',
  renderer: { mipmapFilter: 'LINEAR_MIPMAP_LINEAR' },
  backgroundColor: '#000',
  width: 1280,
  height: 800,
  banner: false,
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
