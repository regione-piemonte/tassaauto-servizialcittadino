import { BffService, CommonService } from '@/common/api/tassa-auto'
import { localhostUserIdentity } from '@/common/session'
import { isNil } from '@/common/utils'
import {
  COMMON_PRIVACY,
  COMMON_PARAMETRI,
  COMMON_GRADI_PARENTELA,
  COMMON_NAZIONI_ANAGRAFICA,
  COMMON_PROVINCE_ANAGRAFICA,
  COMMON_COMUNI_ANAGRAFICA,
  COMMON_COMUNI_RESIDENZA,
  COMMON_MESSAGES,
  COMMON_DATI_CONTRIBUENTE,
  COMMON_SERVIZI,
  COMMON_SERVIZI_PREFERITI,
  COMMON_MODIFICA_SERVIZI_PREFERITI,
  COMMON_ELIMINA_SERVIZI_PREFERITI,
  UTENTE_CARICA_IDENTITA,
  UTENTE_CARICA,
  UTENTE_LOCALHOST_LOGIN,
  UTENTE_LOCALHOST_LOGOUT,
  TAB_AREA_PERSONALE
} from './actions.type'
import {
  SET_COMMON_PARAMETRI,
  SET_COMMON_GRADI_PARENTELA,
  SET_COMMON_NAZIONI_ANAGRAFICA,
  SET_COMMON_PROVINCE_ANAGRAFICA,
  SET_COMMON_COMUNI_ANAGRAFICA,
  SET_COMMON_COMUNI_RESIDENZA,
  SET_COMMON_MESSAGES,
  SET_IDENTITA_UTENTE,
  SET_RESIDENT,
  SET_COMMON_DATI_CONTRIBUENTE,
  SET_COMMON_SERVIZI,
  SET_COMMON_SERVIZI_PREFERITI,
  RIMUOVI_COMMON_SERVIZI_PREFERITI,
  SET_LOCALHOST_LOGIN,
  PURGE_LOCALHOST_LOGIN,
  SET_TAB_AREA_PERSONALE
} from './mutations.type'

const initialState = {
  tabAreaPersonale: 0,
  gradiParentela: [],
  nazioniAnagrafica: [],
  provinceAnagrafica: [],
  comuniAnagrafica: [],
  comuniResidenza: [],
  commonDatiContribuente: null,
  commonElencoServizi: [],
  commonElencoServiziPreferiti: [],
  userIdentity: undefined, // L'identità dell'utente loggato
  isResident: null,
  isUserLoggedLocalhost: false,
  messages: [],
  parametri: null
}

export const state = { ...initialState }

function listagradiParentela (data) {
  const lista = [{ text: 'Seleziona', value: null }]
  for (const idx in data) {
    lista.push({ text: data[idx].descrizione, value: data[idx] })
  }
  return lista
}

export const actions = {
  async [COMMON_PRIVACY] (context, params) {
    return CommonService.scaricaInformativaPrivacy()
  },
  async [COMMON_MESSAGES] (context) {
    const { data } = await CommonService.messages()
    context.commit(SET_COMMON_MESSAGES, data)
  },
  async [COMMON_GRADI_PARENTELA] (context) {
    const { data } = await CommonService.gradiParentela()
    context.commit(SET_COMMON_GRADI_PARENTELA, listagradiParentela(data))
  },
  async [COMMON_NAZIONI_ANAGRAFICA] (context) {
    const { data } = await CommonService.nazioni()
    context.commit(SET_COMMON_NAZIONI_ANAGRAFICA, listagradiParentela(data))
  },
  async [COMMON_PROVINCE_ANAGRAFICA] (context) {
    const { data } = await CommonService.province()
    context.commit(SET_COMMON_PROVINCE_ANAGRAFICA, listagradiParentela(data))
  },
  async [COMMON_COMUNI_ANAGRAFICA] (context, params) {
    const { data } = await CommonService.comuni(params)
    context.commit(SET_COMMON_COMUNI_ANAGRAFICA, listagradiParentela(data))
  },
  async [COMMON_COMUNI_RESIDENZA] (context, params) {
    const { data } = await CommonService.comuni(params)
    context.commit(SET_COMMON_COMUNI_RESIDENZA, listagradiParentela(data))
  },
  async [COMMON_DATI_CONTRIBUENTE] (context, params) {
    const { data } = await CommonService.contribuenti(params)
    context.commit(SET_COMMON_DATI_CONTRIBUENTE, data)
  },
  async [COMMON_SERVIZI] (context) {
    const { data } = await CommonService.servizi()
    context.commit(SET_COMMON_SERVIZI, data)
  },
  async [COMMON_SERVIZI_PREFERITI] (context, params) {
    const { data } = await CommonService.serviziPreferiti(params)
    context.commit(SET_COMMON_SERVIZI_PREFERITI, data)
  },
  async [COMMON_MODIFICA_SERVIZI_PREFERITI] (context, params) {
    const { data } = await CommonService.modificaServiziPreferiti(params)
    context.commit(SET_COMMON_SERVIZI_PREFERITI, data)
  },
  async [COMMON_ELIMINA_SERVIZI_PREFERITI] (context, params) {
    const { data } = await CommonService.eliminaServiziPreferiti(params)
    context.commit(RIMUOVI_COMMON_SERVIZI_PREFERITI, data)
    const codice = params.codice
    return context.commit(RIMUOVI_COMMON_SERVIZI_PREFERITI, codice)
  },
  async [COMMON_PARAMETRI] (context, params) {
    const { data } = await CommonService.parametri(params)
    context.commit(SET_COMMON_PARAMETRI, data)
  },
  async [UTENTE_CARICA_IDENTITA] (context) {
    let user
    if (process.env.NODE_ENV === 'production') {
      try {
        const response = await BffService.identitaUtente()
        user = response.data
      } catch (e) {
        user = null
      }
    } else {
      user = localhostUserIdentity()
    }
    context.commit(SET_IDENTITA_UTENTE, user)
    return user
  },
  async [UTENTE_CARICA] (context) {
    await context.dispatch(UTENTE_CARICA_IDENTITA)
    return context.getters.userIdentity
  },
  [UTENTE_LOCALHOST_LOGIN] (context) {
    context.commit(SET_LOCALHOST_LOGIN)
    context.commit(SET_IDENTITA_UTENTE, localhostUserIdentity())
  },
  [UTENTE_LOCALHOST_LOGOUT] (context) {
    context.commit(PURGE_LOCALHOST_LOGIN)
    context.commit(SET_IDENTITA_UTENTE, null)
  },
  [TAB_AREA_PERSONALE] (context, params) {
    context.commit(SET_TAB_AREA_PERSONALE, params)
  }
}

export const mutations = {
  [SET_COMMON_PARAMETRI] (state, pParametri) {
    state.parametri = pParametri
  },
  [SET_COMMON_GRADI_PARENTELA] (state, pGradoParentela) {
    state.gradiParentela = pGradoParentela
  },
  [SET_COMMON_MESSAGES] (state, pMessages) {
    state.messages = pMessages
  },
  [SET_COMMON_NAZIONI_ANAGRAFICA] (state, pNazioniAnagrafica) {
    state.nazioniAnagrafica = pNazioniAnagrafica
  },
  [SET_COMMON_PROVINCE_ANAGRAFICA] (state, pProvinceAnagrafica) {
    state.provinceAnagrafica = pProvinceAnagrafica
  },
  [SET_COMMON_COMUNI_ANAGRAFICA] (state, pComuniAnagrafica) {
    state.comuniAnagrafica = pComuniAnagrafica
  },
  [SET_COMMON_COMUNI_RESIDENZA] (state, pComuniResidenza) {
    state.comuniResidenza = pComuniResidenza
  },
  [SET_IDENTITA_UTENTE] (state, userIdentity) {
    state.userIdentity = userIdentity
  },
  [SET_COMMON_DATI_CONTRIBUENTE] (state, commonDatiContribuente) {
    state.commonDatiContribuente = commonDatiContribuente
  },
  [SET_COMMON_SERVIZI] (state, commonElencoServizi) {
    state.commonElencoServizi = commonElencoServizi
  },
  [SET_COMMON_SERVIZI_PREFERITI] (state, commonElencoServiziPreferiti) {
    state.commonElencoServiziPreferiti = commonElencoServiziPreferiti
  },
  [RIMUOVI_COMMON_SERVIZI_PREFERITI] (state, codice) {
    const itemIdx = state.commonElencoServiziPreferiti.findIndex(
      p => (p.codice === codice))
    if (itemIdx === -1) return
    state.commonElencoServiziPreferiti.splice(itemIdx, 1)
  },
  [SET_RESIDENT] (state, pisResident) {
    state.isResident = pisResident
  },
  [SET_LOCALHOST_LOGIN] (state) {
    state.isUserLoggedLocalhost = true
  },
  [SET_TAB_AREA_PERSONALE] (state, codice) {
    state.tabAreaPersonale = codice
  },
  [PURGE_LOCALHOST_LOGIN] (state) {
    state.isUserLoggedLocalhost = false
  }
}

const getters = {
  isUserLogged (state) {
    return !isNil(state.userIdentity)
  },
  isUserLoggedLocalhost (state) {
    return state.isUserLoggedLocalhost
  },
  isResident (state) {
    return state.isResident
  },
  parametri (state) {
    return state.parametri
  },
  gradiParentela (state) {
    return state.gradiParentela
  },
  messages (state) {
    return state.messages
  },
  tabAreaPersonale (state) {
    return state.tabAreaPersonale
  },
  nazioniAnagrafica (state) {
    return state.nazioniAnagrafica
  },
  provinceAnagrafica (state) {
    return state.provinceAnagrafica
  },
  comuniAnagrafica (state) {
    return state.comuniAnagrafica
  },
  comuniResidenza (state) {
    return state.comuniResidenza
  },
  commonDatiContribuente (state) {
    return state.commonDatiContribuente
  },
  commonElencoServizi (state) {
    return state.commonElencoServizi
  },
  commonElencoServiziPreferiti (state) {
    return state.commonElencoServiziPreferiti
  },
  userIdentity (state) {
    return state.userIdentity
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
