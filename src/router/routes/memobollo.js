import store from '@/store'
import { MEMO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

// ATTENZIONE!!! eventuali cambiamenti nei path di Memobollo (conferma - revoca) via email
// devono essere comunicati al gruppo di backend perche' aggiorni i template delle email
// che sono spedite all'utente finale.
const MEMOBOLLO = {
  path: '/bollo/memo',
  component: () => import('@/views/bollo/memo/MemoBolloHome'),
  meta: { isPublic: cardAutenticata('memo_bollo') },
  children: [
    {
      name: 'cerca_veicolo_memo',
      path: '',
      component: () => import('@/views/bollo/memo/CercaVeicolo'),
      meta: { isPublic: cardAutenticata('memo_bollo') },
      beforeEnter (to, from, next) {
        store.dispatch(MEMO_RESET_STATE)
        next()
      }
    },
    {
      name: 'attivazione_memo',
      path: 'attivazione',
      component: () => import('@/views/bollo/memo/AttivazioneMemo'),
      meta: { isPublic: cardAutenticata('memo_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.esitoMemoVerifica != null) ? next() : next('/bollo/memo')
      }
    },
    {
      name: 'conf_attivazione_email_memo',
      path: 'email/attivazione/conferma',
      component: () => import('@/views/bollo/memo/ConfAttivazioneEmailMemo'),
      meta: { isPublic: cardAutenticata('memo_bollo') }
    }
  ]
}

export default MEMOBOLLO
