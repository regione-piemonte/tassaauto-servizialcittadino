import store from '@/store'

// ATTENZIONE!!! eventuali cambiamenti nei path di 'transazione_pagopa'
// devono essere comunicati al gruppo di PagoPA perche' aggiorni la URL
// da invocare per tornare su Tassa Auto

const PAGORATE = {
  path: '/bollo/pagorate',
  component: () => import('@/views/bollo/pago/pago_rate/PagoRateHome'),
  children: [
    {
      name: 'inizia_pagamento_rate',
      path: '',
      component: () => import('@/views/bollo/pago/pago_rate/IniziaPagamento')
    },
    {
      name: 'esito_ricerca_pagamento_rate',
      path: 'dettagliorate',
      component: () => import('@/views/bollo/pago/pago_rate/EsitoRicercaPagamento'),
      beforeEnter (to, from, next) {
        (store.getters.respCercaPagamRata !== null && store.getters.respCercaPagamRata.rate.length > 0) ? next() : next('/bollo/pagorate')
      }
    },
    {
      name: 'carrello_pagamenti_rate',
      path: 'carrellorate',
      component: () => import('@/views/bollo/pago/pago_rate/CarrelloPagamenti'),
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoRate.length > 0) ? next() : next('/bollo/pagorate')
      }
    },
    {
      name: 'avvio_pagopa_rate',
      path: '/pagopa/avviorate',
      component: () => import('@/views/bollo/pago/pago_rate/AvvioPagoPA'),
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoRate.length > 0) ? next() : next('/bollo/pagorate')
      }
    },
    {
      name: 'transazione_pagopa_rate',
      path: 'pagopa/transazione',
      component: () => import('@/views/bollo/pago/pago_rate/TransazionePagoPARate')
    }
  ]
}

export default PAGORATE
