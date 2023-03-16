import Vue from 'vue'
import { EsenzioniDisabiliAuthService } from '@/common/api/tassa-auto'
import {
  ESENZIONI_DISABILI_CONTRIBUENTI,
  ESENZIONI_DISABILI_VEICOLI,
  ESENZIONI_DISABILI_CARICA_ALLEGATO,
  ESENZIONI_DISABILI_ELIMINA_ALLEGATO,
  ESENZIONI_DISABILI_CREA,
  ESENZIONI_DISABILI_RESET_STATE
} from './actions.type'

import {
  SET_ESENZIONI_DISABILI,
  SET_ESENZIONI_DISABILI_RESPONSE,
  SET_ESENZIONI_DISABILI_VEICOLI,
  SET_ESENZIONI_DISABILI_CONTRIBUENTI,
  INIT_STATE_ESENZIONI_DISABILI,
  ADD_ALLEGATO_ESENZIONI_DISABILI,
  REM_ALLEGATO_ESENZIONI_DISABILI
} from './mutations.type'

const initialState = {
  esenzioniVeicoli: [],
  esenzioniDisabili: null,
  esenzioniDisabiliResponse: null,
  esenzioniDisabiliAllegati: [],
  contribuente: null,
  oggettoDomanda: {
    valueName: '',
    primaRichiestaEsenzione: {
    },
    trasferimentoEsenzione: {
    }
  },
  dichiarazione: {
    proprietarioDisabile: {
      checked: null,
      riconosciutoPersonaDisabile: null,
      personaDisabilitaPsichicaMentale: null,
      personaVedenteIpovedente: null,
      invalidoRidotteImpediteCapacitaMotorie: null
    },
    disabileFamiliare: {
      checked: null,
      parentela: '',
      cfFamiliare: '',
      disabilitaGrave: null,
      disabilitaPsichicaMentale: null,
      disabilitaNonVedenteIpovedente: null
    },
    disabileComproprietario: {
      checked: null,
      parentela: '',
      cfFamiliare: '',
      disabilitaGrave: null,
      disabilitaPsichicaMentale: null,
      disabilitaNonVedenteIpovedente: null,
      comproprietario: null
    }
  },
  allegati: [
  ],
  email: '',
  telefono: ''
}

export const state = { ...initialState }

function listaTarghe (data) {
  const lista = [{ text: 'Seleziona', value: null }]
  for (const idx in data) {
    lista.push({ text: data[idx].targa, value: data[idx] })
  }
  return lista
}

export const actions = {
  [ESENZIONI_DISABILI_RESET_STATE] ({ commit }) {
    commit(INIT_STATE_ESENZIONI_DISABILI)
  },
  async [ESENZIONI_DISABILI_CONTRIBUENTI] (context, params) {
    const { data } = await EsenzioniDisabiliAuthService.esenzioniContribuenti(params)
    context.commit(SET_ESENZIONI_DISABILI_CONTRIBUENTI, data)
  },
  async [ESENZIONI_DISABILI_VEICOLI] (context, params) {
    try {
      const { data } = await EsenzioniDisabiliAuthService.esenzioniVeicoli(params)
      context.commit(SET_ESENZIONI_DISABILI_VEICOLI, listaTarghe(data))
    } catch (err) {
      context.commit(SET_ESENZIONI_DISABILI_VEICOLI, listaTarghe(''))
      throw err
    }
  },
  async [ESENZIONI_DISABILI_CARICA_ALLEGATO] (context, params) {
    const { data } = await EsenzioniDisabiliAuthService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_ESENZIONI_DISABILI, data)
  },
  async [ESENZIONI_DISABILI_ELIMINA_ALLEGATO] (context, params) {
    const slug = params.slug
    delete params.slug
    await EsenzioniDisabiliAuthService.eliminaAllegato(slug, params)
    return context.commit(REM_ALLEGATO_ESENZIONI_DISABILI, slug)
  },
  async [ESENZIONI_DISABILI_CREA] (context, params) {
    const { data } = await EsenzioniDisabiliAuthService.creaEsenzioni(params)
    return context.commit(SET_ESENZIONI_DISABILI_RESPONSE, data)
  }
}

const mutations = {
  [SET_ESENZIONI_DISABILI] (state, pEsenzioniDisabili) {
    state.esenzioniDisabili = pEsenzioniDisabili
  },
  [SET_ESENZIONI_DISABILI_RESPONSE] (state, pEsenzioniDisabiliResponse) {
    state.esenzioniDisabiliResponse = pEsenzioniDisabiliResponse
  },
  [SET_ESENZIONI_DISABILI_VEICOLI] (state, pVeicoloDisabileEsenzione) {
    state.esenzioniVeicoli = pVeicoloDisabileEsenzione
  },
  [SET_ESENZIONI_DISABILI_CONTRIBUENTI] (state, pContribuente) {
    state.contribuente = pContribuente
  },
  [ADD_ALLEGATO_ESENZIONI_DISABILI] (state, allegato) {
    state.esenzioniDisabiliAllegati.push(allegato)
  },
  [REM_ALLEGATO_ESENZIONI_DISABILI] (state, identificativoArchivio) {
    const itemIdx = state.esenzioniDisabiliAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))

    if (itemIdx === -1) return
    state.esenzioniDisabiliAllegati.splice(itemIdx, 1)
  },
  [INIT_STATE_ESENZIONI_DISABILI] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.esenzioniDisabiliResponse = null
    state.esenzioniDisabiliAllegati = []
    state.contribuente = {
    }
    state.oggettoDomanda = {
      valueName: '',
      primaRichiestaEsenzione: {
      },
      trasferimentoEsenzione: {
      }
    }
    state.dichiarazione = {
      proprietarioDisabile: {
        checked: null,
        riconosciutoPersonaDisabile: null,
        personaDisabilitaPsichicaMentale: null,
        personaVedenteIpovedente: null,
        invalidoRidotteImpediteCapacitaMotorie: null
      },
      disabileFamiliare: {
        checked: null,
        parentela: '',
        cfFamiliare: '',
        disabilitaGrave: null,
        disabilitaPsichicaMentale: null,
        disabilitaNonVedenteIpovedente: null
      }
    }
    state.allegati = [
    ]
  }
}

const getters = {
  contribuente (state) {
    return state.contribuente
  },
  oggettoDomanda (state) {
    return state.oggettoDomanda
  },
  dichiarazione (state) {
    return state.dichiarazione
  },
  esenzioniDisabili (state) {
    return state.esenzioniDisabili
  },
  esenzioniDisabiliAllegati (state) {
    return state.esenzioniDisabiliAllegati
  },
  esenzioniVeicoli (state) {
    return state.esenzioniVeicoli
  },
  esenzioniContribuenti (state) {
    return state.contribuente
  },
  esenzioniDisabiliResponse (state) {
    return state.esenzioniDisabiliResponse
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
