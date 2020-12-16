/* eslint-disable padded-blocks */
import Phaser from 'phaser';
import twemoji from 'twemoji';
import tmi from 'tmi.js';

import appConfig from './config/appConfig';
import { globalCommands, modCommands } from './common/constants';
import Drop from './drop';

const TWITCH_USER_API = 'https://api.twitch.tv/helix/users?login=';
const TWITCH_EMOTE_URL = 'https://static-cdn.jtvnw.net/emoticons/v1/{id}/2.0';
const BTTV_URL = 'https://cors-anywhere.herokuapp.com/https://cdn.betterttv.net/emote/{id}/2x#emote';

export default class {
  constructor(scene) {
    this.scene = scene;

    // Load channel configuration
    const { channel: channelConfig, drop: { delay: dropDelay } } = appConfig;

    // keep history of drops to control how often user can drop again
    this.dropHistory = {};

    // Load BTTV and FFZ emotes list
    this.bttvEmotes = {};
    this.ffzEmotes = {};
    this.getBttvEmotes();
    this.getFfzEmotes();

    // Connect to twitch channel
    if (channelConfig.name) {
      const twitchClient = new tmi.Client({
        options: { debug: true, messagesLogLevel: 'info' },
        connection: {
          secure: true,
          reconnect: true,
        },
        channels: [channelConfig.name],
      });

      twitchClient.connect();

      twitchClient.on('message', (channel, tags, message, self) => {
        if (self || !message.startsWith(channelConfig.commandPrefix)) return;

        const args = message.toLowerCase().split(' ');
        const command = args[0].substring(1);
        args.shift();

        // Check if command is valid
        if ((!(command in globalCommands) && !modCommands.getOptions(command))
          || (command in modCommands && !channelConfig.mods.includes(tags.username))) return;

        let value = 1;
        const options = modCommands.getOptions(command);

        switch (command) {
          case 'drop': {
            const lastDropTime = this.dropHistory[tags.username];
            if (lastDropTime && Date.now() - lastDropTime < dropDelay) return;

            this.drop(tags, args);
            break;

          }

          case 'tr':
          case 'trail': {
            if (args[0] && options.includes(args[0])) {
              value = +args[0];
            }
            const { drop } = appConfig;
            drop.trail = value;
            break;
          }

          case 'ls':
          case 'laser': {
            if (args) {
              if (Number.isInteger(+args[0])) {
                value = args[0] > 1 && args[0] < 6 ? args[0] : 1;
              } else {
                const index = options.indexOf(args[0]);
                appConfig.laserCollision = index === -1 ? appConfig.laserCollision : index;
              }
            }

            this.scene.time.addEvent({
              delay: 1000,
              repeat: value - 1,
              startAt: 1000,
              callback: () => this.scene.fireLaser(),
            });
            break;
          }

          case 'tg':
          case 'target': {
            const { target: targetConfig } = appConfig;
            const { target } = this.scene;

            if (args) {
              const index = options.indexOf(args[0]);
              if (index > -1) {
                if (args[0] === 'move') {
                  target.move(!targetConfig.move);
                } else if (args[0] === 'float') {
                  target.float(!targetConfig.float);
                } else if (args[0] === 'clear') {
                  target.clear();
                } else {
                  target.updateStatus(index);
                }
              }
            }
            break;
          }

          case 'lb':
          case 'leader-board': {
            const { leaderBoard } = this.scene;

            if (args) {
              const index = options.indexOf(args[0]);
              if (index > -1) {
                if (args[0] === 'clear') {
                  leaderBoard.clear();
                } else {
                  leaderBoard.updateStatus(index);
                }
              }
            }
            break;
          }

          default:
            break;
        }
      });
    }
  }

  async drop(tags, args) {
    const displayName = tags['display-name'] || tags.username;

    // Default drop config in case of invalid args
    let image = {
      id: 'defaultEmote',
      url: 'https://static-cdn.jtvnw.net/emoticons/v1/1713818/3.0',
      source: 'DEFAULT',
    };

    // Check for Twitch emotes
    if (tags.emotes) {
      const emoteIds = Object.keys(tags.emotes);
      const id = emoteIds[0];
      // const id = emoteIds[Math.floor(Math.random() * emoteIds.length)];
      image = {
        id,
        url: TWITCH_EMOTE_URL.replace(/{id}/g, id),
        source: 'twitch',
      };
      // if there is an argument
    } else if (args) {
      if (args[0] === 'me') {
        const { channel: { twitchClientID } } = appConfig;
        if (twitchClientID) {
          const profileImageUrl = await this.getProfileImageUrl(twitchClientID, tags.username);
          if (profileImageUrl) {
            image = {
              id: tags.username,
              url: profileImageUrl,
              source: 'USERPROFILE',
            };
          }
        }
        // Check for BTTV emotes
      } else if (args[0] in this.bttvEmotes) {
        image = {
          id: args[0],
          url: BTTV_URL.replace(/{id}/g, this.bttvEmotes[args[0]]),
          source: 'BTTV',
        };
      // Check for FFZ emotes
      } else if (args[0] in this.ffzEmotes) {
        image = {
          id: args[0],
          url: this.ffzEmotes[args[0]],
          source: 'FFZ',
        };
      // Check for emojis
      } else {
        twemoji.parse(args[0], {
          assetType: 'png',
          callback(icon, options, variant) {
            const { base, size, ext } = options;
            image = {
              id: icon,
              url: `${base}${size}/${icon}${ext}`,
              source: 'EMOJI',
            };
          },
        });
      }
    }

    // Check if drop image already exists, otherwise load it
    const imageId = `${image.source}${image.id}`;
    if (!this.scene.textures.exists(imageId)) {
      await this.loadImage(imageId, image.url);
    }

    this.dropHistory[displayName] = Date.now();

    const drop = new Drop(this.scene, imageId, displayName, appConfig.drop.trail);
  }

  loadImage(id, url) {
    return new Promise((resolve) => {
      this.scene.load.image(id, url);
      this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        resolve('loaded');
      });
      this.scene.load.start();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getProfileImageUrl(twitchClientID, username) {
    const { accessToken } = appConfig;
    if (accessToken) {
      const url = `${TWITCH_USER_API}${username}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'client-id': twitchClientID,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data[0]) {
          const { profile_image_url: profileImageUrl } = json.data[0];
          return profileImageUrl;
        }
      }
    }
    return '';
  }

  async getBttvEmotes() {
    const bttvResponse = await fetch('https://api.betterttv.net/3/cached/emotes/global');
    let emotes = await bttvResponse.json();
    const bttvChannelResponse = await fetch('https://api.betterttv.net/3/cached/users/twitch/413856795');
    const { channelEmotes, sharedEmotes } = await bttvChannelResponse.json();
    emotes = emotes.concat(channelEmotes).concat(sharedEmotes);
    emotes.forEach(({ code, id }) => {
      this.bttvEmotes[code] = id;
    });
  }

  async getFfzEmotes() {
    const ffzResponse = await fetch('https://api.frankerfacez.com/v1/set/global');
    const ffzChannelResponse = await fetch('https://api.frankerfacez.com/v1/room/codinggarden');
    const { sets } = await ffzResponse.json();
    const { sets: channelSets } = await ffzChannelResponse.json();
    const appendEmotes = ({ name, urls }) => {
      this.ffzEmotes[name] = `https:${Object.values(urls).pop()}`;
    };
    sets[3].emoticons.forEach(appendEmotes);
    channelSets[609613].emoticons.forEach(appendEmotes);
  }
}
