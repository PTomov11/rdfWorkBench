import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'                           //icons
import InputText from 'primevue/inputtext';
import MegaMenu from "primevue/megamenu";
import DataTable from "primevue/datatable";
import router from "../src/router/router";
import Column from "primevue/column";
import Toast from "primevue/toast";
import TabMenu from 'primevue/tabmenu';
import Dropdown from 'primevue/dropdown';
import Tooltip from 'primevue/tooltip';
import ToggleButton from 'primevue/togglebutton';
import ToastService from 'primevue/toastservice';
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import FileUpload from 'primevue/fileupload';
import Checkbox from 'primevue/checkbox';
import SelectButton from 'primevue/selectbutton';
import { createPinia } from 'pinia'
import TieredMenu from "primevue/tieredmenu";

const app = createApp(App)
app.use(createPinia())
app.use(PrimeVue)
app.use(router)
app.use(ToastService)
app.directive('tooltip', Tooltip)
app.component('TabMenu', TabMenu)
app.component('TieredMenu', TieredMenu)
app.component('SelectButton', SelectButton)
app.component('Checkbox', Checkbox)
app.component('FileUpload', FileUpload)
app.component('Textarea', Textarea)
app.component('Dialog', Dialog)
app.component('ToggleButton', ToggleButton)
app.component('Dropdown', Dropdown)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('MegaMenu', MegaMenu)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Toast', Toast)
app.directive('tooltip', Tooltip)
app.mount('#app')

require('./assets/global.css');//core css