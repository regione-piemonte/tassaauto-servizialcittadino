import Vue from 'vue'
import VueFilterDateFormat from 'vue-filter-date-format'
import VueI18n from 'vue-i18n'

import App from './App'
import messages from './i18n'
import filters from './plugins/filters'
import Vuetify from 'vuetify'
import router from './router'
import store from './store'
import './registerServiceWorker'

import './assets/stylesheets/application.scss'

Vue.config.productionTip = false
Vue.use(VueFilterDateFormat)
Vue.use(VueI18n)
Vue.use(filters)
Vue.use(Vuetify)

const vuetifyOptions = {}

const i18n = new VueI18n({
  locale: 'it-IT',
  fallbackLocale: 'it-IT',
  messages
})

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify: new Vuetify(vuetifyOptions),
  i18n
}).$mount('#app')
