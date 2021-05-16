import { createStore } from 'vuex'

export default createStore({
  state: {
    count : 0,
    name: "NoName"
  },
  mutations: {
    increment (state) : void {
      state.count++;
    },
    setName (state, name : string) : void {
      state.name = name;
    }
  },
  actions: {
  },
  modules: {
  }
})
