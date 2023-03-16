import store from '@/store'
import { OSS_AVV_BONARIO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'
function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}
const OSS_AVV_BONARIO = {
  path: '/pratica/inserimento/osservazione/avviso_bonario',
  component: () => import('@/views/pratica/inserimento/osservazione/avviso_bonario/OssAvvBonarioHome'),
  meta: { isPublic: cardAutenticata('osservazione_avviso_bonario') },
  children: [
    {
      name: 'cerca_avviso_bonario',
      path: '',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_bonario/CercaAvvBonario'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_bonario') },
      beforeEnter (to, from, next) {
        store.dispatch(OSS_AVV_BONARIO_RESET_STATE)
        next()
      }
    },
    {
      name: 'crea_osservazione_avviso_bonario',
      path: 'crea',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_bonario/CreaOssAvvBonario'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_bonario') },
      beforeEnter (to, from, next) {
        (store.getters.avvisoBonario != null) ? next() : next('/pratica/inserimento/osservazione/avviso_bonario')
      }
    },
    {
      name: 'riepilogo_osservazione_avviso_bonario',
      path: 'riepilogo',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_bonario/RiepilogoOssAvvBonario'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_bonario') },
      beforeEnter (to, from, next) {
        (store.getters.avvisoBonario != null) ? next() : next('/pratica/inserimento/osservazione/avviso_bonario')
      }
    },
    {
      name: 'esito_osservazione_avviso_bonario',
      path: 'esito',
      component: () => import('@/views/pratica/inserimento/osservazione/avviso_bonario/EsitoOssAvvBonario'),
      meta: { isPublic: cardAutenticata('osservazione_avviso_bonario') },
      props: true
    }
  ]
}

export default OSS_AVV_BONARIO
