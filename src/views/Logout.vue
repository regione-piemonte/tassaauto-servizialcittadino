<template>
  <div class="home-page">
    <titolo-servizio
      :servizio="servizio"
    />
    <div class="container" id="homePage-gridCard">
      <div class="row">
        <div class="col-md-12">
          <div class="mb-3">
            <h1>Stai per essere disconnesso</h1>
          </div>
        </div>
      </div>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { AUTH_AREA_URL } from '@/common/config'
import Spinner from '@/components/layout/Spinner'
import TitoloServizio from '@/components/layout/TitoloServizio'

export default {
  name: 'Logout',
  components: { Spinner, TitoloServizio },
  data () {
    return {
      overlay: false,
      servizio: 'home'
    }
  },
  async created () {
    this.overlay = true
    const loginRedirectUrl = AUTH_AREA_URL + '/bff/logout'
    // attenzione: passando da Axios non funziona la redirect sulla Location ricevuta in risposta dalla loginRedirectUrl
    window.open(loginRedirectUrl, '_self')
  },
  methods: {
    timeout (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>
