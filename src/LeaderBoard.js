import Phaser from 'phaser';

export default class {
  constructor(scene) {
    this.scene = scene;

    /** @type {Phaser.GameObjects.Container} container */
    this.container = scene.add.container(0, 0);
    this.leaderBoard = scene.add.image(0, 0, 'board');

    this.container.add(this.leaderBoard);

    const SCALE_X = 2.6;
    const SCALE_Y = 1.9;
    this.leaderBoard.setScale(SCALE_X, SCALE_Y);
    this.visible = true;

    Object.assign(this, this.container.getBounds());

    const { width, height } = scene.scale;
    this.showPos = {
      x: width - this.width / 2 - 10,
      y: height - this.height / 2 + 50,
    };
    this.hidePosY = height + 30;

    this.title = scene.add.text(-this.width / 2, -this.height / 2 + 10, 'Leaderboard (Top 5)', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fixedWidth: this.width,
      align: 'center',
    })
      .setStroke('#333333', 4);

    this.container.add(this.title);
    this.container.setPosition(this.showPos.x, this.hidePosY)
      .setAlpha(0.7)
      .setScale(0)
      .setDepth(-1);

    // load high scores from local storage
    const highScores = JSON.parse(localStorage.highScores || '[]');
    highScores.forEach((highScore) => {
      this.addHighScore(highScore);
    });
    this.showHide();
  }

  showHide() {
    const y = this.visible ? this.showPos.y : this.hidePosY;
    const scale = this.visible ? 1 : 0;
    this.scene.tweens.add({
      targets: this.container,
      y,
      scale,
      duration: 600,
      ease: Phaser.Math.Easing.Back.Out,
      onComplete: () => { this.visible = !this.visible; },
    });
  }

  addHighScore(highScore) {
    const { score: newScore, username: newUsername } = highScore;
    const formattedScore = (`   ${newScore}`).slice(-6);
    const text = this.scene.add.text(
      -this.width / 2 + 10, this.height,
      `${formattedScore} ${newUsername}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        fixedWidth: this.width - 24,
        stroke: '#333333',
        strokeThickness: 2,
      },
    )
      .setData(highScore);

    this.container.add(text);
    // eslint-disable-next-line no-bitwise
    this.container.sort('score', (a, b) => (a.data && b.data ? a.data.values.score < b.data.values.score | 0 : -1));

    // Filter the list and remove duplicates for the same user
    this.container.list = this.container.list.reduce((unique, current, index) => {
      // eslint-disable-next-line max-len
      const found = unique.findIndex((e) => (e.data ? e.data.values.username === current.data.values.username : false)) > -1;
      if (found) {
        this.moveText(index, 0);
        return unique;
      }
      return [...unique, current];
    }, []);

    /* Limit the list to maximum of 5 highscores, taking in considration that
      the first 2 items need to be skipped (background and title)  */
    if (this.container.list.length === 8) {
      this.container.removeAt(7, true);
    }

    const highScores = [];
    this.container.list.forEach((item, index) => {
      if (item.data) {
        const { data: { values: { score, username } } } = item;
        highScores.push({ score, username });
        const y = (-this.height / 2 + 35) + (index - 2) * 20;
        if (item.y !== y) {
          this.moveText(index, y);
        }
      }
    });

    // Save high scores to local storage
    localStorage.highScores = JSON.stringify(highScores);
  }

  moveText(index, toY) {
    const scoreText = this.container.list[index];

    if (scoreText) {
      if (this.visible) {
        scoreText.y = toY;
        return;
      }

      this.scene.tweens.add({
        targets: scoreText,
        y: toY,
        duration: 1000,
        ease: Phaser.Math.Easing.Back.Out,
        easeParams: [0.8],
      });
    }
  }

  clear() {
    const removed = this.container.list.splice(2, this.container.list.length - 2);
    removed.forEach((child) => child.destroy());
    localStorage.highScores = [];
  }
}
