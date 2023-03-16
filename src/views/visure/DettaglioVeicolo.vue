<template>
  <div>
    <div class="col-lg-10 mx-lg-auto details-vehicle">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
            <BoxWarning :warning="detailWarning" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-10 offset-lg-1">
            <div
              v-if="visureDettaglioVeicoli.pagamenti.length > 0">
              <p>Data ultimo aggiornamento: {{new Date(visureElencoVeicoli.dataUltimoAggiornamento) | dateFormat('DD/MM/YYYY')}}</p>
              <v-container class="my-12 pa-12 listPagamenti">
                <v-row :class="'my-9 row dl-inline-header text-center bg-ico bg-ico-'+ veicoloScelto.tipoVeicolo.tipoVeicolo.codice" >
                  <dl class="col-sm-5">
                    <dt>
                      tipo
                    </dt>
                    <dd>
                      {{ veicoloScelto.tipoVeicolo.tipoVeicolo.descrizione }}
                    </dd>
                  </dl>
                  <dl class="col-sm-3">
                    <dt>
                      targa
                    </dt>
                    <dd>
                      {{ veicoloScelto.tipoVeicolo.targa }}
                    </dd>
                  </dl>
                </v-row>
                <p class="mb-12">
                  Proprietario dal {{ new Date(veicoloScelto.dataInizioProprieta) | dateFormat('DD/MM/YYYY') }} <span v-if="veicoloScelto.dataFineProprieta !== null">al {{ new Date(veicoloScelto.dataFineProprieta) | dateFormat('DD/MM/YYYY') }}</span>
                </p>
                 <p class="d-sr-only">Tabella di riepilogo dei pagamenti</p>
                <v-row class="d-none d-md-flex" role="row">
                  <v-col cols="3" role="columnheader" class="columnheaderVisure">
                    Anno di pagamento del bollo (*)
                  </v-col>
                  <v-col cols="3" role="columnheader" class="columnheaderVisure">
                    Scadenza del bollo (*)
                  </v-col>
                  <v-col cols="4" role="columnheader" class="columnheaderVisure">
                    Stato pagamento
                  </v-col>
                  <v-col cols="auto" role="columnheader" class="columnheaderVisure">
                    <p class="d-sr-only">Possibilità di procedere al pagamento</p>
                  </v-col>
                </v-row>
                <v-row align="center"
                  class="lineItems my-9 pt-9"
                  v-for="(item, index) in visureDettaglioVeicoli.pagamenti"
                  :key="index"
                  role="row">
                  <v-col cols="12" md="3" role="cell">
                    <p class="d-none d-md-flex d-sr-only">Anno di pagamento del bollo (*)</p>
                    <span class="d-flex d-md-none columnheaderVisure">Anno di pagamento del bollo (*)</span>{{item.annoTributo}}
                  </v-col>
                  <v-col cols="12" md="3" role="cell">
                    <p class="d-none d-md-flex d-sr-only">Scadenza del bollo (*)</p>
                    <span class="d-flex d-md-none columnheaderVisure">Scadenza del bollo (*)</span>{{item.scadenza}}
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="item.statoPagamento !== null || item.statoPagamento !== ''" role="cell">
                    <p class="d-none d-md-flex d-sr-only">Stato pagamento</p>
                    <span class="d-flex d-md-none columnheaderVisure">Stato pagamento</span>
                    <span :class="(item.statoPagamento === 'REGOLARE' || item.statoPagamento === 'PROSSIMA SCADENZA') ? null : 'red-color'">
                      {{item.statoPagamento}}
                    </span>
                  </v-col>
                  <v-col cols="auto" role="cell">
                    <v-btn
                    depressed
                    aria-label="vai alla pagina di pagamento del bollo"
                    @click="paginaPagoBollo(visureDettaglioVeicoli.pagamenti[index])"
                    outlined
                    class="btn-pay"
                    color="primary"
                    v-if="statoPagamentoCheck(item.statoPagamento)">
                      Paga
                    </v-btn>
                    <p class="d-sr-only" v-else>non è necessario procedere al pagamento</p>
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-col>
                    <p>
                      (*) Per approfondimenti sui termini di pagamento e le scadenze della tassa automobilistica, consultare sul sito della Regione Piemonte la pagina: <a :href="bolloAutoUrl" target="_blank" rel="noopener">Bollo auto: quando pagare</a>
                    </p>
                  </v-col>
                </v-row>
                <v-row class="text-md-right mb-12">
                  <v-col>
                    <v-btn
                      depressed
                      aria-label="torna alla pagina di elenco veicoli"
                      color="primary"
                      :to="{ name: 'home' }"
                      @click="resetVeicoli()">
                      Torna all'elenco veicoli
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="inner-cont-2box" v-if="esitoMemoVerifica">
                  <AttivazioneEmailMemo
                    v-bind:boxErr.sync="detailError"
                    v-on:controlspinner="overlay = $event.running"
                    v-on:updateboxerr="updateDetailError($event)"
                    v-if="canaleEmailAttivo"
                  />
                  <AttivazioneSmsMemo
                    v-bind:boxErr.sync="detailError"
                    v-on:controlspinner="overlay = $event.running"
                    v-on:updateboxerr="updateDetailError($event)"
                    v-if="canaleSmsAttivo"
                  />
                </v-row>
              </v-container>
              <div class="container">
                <AlertInfoLegenda />
              </div>

            </div>
            <div v-else>
              <div v-if="!errorPage">
                <BoxNeutral
                  show
                  :msg="detailInfo"
                  class="printDisplay"
                />
              </div>
            </div>
            <div class="container">
              <div class="action-button-wide mt-9">
                <v-row align="center">
                  <v-col cols="12" md="6">
                    <v-row class="ml-n2">
                      <v-col cols="auto">
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          v-if="noFoundPayment && !errorPage"
                          aria-label="ricarica la ricerca"
                          color="primary"
                          class="mt-3 mt-sm-0"
                          depressed
                          type="submit"
                          @click="retry()">
                          Riprova
                        </v-btn>
                        <BtnHome :cssClass="'btn-secondary'" v-if="errorPage"/>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
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
import {
  DETTAGLIO_VEICOLO_VISURE,
  MEMO_VERIFICA,
  MEMO_RESET_STATE,
  VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE
} from '@/store/actions.type'
import store from '@/store'
import { emailAttiva, smsAttivo, REGIONE_PARAMS } from '@/common/config'
import BtnHome from '@/components/layout/btn/BtnHome'
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral.vue'
import AlertInfoLegenda from '@/components/visure/AlertInfoLegenda'
import BoxWarning from '@/components/BoxWarning'
import Spinner from '@/components/layout/Spinner'
import AttivazioneEmailMemo from '@/components/bollo/memo/AttivazioneEmailMemo'
import AttivazioneSmsMemo from '@/components/bollo/memo/AttivazioneSmsMemo'
import NavigatorService from '@/common/navigator.service'
export default {
  name: 'DettaglioVeicoloVisure',
  components: { AttivazioneEmailMemo, AttivazioneSmsMemo, BoxErrore, Spinner, BoxWarning, BoxNeutral, AlertInfoLegenda, BtnHome },
  data () {
    return {
      canaleEmailAttivo: emailAttiva(),
      canaleSmsAttivo: smsAttivo(),
      detailError: { message: '', title: '' },
      detailWarning: { message: '', title: '' },
      overlay: false,
      statoPagamentoClass: null,
      noFoundPayment: false,
      bolloAutoUrl: REGIONE_PARAMS.BOLLOAUTOVISURE_URL,
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      },
      errorPage: false
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'visureElencoVeicoli',
      'visureKey',
      'visureDettaglioVeicoli',
      'veicoloScelto',
      'esitoMemoVerifica'
    ])
  },
  methods: {
    statoPagamentoCheck (elemento) {
      switch (elemento) {
        case 'REGOLARE':
          return false
        case 'PROSSIMA SCADENZA':
          return false
        case 'PAGAMENTO NON DOVUTO':
          return false
        case 'IRREGOLARE':
          return true
        case 'ACCERTAMENTO':
          return true
        case 'RATEIZZATO':
          return false
        case 'IN SCADENZA':
          return true
        case 'ACCERTAMENTO SORIS':
          return false
        default:
          break
      }
    },
    retry () {
      this.errorPage = false
      this.overlay = true
      const params = {
        key: store.getters.visureKey.key,
        cf: store.getters.userIdentity.cf,
        targa: store.getters.veicoloScelto.tipoVeicolo.targa
      }
      setTimeout(() => store.dispatch(DETTAGLIO_VEICOLO_VISURE, params)
        .then(() => {
          this.overlay = false
          this.verificaMemo()
          if (store.getters.visureDettaglioVeicoli.pagamenti.length > 0) {
            this.noFoundPayment = false
            this.detailWarning = {
              title: '',
              message: ''
            }
          }
        })
        .catch((error) => {
          this.overlay = false
          this.errorPage = true
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            }
          } else if (error.response.status === 403) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Codice fiscale non corrisponde al proprietario del veicolo'
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Veicolo non trovato'
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
          }
        }), 5000)
    },
    verificaMemo () {
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(MEMO_VERIFICA, {
          targa: this.veicoloScelto.tipoVeicolo.targa,
          tipoVeicolo: this.veicoloScelto.tipoVeicolo.tipoVeicolo.codice,
          codiceFiscale: this.userIdentity.cf
        })
        .then(() => {
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(MEMO_RESET_STATE)
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          }
          // eliminati tutti i codici di errore 4xx per non far vedere il box errore di memo bollo jira stasp-565
        })
    },
    updateMemo () {
      this.overlay = true
      store
        .dispatch(MEMO_VERIFICA, {
          targa: this.veicoloScelto.tipoVeicolo.targa,
          tipoVeicolo: this.veicoloScelto.tipoVeicolo.tipoVeicolo.codice,
          codiceFiscale: this.userIdentity.cf
        })
        .then(({ data }) => {
          this.overlay = false
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
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            }
          } else if (error.response.status === 403) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Codice fiscale non corrisponde al proprietario del veicolo'
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Veicolo non trovato'
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
          }
        })
    },
    updateDetailError (detErr) {
      this.detailError = detErr
    },
    resetVeicoli () {
      this.overlay = true
      store
        .dispatch(VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE)
        .then(() => {
          this.overlay = false
        })
    },
    paginaPagoBollo (pagamento) {
      pagamento.targa = this.veicoloScelto.tipoVeicolo.targa
      if (pagamento.statoPagamento !== 'IN SCADENZA') {
        this.$router.push({ name: 'inizia_pagamento', params: { pagamentoScelto: pagamento } })
      } else {
        this.$router.push({ name: 'inizia_pagamento', params: { targaScelta: this.veicoloScelto.tipoVeicolo.targa } })
      }
    }
  },
  async created () {
    this.overlay = true
    const params = {
      key: store.getters.visureKey.key,
      cf: store.getters.userIdentity.cf,
      targa: store.getters.veicoloScelto.tipoVeicolo.targa
    }
    // nel caso in cui non ci siano pagamenti associati al veicolo viene stampato il box errore + tasto home
    // get key visure
    setTimeout(() => store.dispatch(DETTAGLIO_VEICOLO_VISURE, params)
      .then(() => {
        if (store.getters.visureDettaglioVeicoli.pagamenti.length < 1) {
          // get key storico pagamenti
          setTimeout(() => store.dispatch(DETTAGLIO_VEICOLO_VISURE, params)
            .then(() => {
              if (store.getters.visureDettaglioVeicoli.pagamenti.length < 1) {
                this.overlay = false
                this.noFoundPayment = true
                this.detailWarning = {
                  title: 'Attenzione!',
                  message: 'Provare a ricaricare il servizio'
                }
              } else {
                this.verificaMemo()
                this.overlay = false
              }
            })
            .catch((error) => {
              this.overlay = false
              this.errorPage = true
              this.noFoundPayment = true
              if (error == null || error.response.status === 500) {
                this.detailError = {
                  title: this.$i18n.t('general.error'),
                  message: this.$i18n.t('general.api.errors.service_unavailable')
                }
              }
              if (error.response.status === 400) {
                this.detailError = {
                  title: this.$i18n.t('general.api.errors.no_results'),
                  message: 'Parametri obbligatori non valorizzati'
                }
              } else if (error.response.status === 403) {
                this.detailError = {
                  title: this.$i18n.t('general.api.errors.no_results'),
                  message: 'Codice fiscale non corrisponde al proprietario del veicolo'
                }
              } else if (error.response.status === 404) {
                this.detailError = {
                  title: this.$i18n.t('general.api.errors.no_results'),
                  message: error.response.title
                }
              } else if (error.response.status === 422) {
                this.detailError = {
                  title: this.$i18n.t('general.api.errors.no_results'),
                  message: this.$i18n.t('general.api.errors.search_params_invalid')
                }
              }
            }), 30000)
        } else {
          this.verificaMemo()
          this.overlay = false
        }
      })
      .catch((error) => {
        this.overlay = false
        this.noFoundPayment = true
        this.errorPage = true
        if (error == null || error.response.status === 500) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          }
        }
        if (error.response.status === 400) {
          this.detailError = {
            title: this.$i18n.t('general.api.errors.no_results'),
            message: 'Parametri obbligatori non valorizzati'
          }
        } else if (error.response.status === 403) {
          this.detailError = {
            title: this.$i18n.t('general.api.errors.no_results'),
            message: 'Codice fiscale non corrisponde al proprietario del veicolo'
          }
        } else if (error.response.status === 404) {
          this.detailError = {
            title: this.$i18n.t('general.api.errors.no_results'),
            message: error.response.data.title
          }
        } else if (error.response.status === 422) {
          this.detailError = {
            title: this.$i18n.t('general.api.errors.no_results'),
            message: this.$i18n.t('general.api.errors.search_params_invalid')
          }
        }
      }), 20000)
  }
}
</script>
