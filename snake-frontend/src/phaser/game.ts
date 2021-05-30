import Phaser from 'phaser';

import BootScene from "@/phaser/scenes/bootScene";
import GameScene from "@/phaser/scenes/gameScene";


// Sets Game information.
function launch(containerId : string) : Phaser.Game {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        backgroundColor: "#222",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y:0},
                debug: false
            }
        },
        scene: [ BootScene, GameScene ],

    })
}
export default launch;
export { launch }