import store from '@/store'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const STAMPA_AVV_ACCERTAMENTO = {
  path: '/pratica/stampa/avviso/accertamento',
  component: () => import('@/views/pratica/stampa/avviso_accertamento/StampaAvvAccertamentoHome'),
  meta: { isPublic: cardAutenticata('stampa_avviso_accertamento') },
  children: [
    {
      name: 'cerca_stampa_avv_accertamento',
      path: '',
      component: () => import('@/views/pratica/stampa/avviso_accertamento/RicercaAvvAccertamento'),
      meta: { isPublic: cardAutenticata('stampa_avviso_accertamento') }
    },
    {
      name: 'riepilogo_avviso_accertamento',
      path: 'riepilogo',
      component: () => import('@/views/pratica/stampa/avviso_accertamento/RiepilogoAvvAccertamento'),
      meta: { isPublic: cardAutenticata('stampa_avviso_accertamento') },
      beforeEnter (to, from, next) {
        (store.getters.stampaAvvAccertamento !== null) ? next() : next('/pratica/stampa/avviso/accertamento')
      }
    }
  ]
}

export default STAMPA_AVV_ACCERTAMENTO
