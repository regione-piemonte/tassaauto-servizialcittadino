import store from '@/store'
import { PRATICA_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const VERIFICA_PRATICA = {
  path: '/pratica/verifica',
  component: () => import('@/views/pratica/verifica/VerificaPraticaHome'),
  meta: { isPublic: cardAutenticata('verifica_pratica') },
  children: [
    {
      name: 'cerca_pratica',
      path: '',
      component: () => import('@/views/pratica/verifica/VerificaPratica'),
      meta: { isPublic: cardAutenticata('verifica_pratica') },
      beforeEnter (to, from, next) {
        store.dispatch(PRATICA_RESET_STATE)
        next()
      }
    },
    {
      name: 'verifica_osservazione',
      path: 'osservazione',
      component: () => import('@/views/pratica/verifica/PraticaOsservazione'),
      meta: { isPublic: cardAutenticata('verifica_pratica') },
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_rateizzazione',
      path: 'rateizzazione',
      component: () => import('@/views/pratica/verifica/PraticaRateizzazione'),
      meta: { isPublic: cardAutenticata('verifica_pratica') },
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_accertamento',
      path: 'accertamento',
      component: () => import('@/views/pratica/verifica/PraticaOssAvvAccertamento'),
      meta: { isPublic: cardAutenticata('verifica_pratica') },
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_bonario',
      path: 'bonario',
      component: () => import('@/views/pratica/verifica/PraticaOssAvvBonario'),
      meta: { isPublic: cardAutenticata('verifica_pratica') },
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_disc_rimb',
      path: 'discarico-rimborso',
      component: () => import('@/views/pratica/verifica/PraticaDomDiscRimb'),
      meta: { isPublic: cardAutenticata('verifica_pratica') },
      beforeEnter (to, from, next) {
        (store.getters.esitoVerificaPratica != null) ? next() : next('/pratica/verifica')
      }
    },
    {
      name: 'verifica_esenzioni_disabili',
      path: 'esenzioni',
      component: () => import('@/views/pratica/verifica_auth/PraticaDomEsenzioniDisabili'),
      async beforeEnter (to, from, next) {
        if (store.getters.userIdentity) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      name: 'verifica_restituzioni_tassa',
      path: 'restituzioni',
      component: () => import('@/views/pratica/verifica_auth/PraticaDomRestTassa'),
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

export default VERIFICA_PRATICA
