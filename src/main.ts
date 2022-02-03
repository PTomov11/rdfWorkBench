import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import './assets/global.css'
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import InputText from 'primevue/inputtext';


const app = createApp(App)
app.use(PrimeVue)
app.component('InputText', InputText)
app.component('Button', Button)
app.mount('#app')