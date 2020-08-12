<template>
  <div>
    <div class="app-container">
      <v-card class="card-view-page card-pago-pa">
      <div class="app-row inner-cont-alert">
        <div class="text-intro col-xxl-8 offset-xxl-2">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="app-row inner-cont-bollo">
        <div class="col-lg-4 offset-lg-4 col-sm-6 offset-sm-3">
          <div class="card-center-pos">
            <strong>
              Il pagamento viene effettuato sulla piattaforma pagoPA.
            </strong>
            <v-row justify="center">
              <v-img
                :src="require('@/assets/images/loghi/piemonte/pagopa.png')"
                max-width="185px"
              />
            </v-row>
            <div class="action-button-wide">
              <div class="col-md-12">
                <BtnBack
                  :backUrl="'carrello_pagamenti'"
                  :size="true"
                  :backType="'back'"/>
                <v-btn
                  id="transazionePagoPaBtn"
                  type="button"
                  block
                  color="primary"
                  @click="creaTransazionePagoPA()">
                  Continua
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import BtnBack from '@/components/layout/btn/BtnBack'
import Spinner from '@/components/layout/Spinner'
import { BOLLO_PAGO_CREA_TRANSAZIONE } from '@/store/actions.type'
import store from '@/store'

export default {
  components: {
    BoxErrore,
    BtnBack,
    Spinner
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'carrelloPagoBollo',
      'emailFormPagoBollo',
      'totaleCarrelloPagoBollo'
    ])
  },
  methods: {
    creaTransazionePagoPA () {
      if (!NavigatorService.checkInternetConnection()) return

      const transaz = {
        carrello: [],
        email: this.emailFormPagoBollo.email,
        totale: this.totaleCarrelloPagoBollo
      }

      const campiCarrello = [
        'codiceFiscale', 'identificativoPagamento', 'targa', 'esplicativo',
        'scadenza', 'validita', 'totale', 'tassa', 'sanzione', 'interesse']
      this.carrelloPagoBollo.forEach(function (item) {
        const carrello = {
          tipoVeicolo: item.risultato.tipoVeicolo.codice,
          proprietario: item.proprietario
        }
        campiCarrello.forEach(function (field) {
          carrello[field] = item.risultato[field]
        })
        transaz.carrello.push(carrello)
      })

      this.overlay = true
      store
        .dispatch(BOLLO_PAGO_CREA_TRANSAZIONE, transaz)
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
          if (error.response.status === 500 && error.response.data.title === 'ERRORE-Esiste gia\' una richiesta avviata per la scadenza e il veicolo indicati.') {
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
