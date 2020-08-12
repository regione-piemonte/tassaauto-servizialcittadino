import Vue from 'vue'
import { OssAvvisoAccertamentoService } from '@/common/api/tassa-auto'
import {
  OSS_AVV_ACCERTAMENTO_RESET_STATE,
  AVV_ACCERTAMENTO_CERCA,
  OSS_AVV_ACC_SALVA_GRIGLIA_PAG,
  OSS_AVV_ACC_SALVA_GRIGLIA_NON_PAG,
  OSS_AVV_ACC_SALVA_GRIGLIA_ALTRO,
  OSS_AVV_ACC_SALVA_NOTE,
  OSS_AVV_ACCERTAMENTO_CREA,
  OSS_AVV_ACCERTAMENTO_CARICA_ALLEGATO,
  OSS_AVV_ACCERTAMENTO_ELIMINA_ALLEGATO
} from './actions.type'

import {
  INIT_STATE_OSS_AVV_ACCERTAMENTO,
  SET_AVVISO_ACCERTAMENTO,
  UPD_GRIGLIA_PAG_OSS_AVV_ACC,
  UPD_GRIGLIA_NON_PAG_OSS_AVV_ACC,
  UPD_GRIGLIA_ALTRO_OSS_AVV_ACC,
  UPD_NOTE_OSS_AVV_ACC,
  ADD_ALLEGATO_OSS_AVV_ACCERTAMENTO,
  REM_ALLEGATO_OSS_AVV_ACCERTAMENTO,
  INIT_STATE_OSS_AVV_ACC_PAGATO,
  INIT_STATE_OSS_AVV_ACC_NONPAGATO,
  INIT_STATE_OSS_AVV_ACC_ALTRO
} from './mutations.type'

const initialState = {
  avvisoAccertamento: null,
  ossAvvAccertamentoAllegati: [],
  grigliaAccertamentoPagato: {
    pagamentiCorretti: false,
    targaErrata: false,
    scadenzaErrata: false,
    veicoloRitargato: false,
    pagamentoAltraRegioneProvincia: false,
    numeroQuietanza: '',
    dataPagamento: '',
    ufficioAccettante: ''
  },
  grigliaAccertamentoNonPagato: {
    grigliaVenditaVeicolo: { value: false, data: '', concessionario: false },
    grigliaRadiatoDemolizione: { value: false, data: '' },
    grigliaRadiatoEsportazione: { value: false, data: '' },
    grigliaPrivazioneDisponibilita: { value: false, dataDal: '', dataAl: '', motivazione: '' },
    grigliaVeicoloMaiPosseduto: { value: false, datiAggiuntivi: '' },
    grigliaTrasferimentoRegione: { value: false, data: '' },
    grigliaCompetevaAltroSoggetto: { value: false, motivazione: '' },
    grigliaEsenzioni: {
      value: false,
      grigliaInstallazioneGplMetano: {
        value: false,
        data: ''
      },
      grigliaEsenzioniAltroMotivo: {
        value: false,
        testo: ''
      },
      grigliaEsenzioniDisabili: {
        value: false,
        data: '',
        numeroProtocolloProvvedimento: ''
      }
    }
  },
  grigliaAccertamentoAltro: {
    grigliaDirittoRiduzione: { value: false, testo: '' },
    grigliaDatiTecniciErrati: {
      value: false,
      kw: '',
      targa: '',
      tipoVeicolo: { codice: null, descrizione: '' },
      catEuro: { codice: null, descrizione: '' },
      alimentazione: { codice: null, descrizione: '' },
      peso: '',
      numPosti: '',
      sp: false,
      rimorchio: false,
      portata: '',
      assi: '',
      imp: false,
      emissCo2: ''
    }
  },
  ossAvvAccNote: ''
}

// spread operator - shallow copy
// cfr. https://lucybain.com/blog/2018/js-es6-spread-operator/
export const state = { ...initialState }

export const actions = {
  [OSS_AVV_ACCERTAMENTO_RESET_STATE] ({ commit }) {
    commit(INIT_STATE_OSS_AVV_ACCERTAMENTO)
    commit(INIT_STATE_OSS_AVV_ACC_PAGATO)
    commit(INIT_STATE_OSS_AVV_ACC_NONPAGATO)
    commit(INIT_STATE_OSS_AVV_ACC_ALTRO)
  },

  async [AVV_ACCERTAMENTO_CERCA] (context, params) {
    const { data } = await OssAvvisoAccertamentoService.cerca(params)
    context.commit(SET_AVVISO_ACCERTAMENTO, data)
  },

  [OSS_AVV_ACC_SALVA_GRIGLIA_PAG] (context, params) {
    context.commit(UPD_GRIGLIA_PAG_OSS_AVV_ACC, params)
    context.commit(INIT_STATE_OSS_AVV_ACC_NONPAGATO)
    context.commit(INIT_STATE_OSS_AVV_ACC_ALTRO)
  },

  [OSS_AVV_ACC_SALVA_GRIGLIA_NON_PAG] (context, params) {
    context.commit(UPD_GRIGLIA_NON_PAG_OSS_AVV_ACC, params)
    context.commit(INIT_STATE_OSS_AVV_ACC_PAGATO)
    context.commit(INIT_STATE_OSS_AVV_ACC_ALTRO)
  },

  [OSS_AVV_ACC_SALVA_GRIGLIA_ALTRO] (context, params) {
    context.commit(UPD_GRIGLIA_ALTRO_OSS_AVV_ACC, params)
    context.commit(INIT_STATE_OSS_AVV_ACC_PAGATO)
    context.commit(INIT_STATE_OSS_AVV_ACC_NONPAGATO)
  },

  [OSS_AVV_ACC_SALVA_NOTE] (context, params) {
    context.commit(UPD_NOTE_OSS_AVV_ACC, params)
  },

  async [OSS_AVV_ACCERTAMENTO_CREA] (context, params) {
    const { data } = await OssAvvisoAccertamentoService.crea(params)
    return { data }
  },

  async [OSS_AVV_ACCERTAMENTO_CARICA_ALLEGATO] (context, params) {
    const { data } = await OssAvvisoAccertamentoService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_OSS_AVV_ACCERTAMENTO, data)
  },

  async [OSS_AVV_ACCERTAMENTO_ELIMINA_ALLEGATO] (context, params) {
    const slug = params.slug
    delete params.slug
    await OssAvvisoAccertamentoService.eliminaAllegato(slug, params)
    return context.commit(REM_ALLEGATO_OSS_AVV_ACCERTAMENTO, slug)
  }
}

const mutations = {
  [SET_AVVISO_ACCERTAMENTO] (state, avvisoAccertamento) {
    state.avvisoAccertamento = avvisoAccertamento
  },

  [INIT_STATE_OSS_AVV_ACCERTAMENTO] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
    state.ossAvvAccertamentoAllegati = []
  },

  [INIT_STATE_OSS_AVV_ACC_PAGATO] () {
    state.grigliaAccertamentoPagato = {
      pagamentiCorretti: false,
      targaErrata: false,
      scadenzaErrata: false,
      veicoloRitargato: false,
      pagamentoAltraRegioneProvincia: false,
      numeroQuietanza: '',
      dataPagamento: '',
      ufficioAccettante: ''
    }
  },

  [INIT_STATE_OSS_AVV_ACC_NONPAGATO] () {
    state.grigliaAccertamentoNonPagato = {
      grigliaVenditaVeicolo: { value: false, data: '', concessionario: false },
      grigliaRadiatoDemolizione: { value: false, data: '' },
      grigliaRadiatoEsportazione: { value: false, data: '' },
      grigliaPrivazioneDisponibilita: { value: false, dataDal: '', dataAl: '', motivazione: '' },
      grigliaVeicoloMaiPosseduto: { value: false, datiAggiuntivi: '' },
      grigliaTrasferimentoRegione: { value: false, data: '' },
      grigliaCompetevaAltroSoggetto: { value: false, motivazione: '' },
      grigliaEsenzioni: {
        value: false,
        grigliaInstallazioneGplMetano: {
          value: false,
          data: ''
        },
        grigliaEsenzioniAltroMotivo: {
          value: false,
          testo: ''
        },
        grigliaEsenzioniDisabili: {
          value: false,
          data: '',
          numeroProtocolloProvvedimento: ''
        }
      }
    }
  },

  [INIT_STATE_OSS_AVV_ACC_ALTRO] () {
    state.grigliaAccertamentoAltro = {
      grigliaDirittoRiduzione: { value: false, testo: '' },
      grigliaDatiTecniciErrati: {
        value: false,
        kw: '',
        targa: '',
        tipoVeicolo: { codice: null, descrizione: '' },
        catEuro: { codice: null, descrizione: '' },
        alimentazione: { codice: null, descrizione: '' },
        peso: '',
        numPosti: '',
        sp: false,
        rimorchio: false,
        portata: '',
        assi: '',
        imp: false,
        emissCo2: ''
      }
    }
  },

  [UPD_GRIGLIA_PAG_OSS_AVV_ACC] (state, pGrigliaAccPagato) {
    state.grigliaAccertamentoPagato = pGrigliaAccPagato
  },

  [UPD_GRIGLIA_NON_PAG_OSS_AVV_ACC] (state, pGrigliaAccNonPagato) {
    state.grigliaAccertamentoNonPagato = pGrigliaAccNonPagato
  },

  [UPD_GRIGLIA_ALTRO_OSS_AVV_ACC] (state, pGrigliaAccAltroMotivo) {
    state.grigliaAccertamentoAltro = pGrigliaAccAltroMotivo
  },

  [UPD_NOTE_OSS_AVV_ACC] (state, pOssAvvAccNote) {
    state.ossAvvAccNote = pOssAvvAccNote
  },

  [ADD_ALLEGATO_OSS_AVV_ACCERTAMENTO] (state, allegato) {
    state.ossAvvAccertamentoAllegati.push(allegato)
  },

  [REM_ALLEGATO_OSS_AVV_ACCERTAMENTO] (state, identificativoArchivio) {
    const itemIdx = state.ossAvvAccertamentoAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))

    if (itemIdx === -1) return
    state.ossAvvAccertamentoAllegati.splice(itemIdx, 1)
  }
}

const getters = {
  avvisoAccertamento (state) {
    return state.avvisoAccertamento
  },

  grigliaAccertamentoPagato (state) {
    return state.grigliaAccertamentoPagato
  },

  grigliaAccertamentoNonPagato (state) {
    return state.grigliaAccertamentoNonPagato
  },

  grigliaAccertamentoAltro (state) {
    return state.grigliaAccertamentoAltro
  },

  ossAvvAccertamentoAllegati (state) {
    return state.ossAvvAccertamentoAllegati
  },

  ossAvvAccNote (state) {
    return state.ossAvvAccNote
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
