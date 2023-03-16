import store from '@/store'
import {
  RICEVUTA_PAGAMENTO_RESET_STATE
} from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}
const RICEVUTA = {
  path: '/bollo/ricevuta',
  component: () => import('@/views/bollo/ricevuta/RicevutaHome'),
  meta: { isPublic: cardAutenticata('ricevuta_bollo') },
  children: [
    {
      name: 'cerca_pagamento',
      path: '',
      component: () => import('@/views/bollo/ricevuta/CercaPagamento'),
      meta: { isPublic: cardAutenticata('ricevuta_bollo') },
      beforeEnter (to, from, next) {
        store.dispatch(RICEVUTA_PAGAMENTO_RESET_STATE)
        next()
      }
    },
    {
      name: 'esito_ricevuta',
      path: 'esito',
      component: () => import('@/views/bollo/ricevuta/EsitoRicevuta'),
      meta: { isPublic: cardAutenticata('ricevuta_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.ricevutaPagam != null) ? next() : next('/bollo/ricevuta')
      }
    }
  ]
}

export default RICEVUTA
