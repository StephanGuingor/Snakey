import Phaser from "phaser";
import phaser from "phaser";

interface Callback { (): void; }

export default class Snake {
    player : Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
    unit : number
    tailLength: number
    tailNodes: number
    nodes : Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>

    threshAngle : number
    lastDir : Phaser.Math.Vector2
    speed : number
    snake_head : string
    snake_body : string

    playerCollider : Phaser.Physics.Arcade.Group | undefined

    constructor(shead : string, sBody : string) {


        this.unit = 32;
        this.tailLength = 1;
        this.tailNodes = 20;
        this.nodes = [];
        this.threshAngle = phaser.Math.DegToRad(15);
        this.lastDir = new Phaser.Math.Vector2(-1,0);
        this.speed = 10;
        this.snake_head = shead;
        this.snake_body = sBody;
    }

    init(physics : phaser.Physics.Arcade.ArcadePhysics, scale : phaser.Scale.ScaleManager, playerCollider : Phaser.Physics.Arcade.Group) : void {
        this.player = physics.add.image(scale.width/2,scale.height/2,'snake_head');
        this.playerCollider = playerCollider;
        this.playerCollider.add(this.player);
        this.player.setDepth(1000);
        this.nodes[0] = this.player;
        for (let  i=1; i < this.tailNodes; i++) {
            this.nodes[i] = physics.add.image(this.player.x - this.unit/2*i,this.player.y,'snake_body');
            this.nodes[i].setDepth(this.nodes[i-1].depth - 1);
        }
    }

    onCollideRed(callback : Callback) : void {
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
            callback();
        }
    }

    onCollideGreen(physics : phaser.Physics.Arcade.ArcadePhysics) : void {
        const last  = this.nodes.length;
        this.nodes[last] = physics.add.image(this.nodes[last-1].x  + this.unit/2,this.nodes[last-1].y +  this.unit/2,'snake_body');
        this.nodes[last].setDepth(this.nodes[last-1].depth - 1);
        this.tailNodes++;
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

    updatePos(physics : phaser.Physics.Arcade.ArcadePhysics,scale : phaser.Scale.ScaleManager) : void {
        for(let i=1;i<this.tailNodes;i++){
            const current = this.nodes[i];
            const last = this.nodes[i-1];

            const dirX = (last.x - current.x) ;
            const dirY = last.y - current.y;

            const sqr : number = Math.sqrt(Math.pow(dirX,2) + Math.pow(dirY,2));
            if (Math.abs(dirX) < scale.width/2 && Math.abs(dirY) < scale.height/2){
                current.setVelocity(this.unit * dirX/sqr  * this.speed, this.unit * dirY/sqr * this.speed);
            }
        }
        physics.world.wrapArray(this.nodes,this.unit/2);
    }
    mod(n:number,m:number) : number{
        return ((n % m)+m)%m;
    }



}