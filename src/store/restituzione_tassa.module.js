import Vue from 'vue'
import { RichiestaTassaAuthService } from '@/common/api/tassa-auto'
import {
  RESTITUZIONI_TASSA_CONTRIBUENTI,
  RESTITUZIONI_TASSA_VEICOLI,
  RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI,
  RESTITUZIONI_TASSA_CARICA_ALLEGATO,
  RESTITUZIONI_TASSA_ELIMINA_ALLEGATO,
  RESTITUZIONI_TASSA_CREA,
  RESTITUZIONI_TASSA_RESET_STATE
} from './actions.type'

import {
  SET_RESTITUZIONI_TASSA,
  SET_RESTITUZIONI_TASSA_RESPONSE,
  SET_RESTITUZIONI_TASSA_EMAIL,
  SET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO,
  SET_ADD_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO,
  SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO,
  SET_RESTITUZIONI_TASSA_TELEFONO,
  SET_RESTITUZIONI_TASSA_VEICOLI,
  SET_RESTITUZIONI_TASSA_CONTRIBUENTI,
  INIT_STATE_RESTITUZIONI_TASSA,
  ADD_ALLEGATO_RESTITUZIONI_TASSA,
  REM_ALLEGATO_RESTITUZIONI_TASSA

} from './mutations.type'

const initialState = {
  restituzioniVeicoli: [],
  elencoVeicoliVersamenti: [],
  restituzioniTassa: null,
  restituzioniTassaResponse: null,
  restituzioniTassaAllegati: [],
  contribuenteRestituzione: null,
  oggettoDomandaRestituzione: {
    doppioPagamento: null,
    pagamentoEccessivo: {
      checked: null,
      erroreMateriale: null,
      targaErrata: null,
      targa: ''
    },
    pagamentoNonDovuto: {
      checked: null,
      motivo: ''
    },
    perditaDiPossesso: {
      checked: null,
      restituzionePeriodo: null,
      restituzioneDifferenza: null
    }
  },
  datiVeicoloVersamentiRestituzione: {
    valueName: '',
    versamentoErrato: {},
    veicoloNonPresente: {
      targa: '',
      tipoVeicolo: ''
    }
  },
  modalitaRestituzione: {
    accreditoCc: {
      checked: null,
      iban: ''
    },
    compensazione: {
      checked: null,
      miaProprieta: null,
      altroSoggetto: null,
      codiceFiscale: ''
    }
  },
  versamenti: [],
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
  [RESTITUZIONI_TASSA_RESET_STATE] ({ commit }) {
    commit(INIT_STATE_RESTITUZIONI_TASSA)// aggiungere gli altri
  },
  async [RESTITUZIONI_TASSA_CONTRIBUENTI] (context, params) {
    const { data } = await RichiestaTassaAuthService.restituzioniContribuenti(params)
    context.commit(SET_RESTITUZIONI_TASSA_CONTRIBUENTI, data)
  },
  async [RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI] (context, params) {
    const { data } = await RichiestaTassaAuthService.restituzioniVeicoliVersamenti(params)
    context.commit(SET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO, data)
  },
  async [RESTITUZIONI_TASSA_VEICOLI] (context, params) {
    const { data } = await RichiestaTassaAuthService.restituzioniVeicoli(params)
    context.commit(SET_RESTITUZIONI_TASSA_VEICOLI, listaTarghe(data))
  },
  async [RESTITUZIONI_TASSA_CARICA_ALLEGATO] (context, params) {
    const { data } = await RichiestaTassaAuthService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_RESTITUZIONI_TASSA, data)
  },
  async [RESTITUZIONI_TASSA_ELIMINA_ALLEGATO] (context, params) {
    const slug = params.slug
    delete params.slug
    await RichiestaTassaAuthService.eliminaAllegato(slug, params)
    return context.commit(REM_ALLEGATO_RESTITUZIONI_TASSA, slug)
  },
  async [RESTITUZIONI_TASSA_CREA] (context, params) {
    const { data } = await RichiestaTassaAuthService.creaEsenzioni(params)
    context.commit(SET_RESTITUZIONI_TASSA_RESPONSE, data)
  }
}

const mutations = {

  [SET_RESTITUZIONI_TASSA] (state, pRestituzioniTassa) {
    state.restituzioniTassa = pRestituzioniTassa
  },
  [SET_RESTITUZIONI_TASSA_RESPONSE] (state, pRestituzioniTassaResponse) {
    state.restituzioniTassaResponse = pRestituzioniTassaResponse
  },
  [SET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO] (state, pVeicoliVersamenti) {
    state.elencoVeicoliVersamenti = pVeicoliVersamenti
  },
  [SET_ADD_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO] (state, pVersamento) {
    state.elencoVeicoliVersamenti.push(pVersamento)
  },
  [SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO] (state) {
    state.elencoVeicoliVersamenti = []
  },
  [SET_RESTITUZIONI_TASSA_TELEFONO] (state, pTelefono) {
    state.telefono = pTelefono
  },
  [SET_RESTITUZIONI_TASSA_EMAIL] (state, pEmail) {
    state.email = pEmail
  },
  [SET_RESTITUZIONI_TASSA_VEICOLI] (state, pRestituzioniVeicoli) {
    state.restituzioniVeicoli = pRestituzioniVeicoli
  },
  [SET_RESTITUZIONI_TASSA_CONTRIBUENTI] (state, pContribuente) {
    state.contribuenteRestituzione = pContribuente
  },
  [ADD_ALLEGATO_RESTITUZIONI_TASSA] (state, allegato) {
    state.restituzioniTassaAllegati.push(allegato)
  },
  [REM_ALLEGATO_RESTITUZIONI_TASSA] (state, identificativoArchivio) {
    const itemIdx = state.restituzioniTassaAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))

    if (itemIdx === -1) return
    state.restituzioniTassaAllegati.splice(itemIdx, 1)
  },
  [INIT_STATE_RESTITUZIONI_TASSA] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.oggettoDomandaRestituzione = {
      doppioPagamento: null,
      pagamentoEccessivo: {
        checked: null,
        erroreMateriale: null,
        targaErrata: null,
        targa: ''
      },
      pagamentoNonDovuto: {
        checked: null,
        motivo: ''
      },
      perditaDiPossesso: {
        checked: null,
        restituzionePeriodo: null,
        restituzioneDifferenza: null
      }
    }
    state.datiVeicoloVersamentiRestituzione = {
      versamentoErrato: {
        checked: null,
        veicolo: {
          targa: '',
          tipoVeicolo: {
            codice: '',
            descrizione: ''
          }
        }
      },
      veicoloNonPresente: {
        checked: null,
        targa: '',
        tipoVeicolo: ''
      }
    }

    state.modalitaRestituzione = {
      accreditoCc: {
        checked: null,
        iban: ''
      },
      compensazione: {
        checked: null,
        miaProprieta: null,
        altroSoggetto: null,
        codiceFiscale: ''
      }
    }
    state.versamenti = []
    state.allegati = []
    state.email = ''
    state.telefono = ''
  }
}

const getters = {
  contribuenteRestituzione (state) {
    return state.contribuenteRestituzione
  },
  elencoVeicoliVersamenti (state) {
    return state.elencoVeicoliVersamenti
  },
  oggettoDomandaRestituzione (state) {
    return state.oggettoDomandaRestituzione
  },
  datiVeicoloVersamentiRestituzione (state) {
    return state.datiVeicoloVersamentiRestituzione
  },
  modalitaRestituzione (state) {
    return state.modalitaRestituzione
  },
  restituzioniTassa (state) {
    return state.restituzioniTassa
  },
  restituzioniTassaResponse (state) {
    return state.restituzioniTassaResponse
  },
  restituzioniTassaAllegati (state) {
    return state.restituzioniTassaAllegati
  },
  restituzioniVeicoli (state) {
    return state.restituzioniVeicoli
  },
  restituzioniContribuenti (state) {
    return state.contribuenteRestituzione
  },
  restituzioniTelefono (state) {
    return state.telefono
  },
  restituzioniMail (state) {
    return state.mail
  }

}

export default {
  state,
  actions,
  mutations,
  getters
}
