import store from '@/store'
import { OSS_AVV_ACCERTAMENTO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const OSS_AVV_ACCERTAMENTO = {
  path: '/pratica/inserimento/osservazione/avviso_accertamento',
  component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/OssAvvAccertamentoHome'),
  meta: { isPublic: cardAutenticata('osservazione_avviso_accertamento') },
  children: [
    {
      name: 'cerca_avviso_accertamento',
      path: '',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/CercaAvvAccertamento'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_accertamento') },
      beforeEnter (to, from, next) {
        store.dispatch(OSS_AVV_ACCERTAMENTO_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_osservazione_accertamento',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/CreaOssAvvAccertamento'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_accertamento') },
      beforeEnter (to, from, next) {
        (store.getters.avvisoAccertamento != null) ? next() : next('/pratica/inserimento/osservazione/avviso_accertamento')
      }
    },
    {
      name: 'riepilogo_osservazione_accertamento',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/RiepilogoOssAvvAccertamento'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_accertamento') },
      beforeEnter (to, from, next) {
        (store.getters.avvisoAccertamento != null) ? next() : next('/pratica/inserimento/osservazione/avviso_accertamento')
      }
    },
    {
      name: 'esito_osservazione_accertamento',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/EsitoOssAvvAccertamento'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_accertamento') },
      props: true
    }
  ]
}

export default OSS_AVV_ACCERTAMENTO
