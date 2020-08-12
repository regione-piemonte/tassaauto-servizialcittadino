import Vue from 'vue'
import { MemoService } from '@/common/api/tassa-auto'
import {
  MEMO_VERIFICA,
  MEMO_RICHIESTA_ATT_EMAIL,
  MEMO_ATTIVAZ_EMAIL,
  MEMO_RICHIESTA_REV_EMAIL,
  MEMO_REVOCA_EMAIL,
  MEMO_RICHIESTA_ATT_SMS,
  MEMO_ATTIVAZ_SMS,
  MEMO_RICHIESTA_REV_SMS,
  MEMO_REVOCA_SMS,
  MEMO_RESET_STATE
} from './actions.type'

import { INITIAL_STATE_MEMOBOLLO, SET_MEMOBOLLO } from './mutations.type'
const initialState = {
  esitoMemoVerifica: null
}

export const state = { ...initialState }

export const actions = {
  [MEMO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_MEMOBOLLO)
  },
  async [MEMO_VERIFICA] (context, params) {
    const { data } = await MemoService.verifica(params)
    context.commit(SET_MEMOBOLLO, data)
    return { data }
  },
  async [MEMO_RICHIESTA_ATT_EMAIL] (context, params) {
    return MemoService.richiediAttEmail(params)
  },
  async [MEMO_RICHIESTA_REV_EMAIL] (context, params) {
    return MemoService.richiediRevEmail(params)
  },
  async [MEMO_ATTIVAZ_EMAIL] (context, params) {
    return MemoService.attivaEmail(params)
  },
  async [MEMO_REVOCA_EMAIL] (context, params) {
    return MemoService.revocaEmail(params)
  },
  async [MEMO_RICHIESTA_ATT_SMS] (context, params) {
    return MemoService.richiediAttSms(params)
  },
  async [MEMO_RICHIESTA_REV_SMS] (context, params) {
    return MemoService.richiediRevSms(params)
  },
  async [MEMO_ATTIVAZ_SMS] (context, params) {
    return MemoService.attivaSms(params)
  },
  async [MEMO_REVOCA_SMS] (context, params) {
    return MemoService.revocaSms(params)
  }
}

const mutations = {
  [SET_MEMOBOLLO] (state, esitoMemoVerifica) {
    state.esitoMemoVerifica = esitoMemoVerifica
  },
  [INITIAL_STATE_MEMOBOLLO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  esitoMemoVerifica (state) {
    return state.esitoMemoVerifica
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
