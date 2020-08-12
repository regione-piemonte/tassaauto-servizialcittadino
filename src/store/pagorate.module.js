import _ from 'lodash'
import Vue from 'vue'
import { PagorateService } from '@/common/api/tassa-auto'
import {
  BOLLO_PAGO_RATE_CERCA,
  BOLLO_PAGO_RESET_STATE_RATE,
  BOLLO_PAGO_SALVA_RIFERIMENTI_RATE,
  BOLLO_PAGO_CREA_TRANSAZIONE_RATE,
  BOLLO_PAGO_RIEPILOGO_TRANSAZIONE_RATE,
  BOLLO_PAGO_RATE_CARRELLO
} from './actions.type'

import {
  ADD_PAGAMENTO_RATE,
  INITIAL_STATE_PAGAMENTO_RATA,
  UPD_RIF_PAGAMENTO_BOLLO,
  UPD_PAGO_RATE_CARRELLO
} from './mutations.type'

const initialState = {
  emailFormPagoRate: { email: '', privacy: 'not_accepted' },
  respCercaPagamRata: null,
  carrelloPagoRate: [],
  importoTotPagoRate: 0
}

export const state = { ...initialState }

export const actions = {
  [BOLLO_PAGO_RESET_STATE_RATE] ({ commit }) {
    commit(INITIAL_STATE_PAGAMENTO_RATA)
  },

  async [BOLLO_PAGO_RATE_CERCA] (context, slug) {
    const { data } = await PagorateService.cercaRate(slug)
    context.commit(ADD_PAGAMENTO_RATE, data)
    return { data }
  },

  async [BOLLO_PAGO_RATE_CARRELLO] (context, params) {
    if (params.rate.length === 0) {
      context.commit(UPD_PAGO_RATE_CARRELLO, { rate: [], totale: 0 })
      return
    }
    const { data } = await PagorateService.calcoloTotaleRate(params)
    context.commit(UPD_PAGO_RATE_CARRELLO, data)
  },

  [BOLLO_PAGO_SALVA_RIFERIMENTI_RATE] (context, params) {
    context.commit(UPD_RIF_PAGAMENTO_BOLLO, params)
  },

  async [BOLLO_PAGO_CREA_TRANSAZIONE_RATE] (context, params) {
    return PagorateService.creaTransazionePagoPA(params)
  },

  async [BOLLO_PAGO_RIEPILOGO_TRANSAZIONE_RATE] (context, slug) {
    return PagorateService.transazionePagoPA(slug)
  }
}

const mutations = {
  [ADD_PAGAMENTO_RATE] (state, nuovoPagamento) {
    state.respCercaPagamRata = nuovoPagamento
  },

  [UPD_RIF_PAGAMENTO_BOLLO] (state, rifParams) {
    state.emailFormPagoRate.email = rifParams.email
    state.emailFormPagoRate.privacy = rifParams.privacy
  },

  [INITIAL_STATE_PAGAMENTO_RATA] (state) {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.carrelloPagoRate = []
    state.emailFormPagoRate = { email: '', privacy: 'not_accepted' }
  },

  [UPD_PAGO_RATE_CARRELLO] (state, respCalcPagoRate) {
    state.carrelloPagoRate = respCalcPagoRate.rate
    state.importoTotPagoRate = respCalcPagoRate.totale
  }
}

const getters = {
  respCercaPagamRata (state) {
    return state.respCercaPagamRata
  },
  // riferimenti ultimo step
  emailFormPagoRate (state) {
    return state.emailFormPagoRate
  },
  // state elenco rate selezionate => orderBy per avere sempre l'elenco ordinato crescente
  carrelloPagoRate (state) {
    return _.orderBy(state.carrelloPagoRate, ['numeroRata'], ['asc'])
  },
  // state somma totale pagamento
  importoTotPagoRate (state) {
    return state.importoTotPagoRate
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
