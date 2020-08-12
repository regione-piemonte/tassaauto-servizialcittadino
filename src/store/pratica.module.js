import Vue from 'vue'
import { PraticaService } from '@/common/api/tassa-auto'
import {
  PRATICA_ALLEGATO,
  PRATICA_OSSERVAZIONE,
  PRATICA_OSSERVAZIONE_MODIFICA,
  PRATICA_RATEIZZAZIONE,
  PRATICA_RATEIZZAZIONE_MODIFICA,
  PRATICA_ACCERTAMENTO,
  PRATICA_ACCERTAMENTO_MODIFICA,
  PRATICA_TIPOLOGIA,
  PRATICA_DISC_RIMB,
  PRATICA_DISC_RIMB_MODIFICA,
  PRATICA_RESET_STATE
} from './actions.type'
import { INITIAL_STATE_VERIFICA_PRATICA, SET_VERIFICA_PRATICA } from './mutations.type'

const initialState = {
  esitoVerificaPratica: null
}

export const state = { ...initialState }

export const actions = {
  [PRATICA_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_VERIFICA_PRATICA)
  },
  async [PRATICA_ALLEGATO] (context, params) {
    const slug = params.slug
    delete params.slug
    return PraticaService.scaricaAllegato(slug, params)
  },
  async [PRATICA_OSSERVAZIONE] (context, params) {
    const { data } = await PraticaService.cercaOsservazione(params)
    context.commit(SET_VERIFICA_PRATICA, data)
    return { data }
  },
  async [PRATICA_OSSERVAZIONE_MODIFICA] (context, params) {
    return PraticaService.modificaRifOsservazione(params)
  },
  async [PRATICA_RATEIZZAZIONE] (context, params) {
    const { data } = await PraticaService.cercaRateizzazione(params)
    context.commit(SET_VERIFICA_PRATICA, data)
    return { data }
  },
  async [PRATICA_RATEIZZAZIONE_MODIFICA] (context, params) {
    return PraticaService.modificaRifRateizzazione(params)
  },
  async [PRATICA_TIPOLOGIA] (context, params) {
    return PraticaService.verificaTipologia(params)
  },
  async [PRATICA_ACCERTAMENTO] (context, params) {
    const { data } = await PraticaService.cercaAccertamento(params)
    context.commit(SET_VERIFICA_PRATICA, data)
    return { data }
  },
  async [PRATICA_ACCERTAMENTO_MODIFICA] (context, params) {
    return PraticaService.modificaRifAccertamento(params)
  },
  async [PRATICA_DISC_RIMB] (context, params) {
    const { data } = await PraticaService.cercaDomandaDiscarico(params)
    context.commit(SET_VERIFICA_PRATICA, data)
    return { data }
  },
  async [PRATICA_DISC_RIMB_MODIFICA] (context, params) {
    return PraticaService.modificaRifDiscaricoRimborso(params)
  }
}

const mutations = {
  [SET_VERIFICA_PRATICA] (state, esitoVerificaPratica) {
    if (esitoVerificaPratica.avvisoAccertamento === null) {
      throw new ReferenceError('errore')
    } else state.esitoVerificaPratica = esitoVerificaPratica
  },
  [INITIAL_STATE_VERIFICA_PRATICA] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  esitoVerificaPratica (state) {
    return state.esitoVerificaPratica
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
