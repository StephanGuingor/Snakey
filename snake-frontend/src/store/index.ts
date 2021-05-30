import { createStore } from 'vuex'

export default createStore({
  state: {
    count : 0,
    scores: [0,1,2,3],
    currentScore : 0,
    name: "stephangf",
    endScene: false,
    restart: false
  },
  mutations: {
    increment (state) : void {
      state.count++;
    },
    setName (state, name : string) : void {
      state.name = name;
    },
    setScores (state,data : [integer]) : void {
        state.scores = data;
    },
    setCurrentScore(state,data : number) {
      state.currentScore = data;
    },
    setEndScene(state,data : boolean) {
      state.endScene = data;
    },
    setRestartScene(state,data : boolean) {
      state.restart = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
