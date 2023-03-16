<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 mx-auto">
            <Wizard
              :servizio="'pago_bollo'"
              :stepAttivo="4"
            />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 mx-auto">
            <BoxErrore
              :error="detailError"
            />
          </div>
        </div>
        <div class="row justify-content-md-center">
          <div class="col-12 col-lg-8 mx-auto mt-12">
            <div class="wrap-view">
              <div class="inner-cont-alert">
                <div class="row">
                  <BoxNeutral
                    show
                    :msg="detailInfo"
                    :service="'pago_bollo'"
                    v-if="detailInfo"
                    class="printDisplay"
                  />
                </div>
                <div class="action-button-wide row">
                  <div class="col-md-6 mt-6">
                    <BtnHome />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
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
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import Spinner from '@/components/layout/Spinner'
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
  components: { BoxErrore, BoxNeutral, BoxSuccesso, BtnHome, Spinner, Wizard },
  data () {
    return {
      csUrl: CUSTOMER_SATISFACTION_URL + 'form/customer-pagobollo',
      detailError: { message: '', title: '' },
      detailInfo: { title: '', message: '' },
      dialog: false,
      overlay: false
    }
  },
  methods: {
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    this.overlay = true
    if (!NavigatorService.checkInternetConnection()) return

    if (!('tranId' in this.$route.query)) {
      this.overlay = false
      this.detailInfo = { title: 'Pagamento annullato', message: 'Nessun pagamento eseguito.' }
      return
    }

    store
      .dispatch(BOLLO_PAGO_RIEPILOGO_TRANSAZIONE, this.$route.query.tranId)
      .then(({ data }) => {
        this.overlay = false
        const detailMsg = data
        this.detailInfo = { title: 'Operazione terminata', message: detailMsg }
        store.dispatch(BOLLO_PAGO_RESET_STATE)
      })
      .catch((error) => {
        this.overlay = false
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
