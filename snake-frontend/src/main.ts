import {Component, createApp} from 'vue'
import { defineCustomElements as defineIonPhaser } from '@ion-phaser/core/loader'
import App from './App.vue'
import store from './store'

// Bind the IonPhaser custom element to the window object
defineIonPhaser(window).catch((e) => console.log(e))
const app : Component = createApp(App)
app.use(store).mount('#app');