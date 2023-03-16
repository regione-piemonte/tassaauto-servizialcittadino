import store from '@/store'
import { ESENZIONI_DISABILI_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const ESENZIONI_DISABILI = {
  path: '/esenzioni-disabili',
  component: () => import('@/views/pratica/inserimento/esenzioni_disabili/EsenzioniDisabiliHome'),
  children: [
    {
      name: 'inserimento_domanda_esenzione',
      path: '',
      props: true,
      component: () => import('@/views/pratica/inserimento/esenzioni_disabili/InserimentoDomandaEsenzione'),
      meta: { isPublic: cardAutenticata('esenzioni_disabili') }
    },
    {
      name: 'riepilogo_domanda_esenzione',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/esenzioni_disabili/RiepilogoDomandaEsenzione'),
      meta: { isPublic: cardAutenticata('esenzioni_disabili') },
      beforeEnter (to, from, next) {
        (store.getters.esenzioniDisabili != null) ? next() : next('/esenzioni-disabili')
      }
    },
    {
      name: 'esito_domanda_esenzione',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/esenzioni_disabili/EsitoDomandaEsenzione'),
      meta: { isPublic: cardAutenticata('esenzioni_disabili') },
      beforeEnter (to, from, next) {
        (store.getters.esenzioniDisabiliResponse != null) ? next() : next('/esenzioni-disabili')
      },
      beforeLeave (to, from, next) {
        store.dispatch(ESENZIONI_DISABILI_RESET_STATE)
      }
    }
  ]
}

export default ESENZIONI_DISABILI
