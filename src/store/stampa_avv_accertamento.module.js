import Vue from 'vue'
import { StampaAvvAccertamentoService, StampaAvvPagamentoService } from '@/common/api/tassa-auto'
import {
  STAMPA_AVV_ACCERTAMENTO_CERCA_IUV,
  STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO,
  STAMPA_AVV_ACCERTAMENTO_PDF,
  STAMPA_AVV_ACCERTAMENTO_RESET_STATE
} from './actions.type'

import {
  ADD_STAMPA_AVV_ACCERTAMENTO,
  INITIAL_STATE_STAMPA_AVV_ACCERTAMENTO
} from './mutations.type'

const initialState = {
  stampaAvvAccertamento: null
}

export const state = { ...initialState }

export const actions = {
  [STAMPA_AVV_ACCERTAMENTO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_STAMPA_AVV_ACCERTAMENTO)
  },

  async [STAMPA_AVV_ACCERTAMENTO_CERCA_IUV] (context, slug) {
    const { data } = await StampaAvvAccertamentoService.cercaIuv(slug)
    context.commit(ADD_STAMPA_AVV_ACCERTAMENTO, data)
  },

  async [STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO] (context, params) {
    const { data } = await StampaAvvAccertamentoService.cercaDatiVeicolo(params)
    context.commit(ADD_STAMPA_AVV_ACCERTAMENTO, data)
  },

  async [STAMPA_AVV_ACCERTAMENTO_PDF] (context, params) {
    return StampaAvvPagamentoService.downloadPdf(params)
  }
}

const mutations = {
  [ADD_STAMPA_AVV_ACCERTAMENTO] (state, pStampaAvvAccertamento) {
    state.stampaAvvAccertamento = pStampaAvvAccertamento
  },

  [INITIAL_STATE_STAMPA_AVV_ACCERTAMENTO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  stampaAvvAccertamento (state) {
    return state.stampaAvvAccertamento
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
