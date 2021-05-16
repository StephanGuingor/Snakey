<template>
  <div v-if="downloaded" class="d-flex flex-column">
    <div :id="containerId"/>
    <v-btn @click="increment">{{ playerName }}:{{ count }}</v-btn>
  </div>
  <div class="placeholder" v-else>
    Loading ...
  </div>

</template>

<script lang="ts">

import { defineComponent,computed } from 'vue';
import { useStore } from "vuex";
import * as phaser from "phaser";

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
    const playerName = computed(() => store.state.name);

    function increment() : void {
      store.commit("increment");
    }
      return { count, increment, playerName };
  },
  name: 'Game',
  store : undefined,
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
</style>