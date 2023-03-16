import { AUTH_AREA_URL } from '@/common/config'
import router from '@/router'
import { APP, LOGOUT } from '@/router/routes/global'
import store from '@/store'
import { UTENTE_LOCALHOST_LOGIN, UTENTE_LOCALHOST_LOGOUT } from '@/store/actions.type'

export const login = () => {
  if (process.env.NODE_ENV !== 'production') {
    store.dispatch(UTENTE_LOCALHOST_LOGIN)
    return
  }

  const authAreaUrl = AUTH_AREA_URL
  const loginRedirectUrl = `${authAreaUrl}/bff/login`

  console.debug('[Login] redirect to:', loginRedirectUrl)

  try {
    // @NOTE: se il BFF è su un dominio diverso rispetto al Front-end => questa istruzione fallirà
    location.assign(loginRedirectUrl)
  } catch (e) {
    window.open(loginRedirectUrl, '_self')
  }
}

export const logout = () => {
  if (process.env.NODE_ENV !== 'production') {
    store.dispatch(UTENTE_LOCALHOST_LOGOUT)
    router.push(APP)
    return
  }
  router.push(LOGOUT)
}

export const localhostUserIdentity = () => {
  // cf: 'RCCMLA68C44L166A' perché usato in test
  return (store.getters.isUserLoggedLocalhost)
    ? {
        autenticazione_livello: '1',
        autenticazione_metodo: 'SPID',
        autenticazione_riscontro: 'S',
        autenticazione_valida: true,
        cf: 'RCCMLA68C44L166A',
        // cf: 'SBCCST76M66F335L',
        // cf: 'FRMNNN62A22L219B',
        // cf: 'VLNFNS80A01H501U',
        // cf: 'BSSSNN74A60E445K',
        // cf: 'CVGGRL63M46L219D',
        cognome: 'RICCHIUTO',
        nome: 'AMALIA'
      }
    : null
}
