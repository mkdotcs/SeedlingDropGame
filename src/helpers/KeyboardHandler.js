import Phaser from 'phaser';
import { targetShowStatus } from './constants';

export default class {
  static handle(currentScene, event) {
    const scene = currentScene;
    switch (event.keyCode) {
      // Show or Hide keyboard shortcuts window
      case Phaser.Input.Keyboard.KeyCodes.K:
        scene.add.tween({
          targets: scene.keyboardContainer,
          alpha: +!scene.keyboardContainer.alpha,
          duration: 300,
        });
        break;

      // Create a new random drop
      case Phaser.Input.Keyboard.KeyCodes.D:
        scene.createRandomDrop();
        if (scene.target.status.showStatus === targetShowStatus.auto
          && scene.target.status.hidden) {
          scene.target.show();
        }
        break;

      // Fire laser
      case Phaser.Input.Keyboard.KeyCodes.L:
        scene.fireLaser();
        break;

      // Remove all scores from leaderboard
      case Phaser.Input.Keyboard.KeyCodes.C:
        scene.leaderBoard.clear();
        break;

      // Remove all seedlings from target
      case Phaser.Input.Keyboard.KeyCodes.R:
        scene.target.clear();
        break;

      // Select drop trails [None, Trail1, Trail2, Trail3, Trail4, Trail5, Trail6]
      case Phaser.Input.Keyboard.KeyCodes.A:
        scene.dropTrail = scene.dropTrail + 1 > 6 ? 0 : scene.dropTrail + 1;
        scene.updateShortcutValue(event.key.toUpperCase(), scene.dropTrail === 0 ? 'None' : `Trail${scene.dropTrail}`);
        break;

      // Select how laser damages the drops [Bounce or Destroy]
      case Phaser.Input.Keyboard.KeyCodes.S:
        scene.laserBounce = !scene.laserBounce;
        scene.updateShortcutValue(event.key.toUpperCase(), scene.laserBounce ? 'Bounce' : 'Destroy');
        break;

      /* Select target's show status
        [Show, Auto (target will only show if there is at least one drop), Hide] */
      case Phaser.Input.Keyboard.KeyCodes.T:
        if (scene.target.status.showStatus === targetShowStatus.hide) {
          scene.updateShortcutValue(event.key.toUpperCase(), 'YES');
          scene.target.status.showStatus = targetShowStatus.show;
          scene.target.show();
        } else if (scene.target.status.showStatus === targetShowStatus.show) {
          scene.updateShortcutValue(event.key.toUpperCase(), 'AUTO');
          scene.target.status.showStatus = targetShowStatus.auto;
          if (scene.dropGroup.countActive() === 0) {
            scene.target.hide();
          }
        } else {
          scene.updateShortcutValue(event.key.toUpperCase(), 'NO');
          scene.target.status.showStatus = targetShowStatus.hide;
          scene.target.hide();
        }
        break;

      // Turn On or Off target movement
      case Phaser.Input.Keyboard.KeyCodes.M:
        scene.target.move(!scene.target.status.currentMoving);
        scene.updateShortcutValue(event.key.toUpperCase(), scene.target.status.currentMoving ? 'YES' : 'NO');
        break;

      // Turn On or Off target floating
      case Phaser.Input.Keyboard.KeyCodes.F:
        scene.target.float(!scene.target.status.currentFloating);
        scene.updateShortcutValue(event.key.toUpperCase(), scene.target.status.currentFloating ? 'YES' : 'NO');
        break;

      // Show or Hide leaderboard
      case Phaser.Input.Keyboard.KeyCodes.B:
        scene.updateShortcutValue(event.key.toUpperCase(), scene.leaderBoard.hidden ? 'YES' : 'NO');
        scene.leaderBoard.showHide();
        break;

      default:
        break;
    }
  }
}
