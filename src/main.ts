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
import DataTable from "primevue/datatable";
import router from "../src/router/router";
import Column from "primevue/column";
import Toast from "primevue/toast";
import TabMenu from 'primevue/tabmenu';

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.component('TabMenu', TabMenu)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('MegaMenu', MegaMenu)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Toast', Toast)
app.mount('#app')