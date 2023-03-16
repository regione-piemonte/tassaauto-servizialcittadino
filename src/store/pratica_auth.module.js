import Vue from 'vue'
import { ConsultaPraticaAuthService } from '@/common/api/tassa-auto'
import {
  PRATICA_RESET_STATE_AUTH,
  PRATICA_ALLEGATO_AUTH,
  PRATICA_ESENZIONI_DISABILI,
  PRATICA_ESENZIONI_DISABILI_MODIFICA,
  PRATICA_RESTITUZIONI_TASSA_MODIFICA,
  PRATICA_RESTITUZIONE_TASSA,
  PRATICA_COMUNICAZIONI_LIST_AUTENTICATI
} from './actions.type'
import { INITIAL_STATE_CONSULTA_PRATICA_AUTH, SET_CONSULTA_PRATICA_AUTH, UPD_PRATICA_COMUNICAZIONI_LIST_AUTENTICATI } from './mutations.type'

const initialState = {
  esitoVerificaPraticaAuth: null,
  listaComunicazioniAuth: []
}

export const state = { ...initialState }

function lista (data) {
  const lista = [{ text: 'Seleziona', value: null }]
  for (const idx in data) {
    lista.push({ text: data[idx].descrizione, value: data[idx] })
  }
  return lista
}

export const actions = {
  [PRATICA_RESET_STATE_AUTH] ({ commit }) {
    commit(INITIAL_STATE_CONSULTA_PRATICA_AUTH)
  },
  async [PRATICA_ALLEGATO_AUTH] (context, params) {
    const slug = params.slug
    delete params.slug
    return ConsultaPraticaAuthService.scaricaAllegato(slug, params)
  },
  async [PRATICA_ESENZIONI_DISABILI] (context, params) {
    const { data } = await ConsultaPraticaAuthService.verificaPraticaCercaEsenzione(params)
    context.commit(SET_CONSULTA_PRATICA_AUTH, data)
    return { data }
  },
  async [PRATICA_RESTITUZIONE_TASSA] (context, params) {
    const { data } = await ConsultaPraticaAuthService.verificaPraticaCercaRestituzione(params)
    context.commit(SET_CONSULTA_PRATICA_AUTH, data)
    return { data }
  },
  async [PRATICA_ESENZIONI_DISABILI_MODIFICA] (context, params) {
    return ConsultaPraticaAuthService.verificaPraticaAggiornaEsenzione(params)
  },
  async [PRATICA_RESTITUZIONI_TASSA_MODIFICA] (context, params) {
    return ConsultaPraticaAuthService.verificaPraticaAggiornaRestituzione(params)
  },
  async [PRATICA_COMUNICAZIONI_LIST_AUTENTICATI] (context, params) {
    const { data } = await ConsultaPraticaAuthService.comunicazioniAutenticati(params)
    context.commit(UPD_PRATICA_COMUNICAZIONI_LIST_AUTENTICATI, lista(data))
    return { data }
  }
}

const mutations = {
  [SET_CONSULTA_PRATICA_AUTH] (state, esitoVerificaPratica) {
    if (esitoVerificaPratica === null) {
      throw new ReferenceError('errore')
    } else state.esitoVerificaPraticaAuth = esitoVerificaPratica
  },
  [INITIAL_STATE_CONSULTA_PRATICA_AUTH] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [UPD_PRATICA_COMUNICAZIONI_LIST_AUTENTICATI] (state, listaComunicazioniAuth) {
    state.listaComunicazioniAuth = listaComunicazioniAuth
  }
}

const getters = {
  esitoVerificaPraticaAuth (state) {
    return state.esitoVerificaPraticaAuth
  },
  listaComunicazioniAuth (state) {
    return state.listaComunicazioniAuth
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
