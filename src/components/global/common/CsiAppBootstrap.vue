<template>
  <div>
    <slot v-if="!overlay" />
    <div class="container">
      <spinner :pOverlay="overlay" />
    </div>
  </div>
</template>

<script>
import { login } from '@/common/session'
import Spinner from '@/components/layout/Spinner'
import { APP } from '@/router/routes/global'
import { canAccessRoute, ensureLogin } from '@/router/hooks'
import store from '@/store'
import { UTENTE_CARICA } from '@/store/actions.type'
import { REGIONE_ABILITATA } from '@/common/config'

export default {
  name: 'CsiAppBootstrap',
  components: { Spinner },
  data () {
    return {
      overlay: true,
      regione: REGIONE_ABILITATA
    }
  },
  async created () {
    if (this.regione !== 'vda') { // provvisorio fincheè vda non avrà l'autenticazione
      const userPromise = store.dispatch(UTENTE_CARICA)
      const user = await userPromise
      console.log('user', { user })
    }

    this.$router.beforeEach(ensureLogin)

    // aspettiamo che il router sia pronto prima di ottenere la route dall'URL
    this.$router.onReady(() => {
      console.debug('[FirstAccess] Router ready')
      console.debug('[FirstAccess] Router:', this.$router)
      console.debug('[FirstAccess] Route:', this.$route)
      console.debug('[FirstAccess] matched:', this.$router.getMatchedComponents())
      console.debug('[FirstAccess] current:', this.$router.history.current)
      const canAccess = canAccessRoute(this.$route)
      if (!canAccess) {
        if (!store.getters.isUserLogged) {
          console.debug('[FirstAccess] The route is not public and the user is not logged => redirect to login...')
          login()
          return
        } else {
          console.debug('[FirstAccess] The route is not public and the user is logged => redirect to home...')
          this.$router.push(APP)
        }
      }
      this.overlay = false
    })

    // Evitiamo di spaccare completamente l'app
    // In questo modo è sempre possibile aggiornarla
    setTimeout(() => {
      this.overlay = false
    }, 5000)
  }
}
</script>

<style scoped lang="stylus"></style>
