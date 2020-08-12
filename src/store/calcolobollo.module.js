import Vue from 'vue'
import { CalcoloService } from '@/common/api/tassa-auto'
import { BOLLO_CALCOLO, BOLLO_CALCOLO_RESET_STATE } from './actions.type'
import { SET_BOLLO_CALCOLO, INITIAL_STATE_BOLLO_CALCOLO } from './mutations.type'

const initialState = {
  esitoCalcoloBollo: null
}

export const state = { ...initialState }

export const actions = {
  [BOLLO_CALCOLO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_BOLLO_CALCOLO)
  },
  async [BOLLO_CALCOLO] (context, params) {
    const { data } = await CalcoloService.calcolaImporto(params)
    context.commit(SET_BOLLO_CALCOLO, data)
  }
}

export const mutations = {
  [SET_BOLLO_CALCOLO] (state, esitoCalcoloBollo) {
    state.esitoCalcoloBollo = esitoCalcoloBollo
  },
  [INITIAL_STATE_BOLLO_CALCOLO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  esitoCalcoloBollo (state) {
    return state.esitoCalcoloBollo
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
