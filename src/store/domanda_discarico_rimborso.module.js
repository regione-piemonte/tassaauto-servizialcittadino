import Vue from 'vue'
import { DomandaDiscaricoRimborsoService } from '@/common/api/tassa-auto'
import {
  DOMANDA_DISCARICO_RIMBORSO_RESET_STATE,
  CERCA_DOMANDA_DISCARICO_RIMBORSO,
  LISTA_NUMERO_INGIUNZIONE,
  LISTA_CODICE_TRIBUTI,
  DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO,
  CREAZIONE_DOMANDA_DISCARICO_RIMBORSO,
  DOM_DISC_RIMB_CARICA_ALLEGATO,
  DOM_DISC_RIMB_ELIMINA_ALLEGATO,
  INVIO_DOMANDA_DISCARICO_RIMBORSO
} from './actions.type'

import {
  ADD_ANAGRAFICA_DISCARICO_RIMBORSO,
  INITIAL_STATE_DOMANDA_DISCARICO_RIMBORSO,
  ADD_DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO,
  ADD_DOMANDA_DISCARICO_RIMBORSO,
  ADD_ALLEGATO_DOM_DISC_RIMB,
  REMOVE_ALLEGATO_DOM_DISC_RIMB,
  RESPONSE_DOMANDA_DISCARICO_RIMBORSO
} from './mutations.type'

const initialState = {
  datiDomandaDiscaricoIntestatario: null,
  ingiunzioneFiscaleDiscRimb: {
    value: false,
    numeroIngiunzione: ''
  },
  cartellaEsattorialeDiscRimb: {
    value: false,
    numeroCartellaEsattoriale: ''
  },
  domandaDiscaricoRimborso: {
    dataNotifica: null,
    importoTotaleRiscossione: null,
    oggettoDomanda: {
      discaricoAmministrativo: {
        value: false,
        totale: false,
        parziale: false
      },
      rimborsoGiaPagato: {
        value: false,
        iban: ''
      }
    },
    motivo: {
      pagamentoEseguito: false,
      mancanzaPresupposto: false,
      altro: {
        value: false,
        note: null
      }
    }
  },

  rappresentanteLegaleDomanda: null,
  domDiscaricoRimborsoAllegati: [],
  responseDomandaDiscaricoRimborso: null
}

export const state = { ...initialState }

export const actions = {
  [DOMANDA_DISCARICO_RIMBORSO_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_DOMANDA_DISCARICO_RIMBORSO)
  },

  async [CERCA_DOMANDA_DISCARICO_RIMBORSO] (context, params) {
    const { data } = await DomandaDiscaricoRimborsoService.cercaDomandaDiscaricoRimborso(params)
    context.commit(ADD_ANAGRAFICA_DISCARICO_RIMBORSO, data)
    return { data }
  },

  async [LISTA_NUMERO_INGIUNZIONE] (context, params) {
    const { data } = await DomandaDiscaricoRimborsoService.listaNumeriIngiunzione(params)
    return { data }
  },

  async [LISTA_CODICE_TRIBUTI] (context) {
    const { data } = await DomandaDiscaricoRimborsoService.listaCodiciTributo()
    return { data }
  },

  async [DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO] (context, params) {
    context.commit(ADD_DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO, params)
  },

  async [CREAZIONE_DOMANDA_DISCARICO_RIMBORSO] (context, params) {
    context.commit(ADD_DOMANDA_DISCARICO_RIMBORSO, params)
  },

  async [DOM_DISC_RIMB_CARICA_ALLEGATO] (context, params) {
    const { data } = await DomandaDiscaricoRimborsoService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_DOM_DISC_RIMB, data)
  },

  async [INVIO_DOMANDA_DISCARICO_RIMBORSO] (context, params) {
    const { data } = await DomandaDiscaricoRimborsoService.inviaDomanda(params)
    return context.commit(RESPONSE_DOMANDA_DISCARICO_RIMBORSO, data)
  },

  async [DOM_DISC_RIMB_ELIMINA_ALLEGATO] (context, params) {
    const slug = params.slug
    const cf = params.codiceFiscale
    await DomandaDiscaricoRimborsoService.eliminaAllegato(slug, cf)
    return context.commit(REMOVE_ALLEGATO_DOM_DISC_RIMB, slug)
  }
}

const mutations = {
  [ADD_ANAGRAFICA_DISCARICO_RIMBORSO] (state, datiDomandaAnagrafica) {
    state.datiDomandaDiscaricoIntestatario = datiDomandaAnagrafica
  },

  [ADD_DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO] (state, datiLegRappr) {
    state.rappresentanteLegaleDomanda = datiLegRappr
  },

  [ADD_DOMANDA_DISCARICO_RIMBORSO] (state, domanda) {
    if (domanda.isIngiunzioneFiscale) {
      state.ingiunzioneFiscaleDiscRimb.value = true
      state.ingiunzioneFiscaleDiscRimb.numeroIngiunzione = domanda.numeroIngiunzione
      state.cartellaEsattorialeDiscRimb.value = false
      state.cartellaEsattorialeDiscRimb.numeroCartellaEsattoriale = null
    } else {
      state.ingiunzioneFiscaleDiscRimb.value = false
      state.ingiunzioneFiscaleDiscRimb.numeroIngiunzione = ''
      state.cartellaEsattorialeDiscRimb.value = true
      state.cartellaEsattorialeDiscRimb.numeroCartellaEsattoriale = domanda.numeroCartellaEsattoriale
    }

    state.domandaDiscaricoRimborso = {
      dataNotifica: domanda.dataNotifica,
      importoTotaleRiscossione: domanda.importoTotaleRiscossione,
      oggettoDomanda: domanda.oggettoDomanda,
      motivo: domanda.motivo
    }
  },

  [ADD_ALLEGATO_DOM_DISC_RIMB] (state, allegato) {
    state.domDiscaricoRimborsoAllegati.push(allegato)
  },

  [REMOVE_ALLEGATO_DOM_DISC_RIMB] (state, identificativoArchivio) {
    const itemIdx = state.domDiscaricoRimborsoAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))
    if (itemIdx === -1) return
    state.domDiscaricoRimborsoAllegati.splice(itemIdx, 1)
  },

  [RESPONSE_DOMANDA_DISCARICO_RIMBORSO] (state, response) {
    state.responseDomandaDiscaricoRimborso = response
  },

  [INITIAL_STATE_DOMANDA_DISCARICO_RIMBORSO] (state) {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.domDiscaricoRimborsoAllegati = []
    state.ingiunzioneFiscaleDiscRimb = { value: false, numeroIngiunzione: null }
    state.cartellaEsattorialeDiscRimb = { value: false, numeroCartellaEsattoriale: null }
    state.domandaDiscaricoRimborso = {
      dataNotifica: null,
      importoTotaleRiscossione: null,
      oggettoDomanda: {
        discaricoAmministrativo: { value: false, totale: false, parziale: false },
        rimborsoGiaPagato: { value: false, iban: '' }
      },
      motivo: { pagamentoEseguito: false, mancanzaPresupposto: false, altro: { value: false, note: null } }
    }
  }
}

const getters = {
  ingiunzioneFiscaleDiscRimb (state) {
    return state.ingiunzioneFiscaleDiscRimb
  },

  cartellaEsattorialeDiscRimb (state) {
    return state.cartellaEsattorialeDiscRimb
  },

  domandaDiscaricoRimborso (state) {
    return state.domandaDiscaricoRimborso
  },

  // state anagrafica intestatario avviso
  datiDomandaDiscaricoIntestatario (state) {
    return state.datiDomandaDiscaricoIntestatario
  },
  // state anagrafica rappresentate legale
  rappresentanteLegaleDomanda (state) {
    return state.rappresentanteLegaleDomanda
  },
  // state elenco allegati
  domDiscaricoRimborsoAllegati (state) {
    return state.domDiscaricoRimborsoAllegati
  },

  // state domanda oggetto form
  domandaDiscaricoRimborsoOggetto (state) {
    return state.domandaDiscaricoRimborsoOggetto
  },
  // state domanda motivo form
  domandaDiscaricoRimborsoMotivo (state) {
    return state.domandaDiscaricoRimborsoMotivo
  },

  // state response domanda discarico
  responseDomandaDiscaricoRimborso (state) {
    return state.responseDomandaDiscaricoRimborso
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
