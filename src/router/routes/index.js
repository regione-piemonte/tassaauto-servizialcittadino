import { REGIONE_PARAMS, servizioAttivo } from '@/common/config'

import CALCOLOBOLLO from './calcolobollo'
import DOMANDA_DISCARICO_RIMBORSO from './domanda_discarico_rimborso'
import { APP, ERRORE_404, ErroreServiziAuth, LOGOUT } from './global'
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
import STAMPA_PIANO_RATEIZZAZIONE from './stampa_piano_rateizzazione'
import VERIFICA_PRATICA from './pratica'
import ESENZIONI_DISABILI from './esenzioni_disabili'
import VERIFICA_PRATICA_AUTH from './verifica_pratica_auth'
import RESTITUZIONE_TASSA from './restituzione_tassa'
import VISURE from './visure'
import OSS_AVV_BONARIO from './oss-avv-bonario'

const routes = [APP]

if (servizioAttivo('calcolo_bollo')) routes.push(CALCOLOBOLLO)
if (servizioAttivo('domanda_discarico_rimborso')) routes.push(DOMANDA_DISCARICO_RIMBORSO)
if (servizioAttivo('info_bollo')) routes.push(INFOBOLLO)
if (servizioAttivo('memo_bollo')) routes.push(MEMOBOLLO)

if (servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) {
  routes.push({
    name: 'scelta_tipo_osservazione',
    path: '/pratica/inserimento/osservazione/scelta_tipo',
    component: () => import('@/views/pratica/inserimento/osservazione/SceltaTipoOsservazione'),
    meta: { isPublic: true }
  })
}
if (servizioAttivo('osservazione_avviso_scadenza')) routes.push(OSS_AVV_SCADENZA)
if (servizioAttivo('osservazione_avviso_accertamento')) routes.push(OSS_AVV_ACCERTAMENTO)
if (servizioAttivo('osservazione_avviso_bonario')) routes.push(OSS_AVV_BONARIO)

if (servizioAttivo('pago_bollo') && servizioAttivo('pago_rate')) {
  routes.push({
    name: 'scelta_tipo_pagamento',
    path: '/pagopa/avvio/scelta_tipo',
    component: () => import('@/views/bollo/pago/SceltaTipoPagamento'),
    meta: { isPublic: true }
  })
}
if (servizioAttivo('pago_bollo')) routes.push(PAGOBOLLO)
if (servizioAttivo('pago_rate')) routes.push(PAGORATE)

if (servizioAttivo('stampa_avviso_scadenza') && servizioAttivo('stampa_avviso_accertamento')) {
  routes.push({
    name: 'scelta_tipo_stampa',
    path: '/pratica/stampa/scelta_tipo',
    component: () => import('@/views/pratica/stampa/SceltaTipoStampa'),
    meta: { isPublic: true }
  })
}
if (servizioAttivo('stampa_avviso_scadenza')) routes.push(STAMPA_AVV_SCADENZA)
if (servizioAttivo('stampa_avviso_accertamento')) routes.push(STAMPA_AVV_ACCERTAMENTO)
if (servizioAttivo('stampa_piano_rateizzazione')) routes.push(STAMPA_PIANO_RATEIZZAZIONE)

if (servizioAttivo('rateizzazione')) routes.push(RATEIZZAZIONE)
if (servizioAttivo('ricevuta_bollo')) routes.push(RICEVUTA)
if (servizioAttivo('verifica_pratica')) routes.push(VERIFICA_PRATICA)

if (servizioAttivo('esenzioni_disabili')) routes.push(ESENZIONI_DISABILI)
if (servizioAttivo('verifica_pratica')) routes.push(VERIFICA_PRATICA_AUTH)
if (servizioAttivo('restituzione_tassa')) routes.push(RESTITUZIONE_TASSA)
if (servizioAttivo('visure')) routes.push(VISURE)

export const CONTATTI_AIUTO = {
  name: 'contatti_aiuto',
  path: '/assistenza',
  meta: { isPublic: true },
  component: () => import('@/views/aiuto/ContattiAiuto')
}

if (servizioAttivo('contatti_aiuto')) {
  routes.push(CONTATTI_AIUTO)

  if (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO) {
    routes.push({
      name: 'video_tutorial',
      path: '/assistenza/video_tutorial',
      component: () => import('@/views/aiuto/VideoTutorial'),
      meta: { isPublic: true }
    })
  }
}

routes.push(LOGOUT)

routes.push(ErroreServiziAuth)

// ATTENZIONE!!! errore404 deve restare per ultimo
routes.push(ERRORE_404)

export default routes
