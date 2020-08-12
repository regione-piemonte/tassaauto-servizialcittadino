import store from '@/store'
import { PRATICA_RESET_STATE } from '@/store/actions.type'

const VERIFICA_PRATICA = {
  path: '/pratica/verifica',
  component: () => import('@/views/pratica/verifica/VerificaPraticaHome'),
  children: [
    {
      name: 'cerca_pratica',
      path: '',
      component: () => import('@/views/pratica/verifica/CercaPratica'),
      beforeEnter (to, from, next) {
        store.dispatch(PRATICA_RESET_STATE)
        next()
      }
    },
    {
      name: 'verifica_osservazione',
      path: 'osservazione',
      component: () => import('@/views/pratica/verifica/PraticaOsservazione'),
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_rateizzazione',
      path: 'rateizzazione',
      component: () => import('@/views/pratica/verifica/PraticaRateizzazione'),
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_accertamento',
      path: 'accertamento',
      component: () => import('@/views/pratica/verifica/PraticaOssAvvAccertamento'),
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_disc_rimb',
      path: 'discarico-rimborso',
      component: () => import('@/views/pratica/verifica/PraticaDomDiscRimb'),
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    }
  ]
}

export default VERIFICA_PRATICA
