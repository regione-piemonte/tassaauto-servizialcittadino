<template>
  <div class="col-lg-10 mx-lg-auto">
    <v-card class="card-view-page">
      <div class="row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-1 offset-xl-2">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="row inner-cont-bollo" v-if="stampaPianoRateizzazione">
        <div class="col-12 cols-sm-11 col-md-10 offset-md-1">
          <div class="risultati-ricerca">
            <h2>{{ $t("pratica.stampa.piano_rateizzazione.risultato") }}</h2>
            <div class="box-grigio mb-10 p-md-9" id="box-protocollo">
              <div class="h2">
                N° di riferimento/anno: <br />
                {{ stampaPianoRateizzazione.nriferimento }}/{{
                  stampaPianoRateizzazione.anno
                }}
              </div>
            </div>
            <DatiAnagraficiIntestatario
              :denominazione="stampaPianoRateizzazione.datiAnagrafici"
              :codiceFiscale="stampaPianoRateizzazione.codiceFiscale"
              :tipoDatiAnagrafici="'contribuente'"
            />
            <div class="space-section">
              <h2>
                {{ $t("pratica.stampa.piano_rateizzazione.titolo_tabella") }}
              </h2>
              <div>
                <p>
                  N.° TOTALE RATE: {{ stampaPianoRateizzazione.ntotaleRate }}
                </p>
                <p>
                  TASSO APPLICATO: {{ stampaPianoRateizzazione.tassoApplicato }}
                </p>
                <p>
                  SPESE ISTRUTTORIA: {{ stampaPianoRateizzazione.spesaIstruttoria }}
                </p>
                <p>
                  IMPORTO TOTALE DEL PIANO:
                  {{ stampaPianoRateizzazione.totaleGenerale }}
                </p>
              </div>
              <div>
                <div class="noAccordion mt-12" role="tablist">
                  <v-card
                    v-for="(item, index) in stampaPianoRateizzazione.rate"
                    :key="index"
                    no-body
                    class="px-md-4 py-md-8"
                  >
                    <v-row justify="center" align="center">
                      <div
                        class="col-md-2 col-sm-6 align-self-center text-center"
                      >
                        <div class="data-up dl-inline-header">
                          <dl class="text-center w-100">
                            <dt>N° rata</dt>
                            <dd>{{ item.numeroRata }}</dd>
                          </dl>
                        </div>
                      </div>
                      <div
                        class="col-md-2 col-sm-6 align-self-center text-center"
                      >
                        <div class="data-up dl-inline-header">
                          <dl class="text-center w-100">
                            <dt>Importo rata</dt>
                            <dd>{{ item.importo | formatCurrency }}</dd>
                          </dl>
                        </div>
                      </div>
                      <div class="col-md-2 col-sm-6 align-self-center">
                        <div class="data-up dl-inline-header">
                          <dl class="text-center w-100">
                            <dt>Scadenza rata</dt>
                            <dd>{{ item.scadenza }}</dd>
                          </dl>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 align-self-center">
                        <div class="data-up dl-inline-header">
                          <dl class="text-center w-100">
                            <dt>Stato della rata</dt>
                            <dd>{{ item.stato }}</dd>
                          </dl>
                        </div>
                      </div>
                      <div class="col-md-auto col-sm-6 align-self-center">
                        <div class="data-up dl-inline-header text-center w-100">
                          <v-btn
                            :disabled="item.stato !== 'NON PAGATA'"
                            @click="stampaPdf('RATEIZZAZIONE', item)"
                            color="primary"
                            class="white--text"
                            fab
                          >
                            <v-icon dark>mdi-printer</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <div
                        class="col-md-auto col-sm-6 align-self-center text-center"
                      >
                        <v-btn
                          :disabled="item.stato !== 'NON PAGATA'"
                          depressed
                          @click="
                            $router.push({ name: 'scelta_tipo_pagamento' })
                          "
                          text
                          color="primary"
                        >
                          <v-icon>mdi-credit-card</v-icon>
                          Paga
                        </v-btn>
                      </div>
                    </v-row>
                  </v-card>
                </div>
              </div>
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  @click="stampaPdf('LETTERA_RATE')"
                  depressed
                  color="primary"
                >
                  Stampa piano
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="text-right">
                <v-btn
                  aria-label="stampa i bollettini di rateizzazione"
                  @click="stampaPdf('RATEIZZAZIONE')"
                  color="primary"
                  class="ma-2 white--text"
                >
                  Stampa bollettini
                </v-btn>
              </v-col>
            </v-row>
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="'cerca_stampa_piano_rateizzazione'"
                  :backType="'back'"
                />
                <BtnHome :cssClass="'btn-secondary'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>
<script>
import NavigatorService from '@/common/navigator.service'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnBack from '@/components/layout/btn/BtnBack'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import Spinner from '@/components/layout/Spinner'
import BoxErrore from '@/components/BoxErrore'
import { STAMPA_PIANO_RATEIZZAZIONE_PDF } from '@/store/actions.type'
import { mapGetters } from 'vuex'
import store from '@/store'
import { saveAs } from 'file-saver'
export default {
  name: 'ElencoVeicoliVisure',
  components: {
    BtnHome,
    BtnBack,
    BoxErrore,
    Spinner,
    DatiAnagraficiIntestatario
  },
  data () {
    return {
      overlay: false,
      detailError: { message: '', title: '' }
    }
  },
  methods: {
    stampaPdf (tipoStampa, item) {
      if (!NavigatorService.checkInternetConnection()) return
      this.detailError = { message: '', title: '' }
      this.overlay = true
      let titoloPdf = ''
      if (tipoStampa === 'RATEIZZAZIONE' && item != null) {
        titoloPdf = 'bolletino-rata-' + item.numeroRata + '.pdf'
      } else if (tipoStampa === 'RATEIZZAZIONE' && item == null) {
        titoloPdf = 'bollettini.pdf'
      } else {
        titoloPdf = 'piano-rateizzazione.pdf'
      }
      let objtosend = null
      objtosend = {
        tipo: tipoStampa,
        idPianoRat: this.stampaPianoRateizzazione.nriferimento
      }
      if (item) {
        objtosend.nRata = item.numeroRata
      }

      store
        .dispatch(
          STAMPA_PIANO_RATEIZZAZIONE_PDF, objtosend
        )
        .then((response) => {
          this.overlay = false
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, titoloPdf)
        })
        .catch((error) => {
          this.overlay = false
          if (error.response == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          switch (error.response.status) {
            case 404:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              }
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              }
              break
            case 500:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            case 503:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            case 505:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            default:
              break
          }
        })
    }
  },
  computed: {
    ...mapGetters(['stampaPianoRateizzazione'])
  }
}
</script>
