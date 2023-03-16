import store from '@/store'
import { RESTITUZIONI_TASSA_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const RESTITUZIONE_TASSA = {
  path: '/restituzione-tassa',
  component: () => import('@/views/pratica/inserimento/restituzione_tassa/RestituzioneTassaHome'),
  meta: { isPublic: cardAutenticata('restituzione_tassa') },
  children: [
    {
      name: 'inserimento_domanda_restituzione',
      path: '',
      component: () => import('@/views/pratica/inserimento/restituzione_tassa/InserimentoDomandaRestituzione')
    },
    {
      name: 'riepilogo_domanda_Restituzione',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/restituzione_tassa/RiepilogoDomandaRestituzione'),
      meta: { isPublic: cardAutenticata('restituzione_tassa') },
      async beforeEnter (to, from, next) {
        (await store.getters.restituzioniTassa !== null) ? next() : next('/restituzione-tassa/')
      }
    },
    {
      name: 'esito_domanda_restituzione',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/restituzione_tassa/EsitoDomandaRestituzione'),
      meta: { isPublic: cardAutenticata('restituzione_tassa') },
      beforeEnter (to, from, next) {
        (store.getters.restituzioniTassaResponse != null) ? next() : next('/restituzione-tassa/')
      },
      beforeLeave (to, from, next) {
        store.dispatch(RESTITUZIONI_TASSA_RESET_STATE)
      }
    }
  ]
}

export default RESTITUZIONE_TASSA
