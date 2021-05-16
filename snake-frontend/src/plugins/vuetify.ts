import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.sass'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'
//import colors from "vuetify/lib/util/colors";



export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})
