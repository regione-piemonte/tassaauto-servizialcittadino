import { VisureAuthService } from '@/common/api/tassa-auto'
import {
  VISURE_CONTRIBUENTE,
  DETTAGLIO_VEICOLO_VISURE_KEY,
  DETTAGLIO_VEICOLO_VISURE,
  DETTAGLIO_VEICOLO_SCELTO,
  VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE
} from './actions.type'
import {
  SET_VISURE_ELENCO_VEICOLI,
  SET_VISURE_KEY,
  SET_DETTAGLIO_VEICOLO_VISURE,
  SET_DETTAGLIO_VEICOLO_SCELTO,
  INITIAL_STATE_VISURE_DETTAGLIO_VEICOLO_SCELTO
} from './mutations.type'

const initialState = {
  visureElencoVeicoli: null,
  visureDettaglioVeicoli: {
    pagamenti: []
  },
  visureKey: {},
  veicoloScelto: {}
}

export const state = { ...initialState }

export const actions = {
  async [VISURE_CONTRIBUENTE] (context, params) {
    const { data } = await VisureAuthService.visureElencoVeicoli(params)
    context.commit(SET_VISURE_ELENCO_VEICOLI, data)
  },
  async [DETTAGLIO_VEICOLO_VISURE_KEY] (context, params) {
    const { data } = await VisureAuthService.visureRecuperoKey(params)
    context.commit(SET_VISURE_KEY, data)
  },
  async [DETTAGLIO_VEICOLO_SCELTO] (context, params) {
    context.commit(SET_DETTAGLIO_VEICOLO_SCELTO, params)
  },
  async [DETTAGLIO_VEICOLO_VISURE] (context, params) {
    const { data } = await VisureAuthService.visureDettaglioVeicolo(params)
    context.commit(SET_DETTAGLIO_VEICOLO_VISURE, data)
  },
  [VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_VISURE_DETTAGLIO_VEICOLO_SCELTO)
  }
}
export const mutations = {
  [SET_VISURE_ELENCO_VEICOLI] (state, pElencoVeicoli) {
    state.visureElencoVeicoli = pElencoVeicoli
  },
  [SET_VISURE_KEY] (state, key) {
    state.visureKey = key
  },
  [SET_DETTAGLIO_VEICOLO_VISURE] (state, dettaglio) {
    state.visureDettaglioVeicoli = dettaglio
  },
  [SET_DETTAGLIO_VEICOLO_SCELTO] (state, veicolo) {
    state.veicoloScelto = veicolo
  },
  [INITIAL_STATE_VISURE_DETTAGLIO_VEICOLO_SCELTO] (state) {
    state.visureDettaglioVeicoli = { pagamenti: [] }
  }
}

const getters = {
  // state selezione veicolo dall'elenco con tutti i dati del veicolo
  veicoloScelto (state) {
    return state.veicoloScelto
  },
  // response elenco veicoli per effetturare la scelta
  visureElencoVeicoli (state) {
    return state.visureElencoVeicoli
  },
  // response post con la key
  visureKey (state) {
    return state.visureKey
  },
  // elencoPagamenti
  visureDettaglioVeicoli (state) {
    return state.visureDettaglioVeicoli
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
