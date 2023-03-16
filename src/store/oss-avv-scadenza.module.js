import Vue from 'vue'
import { OssAvvisoScadenzaService } from '@/common/api/tassa-auto'
import {
  OSS_AVV_SCADENZA_RESET_STATE,
  AVV_SCADENZA_CERCA,
  OSS_AVV_SCADENZA_SALVA_ATTRIBUTI,
  OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI,
  OSS_AVV_SCADENZA_CREA,
  OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA,
  OSS_AVV_SCADENZA_LIST_AUTENTICATI,
  OSS_AVV_SCADENZA_CARICA_ALLEGATO,
  OSS_AVV_SCADENZA_ELIMINA_ALLEGATO
} from './actions.type'

import {
  INIT_STATE_OSS_AVV_SCADENZA,
  SET_AVVISO_SCADENZA,
  UPD_ATTRIB_OSS_AVV_SCADENZA,
  ADD_ALLEGATO_OSS_AVV_SCADENZA,
  REM_ALLEGATO_OSS_AVV_SCADENZA,
  UPD_VERIFICA_DATI_RETTIFICA,
  UPD_DATI_ANAGRAFICI_OSS_AVV_SCADENZA,
  UPD_OSS_AVV_SCADENZA_LIST_AUTENTICATI
} from './mutations.type'

const initialState = {
  avvisoScadenza: null,
  attributiOssAvvScad: {
    datiVeicoloRettifica: {
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
      emissCo2: ''
    },
    isNotIntestatario: { value: false },
    venduto: { value: false, data: '', concessionario: false },
    radiato: { value: false, data: '' },
    disponibilitaPrivata: { value: false, dal: '', al: '' },
    esenzioni: {
      disabili: { value: false, del: '', protocollo: '' },
      impiantoGplMetano: { value: false, data: '' },
      altroMotivo: { value: false, testo: '' }
    },
    trasferimentoRegione: { value: false, data: '' },
    radiatoDemolizione: { value: false, data: '' }
  },
  ossAvvScadDatiAnagRett: {
    value: false,
    codiceFiscale: null,
    cognomeDenominazione: null,
    nome: null,
    domicilioFiscale: null,
    indirizzo: null
  },
  errorRettifica: false,
  ossAvvScadenzaAllegati: [],
  listaAvvisiScaAuth: []
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
  [OSS_AVV_SCADENZA_RESET_STATE] ({ commit }) {
    commit(INIT_STATE_OSS_AVV_SCADENZA)
  },

  async [AVV_SCADENZA_CERCA] (context, params) {
    context.commit(INIT_STATE_OSS_AVV_SCADENZA)
    const { data } = await OssAvvisoScadenzaService.cerca(params)
    context.commit(SET_AVVISO_SCADENZA, data)
  },

  [OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA] (context, params) {
    context.commit(UPD_VERIFICA_DATI_RETTIFICA, params)
  },

  [OSS_AVV_SCADENZA_SALVA_ATTRIBUTI] (context, params) {
    context.commit(UPD_ATTRIB_OSS_AVV_SCADENZA, params)
  },

  [OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI] (context, params) {
    context.commit(UPD_DATI_ANAGRAFICI_OSS_AVV_SCADENZA, params)
  },

  async [OSS_AVV_SCADENZA_CREA] (context, params) {
    const { data } = await OssAvvisoScadenzaService.crea(params)
    return { data }
  },

  async [OSS_AVV_SCADENZA_CARICA_ALLEGATO] (context, params) {
    const { data } = await OssAvvisoScadenzaService.caricaAllegato(params)
    data.upFile = params.get('upFile')
    return context.commit(ADD_ALLEGATO_OSS_AVV_SCADENZA, data)
  },

  async [OSS_AVV_SCADENZA_ELIMINA_ALLEGATO] (context, params) {
    const slug = params.slug
    delete params.slug
    await OssAvvisoScadenzaService.eliminaAllegato(slug, params)
    return context.commit(REM_ALLEGATO_OSS_AVV_SCADENZA, slug)
  },
  async [OSS_AVV_SCADENZA_LIST_AUTENTICATI] (context, params) {
    const { data } = await OssAvvisoScadenzaService.avvisiAutenticati(params)
    context.commit(UPD_OSS_AVV_SCADENZA_LIST_AUTENTICATI, lista(data))
    return { data }
  }
}

const mutations = {
  [SET_AVVISO_SCADENZA] (state, avvisoScadenza) {
    state.avvisoScadenza = avvisoScadenza
  },

  [INIT_STATE_OSS_AVV_SCADENZA] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }

    state.ossAvvScadDatiAnagRett = {
      value: false,
      codiceFiscale: '',
      cognomeDenominazione: '',
      nome: '',
      domicilioFiscale: '',
      indirizzo: ''
    }

    state.ossAvvScadenzaAllegati = []

    state.attributiOssAvvScad = {
      datiVeicoloRettifica: {
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
        emissCo2: ''
      },
      isNotIntestatario: { value: false },
      venduto: { value: false, data: '', concessionario: false },
      radiato: { value: false, data: '' },
      disponibilitaPrivata: { value: false, dal: '', al: '' },
      esenzioni: {
        disabili: { value: false, del: '', protocollo: '' },
        impiantoGplMetano: { value: false, data: '' },
        altroMotivo: { value: false, testo: '' }
      },
      trasferimentoRegione: { value: false, data: '' },
      radiatoDemolizione: { value: false, data: '' }
    }
  },

  [UPD_ATTRIB_OSS_AVV_SCADENZA] (state, pAttrOssAvv) {
    state.attributiOssAvvScad.datiVeicoloRettifica = pAttrOssAvv.datiVeicoloRettifica
    state.attributiOssAvvScad.isNotIntestatario = pAttrOssAvv.isNotIntestatario
    state.attributiOssAvvScad.venduto = pAttrOssAvv.venduto
    state.attributiOssAvvScad.radiato = pAttrOssAvv.radiato
    state.attributiOssAvvScad.disponibilitaPrivata = pAttrOssAvv.disponibilitaPrivata
    state.attributiOssAvvScad.esenzioni = pAttrOssAvv.esenzioni
    state.attributiOssAvvScad.trasferimentoRegione = pAttrOssAvv.trasferimentoRegione
    state.attributiOssAvvScad.radiatoDemolizione = pAttrOssAvv.radiatoDemolizione
  },

  [UPD_VERIFICA_DATI_RETTIFICA] (state, params) {
    state.errorRettifica = params
  },

  [UPD_DATI_ANAGRAFICI_OSS_AVV_SCADENZA] (state, pOssAvvScadDatiAnagRett) {
    if (!pOssAvvScadDatiAnagRett.codiceFiscale) state.ossAvvScadDatiAnagRett.codiceFiscale = pOssAvvScadDatiAnagRett.codiceFiscale
    if (!pOssAvvScadDatiAnagRett.domicilioFiscale) state.ossAvvScadDatiAnagRett.domicilioFiscale = pOssAvvScadDatiAnagRett.domicilioFiscale
    if (!pOssAvvScadDatiAnagRett.cognomeDenominazione) state.ossAvvScadDatiAnagRett.cognomeDenominazione = pOssAvvScadDatiAnagRett.cognomeDenominazione
    if (!pOssAvvScadDatiAnagRett.nome) state.ossAvvScadDatiAnagRett.nome = pOssAvvScadDatiAnagRett.nome
    if (!pOssAvvScadDatiAnagRett.indirizzo) state.ossAvvScadDatiAnagRett.indirizzo = pOssAvvScadDatiAnagRett.indirizzo
  },

  [ADD_ALLEGATO_OSS_AVV_SCADENZA] (state, allegato) {
    state.ossAvvScadenzaAllegati.push(allegato)
  },

  [REM_ALLEGATO_OSS_AVV_SCADENZA] (state, identificativoArchivio) {
    const itemIdx = state.ossAvvScadenzaAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))

    if (itemIdx === -1) return
    state.ossAvvScadenzaAllegati.splice(itemIdx, 1)
  },
  [UPD_OSS_AVV_SCADENZA_LIST_AUTENTICATI] (state, listaAvvisiAuthResponse) {
    state.listaAvvisiScaAuth = listaAvvisiAuthResponse
  }
}

const getters = {
  attributiOssAvvScad (state) {
    return state.attributiOssAvvScad
  },

  avvisoScadenza (state) {
    return state.avvisoScadenza
  },

  ossAvvScadDatiAnagRett (state) {
    return state.ossAvvScadDatiAnagRett
  },

  ossAvvScadenzaAllegati (state) {
    return state.ossAvvScadenzaAllegati
  },

  errorRettifica (state) {
    return state.errorRettifica
  },
  listaAvvisiScaAuth (state) {
    return state.listaAvvisiScaAuth
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
