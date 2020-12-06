import Phaser from 'phaser';
import { TargetShowStatus } from '../Target';

export default class {
  constructor(scene) {
    this.scene = scene;
  }

  handle(event) {
    switch (event.keyCode) {
      // Show or Hide keyboard shortcuts window
      case Phaser.Input.Keyboard.KeyCodes.K:
        this.scene.add.tween({
          targets: this.scene.keyboardContainer,
          alpha: +!this.scene.keyboardContainer.alpha,
          duration: 300,
        });
        break;

      // Create a new random drop
      case Phaser.Input.Keyboard.KeyCodes.D:
        this.scene.createRandomDrop();
        if (this.scene.target.status.showStatus === TargetShowStatus.auto
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
        this.scene.updateShortcutValue(event.key.toUpperCase(), this.scene.dropTrail === 0 ? 'None' : `Trail${this.scene.dropTrail}`);
        break;

      // Select how laser damages the drops [Bounce or Destroy]
      case Phaser.Input.Keyboard.KeyCodes.S:
        this.scene.laserBounce = !this.scene.laserBounce;
        this.scene.updateShortcutValue(event.key.toUpperCase(), this.scene.laserBounce ? 'Bounce' : 'Destroy');
        break;

      /* Select target's show status
        [Show, Auto (target will only show if there is at least one drop), Hide] */
      case Phaser.Input.Keyboard.KeyCodes.T:
        if (this.scene.target.status.showStatus === TargetShowStatus.hide) {
          this.scene.updateShortcutValue(event.key.toUpperCase(), 'YES');
          this.scene.target.status.showStatus = TargetShowStatus.show;
          this.scene.target.show();
        } else if (this.scene.target.status.showStatus === TargetShowStatus.show) {
          this.scene.updateShortcutValue(event.key.toUpperCase(), 'AUTO');
          this.scene.target.status.showStatus = TargetShowStatus.auto;
          if (this.scene.dropGroup.countActive() === 0) {
            this.scene.target.hide();
          }
        } else {
          this.scene.updateShortcutValue(event.key.toUpperCase(), 'NO');
          this.scene.target.status.showStatus = TargetShowStatus.hide;
          this.scene.target.hide();
        }
        break;

      // Turn On or Off target movement
      case Phaser.Input.Keyboard.KeyCodes.M:
        this.scene.target.move(!this.scene.target.status.currentMoving);
        this.scene.updateShortcutValue(event.key.toUpperCase(), this.scene.target.status.currentMoving ? 'YES' : 'NO');
        break;

      // Turn On or Off target floating
      case Phaser.Input.Keyboard.KeyCodes.F:
        this.scene.target.float(!this.scene.target.status.currentFloating);
        this.scene.updateShortcutValue(event.key.toUpperCase(), this.scene.target.status.currentFloating ? 'YES' : 'NO');
        break;

      // Show or Hide leaderboard
      case Phaser.Input.Keyboard.KeyCodes.B:
        this.scene.updateShortcutValue(event.key.toUpperCase(), this.scene.leaderBoard.hidden ? 'YES' : 'NO');
        this.scene.leaderBoard.showHide();
        break;

      default:
        break;
    }
  }
}
