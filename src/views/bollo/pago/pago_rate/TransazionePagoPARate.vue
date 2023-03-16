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
            <BoxErrore :error="detailError" />
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
  </div>
</template>

<script>
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral'
import BoxSuccesso from '@/components/BoxSuccesso'
import BtnHome from '@/components/layout/btn/BtnHome'
import Wizard from '@/components/layout/Wizard'
import NavigatorService from '@/common/navigator.service'
import store from '@/store'
import {
  BOLLO_PAGO_RIEPILOGO_TRANSAZIONE_RATE,
  BOLLO_PAGO_RESET_STATE_RATE
} from '@/store/actions.type'

export default {
  components: { BoxErrore, BoxNeutral, BoxSuccesso, BtnHome, Wizard },
  data () {
    return {
      detailError: { message: '', title: '' },
      detailInfo: { title: '', message: '' }
    }
  },
  async created () {
    if (!NavigatorService.checkInternetConnection()) return

    if (!('tranId' in this.$route.query)) {
      this.detailInfo = { title: 'Pagamento annullato', message: 'Nessun pagamento eseguito.' }
      return
    }

    store
      .dispatch(BOLLO_PAGO_RIEPILOGO_TRANSAZIONE_RATE, this.$route.query.tranId)
      .then(({ data }) => {
        const detailMsg = 'Per la conclusione dell\'operazione è stata inviata una notifica all\'indirizzo: <strong>' + data.email + '</strong><br><br>' +
        'In caso di esito positivo la ricevuta sarà disponibile attraverso il servizio <a href="#/bollo/ricevuta">Scarica la ricevuta di un pagamento</a>'

        this.detailInfo = { title: 'Paga le rate', message: detailMsg }
        store.dispatch(BOLLO_PAGO_RESET_STATE_RATE)
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
