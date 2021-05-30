<template>
  <div v-if="downloaded" class="d-flex flex-column">

    <div :id="containerId"/>
    <div class="score">
      <h2> SCORE : {{ currentScore }} </h2>
    </div>
    <div class="retry" v-if="endScene">
      <h2 style="color: antiquewhite">Score: {{ currentScore }} </h2>
      <v-btn class="m-auto" @click="startScene"> Play Again </v-btn>
    </div>

      <div>
        <p>Highscores for {{ playerName }}</p>
        <ul class="list">
          <li class="item" v-for="(score,index) in scores " :key="index" ><b>{{ index+1 }}. </b>{{ score }}</li>
        </ul>
      </div>
    </div>
  <div class="placeholder" v-else>
    Loading ...
  </div>

</template>

<script lang="ts">

import { defineComponent,computed } from 'vue';
import { useStore } from "vuex";
import * as phaser from "phaser";
import userService from "@/services/UserService"

class Data {
  downloaded : boolean;
  gameInstance : phaser.Game | null
  containerId: string
  constructor(gI : phaser.Game | null, cI : string) {
      this.gameInstance = gI;
      this.containerId = cI;
      this.downloaded = false;
  }
}

export default defineComponent({
  setup() {
    const store = useStore();
    const count = computed(() => store.state.count);
    const scores = computed(() => store.state.scores);
    const playerName = computed(() => store.state.name);
    const currentScore = computed(() => store.state.currentScore);
    const endScene = computed(() => store.state.endScene);

    function startScene() : void {
      store.commit("setEndScene",false);
      store.commit("setRestartScene",true);
    }

      return { count,startScene, playerName,scores,currentScore,endScene };
  },
  name: 'Game',
  store : undefined,
  methods: {
  },
  data() {
    return new Data(
       null,
       "game-container"
    )
  },
  async mounted() {
    const game = await import(/* webpackChunkName: "game" */ '@/phaser/game')
    this.downloaded = true
    await this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId)
    })
    await userService.getScores();


  },
  unmounted() {
    if (this.gameInstance !== null){
      this.gameInstance.destroy(false);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}

.list{
  display: flex;
  flex-direction: row;
}

.item {
  margin: 2rem;
}

.retry {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>