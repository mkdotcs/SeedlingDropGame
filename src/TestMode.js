/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';

import { keyboardShortcuts, showStatus } from './helpers/constants';
import Drop from './Drop';

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
          shortcut.text = this.scene.add.text(240, (22) + 21 * index, shortcut.current, textStyle)
            .setColor('#ffffff')
            .setBackgroundColor('#424242')
            .setPadding(3)
            .setDepth(-1);
          this.scene.shortcutsContainer.add(shortcut.text);
        }
        keyboardShortcuts[key] = shortcut;
      }
      return `${key}: ${shortcut.description}${shortcut.current ? '.'.repeat(18 - shortcut.description.length) : ''}`;
    });

    if (targetKey) {
      const { text } = keyboardShortcuts[targetKey];
      this.scene.tweens.add({
        targets: text,
        alpha: 0.4,
        duration: 200,
        ease: Phaser.Math.Easing.Expo.Out,
        repeat: 2,
        yoyo: true,
        onComplete: () => text.setBackgroundColor('#424242').setAlpha(1),
      });
    } else {
      this.scene.shortcutsContainer.add(
        this.scene.add.text(10, 30, shortcuts, textStyle),
      );
    }
  }

  createRandomDrop() {
    const testImages = this.scene.textures.getTextureKeys().filter((name) => name.startsWith('test'));
    const imageName = testImages[Phaser.Math.Between(0, testImages.length - 1)];
    const drop = new Drop(this.scene, Phaser.Math.Between(0, this.scene.scale.width),
      -100, imageName, this.scene.dropTrail);
    this.scene.dropGroup.add(drop);
  }

  createRandomUsername() {
    const name = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable',
      'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept',
      'admirable', 'admired'];
    return `${name[Phaser.Math.Between(0, name.length - 1)]}`;
  }

  handleKeyboard(event) {
    let value;
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
        this.createRandomDrop();
        if (this.scene.target.status.showStatus === showStatus.auto
          && this.scene.target.status.hidden) {
          this.scene.target.show();
        }
        break;

      // Fire laser
      case Phaser.Input.Keyboard.KeyCodes.L:
        this.scene.fireLaser();
        break;

      // Remove all scores from leaderboard
      case Phaser.Input.Keyboard.KeyCodes.C:
        this.scene.leaderBoard.clear();
        break;

      // Remove all seedlings from target
      case Phaser.Input.Keyboard.KeyCodes.R:
        this.scene.target.clear();
        break;

      // Select drop trails [None, Trail1, Trail2, Trail3, Trail4, Trail5, Trail6]
      case Phaser.Input.Keyboard.KeyCodes.A:
        this.scene.dropTrail = this.scene.dropTrail + 1 > 6 ? 0 : this.scene.dropTrail + 1;
        this.updateShortcutValue(event.key.toUpperCase(), this.scene.dropTrail === 0 ? 'None' : `Trail${this.scene.dropTrail}`);
        break;

      // Select how laser damages the drops [Bounce or Destroy]
      case Phaser.Input.Keyboard.KeyCodes.S:
        this.scene.laserBounce = !this.scene.laserBounce;
        this.updateShortcutValue(event.key.toUpperCase(), this.scene.laserBounce ? 'Bounce' : 'Destroy');
        break;

      /* Select target's show status
        [Show, Auto Show (target will only show if there is at least one drop), Hide] */
      case Phaser.Input.Keyboard.KeyCodes.T:
        if (this.scene.target.status.showStatus === showStatus.hide) {
          this.updateShortcutValue(event.key.toUpperCase(), 'YES');
          this.scene.target.status.showStatus = showStatus.show;
          this.scene.target.show();
        } else if (this.scene.target.status.showStatus === showStatus.show) {
          this.updateShortcutValue(event.key.toUpperCase(), 'AUTO');
          this.scene.target.status.showStatus = showStatus.auto;
          if (this.scene.dropGroup.countActive() === 0) {
            this.scene.target.hide();
          }
        } else {
          this.updateShortcutValue(event.key.toUpperCase(), 'NO');
          this.scene.target.status.showStatus = showStatus.hide;
          this.scene.target.hide();
        }
        break;

      // Turn On or Off target movement
      case Phaser.Input.Keyboard.KeyCodes.M:
        this.scene.target.move(!this.scene.target.status.currentMoving);
        this.updateShortcutValue(event.key.toUpperCase(), this.scene.target.status.currentMoving ? 'YES' : 'NO');
        break;

      // Turn On or Off target floating
      case Phaser.Input.Keyboard.KeyCodes.F:
        this.scene.target.float(!this.scene.target.status.currentFloating);
        this.updateShortcutValue(event.key.toUpperCase(), this.scene.target.status.currentFloating ? 'YES' : 'NO');
        break;

      // Show, Auto Show, or Hide leaderboard
      case Phaser.Input.Keyboard.KeyCodes.B:
        if (this.scene.leaderBoard.showStatus === showStatus.hide) {
          value = 'SHOW';
          this.scene.leaderBoard.updateShowStatus(showStatus.show);
        } else if (this.scene.leaderBoard.showStatus === showStatus.show) {
          value = 'AUTO';
          this.scene.leaderBoard.updateShowStatus(showStatus.auto);
        } else {
          value = 'HIDE';
          this.scene.leaderBoard.updateShowStatus(showStatus.hide);
        }
        break;

      default:
        break;
    }
    if (value) {
      this.updateShortcutValue(event.key.toUpperCase(), value);
    }
  }
}
