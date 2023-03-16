import axios from 'axios'
import { API_URL, AUTH_API_URL } from '@/common/config'

import {
  axiosPublicInstance,
  axiosAuthAreaInstance,
  axiosAuthApiInstance
} from '@/plugins/axios'

const ApiService = {

  query (resource, params) {
    params.data = ''
    return axiosPublicInstance.get(`${resource}`, params)
  },

  get (resource, slug, params) {
    return axiosPublicInstance.get(`${resource}/${slug}`, params)
  },

  post (resource, params, config) {
    return axiosPublicInstance.post(`${resource}`, params, config)
  },

  put (resource, params, config) {
    return axiosPublicInstance.put(`${resource}`, params, config)
  },

  delete (resource, slug, params) {
    return axiosPublicInstance.delete(`${resource}/${slug}`, params)
  },

  attach (resource, formData) {
    /*
    for (var [key, value] of formData.entries()) {
      console.log(key, value)
    }
    */

    return axios.create().post(
      `${API_URL}${resource}`,
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: formData
      }
    )
  }
}

const AuthApiService = {

  query (resource, params) {
    params.data = ''
    return axiosAuthApiInstance.get(`${resource}`, params)
  },

  get (resource, slug, params) {
    return axiosAuthApiInstance.get(`${resource}/${slug}`, params)
  },

  post (resource, params, config) {
    return axiosAuthApiInstance.post(`${resource}`, params, config)
  },

  put (resource, params, config) {
    return axiosAuthApiInstance.put(`${resource}`, params, config)
  },

  delete (resource, slug, params) {
    return axiosAuthApiInstance.delete(`${resource}/${slug}`, params)
  },

  attach (resource, formData) {
    for (var [key, value] of formData.entries()) {
      console.log(key, value)
    }
    return axios.create().post(
      `${AUTH_API_URL}${resource}`,
      formData, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        params: formData
      }
    )
  }
}

export default ApiService

export const BffService = {
  identitaUtente () {
    return axiosAuthAreaInstance.get('bff/identity')
  }
}

export const CalcoloService = {
  calcolaImporto (params) {
    return ApiService.query('bollo/calcola', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  }
}

export const CommonService = {
  scaricaInformativaPrivacy () {
    return ApiService.query('common/informativaPrivacy', { headers: { 'Content-Type': 'application/json' } })
  },
  gradiParentela () {
    return ApiService.query('common/gradi-parentela', { headers: { 'Content-Type': 'application/json' } })
  },
  nazioni () {
    return ApiService.query('common/nazioni', { headers: { 'Content-Type': 'application/json' } })
  },
  province () {
    return ApiService.query('common/province', { headers: { 'Content-Type': 'application/json' } })
  },
  comuni (codProv) {
    const resource = `common/comuni/${codProv}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    return ApiService.query(resource, qParams)
  },
  parametri (param) {
    const resource = `common/parametri?paramName=${param}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    return ApiService.query(resource, qParams)
  },
  messages () {
    return ApiService.query('messages', { headers: { 'Content-Type': 'application/json' } })
  },
  message (id) {
    const resource = `messages/${id}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    return ApiService.query(resource, qParams)
  },
  contribuenti (params) {
    const resource = `contribuenti/${params}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    // return ApiService.query(resource, qParams)
    return AuthApiService.query(resource, qParams)
  },
  servizi () {
    const resource = 'servizi'
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    return ApiService.query(resource, qParams)
  },
  serviziPreferiti (cf) {
    const resource = `servizi/${cf}/preferiti`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  modificaServiziPreferiti (params) {
    const resource = `servizi/${params.cf}/preferiti/${params.codice}/aggiungi`
    return AuthApiService.post(
      resource,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    )
  },
  eliminaServiziPreferiti (params) {
    return AuthApiService.delete(
      `servizi/${params.cf}/preferiti`,
      `${params.codice}/rimuovi`,
      {
        headers: { 'Content-Type': 'application/json' },
        params: { },
        data: ''
      }
    )
  }
}

export const InfoService = {
  verificaEmail (params) {
    return ApiService.query('infoBollo/email/verifica', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  richiediAttEmail (params) {
    return ApiService.post(
      'infoBollo/email/richiestaAttivazione',
      params,
      { headers: { 'Content-Type': 'application/json' } }
    )
  },
  richiediRevEmail (params) {
    return ApiService.post('infoBollo/email/richiestaRevoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  attivaEmail (params) {
    return ApiService.put('infoBollo/email/attivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  revocaEmail (params) {
    return ApiService.put('infoBollo/email/revoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  verificaSms (params) {
    return ApiService.query('infoBollo/sms/verifica', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  richiediAttSms (params) {
    return ApiService.post('infoBollo/sms/richiestaAttivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  richiediRevSms (params) {
    return ApiService.post('infoBollo/sms/richiestaRevoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  attivaSms (params) {
    return ApiService.put('infoBollo/sms/attivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  revocaSms (params) {
    return ApiService.put('infoBollo/sms/revoca', params, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const MemoService = {
  verifica (params) {
    return ApiService.query('memoBollo/verifica', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  richiediAttEmail (params) {
    return ApiService.post('memoBollo/email/richiestaAttivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  richiediRevEmail (params) {
    return ApiService.post('memoBollo/email/richiestaRevoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  attivaEmail (params) {
    return ApiService.put('memoBollo/email/attivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  richiediAttSms (params) {
    return ApiService.post('memoBollo/sms/richiestaAttivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  richiediRevSms (params) {
    return ApiService.post('memoBollo/sms/richiestaRevoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  attivaSms (params) {
    return ApiService.put('memoBollo/sms/attivazione', params, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const OssAvvisoAccertamentoService = {
  cerca (params) {
    return ApiService.query('osservazione/accertamento/cerca', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  crea (params) {
    return ApiService.post('osservazione/accertamento', params, { headers: { 'Content-Type': 'application/json' } })
  },
  caricaAllegato (params) {
    return ApiService.attach('osservazione/accertamento/allegato', params)
  },
  eliminaAllegato (slug, params) {
    return ApiService.delete(
      'osservazione/accertamento/allegato',
      slug, {
        headers: { 'Content-Type': 'application/json' },
        params: params,
        data: ''
      }
    )
  },
  avvisiAutenticati (params) {
    const resource = `contribuenti/${params}/avvisi?tipo=MEMOR`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const OssAvvisoScadenzaService = {
  cerca (params) {
    return ApiService.query('osservazione/scadenza/cerca', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  crea (params) {
    return ApiService.post('osservazione/scadenza', params, { headers: { 'Content-Type': 'application/json' } })
  },
  caricaAllegato (params) {
    return ApiService.attach('osservazione/scadenza/allegato', params)
  },
  eliminaAllegato (slug, params) {
    return ApiService.delete(
      'osservazione/scadenza/allegato',
      slug, {
        headers: { 'Content-Type': 'application/json' },
        params: params,
        data: ''
      }
    )
  },
  avvisiAutenticati (params) {
    const resource = `contribuenti/${params}/avvisi?tipo=OSSER`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const OssAvvisoBonarioService = {
  cerca (params) {
    return ApiService.query('osservazione/avviso/bonario/cerca', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  crea (params) {
    return ApiService.post('osservazione/avviso/bonario', params, { headers: { 'Content-Type': 'application/json' } })
  },
  caricaAllegato (params) {
    return ApiService.attach('osservazione/avviso/bonario/allegato', params)
  },
  eliminaAllegato (slug, params) {
    return ApiService.delete(
      'osservazione/avviso/bonario/allegato',
      slug, {
        headers: { 'Content-Type': 'application/json' },
        params: params,
        data: ''
      }
    )
  },
  avvisiAutenticati (params) {
    const resource = `contribuenti/${params}/avvisi?tipo=BONAR`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const PagobolloService = {
  calcoloIuv (slug) {
    return ApiService.get(
      'pagamento/calcolo/iuv',
      slug,
      {
        headers: { 'Content-Type': 'application/json' },
        data: ''
      })
  },
  calcoloRinnovo (params) {
    return ApiService.query('pagamento/calcolo/rinnovo', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  controlloScadenza (params) {
    return ApiService.query('pagamento/controllo/scadenza', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  listaMesiScadenza () {
    return ApiService.query('pagamento/scadenza/mesi', { headers: { 'Content-Type': 'application/json' } })
  },
  listaAnniScadenza () {
    return ApiService.query('pagamento/scadenza/anni', { headers: { 'Content-Type': 'application/json' } })
  },
  listaMesiValiditaScadenza () {
    return ApiService.query('pagamento/scadenza/validita', { headers: { 'Content-Type': 'application/json' } })
  },
  calcoloScadenza (params) {
    return ApiService.query('pagamento/calcolo/scadenza', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  limiteCarrello () {
    return ApiService.query('pagamento/carrello/limite', { headers: { 'Content-Type': 'application/json' } })
  },
  creaTransazionePagoPA (params) {
    return ApiService.post('pagamento/transazione/crea', params, { headers: { 'Content-Type': 'application/json' } })
  },
  transazionePagoPA (slug) {
    return ApiService.get(
      'pagamento/transazione/riepilogo',
      slug,
      { headers: { 'Content-Type': 'application/json' }, data: '' })
  }
}

export const PagorateService = {
  cercaRate (params) {
    return ApiService.query(
      'pagamento/rata', {
        headers: { 'Content-Type': 'application/json' },
        params: params
      })
  },
  calcoloTotaleRate (params) {
    return ApiService.post(
      'pagamento/rata/calcola/pagamento',
      params,
      { headers: { 'Content-Type': 'application/json' } }
    )
  },
  creaTransazionePagoPA (params) {
    return ApiService.post('pagamento/paga/rata', params, { headers: { 'Content-Type': 'application/json' } })
  },
  transazionePagoPA (slug) {
    return ApiService.get(
      'pagamento/transazione/riepilogo',
      slug,
      { headers: { 'Content-Type': 'application/json' }, data: '' })
  },
  rateizzazioniAutenticati (cf) {
    const resource = `contribuenti/${cf}/rateizzazioni`
    const qParams = {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const PraticaService = {
  scaricaAllegato (slug, params) {
    return ApiService.query(`verificaPratica/allegato/${slug}`, {
      params: params,
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/octet-stream',
        'Content-Type': 'application/json'
      }
    })
  },
  cercaOsservazione (params) {
    return ApiService.query('verificaPratica/cercaOsservazione', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  modificaRifOsservazione (params) {
    return ApiService.post('verificaPratica/modificaOsservazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  modificaRifOssAvvAccertamento (params) {
    return ApiService.post('verificaPratica/modificaAccertamento', params, { headers: { 'Content-Type': 'application/json' } })
  },
  cercaRateizzazione (params) {
    return ApiService.query('verificaPratica/cercaRateizzazione', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  modificaRifRateizzazione (params) {
    return ApiService.post('verificaPratica/modificaDomandaRateizzazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  verificaTipologia (params) {
    return ApiService.query('verificaPratica/tipologia', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  cercaAccertamento (params) {
    return ApiService.query('verificaPratica/cercaAccertamento', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  cercaBonario (params) {
    return ApiService.query('verificaPratica/cerca/avvisoBonario', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  modificaRifAccertamento (params) {
    return ApiService.post('verificaPratica/modificaAccertamento', params, { headers: { 'Content-Type': 'application/json' } })
  },
  modificaRifBonario (params) {
    return ApiService.put('verificaPratica/aggiorna/avvisoBonario', params, { headers: { 'Content-Type': 'application/json' } })
  },
  cercaDomandaDiscarico (params) {
    return ApiService.query('/verificaPratica/cercaDTE', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  modificaRifDiscaricoRimborso (params) {
    return ApiService.post('verificaPratica/modificaDte', params, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const DomandaDiscaricoRimborsoService = {
  cercaDomandaDiscaricoRimborso (resource) {
    return ApiService.query(`discarico/cerca?identificativo=${resource}`, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  listaNumeriIngiunzione (params) {
    return ApiService.query('discarico/numero/ingiunzione', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },

  listaCodiciTributo () {
    return ApiService.query('discarico/codici/tributo',
      { headers: { 'Content-Type': 'application/json' } })
  },

  caricaAllegato (params) {
    return ApiService.attach('discarico/allegato', params)
  },

  eliminaAllegato (slug, params) {
    return ApiService.delete(
      `discarico/allegato/${slug}`, params,
      {
        headers: { 'Content-Type': 'application/json' },
        data: ''
      }
    )
  },

  inviaDomanda (params) {
    return ApiService.post(
      'discarico',
      params,
      { headers: { 'Content-Type': 'application/json' } })
  }
}

export const RicevutaService = {
  get (slug) {
    return ApiService.get(
      'ricevuta',
      slug,
      {
        headers: { 'Content-Type': 'application/json' },
        data: ''
      })
  },

  scaricaPdfPagoBollo (params) {
    return ApiService.query('ricevuta/scaricaPdf', {
      params: params,
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/pdf',
        'Content-Type': 'application/json'
      }
    })
  },

  scaricaPdfPagoRate (params) {
    return ApiService.query('ricevuta/rata/scaricaPdf', {
      params: params,
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/pdf',
        'Content-Type': 'application/json'
      }
    })
  },
  iuvsAutenticati (params) {
    const resource = `contribuenti/${params.cf}/iuvs?anno=${params.anno}&tipo=${params.tipo}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const RateizzazioneService = {
  cercaRateizzazioneIntestatario (params) {
    return ApiService.query(
      'rateizzazione/proprietario/conferma',
      {
        headers: { 'Content-Type': 'application/json' },
        params: params
      })
  },
  cercaDatiRateizzazione (slug) {
    return ApiService.get(
      'rateizzazione/proprietario/cerca',
      slug,
      {
        headers: { 'Content-Type': 'application/json' },
        data: ''
      })
  },
  caricaAllegato (params) {
    return ApiService.attach('rateizzazione/allegato', params)
  },
  eliminaAllegato (slug, params) {
    return ApiService.delete(
      'rateizzazione/allegato',
      slug, {
        headers: { 'Content-Type': 'application/json' },
        params: params,
        data: ''
      }
    )
  },
  listaFasceRata () {
    return ApiService.query(
      'rateizzazione/fasce',
      { headers: { 'Content-Type': 'application/json' } })
  },
  creaRateizzazioneAvviso (params) {
    return ApiService.post(
      'rateizzazione/avviso',
      params,
      { headers: { 'Content-Type': 'application/json' } })
  },
  creaRateizzazioneValida (params) {
    return ApiService.post(
      'rateizzazione/valida',
      params,
      { headers: { 'Content-Type': 'application/json' } })
  }
}

export const StampaAvvAccertamentoService = {
  cercaIuv (slug) {
    return ApiService.get(
      'sintesi/pagamento/accertamento',
      slug,
      {
        headers: { 'Content-Type': 'application/json' },
        data: ''
      })
  },
  cercaDatiVeicolo (params) {
    return ApiService.post(
      'sintesi/pagamento/accertamento',
      params,
      {
        headers: { 'Content-Type': 'application/json' }
      })
  }
}

export const StampaAvvScadenzaService = {
  cercaIuv (slug) {
    return ApiService.get(
      'sintesi/pagamento/scadenza',
      slug,
      {
        headers: { 'Content-Type': 'application/json' },
        data: ''
      })
  },
  cercaDatiVeicolo (params) {
    return ApiService.post(
      'sintesi/pagamento/scadenza',
      params,
      {
        headers: { 'Content-Type': 'application/json' }
      })
  }
}

export const StampaAvvPagamentoService = {
  downloadPdf (params) {
    return ApiService.query(
      'sintesi/download/pdf',
      {
        params: params,
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json'
        }
      })
  },
  downloadLetteraPdf (params) {
    return ApiService.query(
      'sintesi/download/pdf',
      {
        params: params,
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json'
        }
      })
  }
}

export const StampaPianoRateizzazioneService = {
  cercaPianoRateizzazione (params) {
    return ApiService.query('sintesi/pagamento/rata', {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    })
  },
  downloadPdf (params) {
    return ApiService.query(
      'sintesi/download/pdf',
      {
        params: params,
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json'
        }
      })
  }
}

export const VeicoloService = {
  listaCategorieEuro () {
    return ApiService.query(
      'veicolo/categoriaEuro',
      { headers: { 'Content-Type': 'application/json' } })
  },
  listaCombustibili () {
    return ApiService.query(
      'veicolo/combustibile',
      { headers: { 'Content-Type': 'application/json' } })
  },
  listaVeicoli (params) {
    return ApiService.query(
      'veicolo/lista',
      {
        headers: { 'Content-Type': 'application/json' },
        params: params
      })
  }
}

export const EsenzioniDisabiliAuthService = {
  esenzioniContribuenti (cf) {
    const resource = `esenzioni/contribuenti/${cf}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  esenzioniVeicoli (cf) {
    const resource = `esenzioni/${cf}/veicoli`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  caricaAllegato (params) {
    const resource = 'esenzioni/allegati'
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.attach(resource, params)
    }
    return ApiService.attach(resource, params)
    */
    return AuthApiService.attach(resource, params)
  },
  eliminaAllegato (slug, params) {
    const resource = 'esenzioni/allegati'
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.delete(resource, slug, qParams)
    }
    return ApiService.delete(resource, slug, qParams)
    */
    return AuthApiService.delete(resource, slug, qParams)
  },
  creaEsenzioni (params) {
    const resource = 'esenzioni'
    const cfg = { headers: { 'Content-Type': 'application/json' } }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.post(resource, params, cfg)
    }
    return ApiService.post(resource, params, cfg)
    */
    return AuthApiService.post(resource, params, cfg)
  }
}

export const RichiestaTassaAuthService = {
  restituzioniContribuenti (cf) {
    const resource = `restituzioni/contribuenti/${cf}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  restituzioniVeicoli (cf) {
    const resource = `restituzioni/${cf}/veicoli`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  restituzioniVeicoliVersamenti (params) {
    const resource = `restituzioni/veicoli/${params}/versamenti`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  caricaAllegato (params) {
    const resource = 'restituzioni/allegati'
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.attach(resource, params)
    }
    return ApiService.attach(resource, params)
    */
    return AuthApiService.attach(resource, params)
  },
  eliminaAllegato (slug, params) {
    const resource = 'restituzioni/allegati'
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.delete(resource, slug, qParams)
    }
    return ApiService.delete(resource, slug, qParams)
    */
    return AuthApiService.delete(resource, slug, qParams)
  },
  creaEsenzioni (params) {
    const resource = 'restituzioni'
    const cfg = { headers: { 'Content-Type': 'application/json' } }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.post(resource, params, cfg)
    }
    return ApiService.post(resource, params, cfg)
    */
    return AuthApiService.post(resource, params, cfg)
  }
}

export const ConsultaPraticaAuthService = {
  verificaPraticaCercaEsenzione (params) {
    const resource = 'verificaPratica/cercaEsenzione'
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    }
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
  },

  verificaPraticaCercaRestituzione (params) {
    const resource = 'verificaPratica/cercaRestituzione'
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    }
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
  },

  verificaPraticaAggiornaEsenzione (params) {
    const resource = 'verificaPratica/aggiornaEsenzione'
    const cfg = {
      headers: { 'Content-Type': 'application/json' }
    }
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.put(resource, params, cfg)
    }
    return ApiService.put(resource, params, cfg)
  },

  verificaPraticaAggiornaRestituzione (params) {
    const resource = 'verificaPratica/aggiornaRestituzione'
    const cfg = {
      headers: { 'Content-Type': 'application/json' }
    }
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.put(resource, params, cfg)
    }
    return ApiService.put(resource, params, cfg)
  },
  comunicazioniAutenticati (cf) {
    const resource = `contribuenti/${cf}/comunicazioni`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const VisureAuthService = {
  visureElencoVeicoli (cf) {
    const resource = `visure/contribuenti/${cf}/veicoli`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  },
  visureRecuperoKey (params) {
    const resource = 'visure/contribuenti/veicoli'
    const cfg = { headers: { 'Content-Type': 'application/json' } }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.post(resource, params, cfg)
    }
    return ApiService.post(resource, params, cfg)
    */
    return AuthApiService.post(resource, params, cfg)
  },
  visureDettaglioVeicolo (params) {
    const resource = 'visure/contribuenti/veicoli/pagamenti'
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: params,
      data: ''
    }
    /*
    if (process.env.NODE_ENV === 'production') {
      return AuthApiService.query(resource, qParams)
    }
    return ApiService.query(resource, qParams)
    */
    return AuthApiService.query(resource, qParams)
  }
}

export const NotificheAuthService = {
  listaNotificheLette (cf) {
    const resource = `contribuenti/${cf}/notifiche`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: { read: true },
      data: ''
    }
    // return ApiService.query(resource, qParams)
    return AuthApiService.query(resource, qParams)
  },
  listaNotificheNonLette (cf) {
    const resource = `contribuenti/${cf}/notifiche`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      params: { read: false },
      data: ''
    }
    // return ApiService.query(resource, qParams)
    return AuthApiService.query(resource, qParams)
  },
  dettaglioNotifica (params) {
    const resource = `contribuenti/${params.cf}/notifiche/${params.codice}`
    const qParams = {
      headers: { 'Content-Type': 'application/json' },
      data: ''
    }
    // return ApiService.query(resource, qParams)
    return AuthApiService.query(resource, qParams)
  },
  modificaNotifica (params) {
    return axiosAuthApiInstance.put(
      `contribuenti/${params.cf}/notifiche/${params.id}`,
      { headers: { 'Content-Type': 'application/json' } })
  },
  eliminaNotifica (params) {
    return AuthApiService.delete(
      `contribuenti/${params.cf}/notifiche`,
      `${params.id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        params: { },
        data: ''
      }
    )
  }
}
