import Vue from 'vue'
import { RateizzazioneService } from '@/common/api/tassa-auto'
import { NUM_PROTOCOLLO_MAX_LENGTH } from '@/common/config'
import {
  PRATICA_RICHIESTA_INTESTATARIO,
  PRATICA_RICHIESTA_RESET_STATE,
  RATEIZZAZIONE_CONTROLLO_FASCE,
  RATEIZZA_ALLEGATO_CARICA,
  RATEIZZA_ALLEGATO_ELIMINA,
  DATI_INTESTATARIO,
  DATI_LEGALE_RAPPRESENTANTE,
  RATEIZZAZIONE_CREA,
  RATEIZZA_ELIMINA_DAL_CARRELLO
} from './actions.type'

import {
  ADD_RATEIZZAZIONE_PRATICA,
  INITIAL_STATE_RATEIZZAZIONE,
  FASCE_RATEIZZAZIONE,
  ADD_ALLEGATO_RATEIZZA,
  REM_ALLEGATO_RATEIZZA,
  ADD_DATI_INTESTATARIO,
  ADD_DATI_LEGALE_RAPPRESENTANTE,
  REM_PROTOCOLLO_RATEIZZA
} from './mutations.type'

const initialState = {
  accertamentiRateiz: [],
  allegati: [],
  carrelloRateizzazione: {
    diffEconomiche: false,
    fascia: {
      numeroFascia: '',
      importoDa: '',
      importoA: '',
      numeroRate: ''
    }
  },
  datiContribuente: null,
  datiRateizzazione: {
    checked: false,
    numeroRateUtente: null,
    statoEstero: false
  },
  fasceCarrelloRateizzazione: [],
  numeroRateDaPagare: null,
  totaleCarrelloRateizzazione: null,
  rappresentanteLegale: null
}

export const state = { ...initialState }

export const actions = {
  [PRATICA_RICHIESTA_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_RATEIZZAZIONE)
  },

  async [PRATICA_RICHIESTA_INTESTATARIO] (context, params) {
    trovaProtocollo(params.codiceFiscale, params.numeroProtocollo)
    const { data } = await RateizzazioneService.cercaRateizzazioneIntestatario(params)
    if (data.accertamenti.length === 0) return
    context.commit(ADD_RATEIZZAZIONE_PRATICA, data)
    return { data }
  },

  async [DATI_INTESTATARIO] (context, params) {
    const { data } = await RateizzazioneService.cercaDatiRateizzazione(params)
    context.commit(ADD_DATI_INTESTATARIO, data)
    return { data }
  },

  async [DATI_LEGALE_RAPPRESENTANTE] (context, params) {
    context.commit(ADD_DATI_LEGALE_RAPPRESENTANTE, params)
  },

  [RATEIZZA_ELIMINA_DAL_CARRELLO] (context, params) {
    context.commit(REM_PROTOCOLLO_RATEIZZA, params)
  },

  async [RATEIZZAZIONE_CONTROLLO_FASCE] (context, params) {
    const { data } = await RateizzazioneService.listaFasceRata()
    context.commit(FASCE_RATEIZZAZIONE, data)
    return { data }
  },

  async [RATEIZZA_ALLEGATO_CARICA] (context, params) {
    const { data } = await RateizzazioneService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_RATEIZZA, data)
  },

  async [RATEIZZA_ALLEGATO_ELIMINA] (context, params) {
    const slug = params.slug
    delete params.slug
    await RateizzazioneService.eliminaAllegato(slug, params)
    return context.commit(REM_ALLEGATO_RATEIZZA, slug)
  },

  async [RATEIZZAZIONE_CREA] (context, params) {
    const { data } = await RateizzazioneService.creaRateizzazioneAvviso(params)
    return { data }
  }
}

function trovaProtocollo (codiceFiscale, numProtocollo) {
  const item = state.accertamentiRateiz.find(
    p => (p.codiceFiscale === codiceFiscale && p.protocollo === numProtocollo))
  if (item !== undefined) throw new Error('Il protocollo aggiunto è già presente')
}

const mutations = {
  [ADD_RATEIZZAZIONE_PRATICA] (state, nuovaRateizzazione) {
    if (state.accertamentiRateiz.length >= NUM_PROTOCOLLO_MAX_LENGTH) {
      throw new Error('E\' stato raggiunto il numero massimo di protocolli')
    }
    state.accertamentiRateiz.push(nuovaRateizzazione.accertamenti[0])
    state.totaleCarrelloRateizzazione += nuovaRateizzazione.accertamenti[0].totale
    Vue.set(state.accertamentiRateiz[state.accertamentiRateiz.length - 1], 'checked', false)

    const fascia = state.fasceCarrelloRateizzazione.find(
      p => (p.importoDa <= state.totaleCarrelloRateizzazione && (p.importoA >= state.totaleCarrelloRateizzazione || p.importoA === null)))
    if (fascia === undefined) throw new Error('Non è possibile individuare la fascia corrispondente')
    state.carrelloRateizzazione.fascia.numeroFascia = fascia.numeroFascia
    state.carrelloRateizzazione.fascia.importoDa = fascia.importoDa
    state.carrelloRateizzazione.fascia.importoA = fascia.importoA
    state.carrelloRateizzazione.fascia.numeroRate = fascia.numeroRate
  },

  [ADD_DATI_INTESTATARIO] (state, datiIntestatario) {
    state.datiContribuente = datiIntestatario
  },

  [ADD_DATI_LEGALE_RAPPRESENTANTE] (state, datiLegRappr) {
    state.rappresentanteLegale = datiLegRappr
  },

  [FASCE_RATEIZZAZIONE] (state, fasceRateizzazione) {
    state.fasceCarrelloRateizzazione = fasceRateizzazione
  },

  [ADD_ALLEGATO_RATEIZZA] (state, allegato) {
    state.allegati.push(allegato)
  },

  [REM_ALLEGATO_RATEIZZA] (state, identificativoArchivio) {
    const itemIdx = state.allegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))
    if (itemIdx === -1) return
    state.allegati.splice(itemIdx, 1)
  },

  [REM_PROTOCOLLO_RATEIZZA] (state, itemIdx) {
    state.totaleCarrelloRateizzazione -= state.accertamentiRateiz[itemIdx].totale
    state.accertamentiRateiz.splice(itemIdx, 1)
    const fascia = state.fasceCarrelloRateizzazione.find(
      p => (p.importoDa <= state.totaleCarrelloRateizzazione && (p.importoA >= state.totaleCarrelloRateizzazione || p.importoA === null)))
    if (fascia === undefined) throw new Error('Non è possibile individuare la fascia corrispondente')
    state.carrelloRateizzazione.fascia.numeroFascia = fascia.numeroFascia
    state.carrelloRateizzazione.fascia.importoDa = fascia.importoDa
    state.carrelloRateizzazione.fascia.importoA = fascia.importoA
    state.carrelloRateizzazione.fascia.numeroRate = fascia.numeroRate
  },

  [INITIAL_STATE_RATEIZZAZIONE] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.accertamentiRateiz = []
    state.allegati = []
    state.datiRateizzazione = {
      checked: false,
      numeroRateUtente: null
    }
  }
}

const getters = {
  datiContribuente (state) {
    return state.datiContribuente
  },

  accertamentiRateiz (state) {
    return state.accertamentiRateiz
  },

  allegati (state) {
    return state.allegati
  },

  carrelloRateizzazione (state) {
    return state.carrelloRateizzazione
  },

  totaleCarrelloRateizzazione (state) {
    return state.totaleCarrelloRateizzazione
  },

  fasceCarrelloRateizzazione (state) {
    return state.fasceCarrelloRateizzazione
  },

  datiRateizzazione () {
    return state.datiRateizzazione
  },
  numeroRateDaPagare (state) {
    return state.numeroRateDaPagare
  },
  rappresentanteLegale (state) {
    return state.rappresentanteLegale
  },
  rateizzazioneCreata (state) {
    return state.rateizzazioneCreata
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
