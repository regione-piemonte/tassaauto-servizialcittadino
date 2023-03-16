import store from '@/store'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const VERIFICA_PRATICA_AUTH = {
  path: '/pratica/verifica_auth',
  component: () => import('@/views/pratica/verifica_auth/VerificaPraticaAuthHome'),
  meta: { isPublic: cardAutenticata('consulta_pratica_auth') },
  children: [
    {
      name: 'verifica_pratica_auth',
      path: '',
      component: () => import('@/views/pratica/verifica_auth/VerificaPraticaAuth'),
      async beforeEnter (to, from, next) {
        if (store.getters.userIdentity) {
          next()
        } else {
          next('/')
        }
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

export default VERIFICA_PRATICA_AUTH
