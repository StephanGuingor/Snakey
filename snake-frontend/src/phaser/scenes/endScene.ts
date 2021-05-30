import {Scene} from "phaser";
import store from "@/store/index"

export default class BootScene extends Scene {
    constructor () {
        super({ key: 'EndScene' })
    }

    create (data : number) : void {
        this.cameras.main.setBackgroundColor('#0fffea')
        store.commit('setCurrentScore',data);
        store.commit('setEndScene',true);
    }

    update(time: number, delta: number) : void {
        super.update(time, delta);
        console.log(store.state.endScene);
        if (!store.state.endScene) {

            this.scene.remove();
            this.scene.transition({
                target: 'SnakeGame',
                //moveAbove: true,
                 moveBelow: false,

                duration: 3000,

                 remove: true,
                // sleep: false,
                // allowInput: false,

                // onUpdate: null,
                // onUpdateScope: scene
            })
        }
    }
}
