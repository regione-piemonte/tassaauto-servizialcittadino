<template>
  <div>
    <div class="container">
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div class="row inner-cont-alert">
            <div class="text-intro col-lg-8 offset-lg-2">
              <BoxErrore :error="detailError" />
            </div>
          </div>
          <div class="row inner-cont-bollo">
            <div class="col-lg-4 offset-lg-4 col-sm-6 offset-sm-3">
              <div class="card-center-pos">
                <strong>
                  {{ $t('bollo.pago.rate.labels.pagoPA') }}
                </strong>
                <v-row justify="center">
                  <v-img
                    :src="require('@/assets/images/loghi/piemonte/pagopa.png')"
                    max-width="185px"
                  />
                </v-row>
                    <BtnBack
                      :backUrl="'carrello_pagamenti_rate'"
                      :backType="'back'"
                      :size="true"
                      />
                      <br>
                    <v-btn
                      depressed
                      class="col-xs-12"
                      id="creaTransazionePagoPaBtn"
                      color="primary"
                      @click="creaTransazioneRatePagoPA()">
                      {{ $t('general.buttons.continua') }}
                    </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavigatorService from '@/common/navigator.service'
import { BOLLO_PAGO_CREA_TRANSAZIONE_RATE } from '@/store/actions.type'
import BoxErrore from '@/components/BoxErrore'
import BtnBack from '@/components/layout/btn/BtnBack'
import Spinner from '@/components/layout/Spinner'
import store from '@/store'

export default {
  components: { BoxErrore, BtnBack, Spinner },
  data () {
    return {
      detailError: { message: '', title: '' },
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'respCercaPagamRata',
      'importoTotPagoRate',
      'carrelloPagoRate',
      'emailFormPagoBollo'
    ])
  },
  methods: {
    creaTransazioneRatePagoPA () {
      if (!NavigatorService.checkInternetConnection()) return

      const transaz = {
        cf: this.respCercaPagamRata.intestatario.codiceFiscale,
        numeroRiferimento: this.respCercaPagamRata.pianoRateizzazione.numeroRiferimento,
        anno: this.respCercaPagamRata.pianoRateizzazione.anno,
        email: this.emailFormPagoBollo.email,
        rate: this.carrelloPagoRate,
        totale: this.importoTotPagoRate
      }

      this.overlay = true
      store
        .dispatch(BOLLO_PAGO_CREA_TRANSAZIONE_RATE, transaz)
        .then(({ data }) => {
          this.overlay = false
          if (data.esito === 'OK') {
            window.location = data.url
          } else {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
            }
          }
        })
        .catch((error) => {
          this.overlay = false
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
          }
          if (error.response.status === 500 && error.response.data.title === "Esiste gia' una richiesta avviata.") {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Invio non consentito: ' + error.response.data.title
            }
          }
        })
    }
  }
}
</script>
