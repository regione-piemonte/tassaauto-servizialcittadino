<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <p>
          Se hai richiesto la <strong>rateizzazione</strong> a seguito di un
          avviso di accertamento del bollo auto <strong>con anno di pagamento fino al 2019 compreso</strong>, con questo servizio puoi pagare
          le rate.
          <br />
          Gli importi proposti sono quelli del piano di rateizzazione ricevuti a
          casa (bollettini postali inviati dalla Regione).
        </p>
        <p>
          Il pagamento avviene secondo le modalità messe a disposizione dal
          prestatore del servizio di pagamento selezionato e può prevedere una
          commissione.
        </p>
        <p>
          Prima di cominciare ricordati di avere a disposizione i
          <strong>bollettini</strong> per inserire il
          <strong>numero di riferimento / anno</strong> che è un identificativo
          univoco del piano di rateizzazione inviato dalla Regione.
        </p>
        <p>
          <em><strong>(!)</strong> Se l’avviso di accertamento si riferisce ad  un bollo auto <strong>con anno di pagamento successivo al 2019</strong>,
          non puoi più eseguire il versamento utilizzando questo servizio, ma devi avvalerti <strong>esclusivamente</strong> di quello
          disponibile sul sito di <a title="Soris S.p.A." href="https://www.soris.torino.it/">Soris S.p.A.</a>  alla sezione "Pagamenti".</em>
        </p>
      </div>
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'pago_bollo'" :stepAttivo="0" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div
            class="text-intro col-lg-8 offset-lg-2"
            id="boxErrDiv"
            tabindex="-1"
          >
            <box-errore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="cerca-avviso col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
            <v-img
              :src="
                require('@/assets/images/ritagli/servizi/pagamenti_online.svg')
              "
              class="imgHomeServizio"
              fluid
              width="178"
            />
            <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
              <p>
                <span class="d-sr-only"
                  >Per accedere al servizio sarà richiesto il numero di
                  riferimento.</span
                >
                Il numero di riferimento/anno si trova nel
                <v-dialog v-model="dialog" max-width="600" class="dialog-popup">
                  <template v-slot:activator="{ on }">
                    <a href="javascript:null" role="button" name="modalpianoRateizzazione" v-on="on"
                      >piano di rateizzazione</a
                    >
                  </template>
                  <v-card aria-hidden="true">
                    <v-card-title class="justify-end">
                      <v-icon @click="closeDialog()">mdi-close</v-icon>
                    </v-card-title>
                    <v-img
                      :src="
                        require(`@/assets/images/ritagli/${regione}/modal-rif_anno_piano_rateizzazione.jpg`)
                      "
                      alt="Dove è il riferimento avviso?"
                      width="871"
                    />
                  </v-card>
                </v-dialog>
                <span class="d-sr-only">piano di rateizzazione</span> che hai
                ricevuto.
              </p>
              <router-link
                :to="{ name: 'video_tutorial', hash: '#pagalerate_video' }"
                v-if="videoTutorial()"
              >
                <strong
                  ><span class="d-sr-only">Vai al </span>Video tutorial di paga
                  le rate</strong
                >
              </router-link>
              <div class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
               <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-pagamenti-on-line" target="_blank"><strong>Maggiori informazioni</strong></a>
              </div>
            </div>
          </div>
          <div class="form-cerca-avviso-hp col-lg-4 col-md-6 offset-lg-1">
            <h2>Cerca le rate da pagare</h2>
            <div v-if="!logged">
              <v-form @submit.prevent="iniziaPagamento">
                <v-text-field
                  :error-count="4"
                  :error-messages="nRiferimentoErrors"
                  :label="
                    this.$i18n.t(
                      'bollo.pago.rate.labels.cerca_rate.n_riferimento'
                    )
                  "
                  :maxlength="
                    $v.rataForm.numeroRiferimento.$params.maxLength.max
                  "
                  @change.native="resetErroriServer()"
                  autocomplete="off"
                  class="uppercase-input"
                  clear-icon="mdi-close-circle"
                  clearable
                  id="numeroRiferimento"
                  type="text"
                  v-model="rataForm.numeroRiferimento"
                  @focusout="toTrim()"
                ></v-text-field>
                <v-select
                  :error-count="1"
                  :error-messages="anniErrors"
                  :items="anni"
                  :label="
                    this.$i18n.t('bollo.pago.rate.labels.cerca_rate.anno')
                  "
                  @change.native="resetErroriServer()"
                  id="anno"
                  v-model="rataForm.anno"
                >
                </v-select>

                <v-text-field
                  :error-count="3"
                  :error-messages="codFiscaleErrors"
                  :label="
                    this.$i18n.t(
                      'bollo.pago.rate.labels.cerca_rate.cod_fis_piva'
                    )
                  "
                  @change.native="resetErroriServer()"
                  autocomplete="off"
                  class="uppercase-input"
                  clear-icon="mdi-close-circle"
                  clearable
                  id="codicefiscale"
                  type="text"
                  v-model="rataForm.codiceFiscale"
                ></v-text-field>

                <v-btn
                  class="spaceTopButtonSubmit"
                  color="primary"
                  depressed
                  type="submit"
                >
                  {{ $t("bollo.pago.rate.labels.cerca_rate.cerca") }}
                </v-btn>
              </v-form>
            </div>
            <div v-else>
              <v-form @submit.prevent="iniziaPagamentoAuth">
                <v-select
                  :items="listaRateizzazioniAuth"
                  :error-count="1"
                  :error-messages="rateizzazioneSceltaErrors"
                  id="codiceRateizzazione"
                  label="Scegli la rateizzazione"
                  v-model="rataFormAuth.rateizzazioneScelta"
                  @change="recuperaDatiAuth()"
                >
                </v-select>
                <v-text-field
                  disabled
                  label="Numero di riferimento"
                  v-if="rataFormAuth.rateizzazioneScelta !== ''"
                  v-model="rataFormAuth.pianoRate"
                >
                </v-text-field>
                <v-text-field
                  disabled
                  label="Anno"
                  v-if="rataFormAuth.rateizzazioneScelta !== ''"
                  v-model="rataFormAuth.annoRate"
                ></v-text-field>
                <v-text-field
                  disabled
                  label="Codice fiscale"
                  v-if="rataFormAuth.rateizzazioneScelta !== ''"
                  v-model="userIdentity.cf"
                >
                </v-text-field>
                <v-btn
                  depressed
                  class="spaceTopButtonSubmit"
                  id="btnIntVeicAvanti"
                  type="submit"
                  color="primary"
                >
                  Avanti
                </v-btn>
              </v-form>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import {
  PAGO_RATE_NUM_RIFERIMENTO_MAX_LENGTH,
  REGIONE_ABILITATA,
  REGIONE_PARAMS,
  videoServizio
} from '@/common/config'
import Wizard from '@/components/layout/Wizard'
import ApiError from '@/common/api.error'
import NavigatorService from '@/common/navigator.service'
import { BOLLO_PAGO_LIST_ANNO_SCADENZA, BOLLO_PAGO_RATE_CERCA, RATEIZZAZIONE_LIST_AUTENTICATI } from '@/store/actions.type'
import Spinner from '@/components/layout/Spinner'
import { validationMixin } from 'vuelidate'
import { required, alphaNum, maxLength } from 'vuelidate/lib/validators'
import BoxErrore from '@/components/BoxErrore'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  components: { BoxErrore, Spinner, Wizard },
  data () {
    return {
      anni: [],
      detailError: { message: '', title: '' },
      overlay: false,
      regione: REGIONE_ABILITATA,
      rataForm: {
        numeroRiferimento: '',
        anno: null,
        codiceFiscale: ''
      },
      serverErrors: { numeroRiferimento: '', codiceFiscale: '' },
      dialog: false,
      rataFormAuth: {
        rateizzazioneScelta: '',
        pianoRate: '',
        annoRate: ''
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    rataForm: {
      numeroRiferimento: {
        required,
        alphaNum,
        maxLength: maxLength(PAGO_RATE_NUM_RIFERIMENTO_MAX_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroRiferimento')
        }
      },
      anno: {
        required
      },
      codiceFiscale: {
        required,
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      }
    },
    rataFormAuth: {
      rateizzazioneScelta: {
        required
      }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost',
      'listaRateizzazioniAuth'
    ]),
    nRiferimentoErrors () {
      const errors = []
      if (!this.$v.rataForm.numeroRiferimento.$dirty) return errors
      !this.$v.rataForm.numeroRiferimento.required && errors.push('Il Numero di Riferimento è obbligatorio.')
      !this.$v.rataForm.numeroRiferimento.$params.maxLength.max && errors.push('Il Numero di Riferimento non è corretto')
      !this.$v.rataForm.numeroRiferimento.alphaNum && errors.push('Il Numero di Riferimento deve contenere solo lettere e numeri.')
      !this.$v.rataForm.numeroRiferimento.serverFailed && errors.push(this.serverErrors.numeroRiferimento)
      return errors
    },
    anniErrors () {
      const errors = []
      if (!this.$v.rataForm.anno.$dirty) return errors
      !this.$v.rataForm.anno.required && errors.push('L\'anno è obbligatorio.')
      return errors
    },
    codFiscaleErrors () {
      const errors = []
      if (!this.$v.rataForm.codiceFiscale.$dirty) return errors
      !this.$v.rataForm.codiceFiscale.required && errors.push('Il Codice fiscale / P. IVA è obbligatorio.')
      !this.$v.rataForm.codiceFiscale.alphaNum && errors.push('Il Codice fiscale / P. IVA deve contenere solo lettere e numeri.')
      !this.$v.rataForm.codiceFiscale.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    },
    rateizzazioneSceltaErrors () {
      const errors = []
      if (!this.$v.rataFormAuth.rateizzazioneScelta.$dirty) return errors
      !this.$v.rataFormAuth.rateizzazioneScelta.required && errors.push('Il Numero di Riferimento è obbligatorio.')
      return errors
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    toTrim () {
      this.rataForm.numeroRiferimento = this.rataForm.numeroRiferimento.replace(/\s/g, '').toUpperCase()
    },
    iniziaPagamento () {
      this.$v.rataForm.$touch()
      if (this.$v.rataForm.$invalid) return

      if (!NavigatorService.checkInternetConnection()) return
      const inParams = {
        cf: this.rataForm.codiceFiscale.toUpperCase(),
        numeroRiferimento: this.rataForm.numeroRiferimento,
        anno: this.rataForm.anno
      }

      this.overlay = true
      store
        .dispatch(BOLLO_PAGO_RATE_CERCA, inParams)
        .then(() => {
          this.$router.push({ name: 'esito_ricerca_pagamento_rate' })
        })
        .catch((error) => {
          console.log({ error })
          this.overlay = false
          if (error.response == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.message
            }
            return
          }
          switch (error.response.status) {
            case 400:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Parametri obbligatori non valorizzati'
              }
              break
            case 403:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non corrisponde al codice fiscale in input'
              }
              this.serverErrors.codiceFiscale = 'Proprietario non corrisponde al codice fiscale in input'
              break
            case 404:
            case 409:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              }
              break
            case 412:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non trovato'
              }
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t('general.api.errors.search_params_invalid')
              }
              this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
              break
            case 500:
            case 503:
            case 505:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            default:
              break
          }
          document.getElementById('boxErrDiv').focus()
        })
    },
    recuperaDatiAuth () {
      this.resetErroriServer()
      this.rataFormAuth.pianoRate = this.rataFormAuth.rateizzazioneScelta.split('/').shift()
      this.rataFormAuth.annoRate = this.rataFormAuth.rateizzazioneScelta.split('/').pop()
    },
    iniziaPagamentoAuth () {
      this.$v.rataFormAuth.$touch()
      if (this.$v.rataFormAuth.$invalid) return

      if (!NavigatorService.checkInternetConnection()) return
      const inParams = {
        cf: this.userIdentity.cf,
        numeroRiferimento: this.rataFormAuth.pianoRate,
        anno: this.rataFormAuth.annoRate
      }

      this.overlay = true
      store
        .dispatch(BOLLO_PAGO_RATE_CERCA, inParams)
        .then(() => {
          this.$router.push({ name: 'esito_ricerca_pagamento_rate' })
        })
        .catch((error) => {
          console.log({ error })
          this.overlay = false
          if (error.response == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.message
            }
            return
          }
          switch (error.response.status) {
            case 400:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Parametri obbligatori non valorizzati'
              }
              break
            case 403:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non corrisponde al codice fiscale in input'
              }
              this.serverErrors.codiceFiscale = 'Proprietario non corrisponde al codice fiscale in input'
              break
            case 404:
            case 409:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              }
              break
            case 412:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non trovato'
              }
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t('general.api.errors.search_params_invalid')
              }
              this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
              break
            case 500:
            case 503:
            case 505:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            default:
              break
          }
          document.getElementById('boxErrDiv').focus()
        })
    },
    resetErroriServer () {
      this.serverErrors = { numeroRiferimento: '', codiceFiscale: '' }
      this.detailError = { message: '', title: '' }
    },
    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('pago_rate') !== '')
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },

  async mounted () {
    if (!NavigatorService.checkInternetConnection()) return
    store
      .dispatch(BOLLO_PAGO_LIST_ANNO_SCADENZA)
      .then(({ data }) => {
        this.anni.push({ text: 'Seleziona', value: null })
        for (let i = 0; i < data.length; i++) {
          this.anni.push({ text: data[i].nome, value: data[i].valore })
        }
      })
      .catch((error) => {
        if (error == null) return
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        }
      })
  },
  async created () {
    if (this.logged) {
      await store
        .dispatch(RATEIZZAZIONE_LIST_AUTENTICATI, this.userIdentity.cf)
        .then()
        .catch((error) => {
          this.overlay = true
          if (error === null) {
            this.overlay = false
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Non è possibile accedere al servizio'
            }
          }
          if (error.response.status) {
            this.overlay = false
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            }
          }
        })
    }
  }
}
</script>
