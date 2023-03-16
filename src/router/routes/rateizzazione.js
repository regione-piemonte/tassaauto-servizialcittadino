import store from '@/store'
import { PRATICA_RICHIESTA_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function carrelloRateizzazioneOk () {
  return store.getters.accertamentiRateiz.length > 0
}

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const RATEIZZAZIONE = {
  path: '/pratica/inserimento/rateizzazione',
  component: () => import('@/views/pratica/inserimento/rateizzazione/RateizzazioneHome'),
  meta: { isPublic: cardAutenticata('rateizzazione') },
  children: [
    {
      name: 'richiesta_rateizzazione',
      path: '',
      component: () => import('@/views/pratica/inserimento/rateizzazione/RichiestaRateizzazione'),
      meta: { isPublic: cardAutenticata('rateizzazione') },
      beforeEnter (to, from, next) {
        store.dispatch(PRATICA_RICHIESTA_RESET_STATE)
        next()
      }
    },
    {
      name: 'numero_rate',
      path: 'rate',
      component: () => import('@/views/pratica/inserimento/rateizzazione/CreaRateizzazione'),
      meta: { isPublic: cardAutenticata('rateizzazione') },
      beforeEnter (to, from, next) {
        (carrelloRateizzazioneOk()) ? next() : next('/pratica/inserimento/rateizzazione')
      }
    },
    {
      name: 'riepilogo_rateizzazione',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/rateizzazione/RiepilogoRateizzazione'),
      meta: { isPublic: cardAutenticata('rateizzazione') },
      beforeEnter (to, from, next) {
        (carrelloRateizzazioneOk()) ? next() : next('/pratica/inserimento/rateizzazione')
      }
    },
    {
      name: 'esito_rateizzazione',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/rateizzazione/EsitoRateizzazione'),
      meta: { isPublic: cardAutenticata('rateizzazione') },
      props: true
    }
  ]
}

export default RATEIZZAZIONE
