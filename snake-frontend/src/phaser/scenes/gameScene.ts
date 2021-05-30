import Phaser from 'phaser';

import store from "@/store/index"
import Vector2 = Phaser.Math.Vector2;
import userService from "@/services/UserService"
import Snake from "@/phaser/objects/Snake";

// Main Game Scene | Will handle all the snake game logic
export default class GameScene extends Phaser.Scene {
    // main snake
    snake : Snake

    appleCollider : Phaser.Physics.Arcade.Group | undefined
    points : number
    dPoints : number
    wPoints : number

    // Used for transition
    maskShape : Phaser.Geom.Circle | undefined
    mask : Phaser.GameObjects.Image | undefined
    MASK_MIN_SCALE : number
    MASK_MAX_SCALE : number
    constructor() {
        super({key: 'SnakeGame' })

        this.points = 0;
        this.dPoints = 0;
        this.wPoints = 100;

        this.MASK_MIN_SCALE = 0;
        this.MASK_MAX_SCALE = 2;

        this.snake = new Snake('snake_head','snake_body');


    }

    init() : void {
        userService.getScores();
        store.commit('setCurrentScore',0);

        this.snake = new Snake('snake_head','snake_body');

        this.points = 0;
        this.dPoints = 0;
        this.wPoints = 100;

        this.MASK_MIN_SCALE = 0;
        this.MASK_MAX_SCALE = 2;

        this.cameras.main.setBackgroundColor('#24252A')
    }

    create() : void {
        console.log("RESTART");
        this.maskShape = new Phaser.Geom.Circle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.height / 2
        );

        const maskGfx = this.add.graphics()
            .fillCircleShape(this.maskShape)
            .generateTexture('mask')

        ;
        this.mask = this.add.image(0, 0, 'mask')
            .setPosition(
                this.scale.width / 2,
                this.scale.height / 2,
            )

        ;

        this.cameras.main.setMask(
            new Phaser.Display.Masks.BitmapMask(this, this.mask)
        );

        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: this.MASK_MIN_SCALE,
                start: this.MASK_MIN_SCALE,
                to: this.MASK_MAX_SCALE,
            };

            this.tweens.add({
                delay: 500,
                duration: 1500,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask,
            });
        });
        // Creating groups
        const playerCollider = this.physics.add.group();
        this.appleCollider = this.physics.add.group();
        // Adding physics colliders | with a callback
        this.physics.add.collider(playerCollider,this.appleCollider, (player,apple) => {
            if (apple.data.has("red"))
            {
                if (apple.data.get("red")){
                    this.points += this.dPoints;

                    this.snake.onCollideRed( () => { this.end(); });
                }

                else {
                    this.points += this.wPoints;
                    this.snake.onCollideGreen(this.physics);
                }
                store.commit('setCurrentScore',this.points);
            }
            apple.destroy();

        })

        this.add.image(this.scale.width/2, this.scale.height/2, 'sky');
        this.snake.init(this.physics,this.scale, playerCollider);

        // timed events to spawn apples
        this.time.addEvent({delay:4*1000, callback: () => this.spawnApple(false) , callbackScope: this, loop: true});
        this.time.addEvent({delay:2*1000, callback: () => this.spawnApple(true) , callbackScope: this, loop: true, startAt: 2*1000});


    }

    update(time: number, delta: number) : void {
        super.update(time, delta);
        if (!store.state.endScene && store.state.restart) { store.commit('setRestartScene',false); this.scene.restart(); }
        if (this.snake.player === undefined) { return }

        const mouse : Phaser.Input.Pointer = this.input.mousePointer;

        this.snake.rotateTowards(new Vector2(mouse.x ,mouse.y));

        this.snake.updatePos(this.physics,this.scale);
    }

    spawnApple(red : boolean) : void {
            if (this.snake.player == null) return;
            let x : number = Phaser.Math.Between(0,this.scale.width);
            let y : number = Phaser.Math.Between(0,this.scale.height);

            while (Math.abs(x - this.snake.player.x) <= this.snake.unit && Math.abs(x - this.snake.player.x) <= this.snake.unit) {
                x  = Phaser.Math.Between(0,this.scale.width);
                y  = Phaser.Math.Between(0,this.scale.height);
            }
            const key = red ? "red_apple" : "green_apple";
            const apple = this.physics.add.image(x, y,key);
            apple.setData("red",red);
            this.appleCollider?.add(apple);
        }

        end() : void{
            // Fades out
            store.commit('setCurrentScore',this.points);
            if (this.points > 0){
                userService.addScore(this.points);
                userService.getScores();
            }
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: this.MASK_MAX_SCALE,
                start: this.MASK_MAX_SCALE,
                to: this.MASK_MIN_SCALE,
            };
            this.tweens.add({
                duration: 2500,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask,
                onComplete : () => {
                    store.commit('setEndScene',true);
                }

            });

        }
    }


