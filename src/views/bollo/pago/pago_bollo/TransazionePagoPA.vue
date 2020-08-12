<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro col-lg-8 offset-lg-2 col-12">
        <Wizard
          :servizio="'pago_bollo'"
          :stepAttivo="4"
        />
      </div>
    </div>
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore
          :error="detailError"
        />
      </div>
    </div>
    <div class="app-row justify-content-md-center">
      <div class="col-12 col-lg-8">
        <div class="wrap-view">
          <div class="inner-cont-alert">
            <div class="row">
              <BoxNeutral
                show
                :msg="detailInfo"
                class="printDisplay"
              />
            </div>
            <div class="action-button-wide">
              <div class="col-md-6">
                <BtnHome />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </v-card>
    <v-dialog ref="modaleCs" v-model="dialog" size="xl" visible centered hide-footer>
      <div class="modalSatisfaction">
        <v-card>
          <v-card-title class="justify-end">
            <v-icon @click="closeDialog()">mdi-close</v-icon>
          </v-card-title>
          <iframe
            width="100%"
            height="100%"
            :src="csUrl"
          />
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { CUSTOMER_SATISFACTION_URL } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral'
import BoxSuccesso from '@/components/BoxSuccesso'
import BtnHome from '@/components/layout/btn/BtnHome'
import Wizard from '@/components/layout/Wizard'
import NavigatorService from '@/common/navigator.service'
import store from '@/store'
import { BOLLO_PAGO_RIEPILOGO_TRANSAZIONE, BOLLO_PAGO_RESET_STATE } from '@/store/actions.type'

export default {
  components: { BoxErrore, BoxNeutral, BoxSuccesso, BtnHome, Wizard },
  data () {
    return {
      csUrl: CUSTOMER_SATISFACTION_URL + 'form/customer-pagobollo',
      detailError: { message: '', title: '' },
      detailInfo: { title: '', message: '' },
      dialog: false
    }
  },
  methods: {
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    if (!NavigatorService.checkInternetConnection()) return

    if (!('tranId' in this.$route.query)) {
      this.detailInfo = { title: 'Pagamento annullato', message: 'Nessun pagamento eseguito.' }
      return
    }

    store
      .dispatch(BOLLO_PAGO_RIEPILOGO_TRANSAZIONE, this.$route.query.tranId)
      .then(({ data }) => {
        const detailMsg = 'Per la conclusione dell\'operazione è stata inviata una notifica all\'indirizzo: <strong>' + data.email + '</strong><br><br>' +
        'In caso di esito positivo la ricevuta sarà disponibile attraverso il servizio <a href="#/bollo/ricevuta">Scarica la ricevuta di un pagamento</a>'

        this.detailInfo = { title: 'Pago bollo online', message: detailMsg }
        store.dispatch(BOLLO_PAGO_RESET_STATE)
      })
      .catch((error) => {
        if (error == null || error.response.status === 500) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          }
          return
        }
        if (error.response.status === 400) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Parametro obbligatorio non valorizzato'
          }
        } else if (error.response.status === 404) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Nessun dato trovato'
          }
        }
      })
  }
}
</script>
