import Phaser from 'phaser';
import tmi from 'tmi.js';

import globalConfig from './config/globalConfig';
import { keyboardShortcuts, targetShowStatus } from './helpers/constants';
import Drop from './Drop';

export default class {
  constructor(scene) {
    this.scene = scene;

    // Connect to twitch channel
    const client = new tmi.Client({
      options: { debug: true, messagesLogLevel: 'info' },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [globalConfig.channelName],
    });

    client.connect();

    client.on('message', async (channel, tags, message, self) => {
      if (self) return;
      console.log(tags, message, self);
    });
  }
}
