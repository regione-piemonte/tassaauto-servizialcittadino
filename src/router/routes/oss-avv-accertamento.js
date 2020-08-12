import store from '@/store'
import { OSS_AVV_ACCERTAMENTO_RESET_STATE } from '@/store/actions.type'

const OSS_AVV_ACCERTAMENTO = {
  path: '/pratica/inserimento/osservazione/avviso_accertamento',
  component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/OssAvvAccertamentoHome'),
  children: [
    {
      name: 'cerca_avviso_accertamento',
      path: '',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/CercaAvvAccertamento'),
      beforeEnter (to, from, next) {
        store.dispatch(OSS_AVV_ACCERTAMENTO_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_osservazione_accertamento',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/CreaOssAvvAccertamento'),
      beforeEnter (to, from, next) {
        (store.getters.avvisoAccertamento != null) ? next() : next('/pratica/inserimento/osservazione/avviso_accertamento')
      }
    },
    {
      name: 'riepilogo_osservazione_accertamento',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/RiepilogoOssAvvAccertamento'),
      beforeEnter (to, from, next) {
        (store.getters.avvisoAccertamento != null) ? next() : next('/pratica/inserimento/osservazione/avviso_accertamento')
      }
    },
    {
      name: 'esito_osservazione_accertamento',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_accertamento/EsitoOssAvvAccertamento'),
      props: true
    }
  ]
}

export default OSS_AVV_ACCERTAMENTO
