import store from '@/store'
import { BOLLO_CALCOLO_RESET_STATE } from '@/store/actions.type'

const CALCOLOBOLLO = {
  path: '/bollo/calcolo',
  component: () => import('@/views/bollo/calcolo/CalcoloBolloHome'),
  children: [
    {
      name: 'calcolo_importo',
      path: '',
      component: () => import('@/views/bollo/calcolo/CalcoloImporto'),
      meta: { isPublic: true },
      beforeEnter (to, from, next) {
        store.dispatch(BOLLO_CALCOLO_RESET_STATE)
        next()
      }
    },
    {
      name: 'esito_calcolo',
      path: 'esito',
      component: () => import('@/views/bollo/calcolo/EsitoCalcolo'),
      meta: { isPublic: true },
      beforeEnter (to, from, next) {
        (store.getters.esitoCalcoloBollo != null) ? next() : next('/bollo/calcolo')
      }
    }
  ]
}

export default CALCOLOBOLLO
