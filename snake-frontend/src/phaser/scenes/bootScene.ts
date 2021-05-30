import { Scene } from 'phaser'


import logo from '@/phaser/assets/logo.png'
import sky from '@/phaser/assets/sky.png'
import snakeHead from '@/phaser/assets/snake_head.png'
import snakeBody from '@/phaser/assets/snake_body.png'
import redApple from '@/phaser/assets/red_apple.png'
import greenApple from '@/phaser/assets/green_apple.png'

export default class BootScene extends Scene {
    constructor () {
        super({ key: 'BootScene' })
    }

    preload () : void {
        this.load.image('logo', logo)
        this.load.image('sky', sky)
        this.load.image('snake_head', snakeHead)
        this.load.image('snake_body', snakeBody)
        this.load.image('red_apple', redApple)
        this.load.image('green_apple', greenApple)
        // this.load.image('bomb', bomb)
        // this.load.audio('thud', [thudMp3, thudOgg])
    }

    create () : void {
        this.scene.start('SnakeGame')
    }
}
