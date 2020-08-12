import Vue from 'vue'
import { StampaAvvScadenzaService, StampaAvvPagamentoService } from '@/common/api/tassa-auto'
import {
  STAMPA_AVV_SCADENZA_CERCA_IUV,
  STAMPA_AVV_SCADENZA_CERCA_VEICOLO,
  STAMPA_AVV_SCADENZA_PDF,
  STAMPA_AVV_SCADENZA_RESET_STATE
} from './actions.type'

import { ADD_STAMPA_AVV_SCADENZA, INITIAL_STATE_STAMPA_AVV_SCADENZA } from './mutations.type'

const initialState = {
  stampaAvvScadenza: null
}

export const state = { ...initialState }

export const actions = {
  [STAMPA_AVV_SCADENZA_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_STAMPA_AVV_SCADENZA)
  },

  async [STAMPA_AVV_SCADENZA_CERCA_IUV] (context, slug) {
    const { data } = await StampaAvvScadenzaService.cercaIuv(slug)
    context.commit(ADD_STAMPA_AVV_SCADENZA, data)
  },

  async [STAMPA_AVV_SCADENZA_CERCA_VEICOLO] (context, params) {
    const { data } = await StampaAvvScadenzaService.cercaDatiVeicolo(params)
    context.commit(ADD_STAMPA_AVV_SCADENZA, data)
  },

  async [STAMPA_AVV_SCADENZA_PDF] (context, params) {
    return StampaAvvPagamentoService.downloadPdf(params)
  }
}

const mutations = {
  [ADD_STAMPA_AVV_SCADENZA] (state, pStampaAvvScadenza) {
    state.stampaAvvScadenza = pStampaAvvScadenza
  },

  [INITIAL_STATE_STAMPA_AVV_SCADENZA] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  stampaAvvScadenza (state) {
    return state.stampaAvvScadenza
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
