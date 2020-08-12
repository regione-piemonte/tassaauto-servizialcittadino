export default {}

export const SERVICE_WORKER_NAME = 'tassa-auto-service-worker.js'
export const API_URL = process.env.API_URL
export const CUSTOMER_SATISFACTION_URL = process.env.CUSTOMER_SATISFACTION_URL
export const AUTH_AREA_URL = process.env.AUTH_AREA_URL
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY
export const NO_RECAPTCHA_ATTEMPTS = 5 // indica il numero di tentativi falliti di sottomissione di un form prima che appaio il recaptcha

export const REGIONE_ABILITATA = (process.env.TARGET_REGION === undefined) ? 'piemonte' : process.env.TARGET_REGION
export const REGIONE_PARAMS = require('./regioni/config.' + REGIONE_ABILITATA)

const SERVIZI_ABILITATI = REGIONE_PARAMS.SERVIZI_ABILITATI

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

export const PAGO_RATE_NUM_RIFERIMENTO_MAX_LENGTH = 8

export const TARGA_MAX_LENGTH = 8
export const TELAIO_MAX_LENGTH = 18

export const VIDEO_VH_PATH = '/video'

const VIDEO_SERVIZI = REGIONE_PARAMS.VIDEO_SERVIZI

export function servizioAttivo (nome) {
  return SERVIZI_ABILITATI[nome]
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
  for (var i = 0; i < ALLEGATO_FILE_TYPES.length; i++) {
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
