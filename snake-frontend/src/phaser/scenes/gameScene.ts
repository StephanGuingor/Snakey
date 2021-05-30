import Phaser from 'phaser';

import store from "@/store/index"
import * as phaser from "phaser";
import Vector2 = Phaser.Math.Vector2;
import userService from "@/services/UserService"

// Main Game Scene | Will handle all the snake game logic
export default class GameScene extends Phaser.Scene {
    player : Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
    unit : number
    tailLength: number
    tailNodes: number
    nodes : Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>
    threshAngle : number
    lastDir : Phaser.Math.Vector2
    prevAngle: number
    playerCollider : Phaser.Physics.Arcade.Group | undefined
    appleCollider : Phaser.Physics.Arcade.Group | undefined
    points : number
    dPoints : number
    wPoints : number
    speed : number
    maskShape : Phaser.Geom.Circle | undefined
    mask : Phaser.GameObjects.Image | undefined
    MASK_MIN_SCALE : number
    MASK_MAX_SCALE : number
    constructor() {
        super({key: 'SnakeGame' })
        this.unit = 32;
        this.tailLength = 1;
        this.tailNodes = 20;
        this.nodes = [];
        this.threshAngle = phaser.Math.DegToRad(15);
        this.lastDir = new Phaser.Math.Vector2(-1,0);
        this.prevAngle = 0;
        this.points = 0;
        this.dPoints = 0;
        this.wPoints = 100;
        this.speed = 10;



        this.MASK_MIN_SCALE = 0;
        this.MASK_MAX_SCALE = 2;

    }

    init() : void {
        userService.getScores();
        store.commit('setCurrentScore',0);

        this.unit = 32;
        this.tailLength = 1;
        this.tailNodes = 5;
        this.nodes = [];
        this.threshAngle = phaser.Math.DegToRad(15);
        this.lastDir = new Phaser.Math.Vector2(-1,0);
        this.prevAngle = 0;
        this.points = 0;
        this.dPoints = 0;
        this.wPoints = 100;
        this.speed = 10;



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
        this.playerCollider = this.physics.add.group();
        this.appleCollider = this.physics.add.group();
        // Adding physics colliders | with a callback
        this.physics.add.collider(this.playerCollider,this.appleCollider, (player,apple) => {
            if (apple.data.has("red"))
            {
                if (apple.data.get("red")){
                    this.points += this.dPoints;

                    for (let i = 0 ; i < 10;i++){
                        if (this.nodes.length > 0) {
                            this.nodes.pop()?.destroy();
                            this.tailNodes--;
                            continue;
                        }
                        break;
                    }
                    if (this.tailNodes <= 0)
                    {
                        this.player = undefined;
                        this.death();
                    }

                }

                else {
                    this.points += this.wPoints;
                    const last  = this.nodes.length;
                    this.nodes[last] = this.physics.add.image(this.nodes[last-1].x  + this.unit/2,this.nodes[last-1].y +  this.unit/2,'snake_body');
                    this.nodes[last].setDepth(this.nodes[last-1].depth - 1);
                    this.tailNodes++;
                }
                store.commit('setCurrentScore',this.points);
            }
            apple.destroy();

        })

        this.add.image(this.scale.width/2, this.scale.height/2, 'sky');
        this.player = this.physics.add.image(this.scale.width/2,this.scale.height/2,'snake_head');
        this.playerCollider.add(this.player);
        this.player.setDepth(1000);
        this.nodes[0] = this.player;
        for (let  i=1; i < this.tailNodes; i++) {
            this.nodes[i] = this.physics.add.image(this.player.x - this.unit/2*i,this.player.y,'snake_body');
            this.nodes[i].setDepth(this.nodes[i-1].depth - 1);
        }

        this.time.addEvent({delay:4*1000, callback: () => this.spawnApple(false) , callbackScope: this, loop: true});
        this.time.addEvent({delay:2*1000, callback: () => this.spawnApple(true) , callbackScope: this, loop: true, startAt: 2*1000});


    }



    update(time: number, delta: number) : void {
        super.update(time, delta);
        if (!store.state.endScene && store.state.restart) { store.commit('setRestartScene',false); this.scene.restart(); }
        if (this.player === undefined) { return }

        const mouse : Phaser.Input.Pointer = this.input.mousePointer;

        this.rotateTowards(new Vector2(mouse.x ,mouse.y));

        for(let i=1;i<this.tailNodes;i++){
            const current = this.nodes[i];
            const last = this.nodes[i-1];

            const dirX = (last.x - current.x) ;
            const dirY = last.y - current.y;

            const sqr : number = Math.sqrt(Math.pow(dirX,2) + Math.pow(dirY,2));
            if (Math.abs(dirX) < this.scale.width/2 && Math.abs(dirY) < this.scale.height/2){
                current.setVelocity(this.unit * dirX/sqr  * this.speed, this.unit * dirY/sqr * this.speed);
            }
        }
        this.physics.world.wrapArray(this.nodes,this.unit/2);
    }

        mod(n:number,m:number) : number{
        return ((n % m)+m)%m;
    }

        rotateTowards(point : Phaser.Math.Vector2) : void {
            if (this.player === undefined) { return }
            const targetDir = point.subtract(new Phaser.Math.Vector2(this.player.x + Math.cos(this.player.rotation),this.player.y+  Math.sin(this.player.rotation)));

            let angleToLookAt : number = Math.atan2(targetDir.y,targetDir.x); // relating to vector forward
            let angleDiff = this.mod(angleToLookAt - this.player.rotation,Math.PI*2);

            // Adjust angle difference so its only between 0-180 in respect to the head rotation
            if (angleDiff > Math.PI) {
                angleDiff = Math.PI*2 - angleDiff;
            }

           // store.commit("setName",""+ RadToDeg(angleDiff) + " | " + RadToDeg(this.player.rotation) + " | " + RadToDeg(angleToLookAt) + " | " + this.threshAngle + "| " + (this.mod((this.player.rotation-angleToLookAt+Math.PI*2),Math.PI*2) > Math.PI));

            // Choose Shortest Path
            if (angleDiff > this.threshAngle) {
                const value =( (this.mod((this.player.rotation-angleToLookAt+Math.PI*2),Math.PI*2) > Math.PI)) ? 1 : -1;
                angleToLookAt = this.player.rotation + value*this.threshAngle*0.5;
            }

            this.player.setRotation(angleToLookAt);
            this.player.body.setVelocity(Math.cos(this.player.rotation)*this.unit*this.speed,Math.sin(this.player.rotation)*this.unit*this.speed);

        }

        spawnApple(red : boolean) : void {
            if (this.player == null) return;
            let x : number = Phaser.Math.Between(0,this.scale.width);
            let y : number = Phaser.Math.Between(0,this.scale.height);

            while (Math.abs(x - this.player.x) <= this.unit && Math.abs(x - this.player.x) <= this.unit) {
                x  = Phaser.Math.Between(0,this.scale.width);
                y  = Phaser.Math.Between(0,this.scale.height);
            }
            const key = red ? "red_apple" : "green_apple";
            const apple = this.physics.add.image(x, y,key);
            apple.setData("red",red);
            this.appleCollider?.add(apple);
        }

        death() : void{
            // for (const node of this.nodes) {
            //     node.destroy();
            // }
            // this.tailNodes = 0;
            // this.scene.transition()
            // this.scene.remove('SnakeGame');


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


