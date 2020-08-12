import Vue from 'vue'
import { OssAvvisoScadenzaService } from '@/common/api/tassa-auto'
import {
  OSS_AVV_SCADENZA_RESET_STATE,
  AVV_SCADENZA_CERCA,
  OSS_AVV_SCADENZA_SALVA_ATTRIBUTI,
  OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI,
  OSS_AVV_SCADENZA_CREA,
  OSS_AVV_SCADENZA_CARICA_ALLEGATO,
  OSS_AVV_SCADENZA_ELIMINA_ALLEGATO
} from './actions.type'

import {
  INIT_STATE_OSS_AVV_SCADENZA,
  SET_AVVISO_SCADENZA,
  UPD_ATTRIB_OSS_AVV_SCADENZA,
  ADD_ALLEGATO_OSS_AVV_SCADENZA,
  REM_ALLEGATO_OSS_AVV_SCADENZA,
  UPD_DATI_ANAGRAFICI_OSS_AVV_SCADENZA
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
    codiceFiscale: '',
    cognomeDenominazione: '',
    nome: '',
    domicilioFiscale: '',
    indirizzo: ''
  },
  ossAvvScadenzaAllegati: []
}

export const state = { ...initialState }

export const actions = {
  [OSS_AVV_SCADENZA_RESET_STATE] ({ commit }) {
    commit(INIT_STATE_OSS_AVV_SCADENZA)
  },

  async [AVV_SCADENZA_CERCA] (context, params) {
    context.commit(INIT_STATE_OSS_AVV_SCADENZA)
    const { data } = await OssAvvisoScadenzaService.cerca(params)
    context.commit(SET_AVVISO_SCADENZA, data)
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

  [UPD_DATI_ANAGRAFICI_OSS_AVV_SCADENZA] (state, pOssAvvScadDatiAnagRett) {
    state.ossAvvScadDatiAnagRett = pOssAvvScadDatiAnagRett
  },

  [ADD_ALLEGATO_OSS_AVV_SCADENZA] (state, allegato) {
    state.ossAvvScadenzaAllegati.push(allegato)
  },

  [REM_ALLEGATO_OSS_AVV_SCADENZA] (state, identificativoArchivio) {
    const itemIdx = state.ossAvvScadenzaAllegati.findIndex(
      p => (p.identificativoArchivio === identificativoArchivio))

    if (itemIdx === -1) return
    state.ossAvvScadenzaAllegati.splice(itemIdx, 1)
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
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
