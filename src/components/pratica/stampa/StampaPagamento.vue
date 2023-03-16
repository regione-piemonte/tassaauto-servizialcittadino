<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2 col-12">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-12 col-lg-8 offset-lg-2">
            <div class="action-area">
              <div>
                <DatiAnagraficiIntestatario
                  :denominazione="intestVeicolo"
                  :codiceFiscale="cfIntestVeicolo"
                  :email="pSintesiPagamento.anagraficaIntestatario.email"
                  :tipoDatiAnagrafici="'intestatario veicolo'"
                />
                <DatiVeicolo
                  :descrizione="pSintesiPagamento.tipoVeicolo.descrizione"
                  :targa="pSintesiPagamento.targa"
                />
                <div class="space-section" id="dati-avviso-di-pagamento">
                  <h2>
                    Dati avviso di pagamento
                  </h2>
                  <v-list
                    class="text-uppercase"
                    flat>
                    <v-list-item-group
                      :no-action="true"
                      aria-label="dati avviso di scadenza del pagamento">
                      <v-list-item
                        id=""
                        :inactive="true"
                        :ripple="false">
                        Scadenza: <strong class="ml-2">{{ pSintesiPagamento.scadenza }}</strong>
                      </v-list-item>
                      <v-list-item
                        id=""
                        :inactive="true"
                        :ripple="false">
                        Validità: <strong class="ml-2">{{ pSintesiPagamento.validita }} mesi</strong>
                      </v-list-item>
                      <v-list-item
                        id=""
                        :inactive="true"
                        :ripple="false">
                        Costo del bollo: <strong class="ml-2">{{ pSintesiPagamento.costoBollo | formatCurrency }}</strong>
                      </v-list-item>
                      <v-list-item
                        id=""
                        :inactive="true"
                        :ripple="false">
                        Sanzione: <strong v-if="pSintesiPagamento.sanzione > 0" class="ml-2">{{ pSintesiPagamento.sanzione | formatCurrency }}</strong><strong v-else class="ml-2">non dovuta</strong>
                      </v-list-item>
                      <v-list-item
                        id=""
                        :inactive="true"
                        :ripple="false">
                        Interessi: <strong v-if="pSintesiPagamento.interessi > 0" class="ml-2">{{ pSintesiPagamento.interessi | formatCurrency }}</strong><strong v-else>non dovuti</strong>
                      </v-list-item>
                      <v-list-item
                        id=""
                        :inactive="true"
                        :ripple="false">
                        <strong>Totale: {{ pSintesiPagamento.totale | formatCurrency }}</strong>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </div>
            </div>
            <div class="action-button-wide row" id="action-buttons">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="paginaIniziale"
                  :backType="'back'"/>
                <BtnHome />
              </div>
              <div class="col-md-6 text-md-right">
                <v-btn
                  depressed
                  type="button"
                  id="scaricaPdfBtn"
                  color="primary"
                  @click="scaricaPdf">
                  Stampa bollettini
                </v-btn>
                <v-btn
                  depressed
                  type="button"
                  id="scaricaPdfBtn"
                  color="primary"
                  v-if="pStampaAccertamento"
                  @click="stampaLettera">
                  Stampa lettera
                </v-btn>
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
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import BtnHome from '@/components/layout/btn/BtnHome'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import BtnBack from '@/components/layout/btn/BtnBack'
import Spinner from '@/components/layout/Spinner'
import { STAMPA_AVV_ACCERTAMENTO_PDF, STAMPA_LETTERA_AVV_ACCERTAMENTO_PDF, STAMPA_AVV_SCADENZA_PDF } from '@/store/actions.type'
import store from '@/store'
import { saveAs } from 'file-saver'

export default {
  name: 'StampaPagamento',
  props: {
    pSintesiPagamento: { type: Object, required: true },
    pStampaAccertamento: { type: Boolean, required: true }
  },
  components: {
    BtnHome,
    BoxErrore,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiVeicolo,
    Spinner
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      overlay: false
    }
  },
  computed: {
    // cfr. https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/145
    cfIntestVeicolo: function () {
      const piva = this.pSintesiPagamento.anagraficaIntestatario.piva
      if (piva !== null && piva !== '') return piva
      return this.pSintesiPagamento.anagraficaIntestatario.codiceFiscale
    },
    intestVeicolo: function () {
      const denominazione = this.pSintesiPagamento.anagraficaIntestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.pSintesiPagamento.anagraficaIntestatario.nome + ' ' + this.pSintesiPagamento.anagraficaIntestatario.cognome
    },
    paginaIniziale: function () {
      return (this.pStampaAccertamento) ? 'cerca_stampa_avv_accertamento' : 'cerca_stampa_avv_scadenza'
    }
  },
  methods: {
    stampaLettera () {
      if (!NavigatorService.checkInternetConnection()) return
      this.detailError = { message: '', title: '' }
      const tipoStampa = (this.pStampaAccertamento) ? 'LETTERA_ACCERTAMENTO' : ''
      store
        .dispatch(
          STAMPA_LETTERA_AVV_ACCERTAMENTO_PDF,
          { tipo: tipoStampa, iuv: this.pSintesiPagamento.iuv }
        )
        .then((response) => {
          this.overlay = false
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, 'lettera-pagamento.pdf')
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
    },
    scaricaPdf () {
      if (!NavigatorService.checkInternetConnection()) return
      this.detailError = { message: '', title: '' }

      const action = (this.pStampaAccertamento) ? STAMPA_AVV_ACCERTAMENTO_PDF : STAMPA_AVV_SCADENZA_PDF
      const tipoStampa = (this.pStampaAccertamento) ? 'ACCERTAMENTO' : 'SCADENZA'
      this.overlay = true
      store
        .dispatch(
          action,
          { tipo: tipoStampa, iuv: this.pSintesiPagamento.iuv }
        )
        .then((response) => {
          this.overlay = false
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, 'pagamento.pdf')
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
  }
}
</script>
