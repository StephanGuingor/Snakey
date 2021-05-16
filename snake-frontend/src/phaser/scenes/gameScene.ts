import Phaser from 'phaser';

import store from "@/store/index"

export default class GameScene extends Phaser.Scene {

    constructor() {
        super({key: 'SnakeGame' })
    }

    init() : void {
        this.cameras.main.setBackgroundColor('#24252A')
        console.log("HELLO")
    }

    create() : void {
        const logo = this.add.image(400, 80, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    update(time: number, delta: number) : void {
        super.update(time, delta);

        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.down.isDown) {
            console.log(store.commit("increment"));

        }
        }
    }
