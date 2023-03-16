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

const PAGORATE = {
  path: '/bollo/pagorate',
  component: () => import('@/views/bollo/pago/pago_rate/PagoRateHome'),
  meta: { isPublic: cardAutenticata('pago_rate') },
  children: [
    {
      name: 'inizia_pagamento_rate',
      path: '',
      component: () => import('@/views/bollo/pago/pago_rate/IniziaPagamento'),
      meta: { isPublic: cardAutenticata('pago_rate') }
    },
    {
      name: 'esito_ricerca_pagamento_rate',
      path: 'dettagliorate',
      component: () => import('@/views/bollo/pago/pago_rate/EsitoRicercaPagamento'),
      meta: { isPublic: cardAutenticata('pago_rate') },
      beforeEnter (to, from, next) {
        (store.getters.respCercaPagamRata !== null && store.getters.respCercaPagamRata.rate.length > 0) ? next() : next('/bollo/pagorate')
      }
    },
    {
      name: 'carrello_pagamenti_rate',
      path: 'carrellorate',
      component: () => import('@/views/bollo/pago/pago_rate/CarrelloPagamenti'),
      meta: { isPublic: cardAutenticata('pago_rate') },
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoRate.length > 0) ? next() : next('/bollo/pagorate')
      }
    },
    {
      name: 'avvio_pagopa_rate',
      path: '/pagopa/avviorate',
      component: () => import('@/views/bollo/pago/pago_rate/AvvioPagoPA'),
      meta: { isPublic: cardAutenticata('pago_rate') },
      beforeEnter (to, from, next) {
        (store.getters.carrelloPagoRate.length > 0) ? next() : next('/bollo/pagorate')
      }
    },
    {
      name: 'transazione_pagopa_rate',
      path: 'pagopa/transazione',
      component: () => import('@/views/bollo/pago/pago_rate/TransazionePagoPARate'),
      meta: { isPublic: cardAutenticata('pago_rate') }
    }
  ]
}

export default PAGORATE
