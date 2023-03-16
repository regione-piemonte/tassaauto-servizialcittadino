import Vue from 'vue'

import { PagobolloService } from '@/common/api/tassa-auto'

import {
  BOLLO_PAGO_IUV,
  BOLLO_PAGO_RINNOVO,
  BOLLO_PAGO_CONTROLLO_SCADENZA,
  BOLLO_PAGO_SCADENZA,
  BOLLO_PAGO_LIST_MESE_SCADENZA,
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  BOLLO_PAGO_LIST_VAL_SCADENZA,
  BOLLO_PAGO_RESET_STATE,
  BOLLO_PAGO_LIMITE_CARRELLO,
  BOLLO_PAGO_ELIMINA_DAL_CARRELLO,
  BOLLO_PAGO_SALVA_RIFERIMENTI,
  BOLLO_PAGO_CREA_TRANSAZIONE,
  BOLLO_PAGO_RIEPILOGO_TRANSAZIONE
} from './actions.type'

import {
  ADD_PAGAMENTO_BOLLO,
  INITIAL_STATE_PAGAMENTO_BOLLO,
  REM_PAGAMENTO_BOLLO,
  UPD_RIF_PAGAMENTO_BOLLO,
  MAX_CARRELLO
} from './mutations.type'

const initialState = {
  emailFormPagoBollo: { email: '', privacy: 'not_accepted' },
  carrelloPagoBollo: [],
  limiteCarrelloPagoBollo: 0,
  pagamentoBollo: null,
  totaleCarrelloPagoBollo: 0
}

export const state = { ...initialState }

export const actions = {
  [BOLLO_PAGO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_PAGAMENTO_BOLLO)
  },
  async [BOLLO_PAGO_IUV] (context, params) {
    const { data } = await PagobolloService.calcoloIuv(params.iuv)
    trovaPagamento(data, params.parametroAcc, params.parametroMod1CC, params.parametroMod1BolloCC, params.paramAppDateCC)
    context.commit(ADD_PAGAMENTO_BOLLO, data)
    return { data }
  },

  async [BOLLO_PAGO_RINNOVO] (context, params) {
    console.log('marts params BOLLO_PAGO_RINNOVO inParams parametroAcc ' + params.parametroAcc)
    const { data } = await PagobolloService.calcoloRinnovo(params)
    trovaPagamento(data, params.parametroAcc, params.parametroMod1CC, params.parametroMod1BolloCC, params.paramAppDateCC)
    context.commit(ADD_PAGAMENTO_BOLLO, data)
    return { data }
  },

  async [BOLLO_PAGO_CONTROLLO_SCADENZA] (context, params) {
    return PagobolloService.controlloScadenza(params)
  },

  async [BOLLO_PAGO_LIST_MESE_SCADENZA] (context, params) {
    return PagobolloService.listaMesiScadenza()
  },

  async [BOLLO_PAGO_LIST_ANNO_SCADENZA] (context, params) {
    return PagobolloService.listaAnniScadenza()
  },

  async [BOLLO_PAGO_LIST_VAL_SCADENZA] (context, params) {
    return PagobolloService.listaMesiValiditaScadenza()
  },

  async [BOLLO_PAGO_SCADENZA] (context, params) {
    const { data } = await PagobolloService.calcoloScadenza(params)
    trovaPagamento(data, params.parametroAcc, params.parametroMod1CC, params.parametroMod1BolloCC, params.paramAppDateCC)
    context.commit(ADD_PAGAMENTO_BOLLO, data)
    return { data }
  },

  async [BOLLO_PAGO_LIMITE_CARRELLO] (context, params) {
    const { data } = await PagobolloService.limiteCarrello()
    context.commit(MAX_CARRELLO, data)
    return { data }
  },

  [BOLLO_PAGO_ELIMINA_DAL_CARRELLO] (context, params) {
    context.commit(REM_PAGAMENTO_BOLLO, params)
  },

  [BOLLO_PAGO_SALVA_RIFERIMENTI] (context, params) {
    context.commit(UPD_RIF_PAGAMENTO_BOLLO, params)
  },

  async [BOLLO_PAGO_CREA_TRANSAZIONE] (context, params) {
    return PagobolloService.creaTransazionePagoPA(params)
  },

  async [BOLLO_PAGO_RIEPILOGO_TRANSAZIONE] (context, slug) {
    return PagobolloService.transazionePagoPA(slug)
  }
}

// Marts
function periodoSovrapposto (pag, nuovoPag) {
  if (pag.risultato.scadenza === nuovoPag.risultato.scadenza) return true
  if (pag.risultato.scadenza.indexOf('/') === -1 || nuovoPag.risultato.scadenza.indexOf('/') === -1) return true

  const pagArray = pag.risultato.scadenza.split('/')
  // Attenzione: il costruttore di Date è nel secondo parametro (mese) 0-based
  const pagMese = pagArray[0]
  const pagAnno = pagArray[1]
  const pagInizio = new Date(pagAnno, pagMese - pag.risultato.validita, 1) // Inizio: il primo giorno del mese successivo
  const pagFine = new Date(pagAnno, pagMese - 1 + 1, 0) // ultimo giorno del mese

  const nuovoPagArray = nuovoPag.risultato.scadenza.split('/')
  const nuovoPagMese = nuovoPagArray[0]
  const nuovoPagAnno = nuovoPagArray[1]
  const nuovoPagInizio = new Date(nuovoPagAnno, nuovoPagMese - nuovoPag.risultato.validita, 1)
  const nuovoPagFine = new Date(nuovoPagAnno, nuovoPagMese - 1 + 1, 0)

  if (nuovoPagFine < pagInizio || nuovoPagInizio > pagFine) return false // periodo precedente o successivo
  return true
}

function verificaCarrelloOmogeneo (nuovoPag, parametroAcc, parametroMod1CC, parametroMod1BolloCC, paramAppDateCC) {
  state.carrelloPagoBollo.forEach(pag => {
    console.log('verifica carrello omogeneo pag tiipologia cc ' + pag.risultato.tipologiaCC)
    console.log('verifica carrello omogeneo NUOVO pag tiipologia cc ' + nuovoPag.risultato.tipologiaCC)
    if (nuovoPag.risultato !== null && nuovoPag.risultato !== undefined && nuovoPag.risultato.tipologiaCC !== null && nuovoPag.risultato.tipologiaCC !== undefined) {
      if ((pag.risultato.tipologiaCC !== nuovoPag.risultato.tipologiaCC) && pag.risultato.tipologiaCC === parametroAcc) throw new Error('Il carrello contiene pagamenti relativi ad accertamenti. E\' possibile aggiungere solo pagamenti della stessa tipologia')
      if ((pag.risultato.tipologiaCC !== nuovoPag.risultato.tipologiaCC) && pag.risultato.tipologiaCC === parametroMod1CC) throw new Error('Il carrello contiene pagamenti relativi a bolli con termine di pagamento antecedente il ' + paramAppDateCC + '. E\' possibile aggiungere solo pagamenti della stessa tipologia')
      if ((pag.risultato.tipologiaCC !== nuovoPag.risultato.tipologiaCC) && pag.risultato.tipologiaCC === parametroMod1BolloCC) throw new Error('Il carrello contiene pagamenti relativi a bolli con termine di pagamento successivo al ' + paramAppDateCC + '. E\' possibile aggiungere solo pagamenti della stessa tipologia')
    }
  })
}

function trovaPagamento (nuovoPag, parametroAcc, parametroMod1CC, parametroMod1BolloCC, paramAppDateCC) {
  const item = state.carrelloPagoBollo.find(
    p => (
      p.risultato.codiceFiscale === nuovoPag.risultato.codiceFiscale &&
    p.risultato.targa === nuovoPag.risultato.targa &&
    p.risultato.tipoVeicolo.codice === nuovoPag.risultato.tipoVeicolo.codice &&
    periodoSovrapposto(p, nuovoPag)
    ))
  if (item !== undefined) throw new Error('Pagamento già presente, per eliminarlo andare al riepilogo')
  verificaCarrelloOmogeneo(nuovoPag, parametroAcc, parametroMod1CC, parametroMod1BolloCC, paramAppDateCC)
}

const mutations = {
  [ADD_PAGAMENTO_BOLLO] (state, nuovoPagamento) {
    // aggiunta proprietà per indicare quale elemento nel carrello viene si vuole eliminare
    nuovoPagamento = { ...nuovoPagamento, delete: false }
    state.carrelloPagoBollo.push(nuovoPagamento)
    state.pagamentoBollo = nuovoPagamento
    state.totaleCarrelloPagoBollo += nuovoPagamento.risultato.totale
  },

  [REM_PAGAMENTO_BOLLO] (state, pagamento) {
    const itemIdx = state.carrelloPagoBollo.findIndex(
      p => (
        p.risultato.codiceFiscale === pagamento.risultato.codiceFiscale &&
      p.risultato.targa === pagamento.risultato.targa &&
      p.risultato.tipoVeicolo.codice === pagamento.risultato.tipoVeicolo.codice &&
      p.risultato.scadenza === pagamento.risultato.scadenza &&
      p.risultato.validita === pagamento.risultato.validita
      ))

    if (itemIdx === -1) return
    state.totaleCarrelloPagoBollo -= state.carrelloPagoBollo[itemIdx].risultato.totale
    state.carrelloPagoBollo.splice(itemIdx, 1)

    if (state.pagamentoBollo.risultato.codiceFiscale === pagamento.risultato.codiceFiscale &&
      state.pagamentoBollo.risultato.targa === pagamento.risultato.targa &&
      state.pagamentoBollo.risultato.tipoVeicolo.codice === pagamento.risultato.tipoVeicolo.codice &&
      state.pagamentoBollo.risultato.scadenza === pagamento.risultato.scadenza) state.pagamentoBollo = null
  },

  [UPD_RIF_PAGAMENTO_BOLLO] (state, rifParams) {
    state.emailFormPagoBollo.email = rifParams.email
    state.emailFormPagoBollo.privacy = rifParams.privacy
  },

  [INITIAL_STATE_PAGAMENTO_BOLLO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.carrelloPagoBollo = []
    state.emailFormPagoBollo = { email: '', privacy: 'not_accepted' }
  },

  [MAX_CARRELLO] (state, limiteCarrelloPagoBollo) {
    state.limiteCarrelloPagoBollo = limiteCarrelloPagoBollo.valore
  }
}

const getters = {
  carrelloPagoBollo (state) {
    return state.carrelloPagoBollo
  },

  emailFormPagoBollo (state) {
    return state.emailFormPagoBollo
  },

  limiteCarrelloPagoBollo (state) {
    return state.limiteCarrelloPagoBollo
  },

  pagamentoBollo (state) {
    return state.pagamentoBollo
  },

  totaleCarrelloPagoBollo (state) {
    return state.totaleCarrelloPagoBollo
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
