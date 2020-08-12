import axios from 'axios'
import { API_URL } from '@/common/config'

import { axiosPublicInstance } from '@/plugins/axios'

const ApiService = {

  query (resource, params) {
    params.data = ''
    return axiosPublicInstance.get(`${resource}`, params)
  },

  get (resource, slug = '', params) {
    return axiosPublicInstance.get(`${resource}/${slug}`, params)
  },

  post (resource, params, config) {
    return axiosPublicInstance.post(`${resource}`, params, config)
  },

  put (resource, params, config) {
    return axiosPublicInstance.put(`${resource}`, params, config)
  },

  delete (resource, slug = '', params) {
    return axiosPublicInstance.delete(`${resource}/${slug}`, params)
  },

  attach (resource, formData) {
    for (var [key, value] of formData.entries()) {
      console.log(key, value)
    }

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

export default ApiService

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
  revocaEmail (params) {
    return ApiService.put('memoBollo/email/revoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  richiediAttSms (params) {
    return ApiService.post('memoBollo/sms/richiestaAttivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  richiediRevSms (params) {
    return ApiService.post('memoBollo/sms/richiestaRevoca', params, { headers: { 'Content-Type': 'application/json' } })
  },
  attivaSms (params) {
    return ApiService.put('memoBollo/sms/attivazione', params, { headers: { 'Content-Type': 'application/json' } })
  },
  revocaSms (params) {
    return ApiService.put('memoBollo/sms/revoca', params, { headers: { 'Content-Type': 'application/json' } })
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
  modificaRifAccertamento (params) {
    return ApiService.post('verificaPratica/modificaAccertamento', params, { headers: { 'Content-Type': 'application/json' } })
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
