import Vue from 'vue'
import VueFilterDateFormat from 'vue-filter-date-format'
import VueI18n from 'vue-i18n'

import App from './App'
import messages from './i18n'
import filters from './plugins/filters'
import Vuetify from 'vuetify'
import router from './router'
import store from './store'
// import VueGtag from 'vue-gtag'
import './registerServiceWorker'

import './assets/stylesheets/application.scss'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(filters)
Vue.use(Vuetify)

Vue.use(VueFilterDateFormat, {
  dayOfWeekNames: [
    'Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovadì', 'Venerdì',
    'Sabato'
  ],
  dayOfWeekNamesShort: [
    'Do', 'Lu', 'Ma', 'Me', 'Gio', 'Ve', 'Sa'
  ],
  monthNames: [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembere', 'Dicembre'
  ],
  monthNamesShort: [
    'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
    'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
  ]
})

/*
Vue.use(VueGtag, {
  config: {
    id: process.env.GOOGLE_ANALYTICS_ID_MISURAZIONE,
    anonymize_ip: true
  },
  enabled: (process.env.GOOGLE_ANALYTICS_ID_MISURAZIONE != null && process.env.GOOGLE_ANALYTICS_ID_MISURAZIONE !== '')
}, router)
*/

const vuetifyOptions = {
  breakpoint: {
    thresholds: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1440
    },
    scrollbarWidth: 10
  }
}

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
