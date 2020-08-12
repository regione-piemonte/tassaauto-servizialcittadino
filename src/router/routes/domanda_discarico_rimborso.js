import store from '@/store'
import { DOMANDA_DISCARICO_RIMBORSO_RESET_STATE } from '@/store/actions.type'

const DOMANDA_DISCARICO_RIMBORSO = {
  path: '/pratica/inserimento/domanda_discarico_rimborso',
  component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/DomandaDiscaricoRimborsoHome'),
  children: [
    {
      name: 'richiesta_domanda_discarico_rimborso',
      path: '',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/RichiestaDomandaDiscaricoRimborso'),
      beforeEnter (to, from, next) {
        store.dispatch(DOMANDA_DISCARICO_RIMBORSO_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_domanda_discarico_rimborso',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/CreaDomandaDiscaricoRimborso'),
      beforeEnter (to, from, next) {
        (store.getters.datiDomandaDiscaricoIntestatario != null) ? next() : next('/pratica/inserimento/domanda_discarico_rimborso')
      }
    },
    {
      name: 'riepilogo_domanda_discarico_rimborso',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/RiepilogoDomandaDiscaricoRimborso'),
      beforeEnter (to, from, next) {
        (store.getters.datiDomandaDiscaricoIntestatario != null) ? next() : next('/pratica/inserimento/domanda_discarico_rimborso')
      }
    },
    {
      name: 'esito_domanda_discarico_rimborso',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/domanda_discarico_rimborso/EsitoDomandaDiscaricoRimborso'),
      beforeEnter (to, from, next) {
        (store.getters.responseDomandaDiscaricoRimborso != null) ? next() : next('/pratica/inserimento/domanda_discarico_rimborso')
      }
    }

  ]
}

export default DOMANDA_DISCARICO_RIMBORSO
