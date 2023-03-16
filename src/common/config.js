export default {}

export const SERVICE_WORKER_NAME = 'tassa-auto-service-worker.js'
export const API_URL = process.env.API_URL
export const AUTH_API_URL = process.env.AUTH_API_URL
export const AUTH_AREA_URL = process.env.AUTH_AREA_URL
export const CUSTOMER_SATISFACTION_URL = process.env.CUSTOMER_SATISFACTION_URL
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY
export const NO_RECAPTCHA_ATTEMPTS = 5 // indica il numero di tentativi falliti di sottomissione di un form prima che appaio il recaptcha
export const PAGE_ENV = process.env.NODE_ENV

export const PIEMONTE_TU_URL = process.env.PIEMONTE_TU_URL

export const PIEMONTE_TU_URL_LOGGED = process.env.PIEMONTE_TU_URL_LOGGED

export const REGIONE_ABILITATA = (process.env.TARGET_REGION === undefined) ? 'piemonte' : process.env.TARGET_REGION
export const REGIONE_PARAMS = require('./regioni/config.' + REGIONE_ABILITATA)

const SERVIZI_ABILITATI = REGIONE_PARAMS.SERVIZI_ABILITATI

const DESCRIZIONI_LINK_SERVIZI = REGIONE_PARAMS.DESCRIZIONI_LINK_SERVIZI

const SERVIZI_AUTENTICATI = REGIONE_PARAMS.SERVIZI_AUTENTICATI

// ALLEGATO_MAX_SIZE, valore espresso in MegaBytes
// 4 Mb valore ottenuto dopo presentazione in Regione Piemonte
// Impostato a 2 Mb come richiesto in http://jiraprod.csi.it:8083/browse/STASP-371
export const ALLEGATO_MAX_SIZE = 2

export const ALLEGATI_MAX_NUM = 20
export const ALLEGATO_FILE_TYPES = ['pdf', 'tif', 'jpg', 'jpeg', 'docx', 'pptx', 'odt', 'ods', 'odp', 'odg', 'odb', 'txt']

export const CELL_MAX_LENGTH = 10
export const CELL_MIN_LENGTH = 9

export const COD_FISCALE_MIN_LENGTH = 11
export const COD_FISCALE_MAX_LENGTH = 16

export const IBAN_MIN_LENGTH = 15 // anche IBAN estero
export const IBAN_MAX_LENGTH = 32

export const IUV_LENGTH = 25 // Codice IUV nel caso di pagamenti attivati preso l'Ente Creditore (Structured Creditor Reference)

export const NUM_PROTOCOLLO_MAX_LENGTH = 15 // info ottenuta in riunione
export const NUM_PROTOCOLLO_RATE_MAX = 30

export const PIANO_RATEIZZAZIONE_MAX_LENGTH = 15 // da vedere

export const PAGO_RATE_NUM_RIFERIMENTO_MAX_LENGTH = 8

export const TARGA_MAX_LENGTH = 8
export const TELAIO_MAX_LENGTH = 18
export const MAX_SIZE_CHECKBOX_VERSAMENTI = 2

export const VIDEO_TUTORIAL_URL = REGIONE_PARAMS.VIDEO_TUTORIAL_URL

export const ORDINE_SERVIZI = [
  {
    id: 1,
    codice: 'VISURE',
    tags: ['visure'],
    displayAuth: false
  },
  {
    id: 2,
    codice: 'MEMOBOLLO',
    tags: ['memo_bollo'],
    displayAuth: true
  },
  {
    id: 3,
    codice: 'PAGAONLINE',
    tags: ['pago_bollo', 'pago_rate'],
    displayAuth: true
  },
  {
    id: 4,
    codice: 'SCARICARIC',
    tags: ['ricevuta_bollo'],
    displayAuth: true
  },
  {
    id: 5,
    codice: 'INSOSSERVA',
    tags: ['osservazione_avviso_scadenza', 'osservazione_avviso_bonario', 'osservazione_avviso_accertamento'],
    displayAuth: true
  },
  {
    id: 6,
    codice: 'CONSULTAPR',
    tags: ['osservazione_avviso_scadenza', 'osservazione_avviso_bonario', 'osservazione_avviso_accertamento', 'consulta_pratica_rateizzazione', 'domanda_discarico_rimborso', 'esenzioni_disabili', 'restituzione_tassa'],
    displayAuth: true
  },
  {
    id: 7,
    codice: 'INSRATEIZZ',
    tags: ['rateizzazione'],
    displayAuth: true
  },
  {
    id: 8,
    codice: 'INSDISCRIM',
    tags: ['domanda_discarico_rimborso'],
    displayAuth: true
  },
  {
    id: 9,
    codice: 'INFOBOLLO',
    tags: ['info_bollo'],
    displayAuth: true
  },
  {
    id: 10,
    codice: 'STAMPAAVVI',
    tags: ['stampa_avviso_accertamento', 'stampa_avviso_scadenza', 'stampa_piano_rateizzazione'],
    displayAuth: true
  },
  {
    id: 11,
    codice: 'INSESENZ',
    tags: ['esenzioni_disabili'],
    displayAuth: true
  },
  {
    id: 12,
    codice: 'INDREST',
    tags: ['restituzione_tassa'],
    displayAuth: true
  },
  {
    id: 13,
    codice: 'CALCOLOBOL',
    tags: ['calcolo_bollo'],
    displayAuth: true
  },
  {
    id: 16,
    codice: 'AIUTO',
    tags: ['contatti_aiuto'],
    displayAuth: true
  }
]
const VIDEO_SERVIZI = REGIONE_PARAMS.VIDEO_SERVIZI

export function servizioAttivo (nome) {
  return SERVIZI_ABILITATI[nome]
}

export function servizioAuth (nome) {
  return SERVIZI_AUTENTICATI[nome]
}

export function descrizioniLinkServizio (nome) {
  return DESCRIZIONI_LINK_SERVIZI[nome]
}

export function emailAttiva () {
  return REGIONE_PARAMS.CANALE_EMAIL
}

export function smsAttivo () {
  return REGIONE_PARAMS.CANALE_SMS
}

export function checkDimenAllegato (fileSize) {
  if ((fileSize / 1024 / 1024) > ALLEGATO_MAX_SIZE) return false
  return true
}

export function checkTipoAllegato (fileExt) {
  if (ALLEGATO_FILE_TYPES.indexOf(fileExt) === -1) return false
  return true
}

export function tipiAllegatoString () {
  let tipiAllegato = ''
  for (let i = 0; i < ALLEGATO_FILE_TYPES.length; i++) {
    tipiAllegato += ALLEGATO_FILE_TYPES[i]
    if (i < ALLEGATO_FILE_TYPES.length - 1) {
      tipiAllegato += ', '
    }
  }
  return tipiAllegato
}

export function videoServizio (nome) {
  return VIDEO_SERVIZI[nome]
}
