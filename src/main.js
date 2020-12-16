import Phaser from 'phaser';
import phaserConfig from './config/phaserConfig';
import appConfig from './config/appConfig';

let game;
let startGame = true;
const { channel: { twitchClientID } } = appConfig;

async function getTwitchAccessToken() {
  let accessToken;
  const hasAccessToken = window.location.hash.includes('access_token');
  if (hasAccessToken) {
    [,, accessToken] = window.location.hash.match(/(token=)([a-z0-9]+)[^&]?/i);
    if (accessToken) {
      appConfig.accessToken = accessToken;
    }
    window.history.replaceState({}, document.title, '/');
  } else {
    startGame = false;
    const twitchAPI = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${twitchClientID}`
      + `&scope=viewing_activity_read&redirect_uri=http://${window.location.host}`;
    window.location.href = `${twitchAPI}`;
  }
}

function newGame() {
  if (game || appConfig.accessToken) return;

  if (twitchClientID && !appConfig.testMode) {
    if (window.location.hostname !== 'id.twitch.tv') {
      getTwitchAccessToken();
    }
  }

  if (startGame) {
    game = new Phaser.Game(phaserConfig);
  }
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
