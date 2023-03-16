import Vue from 'vue'
import { RicevutaService } from '@/common/api/tassa-auto'
import {
  RICEVUTA_PAGAMENTO,
  BOLLO_RICEVUTA_PDF,
  PAGORATE_RICEVUTA_PDF,
  RICEVUTA_LIST_AUTENTICATI,
  RICEVUTA_PAGAMENTO_RESET_STATE
} from './actions.type'
import {
  SET_RICEVUTA_PAGAMENTO,
  INITIAL_STATE_RICEVUTA_PAGAMENTO,
  UPD_RICEVUTA_LIST_AUTENTICATI
} from './mutations.type'

const initialState = {
  ricevutaPagam: null,
  listaPagamentoIuvAuth: null
}

export const state = { ...initialState }

function listaIuvConLabel (data) {
  const lista = [{ text: 'Seleziona', value: null }]
  for (const idx in data) {
    lista.push({ text: data[idx].descrizione, value: data[idx].codice })
  }
  return lista
}

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
  },

  async [RICEVUTA_LIST_AUTENTICATI] (context, params) {
    const { data } = await RicevutaService.iuvsAutenticati(params)
    const listIuv = listaIuvConLabel(data)
    context.commit(UPD_RICEVUTA_LIST_AUTENTICATI, listIuv)
  }
}

export const mutations = {
  [SET_RICEVUTA_PAGAMENTO] (state, ricevutaPagam) {
    state.ricevutaPagam = ricevutaPagam
  },

  async [UPD_RICEVUTA_LIST_AUTENTICATI] (state, listaPagamentoIuvAuth) {
    state.listaPagamentoIuvAuth = listaPagamentoIuvAuth
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
  },

  listaPagamentoIuvAuth (state) {
    return state.listaPagamentoIuvAuth
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
