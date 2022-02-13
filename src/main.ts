import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import './assets/global.css'
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import InputText from 'primevue/inputtext';
import MegaMenu from "primevue/megamenu";
import router from "../src/router/router";

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('MegaMenu', MegaMenu)
app.mount('#app')