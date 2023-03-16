import Vue from 'vue'
import { NotificheAuthService } from '@/common/api/tassa-auto'
import { NOTIFICHE_LISTA_NON_LETTE, NOTIFICHE_LISTA_LETTE, DETTAGLIO_NOTIFICA, NOTIFICHE_RESET_STATE, ELIMINA_NOTIFICA, MODIFICA_NOTIFICA } from './actions.type'
import { SET_NOTIFICHE_LISTA_NON_LETTE, SET_NOTIFICHE_LISTA_LETTE, SET_DETTAGLIO_NOTIFICA, INITIAL_STATE_NOTIFICHE, RIMUOVI_NOTIFICA } from './mutations.type'

const initialState = {
  notificheListaNonLette: [],
  notificheListaLette: [],
  dettaglioNotifica: {}
}

export const state = { ...initialState }

export const actions = {
  [NOTIFICHE_RESET_STATE] ({ commit }) {
    commit(INITIAL_STATE_NOTIFICHE)
  },
  async [NOTIFICHE_LISTA_NON_LETTE] (context, params) {
    const { data } = await NotificheAuthService.listaNotificheNonLette(params)
    context.commit(SET_NOTIFICHE_LISTA_NON_LETTE, data)
  },
  async [NOTIFICHE_LISTA_LETTE] (context, params) {
    const { data } = await NotificheAuthService.listaNotificheLette(params)
    context.commit(SET_NOTIFICHE_LISTA_LETTE, data)
  },
  async [DETTAGLIO_NOTIFICA] (context, params) {
    context.commit(SET_DETTAGLIO_NOTIFICA, params)
  },
  async [ELIMINA_NOTIFICA] (context, params) {
    await NotificheAuthService.eliminaNotifica(params)
    return context.commit(RIMUOVI_NOTIFICA, { id: params.id, read: params.read })
  },
  async [MODIFICA_NOTIFICA] (context, params) {
    await NotificheAuthService.modificaNotifica(params)
    await context.dispatch(NOTIFICHE_LISTA_NON_LETTE, params.cf)
    await context.dispatch(NOTIFICHE_LISTA_LETTE, params.cf)
  }
}

export const mutations = {
  [SET_NOTIFICHE_LISTA_NON_LETTE] (state, notificheListaNonLette) {
    state.notificheListaNonLette = notificheListaNonLette
  },
  [SET_NOTIFICHE_LISTA_LETTE] (state, notificheListaLette) {
    state.notificheListaLette = notificheListaLette
  },
  [SET_DETTAGLIO_NOTIFICA] (state, dettaglio) {
    state.dettaglioNotifica = dettaglio
  },
  [RIMUOVI_NOTIFICA] (state, params) {
    const read = params.read
    const id = params.id
    if (read) {
      const itemIdx = state.notificheListaLette.findIndex(
        p => (p.id === id))
      if (itemIdx === -1) return
      state.notificheListaLette.splice(itemIdx, 1)
    } else {
      const itemIdx = state.notificheListaNonLette.findIndex(
        p => (p.id === id))
      if (itemIdx === -1) return
      state.notificheListaNonLette.splice(itemIdx, 1)
    }
  },
  [INITIAL_STATE_NOTIFICHE] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  notificheListaNonLette (state) {
    return state.notificheListaNonLette
  },
  notificheListaLette (state) {
    return state.notificheListaLette
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
