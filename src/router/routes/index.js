import { REGIONE_PARAMS, servizioAttivo } from '@/common/config'

import CALCOLOBOLLO from './calcolobollo'
import DOMANDA_DISCARICO_RIMBORSO from './domanda_discarico_rimborso'
import INFOBOLLO from './infobollo'
import MEMOBOLLO from './memobollo'
import OSS_AVV_ACCERTAMENTO from './oss-avv-accertamento'
import OSS_AVV_SCADENZA from './oss-avv-scadenza'
import PAGOBOLLO from './pagobollo'
import PAGORATE from './pagorate'
import RATEIZZAZIONE from './rateizzazione'
import RICEVUTA from './ricevuta'
import STAMPA_AVV_ACCERTAMENTO from './stampa_avv_accertamento'
import STAMPA_AVV_SCADENZA from './stampa_avv_scadenza'
import VERIFICA_PRATICA from './pratica'

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/Home')
  }
]

if (servizioAttivo('calcolo_bollo')) routes.push(CALCOLOBOLLO)
if (servizioAttivo('domanda_discarico_rimborso')) routes.push(DOMANDA_DISCARICO_RIMBORSO)
if (servizioAttivo('info_bollo')) routes.push(INFOBOLLO)
if (servizioAttivo('memo_bollo')) routes.push(MEMOBOLLO)

if (servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) {
  routes.push({
    name: 'scelta_tipo_osservazione',
    path: '/pratica/inserimento/osservazione/scelta_tipo',
    component: () => import('@/views/pratica/inserimento/osservazione/SceltaTipoOsservazione')
  })
}
if (servizioAttivo('osservazione_avviso_scadenza')) routes.push(OSS_AVV_SCADENZA)
if (servizioAttivo('osservazione_avviso_accertamento')) routes.push(OSS_AVV_ACCERTAMENTO)

if (servizioAttivo('pago_bollo') && servizioAttivo('pago_rate')) {
  routes.push({
    name: 'scelta_tipo_pagamento',
    path: '/pagopa/avvio/scelta_tipo',
    component: () => import('@/views/bollo/pago/SceltaTipoPagamento')
  })
}
if (servizioAttivo('pago_bollo')) routes.push(PAGOBOLLO)
if (servizioAttivo('pago_rate')) routes.push(PAGORATE)

if (servizioAttivo('stampa_avviso_scadenza') && servizioAttivo('stampa_avviso_accertamento')) {
  routes.push({
    name: 'scelta_tipo_stampa',
    path: '/pratica/stampa/scelta_tipo',
    component: () => import('@/views/pratica/stampa/SceltaTipoStampa')
  })
}
if (servizioAttivo('stampa_avviso_scadenza')) routes.push(STAMPA_AVV_SCADENZA)
if (servizioAttivo('stampa_avviso_accertamento')) routes.push(STAMPA_AVV_ACCERTAMENTO)

if (servizioAttivo('rateizzazione')) routes.push(RATEIZZAZIONE)
if (servizioAttivo('ricevuta_bollo')) routes.push(RICEVUTA)
if (servizioAttivo('verifica_pratica')) routes.push(VERIFICA_PRATICA)

if (servizioAttivo('contatti_aiuto')) {
  routes.push({
    name: 'contatti_aiuto',
    path: '/assistenza',
    meta: { isPublic: true },
    component: () => import('@/views/aiuto/ContattiAiuto')
  })

  if (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO) {
    routes.push({
      name: 'video_tutorial',
      path: '/assistenza/video_tutorial',
      component: () => import('@/views/aiuto/VideoTutorial'),
      meta: { isPublic: true }
    })
  }
}

// ATTENZIONE!!! errore404 deve restare per ultimo
routes.push({
  name: 'errore404',
  path: '*',
  component: () => import('@/views/errore/404NotFound'),
  meta: { isPublic: true }
})

export default routes
