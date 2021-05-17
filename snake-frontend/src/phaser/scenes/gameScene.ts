import Phaser from 'phaser';

import store from "@/store/index"
import * as phaser from "phaser";
import Vector2 = Phaser.Math.Vector2;

export default class GameScene extends Phaser.Scene {
    player : Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
    unit : number
    tailLength: number
    tailNodes: number
    nodes : Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>
    threshAngle : number
    lastDir : Phaser.Math.Vector2
    prevAngle: number
    constructor() {
        super({key: 'SnakeGame' })
        this.unit = 32;
        this.tailLength = 1;
        this.tailNodes = 20;
        this.nodes = [];
        this.threshAngle = phaser.Math.DegToRad(15);
        this.lastDir = new Phaser.Math.Vector2(-1,0);
        this.prevAngle = 0;

    }

    init() : void {
        this.cameras.main.setBackgroundColor('#24252A')
        console.log("HELLO")
    }

    create() : void {
        this.add.image(this.scale.width/2, this.scale.height/2, 'sky');
        this.player = this.physics.add.image(this.scale.width/2,this.scale.height/2,'snake_head');
        this.player.setDepth(1000);
        this.nodes[0] = this.player;
        for (let  i=1; i < this.tailNodes; i++) {
            this.nodes[i] = this.physics.add.image(this.player.x - this.unit/2*i,this.player.y,'snake_body');
            this.nodes[i].setDepth(this.nodes[i-1].depth - 1);
        }


    }

    update(time: number, delta: number) : void {
        super.update(time, delta);
        if (this.player === undefined) { return }

        const mouse : Phaser.Input.Pointer = this.input.activePointer;
        this.rotateTowards(new Vector2(mouse.x ,mouse.y));

        for(let i=1;i<this.tailNodes;i++){
            const current = this.nodes[i];
            const last = this.nodes[i-1];

            const dirX = (last.x - current.x) ;
            const dirY = last.y - current.y;
         
            if (this.mod(dirX,this.scale.width) < dirX) {

                store.commit("setName","X : "+ dirX  + "Y: " + dirY);
            }
            const sqr : number = Math.sqrt(Math.pow(dirX,2) + Math.pow(dirY,2));
            if (Math.abs(dirX) < this.scale.width/2 && Math.abs(dirY) < this.scale.height/2){
                current.setVelocity(this.unit * dirX/sqr  * 5, this.unit * dirY/sqr * 5);
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
            this.player.body.setVelocity(Math.cos(this.player.rotation)*this.unit*5,Math.sin(this.player.rotation)*this.unit*5);

        }

    }
