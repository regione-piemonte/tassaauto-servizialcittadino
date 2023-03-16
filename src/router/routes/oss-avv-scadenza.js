
import store from '@/store'
import { OSS_AVV_SCADENZA_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const OSS_AVV_SCADENZA = {
  path: '/pratica/inserimento/osservazione/avviso_scadenza',
  component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/OssAvvScadenzaHome'),
  meta: { isPublic: cardAutenticata('osservazione_avviso_scadenza') },
  children: [
    {
      name: 'cerca_avviso_scadenza',
      path: '',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/CercaAvviso'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_scadenza') },
      beforeEnter (to, from, next) {
        store.dispatch(OSS_AVV_SCADENZA_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_osservazione_avviso',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/CreaOsservazione'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_scadenza') },
      beforeEnter (to, from, next) {
        (store.getters.avvisoScadenza != null) ? next() : next('/pratica/inserimento/osservazione/avviso_scadenza')
      }
    },
    {
      name: 'riepilogo_osservazione_avviso',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/RiepilogoOsservazione'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_scadenza') },
      beforeEnter (to, from, next) {
        (store.getters.avvisoScadenza != null) ? next() : next('/pratica/inserimento/osservazione/avviso_scadenza')
      }
    },
    {
      name: 'esito_osservazione_avviso',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_scadenza/EsitoOsservazione'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_scadenza') },
      props: true
    }
  ]
}

export default OSS_AVV_SCADENZA
