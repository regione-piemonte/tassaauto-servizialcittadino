import store from '@/store'

const STAMPA_AVV_SCADENZA = {
  path: '/pratica/stampa/avviso/scadenza',
  component: () => import('@/views/pratica/stampa/avviso_scadenza/StampaAvvScadenzaHome'),
  children: [
    {
      name: 'cerca_stampa_avv_scadenza',
      path: '',
      component: () => import('@/views/pratica/stampa/avviso_scadenza/RicercaAvvScadenza')
    },
    {
      name: 'riepilogo_avviso_scadenza',
      path: 'riepilogo',
      component: () => import('@/views/pratica/stampa/avviso_scadenza/RiepilogoAvvScadenza'),
      beforeEnter (to, from, next) {
        (store.getters.stampaAvvScadenza !== null) ? next() : next('/pratica/stampa/avviso/scadenza')
      }
    }
  ]
}

export default STAMPA_AVV_SCADENZA
