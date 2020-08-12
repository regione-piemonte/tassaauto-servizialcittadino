
import store from '@/store'
import { OSS_AVV_SCADENZA_RESET_STATE } from '@/store/actions.type'

const OSS_AVV_SCADENZA = {
  path: '/pratica/inserimento/osservazione/avviso_scadenza',
  component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/OssAvvScadenzaHome'),
  children: [
    {
      name: 'cerca_avviso_scadenza',
      path: '',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/CercaAvviso'),
      beforeEnter (to, from, next) {
        store.dispatch(OSS_AVV_SCADENZA_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_osservazione_avviso',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/CreaOsservazione'),
      beforeEnter (to, from, next) {
        (store.getters.avvisoScadenza != null) ? next() : next('/pratica/inserimento/osservazione/avviso_scadenza')
      }
    },
    {
      name: 'riepilogo_osservazione_avviso',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/RiepilogoOsservazione'),
      beforeEnter (to, from, next) {
        (store.getters.avvisoScadenza != null) ? next() : next('/pratica/inserimento/osservazione/avviso_scadenza')
      }
    },
    {
      name: 'esito_osservazione_avviso',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/EsitoOsservazione'),
      props: true
    }
  ]
}

export default OSS_AVV_SCADENZA
