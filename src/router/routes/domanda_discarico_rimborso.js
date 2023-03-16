import store from '@/store'
import { DOMANDA_DISCARICO_RIMBORSO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}
const DOMANDA_DISCARICO_RIMBORSO = {
  path: '/pratica/inserimento/domanda_discarico',
  component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/DomandaDiscaricoRimborsoHome'),
  meta: { isPublic: cardAutenticata('domanda_discarico_rimborso') },
  children: [
    {
      name: 'richiesta_domanda_discarico_rimborso',
      path: '',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/RichiestaDomandaDiscaricoRimborso'),
      meta: { isPublic: cardAutenticata('domanda_discarico_rimborso') },
      beforeEnter (to, from, next) {
        store.dispatch(DOMANDA_DISCARICO_RIMBORSO_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_domanda_discarico_rimborso',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/CreaDomandaDiscaricoRimborso'),
      meta: { isPublic: cardAutenticata('domanda_discarico_rimborso') },
      beforeEnter (to, from, next) {
        (store.getters.datiDomandaDiscaricoIntestatario != null) ? next() : next('/pratica/inserimento/domanda_discarico')
      }
    },
    {
      name: 'riepilogo_domanda_discarico_rimborso',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/RiepilogoDomandaDiscaricoRimborso'),
      meta: { isPublic: cardAutenticata('domanda_discarico_rimborso') },
      beforeEnter (to, from, next) {
        (store.getters.datiDomandaDiscaricoIntestatario != null) ? next() : next('/pratica/inserimento/domanda_discarico')
      }
    },
    {
      name: 'esito_domanda_discarico_rimborso',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/EsitoDomandaDiscaricoRimborso'),
      meta: { isPublic: cardAutenticata('domanda_discarico_rimborso') },
      beforeEnter (to, from, next) {
        (store.getters.responseDomandaDiscaricoRimborso != null) ? next() : next('/pratica/inserimento/domanda_discarico')
      }
    }
  ]
}

export default DOMANDA_DISCARICO_RIMBORSO
