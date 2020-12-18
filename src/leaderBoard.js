import Phaser from 'phaser';
import appConfig from './config/appConfig';
import { showStatus } from './common/constants';

const defaultConfig = {
  status: 0, // 0: show, 1: auto, 2: hide
  autoTimeout: 90000, // milliseconds
};

const SCALE_X = 2.6;
const SCALE_Y = 1.9;

export default class {
  constructor(scene) {
    /** @type {Phaser.Scene} scene */
    this.scene = scene;

    // load leaderboard configuration and set defaults
    this.config = appConfig.leaderBoard;
    this.config.status = this.config.status
      && this.config.status < Object.keys(showStatus).length
      ? this.config.status : defaultConfig.status;
    this.config.autoTimeout = this.config.autoTimeout || defaultConfig.autoTimeout;

    // initialization
    /** @type {Phaser.GameObjects.Container} container */
    this.container = scene.add.container(0, 0);
    this.leaderBoard = scene.add.image(0, 0, 'board');

    this.container.add(this.leaderBoard);

    this.leaderBoard.setScale(SCALE_X, SCALE_Y);

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

    this.updateStatus(this.config.status);
  }

  updateStatus(status) {
    this.removeTimer();

    this.config.status = status;
    if (status === showStatus.show) {
      this.update(this.showPos.y, 1);
    } else if (status === showStatus.hide) {
      this.update(this.hidePosY, 0);
    } else {
      this.startAutoTimer();
    }
  }

  update(y, scale) {
    this.scene.tweens.add({
      targets: this.container,
      y,
      scale,
      duration: 600,
      delay: 300,
      ease: Phaser.Math.Easing.Back.Out,
    });
  }

  addHighScore(highScore) {
    this.removeTimer();
    const { score: newScore, displayName: newDisplayName } = highScore;
    const formattedScore = (`   ${newScore.toFixed(2)}`).slice(-6);
    const text = this.scene.add.text(
      -this.width / 2 + 10, this.height,
      `${formattedScore} ${newDisplayName}`, {
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
      const found = unique.findIndex((e) => (e.data ? e.data.values.displayName === current.data.values.displayName : false)) > -1;
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
        const { data: { values: { score, displayName } } } = item;
        highScores.push({ score, displayName });
        const y = (-this.height / 2 + 35) + (index - 2) * 20;
        if (item.y !== y) {
          this.moveText(index, y);
        }
      }
    });

    if (this.config.status === showStatus.auto) {
      this.update(this.showPos.y, 1);
      this.startAutoTimer();
    }

    // Save high scores to local storage
    localStorage.highScores = JSON.stringify(highScores);
  }

  moveText(index, toY) {
    const scoreText = this.container.list[index];

    if (scoreText) {
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

  startAutoTimer() {
    if (!this.autoTimer) {
      /** @type {Phaser.Time.Clock} autoTimer */
      this.autoTimer = this.scene.time.delayedCall(
        this.config.autoTimeout,
        () => this.update(this.hidePosY, 0),
      );
    }
  }

  removeTimer() {
    if (this.autoTimer) {
      this.autoTimer.remove();
      this.autoTimer = undefined;
    }
  }
}
