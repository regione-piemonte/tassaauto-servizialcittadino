<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'pago_bollo'" :stepAttivo="2" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <DatiAnagraficiIntestatario
              :denominazione="soggettoRateizz"
              :codiceFiscale="respCercaPagamRata.intestatario.codiceFiscale"
              :tipoDatiAnagrafici="'intestatario rate'"
            />
            <DatiPianoRateizzazione
              :numeroRiferimento="respCercaPagamRata.pianoRateizzazione.numeroRiferimento"
              :anno="respCercaPagamRata.pianoRateizzazione.anno"
              :totaleImporto="respCercaPagamRata.pianoRateizzazione.totale | formatCurrency"
              :numeroRateDaPagare="respCercaPagamRata.pianoRateizzazione.numeroRate"
              :ratePagate="false"
            />
            <TabellaRate
              :rate="carrelloPagoRate"
              :importoTotale="importoTotPagoRate"
              :ratePagate="false"
            />
            <RiferimentiPago
              ref="rifPago"
              :pEmail="emailFormPagoRate.email"
              :pPrivacy="emailFormPagoRate.privacy"
              v-on:bloccapagamento="vaiPagamentoDisabled = true"
            />
            <PagamentoPagoPa
            />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="'esito_ricerca_pagamento_rate'"
                  :backType="'back'"/>
              </div>
              <div class="col-md-6 text-md-right">
                <v-btn type="button"
                depressed
                  id="vaiAlPagamentoBtn"
                  color="primary"
                  @click="avviaPagoPA()"
                  :disabled="vaiPagamentoDisabled">
                  {{ $t('general.buttons.pagamento') }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import DatiVeicolo from '@/components/DatiVeicolo'
import Wizard from '@/components/layout/Wizard'
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import PagamentoPagoPa from '@/components/bollo/PagamentoPagoPa'
import BtnBack from '@/components/layout/btn/BtnBack'
import RiferimentiPago from '@/components/bollo/RiferimentiPago'
import DatiPianoRateizzazione from '@/components/bollo/rate/DatiPianoRateizzazione'
import TabellaRate from '@/components/bollo/rate/TabellaRate'
import { BOLLO_PAGO_SALVA_RIFERIMENTI_RATE } from '@/store/actions.type'
import store from '@/store'

export default {
  components: {
    BoxErrore,
    BtnBack,
    ComposizioneImporto,
    DatiAnagraficiIntestatario,
    DatiPianoRateizzazione,
    DatiVeicolo,
    PagamentoPagoPa,
    RiferimentiPago,
    TabellaRate,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      vaiPagamentoDisabled: false
    }
  },
  computed: {
    ...mapGetters([
      'respCercaPagamRata',
      'importoTotPagoRate',
      'carrelloPagoRate',
      'emailFormPagoRate'
    ]),
    soggettoRateizz: function () {
      if (!this.respCercaPagamRata.intestatario.personaFisica) return this.respCercaPagamRata.intestatario.denominazione
      return this.respCercaPagamRata.intestatario.nome + ' ' + this.respCercaPagamRata.intestatario.cognome
    }
  },
  methods: {
    avviaPagoPA () {
      this.$refs.rifPago.iniziaValidazione()
      this.$refs.rifPago.$v.rifForm.$touch()
      if (this.$refs.rifPago.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const rifObj = this.$refs.rifPago.getEmailPrivacy()
      store
        .dispatch(BOLLO_PAGO_SALVA_RIFERIMENTI_RATE, {
          email: rifObj.email.toLowerCase(),
          privacy: rifObj.privacy
        })
        .then(() => {
          this.$router.push({ name: 'avvio_pagopa_rate' })
        })
        .catch((error) => {
          console.log('Errore', { error })
        })
    }
  }
}
</script>
