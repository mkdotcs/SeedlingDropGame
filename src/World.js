import Phaser from 'phaser';
import gameConfig from './gameConfig';
import Drop from './Drop';
import Target from './Target';

export default class World extends Phaser.Scene {
  constructor () {
    super({
      key: 'world'
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
  }

  create () {
    const { width, height } = this.scale;
    // const width = window.innerWidth; // gameConfig.width;
    // const height = window.innerHeight; // gameConfig.height;
    // this.cameras.resize(width, height);
    this.add.image(0, 0, 'bg')
      .setDisplaySize(width, height)
      .setOrigin(0);

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

    const target = new Target(this, 0, 0, 'target');

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
    window.target = target;
    window.scene = this;

    const dropGroup = this.add.group();
    window.group = this.group;
    // this.group1 = this.add.group();
    const testImages = this.textures.getTextureKeys().filter(name => name.startsWith('test'));
    
    // const test = this.physics.add.image(0, 0, 'logo');
    // test.setPosition(test.width / 2 + Math.floor(Math.random() * Math.floor(width)), -100);

    for (let i = 0; i < 1; i++) {
      testImages.forEach(imageName => {
        const drop = new Drop(this, Phaser.Math.Between(0, width), -100, imageName);
        // drop.body.setSize(10,10);
        // drop.body.setOffset(10,10);
        // setTimeout(() => {
        //   console.log(drop.width, drop.body.width, drop.displayHeight, drop.body.displayHeight);
        // }, 2000);
        dropGroup.add(drop);
        // const abc = this.physics.add.existing(drop1);
        // console.log('abc', abc);
        
        // const drop = this.physics.add.image(Phaser.Math.Between(0, width), -100, drop1.texture)
        //   .setVelocity(Phaser.Math.Between(-100, 150), Phaser.Math.Between(70, 250))
        //   .setBounce(1)
        //   .setCollideWorldBounds(true)
        //   .setDepth(1)
          // // .setDisplaySize(50, 50);
  
        // drops.push(drop);

      //   this.add.particles(imageName, null, {
      //     speed: 50,
      //     // scale: { start: 0.5, end: 0.1 },
      //     alpha: { start: 0.1, end: 0 },
      //     // blendMode: 'ADD',
      //     follow: drop
      // });
  
        // const emitter = particles.createEmitter({
        //   speed: 50,
        //   // lifespan: 1000,
        //   scale: { start: 0.5, end: 0.1 },
        //   alpha: { start: 1, end: 0 },
        //   blendMode: 'ADD',
        //   follow: drop
        // });
  
        // trails.push(emitter);
      });
    }

    this.physics.world.on('worldbounds', (drop, up, down, left, right) => {
      if (down) {
        drop.gameObject.landed(false);
      }
    });

    this.physics.add.collider(dropGroup);
    this.physics.add.collider(target, dropGroup, (target, drop) => {
      if (target.body.touching.up) {
        drop.landed(true);

        const { left: targetLeft, right: targetRight } = target.body.getBounds({});
        const { left: dropLeft, right: dropRight } = drop.getBounds();
        let dropX = drop.x;
        if (drop.x < targetLeft) {
          dropX = targetLeft + ((dropRight - targetLeft) / 2);
        } else if (drop.x > targetRight) {
          dropX = targetRight - ((targetRight - dropLeft) / 2);
        }

        target.addSeedling(dropX);
      }
    // }
    // , (target, drop) => {
    //   console.log(target.getBounds().contains(drop.x, drop.y));
    //   // console.log(target);
    //   // console.log(drop);
    //   // if (target.body.touching.up) {
    //     return target.getBounds().contains(drop.x, drop.y);
    //   // }
    //   // return false;
    });
  }

  update () {
    // console.dir(this.group.getChildren().length);
  }
}
