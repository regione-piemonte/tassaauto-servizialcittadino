import store from '@/store'

const STAMPA_PIANO_RATEIZZAZIONE = {
  path: '/pratica/stampa/piano_rateizzazione',
  component: () => import('@/views/pratica/stampa/piano_rateizzazione/StampaPianoRateizzazioneHome'),
  meta: { isPublic: true },
  children: [
    {
      name: 'cerca_stampa_piano_rateizzazione',
      path: '',
      component: () => import('@/views/pratica/stampa/piano_rateizzazione/RicercaPianoRateizzazione'),
      meta: { isPublic: true }
    },
    {
      name: 'riepilogo_piano_rateizzazione',
      path: 'riepilogo',
      component: () => import('@/views/pratica/stampa/piano_rateizzazione/RiepilogoPianoRateizzazione'),
      meta: { isPublic: true },
      beforeEnter (to, from, next) {
        (store.getters.stampaPianoRateizzazione !== null) ? next() : next('/pratica/stampa/piano_rateizzazione')
      }
    }
  ]
}

export default STAMPA_PIANO_RATEIZZAZIONE
