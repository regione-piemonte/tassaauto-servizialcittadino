import store from '@/store'

// ATTENZIONE!!! eventuali cambiamenti nei path di 'transazione_pagopa'
// devono essere comunicati al gruppo di PagoPA perche' aggiorni la URL
// da invocare per tornare su Tassa Auto

const PAGOBOLLO = {
  path: '/bollo/pago',
  component: () => import('@/views/bollo/pago/pago_bollo/PagoBolloHome'),
  children: [
    {
      name: 'avvio_pagopa',
      path: '/pagopa/avvio',
      component: () => import('@/views/bollo/pago/pago_bollo/AvvioPagoPA'),
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoBollo.length > 0) ? next() : next('/bollo/pago')
      }
    },
    {
      name: 'inizia_pagamento',
      path: '',
      component: () => import('@/views/bollo/pago/pago_bollo/IniziaPagamento')
    },
    {
      name: 'esito_ricerca_pagamento',
      path: 'dettaglio',
      component: () => import('@/views/bollo/pago/pago_bollo/EsitoRicercaPagamento'),
      beforeEnter (to, from, next) {
        (store.getters.pagamentoBollo != null) ? next() : next('/bollo/pago')
      }
    },
    {
      name: 'carrello_pagamenti',
      path: 'carrello',
      component: () => import('@/views/bollo/pago/pago_bollo/CarrelloPagamenti'),
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoBollo.length > 0) ? next() : next('/bollo/pago')
      }
    },
    {
      name: 'transazione_pagopa',
      path: 'pagopa/transazione',
      component: () => import('@/views/bollo/pago/pago_bollo/TransazionePagoPA')
    }
  ]
}

export default PAGOBOLLO
