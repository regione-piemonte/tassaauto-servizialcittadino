import Vue from 'vue'
import { InfoService } from '@/common/api/tassa-auto'
import {
  INFO_VERIFICA_EMAIL,
  INFO_RICHIESTA_ATT_EMAIL,
  INFO_ATTIVAZ_EMAIL,
  INFO_RICHIESTA_REV_EMAIL,
  INFO_REVOCA_EMAIL,
  INFO_VERIFICA_SMS,
  INFO_RICHIESTA_ATT_SMS,
  INFO_ATTIVAZ_SMS,
  INFO_RICHIESTA_REV_SMS,
  INFO_REVOCA_SMS,
  INFO_RESET_STATE
} from './actions.type'

import { INITIAL_STATE_INFOBOLLO, SET_INFOBOLLO_EMAIL, SET_INFOBOLLO_SMS } from './mutations.type'

const initialState = {
  esitoInfoVerificaEmail: null,
  esitoInfoVerificaSms: null
}

export const state = { ...initialState }

export const actions = {
  [INFO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_INFOBOLLO)
  },
  async [INFO_VERIFICA_EMAIL] (context, params) {
    const { data } = await InfoService.verificaEmail(params)
    context.commit(SET_INFOBOLLO_EMAIL, data)
    return { data }
  },
  async [INFO_RICHIESTA_ATT_EMAIL] (context, params) {
    return InfoService.richiediAttEmail(params)
  },
  async [INFO_RICHIESTA_REV_EMAIL] (context, params) {
    return InfoService.richiediRevEmail(params)
  },
  async [INFO_ATTIVAZ_EMAIL] (context, params) {
    return InfoService.attivaEmail(params)
  },
  async [INFO_REVOCA_EMAIL] (context, params) {
    return InfoService.revocaEmail(params)
  },
  async [INFO_VERIFICA_SMS] (context, params) {
    const { data } = await InfoService.verificaSms(params)
    context.commit(SET_INFOBOLLO_SMS, data)
    return { data }
  },
  async [INFO_RICHIESTA_ATT_SMS] (context, params) {
    return InfoService.richiediAttSms(params)
  },
  async [INFO_RICHIESTA_REV_SMS] (context, params) {
    return InfoService.richiediRevSms(params)
  },
  async [INFO_ATTIVAZ_SMS] (context, params) {
    return InfoService.attivaSms(params)
  },
  async [INFO_REVOCA_SMS] (context, params) {
    return InfoService.revocaSms(params)
  }
}

const mutations = {
  [SET_INFOBOLLO_EMAIL] (state, esitoInfoVerificaEmail) {
    state.esitoInfoVerificaEmail = esitoInfoVerificaEmail
  },
  [SET_INFOBOLLO_SMS] (state, esitoInfoVerificaSms) {
    state.esitoInfoVerificaSms = esitoInfoVerificaSms
  },
  [INITIAL_STATE_INFOBOLLO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  esitoInfoVerificaEmail (state) {
    return state.esitoInfoVerificaEmail
  },
  esitoInfoVerificaSms (state) {
    return state.esitoInfoVerificaSms
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
