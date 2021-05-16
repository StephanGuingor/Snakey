import { Scene } from 'phaser'


import logo from '@/phaser/assets/logo.png'

export default class BootScene extends Scene {
    constructor () {
        super({ key: 'BootScene' })
    }

    preload () : void {
        this.load.image('logo', logo)
        // this.load.image('bomb', bomb)
        // this.load.audio('thud', [thudMp3, thudOgg])
    }

    create () : void {
        this.scene.start('SnakeGame')
    }
}
