<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-lg-8 offset-lg-2 col-12">
        <BoxErrore :error="detailError" />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="col-xxl-8 offset-xxl-2">
        <div class="action-area">
          <!-- cfr. https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/178#note_4415 -->
          <PagamentoSingolo
            v-if="ricevutaPagam.tipologia === 'S' && ricevutaPagam.pianoRateizzazione === null && ricevutaPagam.rate.length === 0"
            :ricevuta="ricevutaPagam.ricevutaSingola"
          />
          <PagamentoCumulativo
            v-if="ricevutaPagam.tipologia === 'C' && ricevutaPagam.pianoRateizzazione === null && ricevutaPagam.rate.length === 0"
            :ricevuta="ricevutaPagam.ricevutaCumulativa"
          />
          <PagamentoRate
            v-if="ricevutaPagam.tipologia === 'S' && ricevutaPagam.pianoRateizzazione !== null && ricevutaPagam.rate.length > 0"
            :ricevuta="ricevutaPagam.ricevutaSingola"
            :anagraficaIntest="ricevutaPagam.anagraficaIntestatario"
            :pianoRateizz="ricevutaPagam.pianoRateizzazione"
            :rate="ricevutaPagam.rate"
          />
        </div>
        <div class="action-button-wide">
          <div class="col-md-6">
            <BtnBack
              :backUrl="'cerca_pagamento'"
              :backType="'back'"/>
            <BtnHome />
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
              type="button"
              id="scaricaPdfBtn"
              color="primary"
              @click="scaricaPdf">
              {{ $t('general.buttons.download_pdf') }}
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
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import BtnHome from '@/components/layout/btn/BtnHome'
import PagamentoCumulativo from '@/components/bollo/ricevuta/PagamentoCumulativo'
import BtnBack from '@/components/layout/btn/BtnBack'
import PagamentoRate from '@/components/bollo/ricevuta/PagamentoRate'
import PagamentoSingolo from '@/components/bollo/ricevuta/PagamentoSingolo'
import Spinner from '@/components/layout/Spinner'
import { BOLLO_RICEVUTA_PDF, PAGORATE_RICEVUTA_PDF } from '@/store/actions.type'
import store from '@/store'
import { saveAs } from 'file-saver'

export default {
  components: {
    BoxErrore,
    BtnHome,
    BtnBack,
    PagamentoCumulativo,
    PagamentoRate,
    PagamentoSingolo,
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
      'ricevutaPagam'
    ])
  },
  methods: {
    scaricaPdf () {
      if (!NavigatorService.checkInternetConnection()) return
      this.detailError = { message: '', title: '' }

      if (this.ricevutaPagam != null && this.ricevutaPagam.tipologia === 'S' &&
        this.ricevutaPagam.pianoRateizzazione !== null && this.ricevutaPagam.rate.length > 0) {
        this.scaricaPagoRatePdf()
        return
      }

      let inputParams = { }
      if (this.ricevutaPagam != null && this.ricevutaPagam.tipologia === 'S') {
        inputParams = {
          iuv: this.ricevutaPagam.ricevutaSingola.iuv,
          tipologia: this.ricevutaPagam.tipologia,
          cf: this.ricevutaPagam.ricevutaSingola.datiCalcolo.codiceFiscale,
          tipoVeicolo: this.ricevutaPagam.ricevutaSingola.datiCalcolo.tipoVeicolo.codice,
          targa: this.ricevutaPagam.ricevutaSingola.datiCalcolo.targa
        }
      } else if (this.ricevutaPagam != null && this.ricevutaPagam.tipologia === 'C') {
        inputParams = {
          iuv: this.ricevutaPagam.ricevutaCumulativa.riepilogo.iuv,
          tipologia: this.ricevutaPagam.tipologia,
          carrello: this.ricevutaPagam.ricevutaCumulativa.riepilogo.identificativoCarrello
        }
      } else {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        }
        return
      }

      this.overlay = true
      store
        .dispatch(BOLLO_RICEVUTA_PDF, inputParams)
        .then((response) => {
          this.overlay = false
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, 'ricevuta.pdf')
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
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.download_file')
          }
        })
    },

    scaricaPagoRatePdf () {
      const inputParams = {
        codiceFiscale: this.ricevutaPagam.anagraficaIntestatario.codiceFiscale,
        anno: this.ricevutaPagam.pianoRateizzazione.anno,
        idRatPiano: this.ricevutaPagam.pianoRateizzazione.numeroRiferimento,
        iuv: this.ricevutaPagam.ricevutaSingola.iuv
      }

      this.overlay = true
      store
        .dispatch(PAGORATE_RICEVUTA_PDF, inputParams)
        .then((response) => {
          this.overlay = false
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, 'ricevuta.pdf')
        })
        .catch((error) => {
          this.overlay = false
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
            return
          }
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.download_file') + ' (' + error.response.data.title + ')'
          }
        })
    }
  }
}
</script>
