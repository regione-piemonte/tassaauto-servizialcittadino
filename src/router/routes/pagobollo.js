import store from '@/store'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}
// ATTENZIONE!!! eventuali cambiamenti nei path di 'transazione_pagopa'
// devono essere comunicati al gruppo di PagoPA perche' aggiorni la URL
// da invocare per tornare su Tassa Auto

const PAGOBOLLO = {
  path: '/bollo/pago',
  component: () => import('@/views/bollo/pago/pago_bollo/PagoBolloHome'),
  meta: { isPublic: cardAutenticata('pago_bollo') },
  children: [
    {
      name: 'avvio_pagopa',
      path: '/pagopa/avvio',
      component: () => import('@/views/bollo/pago/pago_bollo/AvvioPagoPA'),
      meta: { isPublic: cardAutenticata('pago_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoBollo.length > 0) ? next() : next('/bollo/pago')
      }
    },
    {
      name: 'inizia_pagamento',
      path: '',
      props: (route) => ({
        ...route.params
      }),
      component: () => import('@/views/bollo/pago/pago_bollo/IniziaPagamento'),
      meta: { isPublic: cardAutenticata('pago_bollo') }
    },
    {
      name: 'esito_ricerca_pagamento',
      path: 'dettaglio',
      component: () => import('@/views/bollo/pago/pago_bollo/EsitoRicercaPagamento'),
      meta: { isPublic: cardAutenticata('pago_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.pagamentoBollo != null) ? next() : next('/bollo/pago')
      }
    },
    {
      name: 'carrello_pagamenti',
      path: 'carrello',
      component: () => import('@/views/bollo/pago/pago_bollo/CarrelloPagamenti'),
      meta: { isPublic: cardAutenticata('pago_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoBollo.length > 0) ? next() : next('/bollo/pago')
      }
    },
    {
      name: 'transazione_pagopa',
      path: 'pagopa/transazione',
      component: () => import('@/views/bollo/pago/pago_bollo/TransazionePagoPA'),
      meta: { isPublic: cardAutenticata('pago_bollo') }
    }
  ]
}

export default PAGOBOLLO
