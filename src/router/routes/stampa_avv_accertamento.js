import store from '@/store'

const STAMPA_AVV_ACCERTAMENTO = {
  path: '/pratica/stampa/avviso/accertamento',
  component: () => import('@/views/pratica/stampa/avviso_accertamento/StampaAvvAccertamentoHome'),
  children: [
    {
      name: 'cerca_stampa_avv_accertamento',
      path: '',
      component: () => import('@/views/pratica/stampa/avviso_accertamento/RicercaAvvAccertamento')
    },
    {
      name: 'riepilogo_avviso_accertamento',
      path: 'riepilogo',
      component: () => import('@/views/pratica/stampa/avviso_accertamento/RiepilogoAvvAccertamento'),
      beforeEnter (to, from, next) {
        (store.getters.stampaAvvAccertamento !== null) ? next() : next('/pratica/stampa/avviso/accertamento')
      }
    }
  ]
}

export default STAMPA_AVV_ACCERTAMENTO
