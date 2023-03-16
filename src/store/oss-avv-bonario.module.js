import Vue from 'vue'
import { OssAvvisoBonarioService } from '@/common/api/tassa-auto'
import {
  OSS_AVV_BONARIO_RESET_STATE,
  AVV_BONARIO_CERCA,
  OSS_AVV_BONARIO_SALVA_GRIGLIA_PAG,
  OSS_AVV_BONARIO_SALVA_GRIGLIA_NON_PAG,
  OSS_AVV_BONARIO_SALVA_GRIGLIA_ALTRO,
  OSS_AVV_BONARIO_SALVA_NOTE,
  OSS_AVV_BONARIO_CREA,
  OSS_AVV_BONARIO_CARICA_ALLEGATO,
  OSS_AVV_BONARIO_ELIMINA_ALLEGATO,
  OSS_AVV_BONARIO_LIST_AUTENTICATI
} from './actions.type'
import {
  INIT_STATE_OSS_AVV_BONARIO,
  INIT_STATE_OSS_AVV_BONARIO_PAGATO,
  INIT_STATE_OSS_AVV_BONARIO_NONPAGATO,
  INIT_STATE_OSS_AVV_BONARIO_ALTRO,
  SET_AVVISO_BONARIO,
  UPD_GRIGLIA_PAG_OSS_AVV_BONARIO,
  UPD_GRIGLIA_NON_PAG_OSS_AVV_BONARIO,
  UPD_GRIGLIA_ALTRO_OSS_AVV_BONARIO,
  UPD_NOTE_OSS_AVV_BONARIO,
  ADD_ALLEGATO_OSS_AVV_BONARIO,
  REM_ALLEGATO_OSS_AVV_BONARIO,
  UPD_OSS_AVV_BONARIO_LIST_AUTENTICATI
} from './mutations.type'

const initialState = {
  avvisoBonario: null,
  ossAvvBonarioAllegati: [],
  grigliaAvvisoBonarioPagato: {
    pagamentiCorretti: false,
    targaErrata: false,
    scadenzaErrata: false,
    veicoloRitargato: false,
    pagamentoAltraRegioneProvincia: false,
    numeroQuietanza: '',
    dataPagamento: '',
    ufficioAccettante: ''
  },
  grigliaAvvisoBonarioNonPagato: {
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
  grigliaAvvisoBonarioAltro: {
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
  ossAvvBonarioNote: '',
  listaAvvisiBonariAuth: []
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
  [OSS_AVV_BONARIO_RESET_STATE] ({ commit }) {
    commit(INIT_STATE_OSS_AVV_BONARIO)
    commit(INIT_STATE_OSS_AVV_BONARIO_PAGATO)
    commit(INIT_STATE_OSS_AVV_BONARIO_NONPAGATO)
    commit(INIT_STATE_OSS_AVV_BONARIO_ALTRO)
  },

  async [AVV_BONARIO_CERCA] (context, params) {
    const { data } = await OssAvvisoBonarioService.cerca(params)
    context.commit(SET_AVVISO_BONARIO, data)
  },

  [OSS_AVV_BONARIO_SALVA_GRIGLIA_PAG] (context, params) {
    context.commit(UPD_GRIGLIA_PAG_OSS_AVV_BONARIO, params)
    context.commit(INIT_STATE_OSS_AVV_BONARIO_NONPAGATO)
    context.commit(INIT_STATE_OSS_AVV_BONARIO_ALTRO)
  },

  [OSS_AVV_BONARIO_SALVA_GRIGLIA_NON_PAG] (context, params) {
    context.commit(UPD_GRIGLIA_NON_PAG_OSS_AVV_BONARIO, params)
    context.commit(INIT_STATE_OSS_AVV_BONARIO_PAGATO)
    context.commit(INIT_STATE_OSS_AVV_BONARIO_ALTRO)
  },

  [OSS_AVV_BONARIO_SALVA_GRIGLIA_ALTRO] (context, params) {
    context.commit(UPD_GRIGLIA_ALTRO_OSS_AVV_BONARIO, params)
    context.commit(INIT_STATE_OSS_AVV_BONARIO_PAGATO)
    context.commit(INIT_STATE_OSS_AVV_BONARIO_NONPAGATO)
  },

  [OSS_AVV_BONARIO_SALVA_NOTE] (context, params) {
    context.commit(UPD_NOTE_OSS_AVV_BONARIO, params)
  },

  async [OSS_AVV_BONARIO_CREA] (context, params) {
    const { data } = await OssAvvisoBonarioService.crea(params)
    return { data }
  },

  async [OSS_AVV_BONARIO_CARICA_ALLEGATO] (context, params) {
    const { data } = await OssAvvisoBonarioService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_OSS_AVV_BONARIO, data)
  },

  async [OSS_AVV_BONARIO_ELIMINA_ALLEGATO] (context, params) {
    const slug = params.slug
    delete params.slug
    await OssAvvisoBonarioService.eliminaAllegato(slug, params)
    return context.commit(REM_ALLEGATO_OSS_AVV_BONARIO, slug)
  },
  async [OSS_AVV_BONARIO_LIST_AUTENTICATI] (context, params) {
    const { data } = await OssAvvisoBonarioService.avvisiAutenticati(params)
    context.commit(UPD_OSS_AVV_BONARIO_LIST_AUTENTICATI, lista(data))
    return { data }
  }

}

const mutations = {
  [SET_AVVISO_BONARIO] (state, avvisoBonario) {
    state.avvisoBonario = avvisoBonario
  },
  [INIT_STATE_OSS_AVV_BONARIO] () {
    for (const f in state) {
      // console.log('resetto campo : ' + f + ' , valore attuale : ', state[f])
      Vue.set(state, f, initialState[f])
    }
    state.ossAvvBonarioAllegati = []
  },
  [INIT_STATE_OSS_AVV_BONARIO_PAGATO] () {
    state.grigliaAvvisoBonarioPagato = {
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

  [INIT_STATE_OSS_AVV_BONARIO_NONPAGATO] () {
    state.grigliaAvvisoBonarioNonPagato = {
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

  [INIT_STATE_OSS_AVV_BONARIO_ALTRO] () {
    state.grigliaAvvisoBonarioAltro = {
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

  [UPD_GRIGLIA_PAG_OSS_AVV_BONARIO] (state, pGrigliaAccPagato) {
    state.grigliaAvvisoBonarioPagato = pGrigliaAccPagato
  },

  [UPD_GRIGLIA_NON_PAG_OSS_AVV_BONARIO] (state, pGrigliaAccNonPagato) {
    state.grigliaAvvisoBonarioNonPagato = pGrigliaAccNonPagato
  },

  [UPD_GRIGLIA_ALTRO_OSS_AVV_BONARIO] (state, pGrigliaAccAltroMotivo) {
    state.grigliaAvvisoBonarioAltro = pGrigliaAccAltroMotivo
  },

  [UPD_NOTE_OSS_AVV_BONARIO] (state, pOssAvvBonarioNote) {
    state.ossAvvBonarioNote = pOssAvvBonarioNote
  },

  [ADD_ALLEGATO_OSS_AVV_BONARIO] (state, allegato) {
    state.ossAvvBonarioAllegati.push(allegato)
  },

  [REM_ALLEGATO_OSS_AVV_BONARIO] (state, identificativoArchivio) {
    const itemIdx = state.ossAvvBonarioAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))

    if (itemIdx === -1) return
    state.ossAvvBonarioAllegati.splice(itemIdx, 1)
  },
  [UPD_OSS_AVV_BONARIO_LIST_AUTENTICATI] (state, listaAvvisiAuth) {
    state.listaAvvisiBonariAuth = listaAvvisiAuth
  }
}

const getters = {
  avvisoBonario (state) {
    return state.avvisoBonario
  },

  grigliaAvvisoBonarioPagato (state) {
    return state.grigliaAvvisoBonarioPagato
  },

  grigliaAvvisoBonarioNonPagato (state) {
    return state.grigliaAvvisoBonarioNonPagato
  },

  grigliaAvvisoBonarioAltro (state) {
    return state.grigliaAvvisoBonarioAltro
  },

  ossAvvBonarioNote (state) {
    return state.ossAvvBonarioNote
  },
  ossAvvBonarioAllegati (state) {
    return state.ossAvvBonarioAllegati
  },
  listaAvvisiBonariAuth (state) {
    return state.listaAvvisiBonariAuth
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
