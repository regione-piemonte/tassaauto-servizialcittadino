import store from '@/store'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const STAMPA_AVV_SCADENZA = {
  path: '/pratica/stampa/avviso/scadenza',
  component: () => import('@/views/pratica/stampa/avviso_scadenza/StampaAvvScadenzaHome'),
  meta: { isPublic: cardAutenticata('stampa_avviso_scadenza') },
  children: [
    {
      name: 'cerca_stampa_avv_scadenza',
      path: '',
      component: () => import('@/views/pratica/stampa/avviso_scadenza/RicercaAvvScadenza'),
      meta: { isPublic: cardAutenticata('stampa_avviso_scadenza') }
    },
    {
      name: 'riepilogo_avviso_scadenza',
      path: 'riepilogo',
      component: () => import('@/views/pratica/stampa/avviso_scadenza/RiepilogoAvvScadenza'),
      meta: { isPublic: cardAutenticata('stampa_avviso_scadenza') },
      beforeEnter (to, from, next) {
        (store.getters.stampaAvvScadenza !== null) ? next() : next('/pratica/stampa/avviso/scadenza')
      }
    }
  ]
}

export default STAMPA_AVV_SCADENZA
