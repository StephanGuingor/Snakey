import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('Game');

    }

    init() : void {
        this.cameras.main.setBackgroundColor('#24252A')
        console.log("HELLO")
    }

    preload() : void {
        this.load.image('logo', '../assets/logo.png');
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
            console.log("Hello DOen")
        }
        }
    }
