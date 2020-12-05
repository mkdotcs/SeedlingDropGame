import Phaser from 'phaser';
import Drop from './Drop';
import Target, { TargetShowStatus } from './Target';
import LeaderBoard from './LeaderBoard';

const keyboardShortcuts = {
  D: { description: 'Random drop' },
  L: { description: 'Fire laser beam' },
  C: { description: 'Clear leaderboard' },
  R: { description: 'Remove all seedlings' },
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
      // physics: {
      //   arcade: {
      //     debug: true,
      //     checkCollision: {
      //       up: false,
      //       down: false
      //     }
      //     // gravity: {}
      //   },
      //   matter: {
      //     debug: true,
      //     gravity: false
      //   }
      // }
    });

    // this.dropGroup;
    // this.target;
  }

  create() {
    // this.sceneWidth = this.scale.width;
    // , height } = this.scale;
    // const width = window.innerWidth; // gameConfig.width;
    // const height = window.innerHeight; // gameConfig.height;
    // this.cameras.resize(width, height);

    /* for testing only */

        this.add.image(0, 0, 'bg')
      .setDisplaySize(this.scale.width, this.scale.height)
      .setOrigin(0)
      .setDepth(-3);

      // this.fireLaser();
    /* for testing only */

    // const targetScaledWidth = width * 0.2;
    // const zone = this.add.zone(width / 2, height / 2, width, height);
    // const targetMiddle = this.physics.add.image(0, 0, 'target-middle');
    // targetMiddle.setSize(targetMiddle.displayWidth, targetMiddle.displayHeight);
    // Phaser.Display.Align.In.BottomCenter(targetMiddle, zone);
    // targetMiddle.setScale(0.5)
    //   // .setOrigin(0)
    // targetMiddle.setOrigin(0)
    //   .setScale(0.5)
    //   .setImmovable(true);

    // const targetLeft = this.physics.add.image(0, 0, 'target-left');
    // Phaser.Display.Align.To.LeftCenter(targetLeft, targetMiddle);
    // targetLeft.setScale(0.5)
    //   // .setOrigin(0)
    //   .setPosition(targetMiddle.getBounds().left - targetLeft.displayWidth / 2, targetMiddle.y)

    // targetLeft.setOrigin(0)
    //   .setScale(0.5)
    //   .setImmovable(true);

    // const targetRight = this.physics.add.image(0, 0, 'target-right');
    // targetRight.setScale(0.5)
    //   // .setOrigin(0)
    //   .setPosition(targetMiddle.getBounds().right + targetMiddle.displayWidth / 2, targetMiddle.y)
    // targetRight.setOrigin(0)
    //   .setScale(0.5)
    //   .setImmovable(true);

    // // Phaser.Display.Align.To.RightCenter(targetRight, targetMiddle);

    // this.add.image(0, 0, 'board')
    //   .setDisplaySize(200, 150)
    //   .setPosition(width - 120, height - 50);

    this.leaderBoard = new LeaderBoard(this);

    this.target = new Target(this, 0, 0);

    this.initKeyboardShortcuts();
    this.laserBounce = true;

    // this.add.image(800, target.y, 'leaf')
    //   .setScale(0.3)
    //   .setOrigin(1);
  
    // const targetGroup = this.add.group([targetLeft, targetMiddle, targetRight]);
    // targetGroup.children.iterate(child => {
    //   child.setOrigin(0)
    //     .setScale(0.5)
    //     .setImmovable(true);
    // });
    
    // Phaser.Actions.GridAlign(targetGroup.getChildren(), {
    //   width: 3,
    //   height: 0,
    //   cellWidth: targetMiddle.displayWidth,
    //   cellHeight: targetMiddle.displayHeight,
    //   x: width / 2 - targetMiddle.displayWidth,
    //   y: height - targetMiddle.displayHeight / 2
    // });

    // targetGroup.config.setScale(1, 2);

    // target.y = height - 50;
    // target.setSize(targetScaledWidth);

    // setTimeout(() => {
    //   target.setSize(target.width, target.height);
    // }, 1000);

    // target.displayWidth = targetScaledWidth;
    // target.width = targetScaledWidth;
    // target.scaleY = target.scaleX;
    // target.y += target.displayHeight * 0.2;
    // const targetHitArea = this.physics.add.image(target.x, target.y - 40);
    // targetHitArea.setOrigin(0,0);
    // targetHitArea.body.setCircle(target.displayWidth);
    // targetHitArea.x = target.getTopLeft().x - target.displayWidth * 0.5;
    // targetHitArea.y = target.getTopLeft().y + target.displayHeight * 0.05;
    // console.log(target.getTopLeft(), targetHitArea.y, height);
    // targetHitArea.setDebugBodyColor(0xffff00);
    // const grass = this.matter.add.image(width / 2, height + 15, 'grass');

    // const particles = this.add.particles('red');

    // const drops = [];
    // const trails = [];

    this.dropGroup = this.add.group();
    window.group = this.group;
    // this.group1 = this.add.group();
    // const testImages = this.textures.getTextureKeys().filter(name => name.startsWith('test'));
    
    // const test = this.physics.add.image(0, 0, 'logo');
    // test.setPosition(test.width / 2 + Math.floor(Math.random() * Math.floor(width)), -100);

    // for (let i = 0; i < 1; i++) {
    //   testImages.forEach(imageName => {
    //     const drop = new Drop(this, Phaser.Math.Between(0, width), -100, imageName);
    //     // drop.body.setSize(10,10);
    //     // drop.body.setOffset(10,10);
    //     // setTimeout(() => {
    //     //   console.log(drop.width, drop.body.width, drop.displayHeight, drop.body.displayHeight);
    //     // }, 2000);
    //     dropGroup.add(drop);
    //     // const abc = this.physics.add.existing(drop1);
    //     // console.log('abc', abc);
        
    //     // const drop = this.physics.add.image(Phaser.Math.Between(0, width), -100, drop1.texture)
    //     //   .setVelocity(Phaser.Math.Between(-100, 150), Phaser.Math.Between(70, 250))
    //     //   .setBounce(1)
    //     //   .setCollideWorldBounds(true)
    //     //   .setDepth(1)
    //       // // .setDisplaySize(50, 50);
  
    //     // drops.push(drop);

    //   //   this.add.particles(imageName, null, {
    //   //     speed: 50,
    //   //     // scale: { start: 0.5, end: 0.1 },
    //   //     alpha: { start: 0.1, end: 0 },
    //   //     // blendMode: 'ADD',
    //   //     follow: drop
    //   // });
  
    //     // const emitter = particles.createEmitter({
    //     //   speed: 50,
    //     //   // lifespan: 1000,
    //     //   scale: { start: 0.5, end: 0.1 },
    //     //   alpha: { start: 1, end: 0 },
    //     //   blendMode: 'ADD',
    //     //   follow: drop
    //     // });
  
    //     // trails.push(emitter);
    //   });
    // }

    // this.physics.world.on('worldbounds', (drop, up, down, left, right) => {
    //   if (down) {
    //     drop.gameObject.landed(false);
    //   }
    // });

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
    const [width, height] = [330, 210];
    const title = this.add.text(10, 10, 'K: Keybaord shortcuts', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      // fixedWidth: width,
      // align: 'center',
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
        case Phaser.Input.Keyboard.KeyCodes.S:
          this.updateShortcutValue(event.key.toUpperCase(), this.laserBounce ? 'Destroy' : 'Bounce');
          this.laserBounce = !this.laserBounce;
          break;
        case Phaser.Input.Keyboard.KeyCodes.T:
          if (this.target.status.showStatus === TargetShowStatus.hide) {
            this.updateShortcutValue('T', 'YES');
            this.target.updateShowStatus(TargetShowStatus.show);
          } else if (this.target.status.showStatus === TargetShowStatus.show) {
            this.updateShortcutValue('T', 'AUTO');
            this.target.updateShowStatus(TargetShowStatus.auto);
          } else {
            this.updateShortcutValue('T', 'NO');
            this.target.updateShowStatus(TargetShowStatus.hide);
          }
          break;
        case Phaser.Input.Keyboard.KeyCodes.M:
          this.updateShortcutValue('M', this.target.status.currentMoving ? 'NO' : 'YES');
          this.target.move(!this.target.status.currentMoving);
          break;
        case Phaser.Input.Keyboard.KeyCodes.F:
          this.updateShortcutValue('F', this.target.status.currentFloating ? 'NO' : 'YES');
          this.target.float(!this.target.status.currentFloating);
          break;
        case Phaser.Input.Keyboard.KeyCodes.B:
          this.updateShortcutValue('B', this.leaderBoard.hidden ? 'YES' : 'NO');
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
    const drop = new Drop(this, Phaser.Math.Between(0, this.scale.width), -100, imageName);
    this.dropGroup.add(drop);
  }

  // eslint-disable-next-line class-methods-use-this
  createRandomUsername() {
    const name = ['abandoned', 'able', 'absolute', 'adorable', 'adventurous', 'academic', 'acceptable', 'acclaimed', 'accomplished', 'accurate', 'aching', 'acidic', 'acrobatic', 'active', 'actual', 'adept', 'admirable', 'admired'];
    return `${name[Phaser.Math.Between(0, name.length - 1)]}`;
  }
  /* ****** for testing only ****** */
}
