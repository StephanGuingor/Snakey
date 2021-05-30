<template>
  <v-app class="application">
    <div>
      <v-container v-if="initializeGame"  class="game-container" fluid>
        <SnakeGame/>
      </v-container>
      <v-container v-else fluid>
          <div class="card-wrapper">
              <div class="form-wrapper d-flex flex-column">
              <div class="form-head">
                <h2>SNAKE</h2>
                <v-divider></v-divider>
              </div>
              <form>
                <div class="name-form">
                  <label for="name">Player Name: </label>
                  <input type="text" name="name" id="name" v-model="player" required>
                  <v-divider inset></v-divider>
                </div>
                <div class="d-flex align-content-space-around">
                  <v-btn type="submit" class="mr-2" color="primary" @click="startGame"> Start Solo</v-btn>
                  <v-btn type="submit" class="ml-2" color="primary" @click="startGame"> Start Multiplayer</v-btn>
                </div>

              </form>
            </div>
          </div>
      </v-container>

    </div>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SnakeGame from "@/components/SnakeGame.vue";
import {useStore} from "vuex";

// Entry Point, where user will choose their username and link with database.
export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return ({
          initializeGame: false,
          player : ''
        })
  },
  watch: {
    player(name : string) {
      this.store.commit("setName",name);
    }
  },
  methods : {
    startGame(event : Event) : void {
      event.preventDefault();
      this.initializeGame = true;


    }
  },
  components: {
    SnakeGame
  },


  mounted() {
    this.player = "Player" + Math.round(Math.random() * 1000 + 1000);
  }

});
</script>

<style>

.game-container{
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

}

h2 {
  font-size: 3rem;
}
.card-wrapper{
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  display: flex;
}
.form-wrapper {
  background:white;
  border-radius: 20px;
  color: #000000;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1), 0  20px 20px rgba(0, 0, 0, 0.1);

}

.form-head{
  text-align: center;
  padding: 4rem;
}

.name-form {
  text-align: center;
  padding: 3rem;
}

.form-wrapper label {
  margin: 0 3rem;
  font-size: 2rem;
}

.form-wrapper button {
  width: 100%;
  padding: 2rem;
  margin-top: 8rem;
}

.form-wrapper input {
  padding: 1rem 3rem;
  background-color: white;
  border: solid 1px black;
  font-size: 2rem;
}

.application{
  background: antiquewhite !important;
  font-family: "Courier New", Courier, monospace;
}

body {
  align-items: center;
  justify-content: center;
}
</style>