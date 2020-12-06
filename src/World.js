import Phaser from 'phaser';
import Drop from './Drop';
import Target, { TargetShowStatus } from './Target';
import LeaderBoard from './LeaderBoard';

const keyboardShortcuts = {
  D: { description: 'Random drop' },
  L: { description: 'Fire laser beam' },
  C: { description: 'Clear leaderboard' },
  R: { description: 'Remove all seedlings' },
  A: { description: 'Drop trail', options: ['None', 'Trail1', 'Trail2'], current: 'Trail1' },
  S: { description: 'Laser collision', options: ['Bounce', 'Kill'], current: 'Bounce' },
  T: { description: 'Show Target', options: ['YES', 'NO', 'AUTO'], current: 'YES' },
  M: { description: 'Move target', options: ['YES', 'NO'], current: 'NO' },
  F: { description: 'Float target', options: ['YES', 'NO'], current: 'YES' },
  B: { description: 'Show Leaderboard', options: ['YES', 'NO'], current: 'YES' },
};

export default class World extends Phaser.Scene {
  constructor() {
    super({
      key: 'world',
    });
  }

  create() {
    /* for testing only */
    this.add.image(0, 0, 'bg')
      .setDisplaySize(this.scale.width, this.scale.height)
      .setOrigin(0)
      .setTint(0x444444)
      .setDepth(-3);

    // this.fireLaser();
    /* for testing only */

    this.initKeyboardShortcuts();
    this.leaderBoard = new LeaderBoard(this);
    this.target = new Target(this, 0, 0);
    this.laserBounce = true;
    this.dropTrail = 1;
    /** @type {Phaser.GameObjects.Group} dropGroup */
    this.dropGroup = this.add.group({
      removeCallback: () => {
        if (this.dropGroup.countActive() === 0) {
          this.target.startAutoShowTimer();
        }
      },
    });

    this.physics.add.collider(this.dropGroup);
    this.physics.add.collider(this.target, this.dropGroup, (target, drop) => {
      if (target.body.touching.up) {
        const { left: dropLeft, right: dropRight } = drop.getBounds();
        let dropX = drop.x;

        if (drop.x < target.body.left) {
          dropX = target.body.left + ((dropRight - target.body.left) / 2);
        } else if (drop.x > target.body.right) {
          dropX = target.body.right - ((target.body.right - dropLeft) / 2);
        }
        const seedlingX = dropX - target.x;
        const score = (1 - Math.abs(seedlingX) / (this.target.displayWidth / 2)) * 100;
        const username = this.createRandomUsername();

        drop.landed(true, dropX, () => target.addSeedling(seedlingX, score, username));
        this.leaderBoard.addHighScore({ score, username });
      }
    });

    /* for testing only */
    this.setupControlKeys();
    /* for testing only */
  }

  fireLaser() {
    const laserBeam = this.physics.add.image(this.scale.width, Phaser.Math.Between(20, this.scale.height - 100), 'flares', 'laser');
    laserBeam
      .setAlpha(0)
      .setScale(1, 2)
      .setImmovable(true);
    laserBeam.body.setSize(1, 1);

    const collider = this.laserBounce ?
      this.physics.add.collider(laserBeam, this.dropGroup)
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
            this.cameras.main.shake(200, 0.02);
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
              laserBeam.body.setSize(1,1);
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

  setupControlKeys() {
    this.input.keyboard.on('keyup', (event) => {
      switch (event.keyCode) {
        case Phaser.Input.Keyboard.KeyCodes.K:
          this.add.tween({
            targets: this.keyboardContainer,
            alpha: +!this.keyboardContainer.alpha,
            duration: 300,
          });
          break;
        case Phaser.Input.Keyboard.KeyCodes.D:
          this.createRandomDrop();
          if (this.target.status.showStatus === TargetShowStatus.auto
            && this.target.status.hidden) {
            this.target.show();
          }
          break;
        case Phaser.Input.Keyboard.KeyCodes.L:
          this.fireLaser();
          break;
        case Phaser.Input.Keyboard.KeyCodes.C:
          this.leaderBoard.clear();
          break;
        case Phaser.Input.Keyboard.KeyCodes.R:
          this.target.clear();
          break;
        case Phaser.Input.Keyboard.KeyCodes.A:
          this.dropTrail = this.dropTrail + 1 > 5 ? 1 : this.dropTrail + 1;
          //  this.dropTrail === 'Trail1' ? 'Trail2' : 'Trail1';
          // this.dropTrail = this.dropTrail === 'Trail1' ? 'Trail2' : 'Trail1';
          this.updateShortcutValue(event.key.toUpperCase(), `Trail${this.dropTrail}`);
          break;
        case Phaser.Input.Keyboard.KeyCodes.S:
          this.laserBounce = !this.laserBounce;
          this.updateShortcutValue(event.key.toUpperCase(), this.laserBounce ? 'Bounce' : 'Destroy');
          break;
        case Phaser.Input.Keyboard.KeyCodes.T:
          if (this.target.status.showStatus === TargetShowStatus.hide) {
            this.updateShortcutValue(event.key.toUpperCase(), 'YES');
            this.target.updateShowStatus(TargetShowStatus.show);
          } else if (this.target.status.showStatus === TargetShowStatus.show) {
            this.updateShortcutValue(event.key.toUpperCase(), 'AUTO');
            this.target.updateShowStatus(TargetShowStatus.auto);
          } else {
            this.updateShortcutValue(event.key.toUpperCase(), 'NO');
            this.target.updateShowStatus(TargetShowStatus.hide);
          }
          break;
        case Phaser.Input.Keyboard.KeyCodes.M:
          this.target.move(!this.target.status.currentMoving);
          this.updateShortcutValue(event.key.toUpperCase(), this.target.status.currentMoving ? 'YES' : 'NO');
          break;
        case Phaser.Input.Keyboard.KeyCodes.F:
          this.target.float(!this.target.status.currentFloating);
          this.updateShortcutValue(event.key.toUpperCase(), this.target.status.currentFloating ? 'YES' : 'NO');
          break;
        case Phaser.Input.Keyboard.KeyCodes.B:
          this.updateShortcutValue(event.key.toUpperCase(), this.leaderBoard.hidden ? 'YES' : 'NO');
          this.leaderBoard.showHide();
          break;
        // case Phaser.Input.Keyboard.KeyCodes.A:
        //   this.leaderBoard.addHighScore({
        //     score: Math.floor(Math.random() * (100 - 1 + 1) + 1),
        //     username: this.createRandomUsername(), //'admirable',
        //   });
        //   // this.leaderBoard.addHighScore({
        //   //   score: 100,
        //   //   username: 'a12345678901234567890',
        //   // });
        //   // this.leaderBoard.addHighScore({
        //   //   score: 82.123,
        //   //   username: 'b12345678901234567890',
        //   // });
        //   // this.leaderBoard.addHighScore({
        //   //   score: 60.1,
        //   //   username: 'c12345678901234567890',
        //   // });
        //   // this.leaderBoard.addHighScore({
        //   //   score: 20.85,
        //   //   username: 'd12345678901234567890',
        //   // });
        //   // this.leaderBoard.addHighScore({
        //   //   score: 5.65,
        //   //   username: 'e12345678901234567890',
        //   // });
          // break;
        default:
          break;
      }
    });
  }

  createRandomDrop() {
    const testImages = this.textures.getTextureKeys().filter((name) => name.startsWith('test'));
    const imageName = testImages[Phaser.Math.Between(0, testImages.length - 1)];
    const drop = new Drop(this, Phaser.Math.Between(0, this.scale.width),
      -100, imageName, this.dropTrail);
    this.dropGroup.add(drop);
  }

  // eslint-disable-next-line class-methods-use-this
  createRandomUsername() {
    const name = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable', 'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept', 'admirable', 'admired'];
    return `${name[Phaser.Math.Between(0, name.length - 1)]}`;
  }
  /* ****** for testing only ****** */
}
