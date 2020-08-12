import { VeicoloService } from '@/common/api/tassa-auto'
import {
  CATEGORIE_EURO_LISTA,
  COMBUSTIBILI_LISTA,
  VEICOLO_LISTA,
  VEICOLO_LISTA_FILTRATA
} from './actions.type'

import {
  SET_CATEGORIE_EURO_LISTA,
  SET_COMBUSTIBILI_LISTA,
  SET_VEICOLO_LISTA_FILTRATA
} from './mutations.type'

const initialState = {
  veicoloCategoriaEuro: null,
  veicoloCombustibili: null,
  veicoloListaFiltrata: null
}

export const state = { ...initialState }

function listaConLabel (data) {
  const lista = [{ text: 'Seleziona', value: null }]
  for (const idx in data) {
    lista.push({ text: data[idx].descrizione, value: data[idx].codice })
  }
  return lista
}

export const actions = {
  async [CATEGORIE_EURO_LISTA] (context) {
    const { data } = await VeicoloService.listaCategorieEuro()
    context.commit(SET_CATEGORIE_EURO_LISTA, listaConLabel(data))
  },

  async [COMBUSTIBILI_LISTA] (context) {
    const { data } = await VeicoloService.listaCombustibili()
    context.commit(SET_COMBUSTIBILI_LISTA, listaConLabel(data))
  },

  async [VEICOLO_LISTA_FILTRATA] (context) {
    const { data } = await VeicoloService.listaVeicoli({ filtro: 'true' })
    const listVeic = listaConLabel(data)
    context.commit(SET_VEICOLO_LISTA_FILTRATA, listVeic)
    return listVeic
  },

  async [VEICOLO_LISTA] (context, params) {
    const { data } = await VeicoloService.listaVeicoli(params)
    return listaConLabel(data)
  }
}

const mutations = {
  [SET_CATEGORIE_EURO_LISTA] (state, pVeicoloCategoriaEuro) {
    state.veicoloCategoriaEuro = pVeicoloCategoriaEuro
  },

  [SET_COMBUSTIBILI_LISTA] (state, pVeicoloCombustibili) {
    state.veicoloCombustibili = pVeicoloCombustibili
  },

  [SET_VEICOLO_LISTA_FILTRATA] (state, pVeicoloListaFiltrata) {
    state.veicoloListaFiltrata = pVeicoloListaFiltrata
  }
}

const getters = {
  veicoloCategoriaEuro (state) {
    return state.veicoloCategoriaEuro
  },

  veicoloCombustibili (state) {
    return state.veicoloCombustibili
  },

  veicoloListaFiltrata (state) {
    return state.veicoloListaFiltrata
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
