import Phaser from 'phaser';
import gameConfig from './gameConfig';
import Drop from './Drop';

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
    this.group;
  }

  create () {
    const { width, height } = this.scale;
    // const width = window.innerWidth; // gameConfig.width;
    // const height = window.innerHeight; // gameConfig.height;
    // this.cameras.resize(width, height);
    this.add.image(0, 0, 'bg')
      .setDisplaySize(width, height)
      .setOrigin(0);

    const targetScaledWidth = width * 0.2;
    const target = this.physics.add.staticImage(width / 2, height, 'grass');
    // target.setSize(targetScaledWidth);

    setTimeout(() => {
      target.setSize(target.width, target.height);
    }, 1000);

    target.displayWidth = targetScaledWidth;
    target.width = targetScaledWidth;
    target.scaleY = target.scaleX;
    // target.y += target.displayHeight * 0.2;
    const targetHitArea = this.physics.add.image(target.x, target.y - 40);
    targetHitArea.setOrigin(0,0);
    targetHitArea.body.setCircle(target.displayWidth);
    targetHitArea.x = target.getTopLeft().x - target.displayWidth * 0.5;
    targetHitArea.y = target.getTopLeft().y + target.displayHeight * 0.05;
    console.log(target.getTopLeft(), targetHitArea.y, height);
    targetHitArea.setDebugBodyColor(0xffff00);
    // const grass = this.matter.add.image(width / 2, height + 15, 'grass');


    // const particles = this.add.particles('red');

    // const drops = [];
    // const trails = [];

    this.group = this.add.group();
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
        this.group.add(drop);
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

    this.physics.add.collider(this.group);
    this.physics.add.overlap(targetHitArea, this.group, (target, drop) => {
      drop.landed(true);
    });
  }

  update () {
    // console.dir(this.group.getChildren().length);
  }
}
