import store from '@/store'
import { VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const VISURE_AUTH = {
  path: '/visure',
  component: () => import('@/views/visure/VisureHome'),
  meta: { isPublic: cardAutenticata('visure') },
  children: [
    {
      name: 'elenco_veicoli_visure',
      path: '',
      props: true,
      component: () => import('@/views/visure/ElencoVeicoli'),
      async beforeEnter (to, from, next) {
        store.dispatch(VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE)
        if (store.getters.userIdentity) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      name: 'dettaglio_veicoli_visure',
      path: 'dettaglio',
      component: () => import('@/views/visure/DettaglioVeicolo'),
      async beforeEnter (to, from, next) {
        if (store.getters.userIdentity) {
          next()
        } else {
          next('/')
        }
      }
    }
  ]
}

export default VISURE_AUTH
