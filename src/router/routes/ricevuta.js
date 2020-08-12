import store from '@/store'
import {
  RICEVUTA_PAGAMENTO_RESET_STATE
} from '@/store/actions.type'

const RICEVUTA = {
  path: '/bollo/ricevuta',
  component: () => import('@/views/bollo/ricevuta/RicevutaHome'),
  children: [
    {
      name: 'cerca_pagamento',
      path: '',
      component: () => import('@/views/bollo/ricevuta/CercaPagamento'),
      beforeEnter (to, from, next) {
        store.dispatch(RICEVUTA_PAGAMENTO_RESET_STATE)
        next()
      }
    },
    {
      name: 'esito_ricevuta',
      path: 'esito',
      component: () => import('@/views/bollo/ricevuta/EsitoRicevuta'),
      beforeEnter (to, from, next) {
        (store.getters.ricevutaPagam != null) ? next() : next('/bollo/ricevuta')
      }
    }
  ]
}

export default RICEVUTA
