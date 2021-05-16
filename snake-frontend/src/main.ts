import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import store from './store'

createApp(App)
  .use(store)
  .use(vuetify)
  .mount('#app')
