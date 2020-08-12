import store from '@/store'
import { PRATICA_RICHIESTA_RESET_STATE } from '@/store/actions.type'

function carrelloRateizzazioneOk () {
  return store.getters.accertamentiRateiz.length > 0
}

const RATEIZZAZIONE = {
  path: '/pratica/inserimento/rateizzazione',
  component: () => import('@/views/pratica/inserimento/rateizzazione/RateizzazioneHome'),
  children: [
    {
      name: 'richiesta_rateizzazione',
      path: '',
      component: () => import('@/views/pratica/inserimento/rateizzazione/RichiestaRateizzazione'),
      beforeEnter (to, from, next) {
        store.dispatch(PRATICA_RICHIESTA_RESET_STATE)
        next()
      }
    },
    {
      name: 'numero_rate',
      path: 'rate',
      component: () => import('@/views/pratica/inserimento/rateizzazione/CreaRateizzazione'),
      beforeEnter (to, from, next) {
        (carrelloRateizzazioneOk()) ? next() : next('/pratica/inserimento/rateizzazione')
      }
    },
    {
      name: 'riepilogo_rateizzazione',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/rateizzazione/RiepilogoRateizzazione'),
      beforeEnter (to, from, next) {
        (carrelloRateizzazioneOk()) ? next() : next('/pratica/inserimento/rateizzazione')
      }
    },
    {
      name: 'esito_rateizzazione',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/rateizzazione/EsitoRateizzazione'),
      props: true
    }
  ]
}

export default RATEIZZAZIONE
