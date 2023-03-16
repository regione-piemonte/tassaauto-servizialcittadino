import store from '@/store'
import { INFO_RESET_STATE } from '@/store/actions.type'
import { servizioAuth } from '@/common/config'

function cardAutenticata (nome) {
  const auth = servizioAuth(nome)
  if (auth === true) {
    return false
  } else return true
}

// ATTENZIONE!!! eventuali cambiamenti nei path di Infobollo (conferma - revoca) via email
// devono essere comunicati al gruppo di backend perche' aggiorni i template delle email
// che sono spedite all'utente finale.

const INFOBOLLO = {
  path: '/bollo/info',
  component: () => import('@/views/bollo/info/InfoBolloHome'),
  meta: { isPublic: cardAutenticata('info_bollo') },
  children: [
    {
      name: 'verifica_attivazione_info',
      path: '',
      component: () => import('@/views/bollo/info/VerificaAttivazione'),
      meta: { isPublic: cardAutenticata('info_bollo') },
      beforeEnter (to, from, next) {
        store.dispatch(INFO_RESET_STATE)
        next()
      }
    },
    {
      name: 'attivazione_email_info',
      path: 'email/attivazione',
      component: () => import('@/views/bollo/info/AttivazioneEmailInfo'),
      meta: { isPublic: cardAutenticata('info_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.esitoInfoVerificaEmail != null) ? next() : next('/bollo/info')
      }
    },
    {
      name: 'attivazione_sms_info',
      path: 'sms/attivazione',
      component: () => import('@/views/bollo/info/AttivazioneSmsInfo'),
      meta: { isPublic: cardAutenticata('info_bollo') },
      beforeEnter (to, from, next) {
        (store.getters.esitoInfoVerificaSms != null) ? next() : next('/bollo/info')
      }
    },
    {
      name: 'conf_attivazione_email_info',
      path: 'email/attivazione/conferma',
      component: () => import('@/views/bollo/info/ConfAttivazioneEmailInfo'),
      meta: { isPublic: cardAutenticata('info_bollo') }
    },
    {
      name: 'conf_revoca_email_info',
      path: 'email/revoca/conferma',
      component: () => import('@/views/bollo/info/ConfRevocaEmailInfo'),
      meta: { isPublic: cardAutenticata('info_bollo') }
    }
  ]
}

export default INFOBOLLO
