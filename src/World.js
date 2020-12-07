import Phaser from 'phaser';
import tmi from 'tmi.js';

import Drop from './Drop';
import Target from './Target';
import LeaderBoard from './LeaderBoard';
import keyboardHandler from './helpers/keyboardHandler';
import {
  keyboardShortcuts, globalCommands, modCommands, targetShowStatus,
} from './helpers/constants';
import globalConfig from './config/globalConfig';

export default class World extends Phaser.Scene {
  constructor() {
    super({
      key: 'world',
    });
  }

  create() {
    /* (test: true) in config */
    if (globalConfig.test) {
      this.add.image(0, 0, 'bg')
        .setDisplaySize(this.scale.width, this.scale.height)
        .setOrigin(0)
        .setTint(0x555555)
        .setDepth(-3);

      this.initKeyboardShortcuts();
      this.input.keyboard.on('keyup', (event) => keyboardHandler.handle(this, event));
    }

    this.leaderBoard = new LeaderBoard(this);
    this.target = new Target(this, 0, 0);
    this.laserBounce = true;
    this.dropTrail = 0;

    /** @type {Phaser.GameObjects.Group} dropGroup */
    this.dropGroup = this.add.group({
      removeCallback: () => {
        if (this.dropGroup.countActive() === 0
          && this.target.status.showStatus === targetShowStatus.auto) {
          this.target.startAutoShowTimer();
        }
      },
    });

    this.physics.add.collider(this.dropGroup);
    this.physics.add.collider(this.target, this.dropGroup, (target, drop) => {
      if (target.body.touching.up) {
        const {
          left: dropLeft,
          right: dropRight,
        } = drop.getBounds();
        let dropX = drop.x;

        if (drop.x < target.body.left) {
          dropX = target.body.left + ((dropRight - target.body.left) / 2);
        } else if (drop.x > target.body.right) {
          dropX = target.body.right - ((target.body.right - dropLeft) / 2);
        }
        const seedlingX = dropX - target.x;
        const score = ((1 - Math.abs(seedlingX) / (this.target.displayWidth / 2)) * 100).toFixed(2);
        const username = World.createRandomUsername();

        drop.landed(true, dropX, () => target.addSeedling(seedlingX, score, username));
        this.leaderBoard.addHighScore({
          score,
          username,
        });
      }
    });

    if (!globalConfig.test) {
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

  fireLaser() {
    const laserBeam = this.physics.add.image(this.scale.width, Phaser.Math.Between(20, this.scale.height - 100), 'flares', 'laser');
    laserBeam
      .setAlpha(0)
      .setScale(1, 2)
      .setImmovable(true);
    laserBeam.body.setSize(1, 1);

    const collider = this.laserBounce
      ? this.physics.add.collider(laserBeam, this.dropGroup)
      : this.physics.add.overlap(laserBeam, this.dropGroup, (laser, drop) => {
        drop.explode();
      });

    this.tweens.timeline({
      targets: laserBeam,
      ease: Phaser.Math.Easing.Linear.In,
      tweens: [
        {
          alpha: 1,
          scaleY: 10,
          duration: 1000,
          onComplete: () => {
            this.cameras.main.shake(800, 0.01);
            laserBeam.setScale(150, 2);
            laserBeam.body.setSize(laserBeam.width, 5);
          },
        },
        {
          x: this.scale.width * -2,
          alpha: 0,
          duration: 1000,
          onUpdate: () => {
            if (laserBeam.alpha < 0.8) {
              laserBeam.body.setSize(1, 1);
            }
          },
          onComplete: () => {
            this.physics.world.removeCollider(collider);
            laserBeam.destroy();
          },
        },
      ],
    });
  }

  /* ****** for testing only ****** */
  initKeyboardShortcuts() {
    /** @type {Phaser.GameObjects.Graphics} keyboardContainer */
    const [width, height] = [330, 230];
    const title = this.add.text(10, 10, 'K: Keybaord shortcuts', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
    });

    this.keyboardContainer = this.add.container(0, this.scale.height - height, title)
      .setSize(width, height)
      .setDepth(-2);
    const bg = this.add.rectangle(0, 0,
      this.keyboardContainer.width, this.keyboardContainer.height, 0x000000, 0.6).setOrigin(0);
    this.keyboardContainer.addAt(bg, 0);

    this.updateShortcutValue();
  }

  updateShortcutValue(targetKey, newValue) {
    const textStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      lineSpacing: 8,
      color: '#aaaaaa',
    };

    const shortcuts = Object.entries(keyboardShortcuts).map(([key, value], index) => {
      const shortcut = value;
      if (shortcut.current) {
        if (key === targetKey) {
          shortcut.current = newValue;
          shortcut.text
            .setText(newValue)
            .setBackgroundColor('#3e8723');
        }
        if (!shortcut.text) {
          shortcut.text = this.add.text(240, (22) + 21 * index, shortcut.current, textStyle)
            .setColor('#ffffff')
            .setBackgroundColor('#424242')
            .setPadding(3)
            .setDepth(-1);
          this.keyboardContainer.add(shortcut.text);
        }
        keyboardShortcuts[key] = shortcut;
      }
      return `${key}: ${shortcut.description}${shortcut.current ? '.'.repeat(18 - shortcut.description.length) : ''}`;
    });

    if (targetKey) {
      const { text } = keyboardShortcuts[targetKey];
      this.tweens.add({
        targets: text,
        alpha: 0.4,
        duration: 200,
        ease: Phaser.Math.Easing.Expo.Out,
        repeat: 2,
        yoyo: true,
        onComplete: () => text.setBackgroundColor('#424242').setAlpha(1),
      });
    } else {
      this.keyboardContainer.add(
        this.add.text(10, 30, shortcuts, textStyle),
      );
    }
  }

  createRandomDrop() {
    const testImages = this.textures.getTextureKeys().filter((name) => name.startsWith('test'));
    const imageName = testImages[Phaser.Math.Between(0, testImages.length - 1)];
    const drop = new Drop(this, Phaser.Math.Between(0, this.scale.width),
      -100, imageName, this.dropTrail);
    this.dropGroup.add(drop);
  }

  static createRandomUsername() {
    const name = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable', 'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept', 'admirable', 'admired'];
    return `${name[Phaser.Math.Between(0, name.length - 1)]}`;
  }
  /* ****** for testing only ****** */
}
