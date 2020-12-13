import Phaser from 'phaser';
import phaserConfig from './config/phaserConfig';

let game;

function newGame() {
  if (game) return;
  game = new Phaser.Game(phaserConfig);
}

function destroyGame() {
  if (!game) return;
  window.location.reload();
  // game.destroy(true);
  // game.runDestroy();
  // game = null;
}

if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(newGame);
}

if (!game) newGame();
