import Vue from 'vue'
import { StampaAvvAccertamentoService, StampaAvvPagamentoService, OssAvvisoAccertamentoService } from '@/common/api/tassa-auto'
import {
  STAMPA_AVV_ACCERTAMENTO_CERCA_IUV,
  STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO,
  STAMPA_AVV_ACCERTAMENTO_PDF,
  STAMPA_LETTERA_AVV_ACCERTAMENTO_PDF,
  STAMPA_AVV_ACCERTAMENTO_RESET_STATE,
  STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI
} from './actions.type'

import {
  ADD_STAMPA_AVV_ACCERTAMENTO,
  INITIAL_STATE_STAMPA_AVV_ACCERTAMENTO,
  UPD_STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI
} from './mutations.type'

const initialState = {
  stampaAvvAccertamento: null,
  listaStampaAvvisiAuth: null
}

export const state = { ...initialState }

function lista (data) {
  const lista = [{ text: 'Seleziona', value: null }]
  for (const idx in data) {
    lista.push({ text: data[idx].tipoVeicolo.descrizione + ' - ' + data[idx].targa + ' - ' + data[idx].meseScadenza + '/' + data[idx].annoScadenza, value: data[idx] })
  }
  return lista
}

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
  },

  async [STAMPA_LETTERA_AVV_ACCERTAMENTO_PDF] (context, params) {
    return StampaAvvPagamentoService.downloadLetteraPdf(params)
  },

  async [STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI] (context, params) {
    const { data } = await OssAvvisoAccertamentoService.avvisiAutenticati(params)
    context.commit(UPD_STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI, lista(data))
    return { data }
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
  },

  [UPD_STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI] (state, listaStampaAvvisiAuth) {
    state.listaStampaAvvisiAuth = listaStampaAvvisiAuth
  }
}

const getters = {
  stampaAvvAccertamento (state) {
    return state.stampaAvvAccertamento
  },
  listaStampaAvvisiAuth (state) {
    return state.listaStampaAvvisiAuth
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
