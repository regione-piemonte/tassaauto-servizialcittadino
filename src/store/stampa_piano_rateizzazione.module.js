import Vue from 'vue'
import { StampaPianoRateizzazioneService } from '@/common/api/tassa-auto'
import {
  STAMPA_PIANO_RATEIZZAZIONE_CERCA,
  STAMPA_PIANO_RATEIZZAZIONE_PDF,
  STAMPA_PIANO_RATEIZZAZIONE_RESET_STATE
} from './actions.type'

import { ADD_STAMPA_PIANO_RATEIZZAZIONE } from './mutations.type'

const initialState = {
  stampaPianoRateizzazione: null
}

export const state = { ...initialState }

export const actions = {
  [STAMPA_PIANO_RATEIZZAZIONE_RESET_STATE] ({ commit }) {
    commit(STAMPA_PIANO_RATEIZZAZIONE_RESET_STATE)
  },
  async [STAMPA_PIANO_RATEIZZAZIONE_PDF] (context, params) {
    return StampaPianoRateizzazioneService.downloadPdf(params)
  },
  async [STAMPA_PIANO_RATEIZZAZIONE_CERCA] (context, slug) {
    const { data } = await StampaPianoRateizzazioneService.cercaPianoRateizzazione(slug)
    context.commit(ADD_STAMPA_PIANO_RATEIZZAZIONE, data)
  }
}

const mutations = {
  [ADD_STAMPA_PIANO_RATEIZZAZIONE] (state, pPianoRateizzazione) {
    state.stampaPianoRateizzazione = pPianoRateizzazione
  },

  [STAMPA_PIANO_RATEIZZAZIONE_RESET_STATE] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  stampaPianoRateizzazione (state) {
    return state.stampaPianoRateizzazione
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
