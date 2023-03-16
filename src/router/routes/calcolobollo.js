import store from '@/store'
import { BOLLO_CALCOLO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

const CALCOLOBOLLO = {
  path: '/bollo/calcolo',
  component: () => import('@/views/bollo/calcolo/CalcoloBolloHome'),
  meta: { isPublic: cardAutenticata('calcolo_bollo') },
  children: [
    {
      name: 'calcolo_importo',
      path: '',
      component: () => import('@/views/bollo/calcolo/CalcoloImporto'),
      meta: { isPublic: cardAutenticata('calcolo_bollo') },
      beforeEnter (to, from, next) {
        store.dispatch(BOLLO_CALCOLO_RESET_STATE)
        next()
      }
    },
    {
      name: 'esito_calcolo',
      path: 'esito',
      component: () => import('@/views/bollo/calcolo/EsitoCalcolo'),
      meta: { isPublic: cardAutenticata('calcolo_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.esitoCalcoloBollo != null) ? next() : next('/bollo/calcolo')
      }
    }
  ]
}

export default CALCOLOBOLLO
