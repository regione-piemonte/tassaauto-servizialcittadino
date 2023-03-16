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
import stampapianorateizzazione from './stampa_piano_rateizzazione.module'
import veicolo from './veicolo.module'
import esenzionidisabili from './esenzioni_disabili.module'
import restituzionetassa from './restituzione_tassa.module'
import consultapraticaauth from './pratica_auth.module'
import visure from './visure.module'
import notifiche from './notifiche.module'
import ossavvbonario from './oss-avv-bonario.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    calcolobollo,
    common,
    consultapraticaauth,
    domandadiscaricorimborso,
    esenzionidisabili,
    info,
    memobollo,
    ossavvaccertamento,
    ossavvscadenza,
    ossavvbonario,
    pagobollo,
    pagorate,
    pratica,
    rateizzazione,
    restituzionetassa,
    ricevuta,
    stampaavvaccertamento,
    stampaavvscadenza,
    stampapianorateizzazione,
    veicolo,
    visure,
    notifiche
  }
})
