/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';

import { keyboardShortcuts, showStatus } from './common/constants';
import appConfig from './config/appConfig';
import Drop from './drop';

export default class {
  constructor(scene) {
    this.scene = scene;

    const { width: sceneWidth, height: sceneHeight } = scene.scale;

    this.scene.add.image(0, 0, 'bg')
      .setDisplaySize(sceneWidth, sceneHeight)
      .setOrigin(0)
      .setTint(0x555555)
      .setDepth(-3);

    this.scene.input.keyboard.on('keyup', (event) => this.handleKeyboard(event));

    /** @type {Phaser.GameObjects.Graphics} shortcutsContainer */
    const [width, height] = [330, 230];
    const title = this.scene.add.text(10, 10, 'K: Keybaord shortcuts', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
    });

    this.scene.shortcutsContainer = this.scene.add.container(0, sceneHeight - height, title)
      .setSize(width, height)
      .setDepth(-2);
    const shortcutsBackground = this.scene.add.rectangle(0, 0,
      this.scene.shortcutsContainer.width,
      this.scene.shortcutsContainer.height,
      0x000000, 0.6).setOrigin(0);
    this.scene.shortcutsContainer.addAt(shortcutsBackground, 0);

    this.initShortcuts();
  }

  initShortcuts() {
    const textStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      lineSpacing: 8,
      color: '#aaaaaa',
    };

    const shortcuts = Object.entries(keyboardShortcuts).map(([key, value], index) => {
      const settings = value;
      const { current, text, description } = settings;
      if (current) {
        if (!text) {
          settings.text = this.scene.add.text(240, (22) + 21 * index, current, textStyle)
            .setColor('#ffffff')
            .setBackgroundColor('#424242')
            .setPadding(3)
            .setDepth(-1);
          this.scene.shortcutsContainer.add(settings.text);
        }
        keyboardShortcuts[key] = settings;
      }
      return `${key}: ${description}${current ? '.'.repeat(18 - description.length) : ''}`;
    });

    this.scene.shortcutsContainer.add(
      this.scene.add.text(10, 30, shortcuts, textStyle),
    );
  }

  updateShortcut(key, value) {
    const settings = keyboardShortcuts[key];
    if (settings) {
      const { text } = settings;
      settings.current = value;
      text.setText(settings.current)
        .setBackgroundColor('#3e8723');
      this.scene.tweens.add({
        targets: text,
        alpha: 0.4,
        duration: 200,
        ease: Phaser.Math.Easing.Expo.Out,
        repeat: 2,
        yoyo: true,
        onComplete: () => text.setBackgroundColor('#424242').setAlpha(1),
      });
    }
  }

  getRandomDrop() {
    const testImages = this.scene.textures.getTextureKeys().filter((name) => name.startsWith('test'));
    const imageName = testImages[Phaser.Math.Between(0, testImages.length - 1)];
    const drop = new Drop(this.scene, imageName,
      this.getRandomDisplayName(), appConfig.drop.trail);
  }

  getRandomDisplayName() {
    const name = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable',
      'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept',
      'admirable', 'admired'];
    return `${name[Phaser.Math.Between(0, name.length - 1)]}`;
  }

  handleKeyboard(event) {
    const {
      target, target: { config: targetConfig },
      leaderBoard, leaderBoard: { config: leaderBoardConfig },
    } = this.scene;

    switch (event.keyCode) {
      // Show or Hide keyboard shortcuts window
      case Phaser.Input.Keyboard.KeyCodes.K:
        this.scene.add.tween({
          targets: this.scene.shortcutsContainer,
          alpha: +!this.scene.shortcutsContainer.alpha,
          duration: 300,
        });
        break;

      // Create a new random drop
      case Phaser.Input.Keyboard.KeyCodes.D:
        this.getRandomDrop();
        // target.updateStatus(targetConfig.status);
        break;

      // Fire laser
      case Phaser.Input.Keyboard.KeyCodes.L:
        this.scene.fireLaser();
        break;

      // Remove all scores from leaderboard
      case Phaser.Input.Keyboard.KeyCodes.C:
        leaderBoard.clear();
        break;

      // Remove all seedlings from target
      case Phaser.Input.Keyboard.KeyCodes.R:
        target.clear();
        break;

      // Select drop trail
      // [0: none, 1: random, 2: drop image, 3: multi colors, 4: red, 5: blue, 6: green, 7: yellow]
      case Phaser.Input.Keyboard.KeyCodes.A:
        appConfig.drop.trail = appConfig.drop.trail + 1 > 7 ? 0 : appConfig.drop.trail + 1;
        this.updateShortcut(event.key.toUpperCase(), appConfig.drop.trail);
        break;

      // Select how laser damages the drops [0: Bounce, 1: Destroy]
      case Phaser.Input.Keyboard.KeyCodes.S:
        appConfig.laserCollision = 1 - appConfig.laserCollision;
        this.updateShortcut(event.key.toUpperCase(), appConfig.laserCollision);
        break;

      // Select target's show status
      // [Show, Auto (target will only show if there is at least one drop), or Hide]
      case Phaser.Input.Keyboard.KeyCodes.T:
        if (targetConfig.status === showStatus.show) {
          target.updateStatus(showStatus.auto);
        } else if (targetConfig.status === showStatus.auto) {
          target.updateStatus(showStatus.hide);
        } else {
          target.updateStatus(showStatus.show);
        }
        this.updateShortcut(event.key.toUpperCase(), targetConfig.status);
        break;

      // Turn On or Off target movement
      case Phaser.Input.Keyboard.KeyCodes.M:
        target.move(!targetConfig.move);
        this.updateShortcut(event.key.toUpperCase(), +targetConfig.move);
        break;

      // Turn On or Off target floating
      case Phaser.Input.Keyboard.KeyCodes.F:
        target.float(!targetConfig.float);
        this.updateShortcut(event.key.toUpperCase(), +targetConfig.float);
        break;

      // Show, Auto, or Hide leaderboard
      case Phaser.Input.Keyboard.KeyCodes.B:
        if (leaderBoardConfig.status === showStatus.show) {
          leaderBoard.updateStatus(showStatus.auto);
        } else if (leaderBoardConfig.status === showStatus.auto) {
          leaderBoard.updateStatus(showStatus.hide);
        } else {
          leaderBoard.updateStatus(showStatus.show);
        }
        this.updateShortcut(event.key.toUpperCase(), leaderBoardConfig.status);
        break;

      default:
        break;
    }
  }
}
