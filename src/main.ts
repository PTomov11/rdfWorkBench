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
import Dropdown from 'primevue/dropdown';
import ToggleButton from 'primevue/togglebutton';
import ToastService from 'primevue/toastservice';
import Dialog from "primevue/dialog";
import store from '../src/store/store';

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(store)
app.use(ToastService)
app.component('TabMenu', TabMenu)
app.component('Dialog', Dialog)
app.component('ToggleButton', ToggleButton)
app.component('Dropdown', Dropdown)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('MegaMenu', MegaMenu)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Toast', Toast)
app.mount('#app')