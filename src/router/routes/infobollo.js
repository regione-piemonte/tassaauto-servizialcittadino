import store from '@/store'
import { INFO_RESET_STATE } from '@/store/actions.type'

// ATTENZIONE!!! eventuali cambiamenti nei path di Infobollo (conferma - revoca) via email
// devono essere comunicati al gruppo di backend perche' aggiorni i template delle email
// che sono spedite all'utente finale.

const INFOBOLLO = {
  path: '/bollo/info',
  component: () => import('@/views/bollo/info/InfoBolloHome'),
  children: [
    {
      name: 'verifica_attivazione_info',
      path: '',
      component: () => import('@/views/bollo/info/VerificaAttivazione'),
      beforeEnter (to, from, next) {
        store.dispatch(INFO_RESET_STATE)
        next()
      }
    },
    {
      name: 'attivazione_email_info',
      path: 'email/attivazione',
      component: () => import('@/views/bollo/info/AttivazioneEmailInfo'),
      beforeEnter (to, from, next) {
        (store.getters.esitoInfoVerificaEmail != null) ? next() : next('/bollo/info')
      }
    },
    {
      name: 'attivazione_sms_info',
      path: 'sms/attivazione',
      component: () => import('@/views/bollo/info/AttivazioneSmsInfo'),
      beforeEnter (to, from, next) {
        (store.getters.esitoInfoVerificaSms != null) ? next() : next('/bollo/info')
      }
    },
    {
      name: 'conf_attivazione_email_info',
      path: 'email/attivazione/conferma',
      component: () => import('@/views/bollo/info/ConfAttivazioneEmailInfo')
    },
    {
      name: 'conf_revoca_email_info',
      path: 'email/revoca/conferma',
      component: () => import('@/views/bollo/info/ConfRevocaEmailInfo')
    }
  ]
}

export default INFOBOLLO
