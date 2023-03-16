<template>
  <div>
    <TitoloServizio :servizio="servizio" />
    <div class="container" ref="formContainer">
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div class="row inner-cont-alert">
            <div class="text-intro col-lg-8 offset-lg-2 col-12">
              <v-alert
                class="w-100"
                border="left"
                type="error"
                aria-relevant="all"
                :icon="false"
                show>
                <v-row class="pl-6 pl-md-12 mb-1">
                  <v-col cols="12" md="1">
                    <v-img
                      width="40"
                      :src="require(`@/assets/images/icone/alert/alert.svg`)"
                      :lazy-src="require(`@/assets/images/icone/alert/alert.svg`)"/>
                  </v-col>
                  <v-col cols="12" md="10">
                    <h2 class="ma-0">Utenza non abilitata ai servizi autenticati</h2>
                    <ul class="pl-0">
                      <li>
                        {{message}}
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-alert>
              <div class="action-button-wide mt-9">
                <BtnHome />
              </div>
            </div>
          </div>
        </v-card>
      </div>

    </div>
  </div>
</template>

<script>
import TitoloServizio from '@/components/layout/TitoloServizio'
import BtnHome from '@/components/layout/btn/BtnHome'
export default {
  name: 'ErroreServizio',
  components: { TitoloServizio, BtnHome },
  props: ['errorStatus', 'errorMessage'],
  data () {
    return {
      servizio: 'not_auth_service',
      message: '',
      text: 'Errore '
    }
  },
  async created () {
    switch (this.errorStatus) {
      case 400:
        this.message = 'Campi obbligatori mancanti'
        break
      case 404:
        this.message = 'Nessun dato trovato'
        break
      case 422:
        this.message = 'Parametri inseriti non validi'
        break
      case 500:
        this.message = this.errorMessage
        break
      default:
        this.message = 'Non è possibile accedere al servizio'
        break
    }
  }
}
</script>
