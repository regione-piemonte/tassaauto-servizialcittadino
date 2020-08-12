import Vue from 'vue'
import Vuex from 'vuex'

import calcolobollo from './calcolobollo.module'
import common from './common.module'
import domandadiscaricorimborso from './domanda_discarico_rimborso.module'
import info from './info.module'
import memobollo from './memobollo.module'
import ossavvaccertamento from './oss-avv-accertamento.module'
import ossavvscadenza from './oss-avv-scadenza.module'
import pagobollo from './pagobollo.module'
import pagorate from './pagorate.module'
import pratica from './pratica.module'
import rateizzazione from './rateizzazione.module'
import ricevuta from './ricevuta.module'
import stampaavvaccertamento from './stampa_avv_accertamento.module'
import stampaavvscadenza from './stampa_avv_scadenza.module'
import veicolo from './veicolo.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    calcolobollo,
    common,
    domandadiscaricorimborso,
    info,
    memobollo,
    ossavvaccertamento,
    ossavvscadenza,
    pagobollo,
    pagorate,
    pratica,
    rateizzazione,
    ricevuta,
    stampaavvaccertamento,
    stampaavvscadenza,
    veicolo
  }
})
