import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

createApp(App)
  .use(store)
  .use(vuetify)
  .use(VueAxios,axios)
  .mount('#app')
