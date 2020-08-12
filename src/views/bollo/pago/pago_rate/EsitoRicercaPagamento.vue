<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <Wizard :servizio="'pago_bollo'" :stepAttivo="1" />
      </div>
    </div>
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore :error="detailError" />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="col-xxl-8 offset-xxl-2">
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
        <ElencoModificaRate
          :pRespPagoRate="respCercaPagamRata"
          :pRateSelezionate="carrelloPagoRate"
          :pImportoTotale="importoTotPagoRate"
          v-on:controlspinner="overlay = $event.running"
          v-on:updatecalcolo="updateCalcoloOk($event)"
        />
        <div class="action-button-wide">
          <div class="col-md-6">
            <BtnBack
              :backUrl="'inizia_pagamento_rate'"
              :backType="'back'"/>
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
              type="button"
              color="primary"
              :disabled="carrelloPagoRate.length < 1 || !calcoloTotaleOk"
              :to="{ name: 'carrello_pagamenti_rate' }">
              Avanti
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import ElencoModificaRate from '@/components/bollo/rate/ElencoModificaRate'
import BtnBack from '@/components/layout/btn/BtnBack'
import DatiPianoRateizzazione from '@/components/bollo/rate/DatiPianoRateizzazione'
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiVeicolo from '@/components/DatiVeicolo'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'

export default {
  components: {
    BoxErrore,
    BtnBack,
    ComposizioneImporto,
    DatiAnagraficiIntestatario,
    DatiPianoRateizzazione,
    DatiVeicolo,
    ElencoModificaRate,
    Spinner,
    Wizard
  },
  data () {
    return {
      calcoloTotaleOk: false,
      detailError: { message: '', title: '' },
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'respCercaPagamRata',
      'carrelloPagoRate',
      'importoTotPagoRate'
    ]),
    soggettoRateizz: function () {
      if (!this.respCercaPagamRata.intestatario.personaFisica) return this.respCercaPagamRata.intestatario.denominazione
      return this.respCercaPagamRata.intestatario.nome + ' ' + this.respCercaPagamRata.intestatario.cognome
    }
  },
  methods: {
    updateCalcoloOk (esitoCalcolo) {
      this.calcoloTotaleOk = esitoCalcolo
    }
  }
}
</script>
