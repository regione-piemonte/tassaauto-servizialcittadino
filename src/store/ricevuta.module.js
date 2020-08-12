import Vue from 'vue'
import { RicevutaService } from '@/common/api/tassa-auto'
import {
  RICEVUTA_PAGAMENTO,
  BOLLO_RICEVUTA_PDF,
  PAGORATE_RICEVUTA_PDF,
  RICEVUTA_PAGAMENTO_RESET_STATE
} from './actions.type'
import {
  SET_RICEVUTA_PAGAMENTO,
  INITIAL_STATE_RICEVUTA_PAGAMENTO
} from './mutations.type'

const initialState = {
  ricevutaPagam: null
}

export const state = { ...initialState }

export const actions = {
  [RICEVUTA_PAGAMENTO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_RICEVUTA_PAGAMENTO)
  },

  async [RICEVUTA_PAGAMENTO] (context, ricevutaSlug) {
    const { data } = await RicevutaService.get(ricevutaSlug)
    context.commit(SET_RICEVUTA_PAGAMENTO, data)
    return { data }
  },

  async [BOLLO_RICEVUTA_PDF] (context, params) {
    return RicevutaService.scaricaPdfPagoBollo(params)
  },

  async [PAGORATE_RICEVUTA_PDF] (context, params) {
    return RicevutaService.scaricaPdfPagoRate(params)
  }
}

export const mutations = {
  [SET_RICEVUTA_PAGAMENTO] (state, ricevutaPagam) {
    state.ricevutaPagam = ricevutaPagam
  },

  [INITIAL_STATE_RICEVUTA_PAGAMENTO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  ricevutaPagam (state) {
    return state.ricevutaPagam
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
