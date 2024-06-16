import { initializeApp } from 'firebase/app'
import { createPinia } from 'pinia'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import InlineMessage from 'primevue/inlinemessage'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import ProgressSpinner from 'primevue/progressspinner'
import RadioButton from 'primevue/radiobutton'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import './assets/main.css'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyDIUDExg6mzILXGvRUNFe4YiuF60H8uqro',
  authDomain: 'interviews-list.firebaseapp.com',
  projectId: 'interviews-list',
  storageBucket: 'interviews-list.appspot.com',
  messagingSenderId: '1073655382488',
  appId: '1:1073655382488:web:8b613cf36ee9542ada72ad'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(PrimeVue)
app.use(router)
app.directive('tooltip', Tooltip)
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input_text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', InlineMessage)
app.component('app-input-number', InputNumber)
app.component('app-radio-btn', RadioButton)
app.component('app-textarea', Textarea)
app.component('app-calendar', Calendar)
app.component('app-badge', Badge)
app.component('app-chart', Chart)
app.mount('#app')
