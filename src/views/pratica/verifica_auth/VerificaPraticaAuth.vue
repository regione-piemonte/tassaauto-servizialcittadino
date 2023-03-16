<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <p
          v-html="introServizio"
        />
      </div>
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
            <!-- inizio box warning per servizi autenticati di consulta pratica -->
            <v-alert
              class="w-100"
              type="warning"
              aria-relevant="all"
              border="left"
              :icon="false"
              v-if="detailWarning.message !== '' && detailWarning.title !== ''"
            >
              <v-row class="pl-6 pl-md-12">
                <v-col cols="12" md="1">
                  <v-img
                    width="40"
                    :src="require(`@/assets/images/icone/alert/warning.svg`)"
                    :lazy-src="
                      require(`@/assets/images/icone/alert/warning.svg`)
                    "
                  />
                </v-col>
                <v-col cols="12" md="10">
                  <h4 class="alert-heading">
                    {{ detailWarning.title }}
                  </h4>
                  <p class="">
                    {{ detailWarning.message }}
                    <a @click="verificaPraticaRoute()">link</a>
                  </p>
                </v-col>
              </v-row>
            </v-alert>
            <!-- fine box warning per servizi autenticati di consulta pratica -->
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div
            class="verifica-pratica-hp col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0"
          >
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="
                require('@/assets/images/ritagli/servizi/consulta_pratica.svg')
              "
              alt=""
              fluid
            />
            <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
              <p v-html="descrizServizio" />
            </div>
          </div>
          <div class="form-verifica-pratica col-lg-4 col-md-6 offset-lg-1">
            <h2>
              {{ $t("pratica.verifica.cerca_titolo") }}
            </h2>
            <v-form @submit.prevent="verificaPratica" v-if="logged">
              <v-text-field
                v-if="!logged"
                clearable
                clear-icon="mdi-close-circle"
                label="Numero protocollo"
                id="numero"
                v-model="cercaForm.numero"
                @change.native="resetErroriServer()"
                :maxLength="$v.cercaForm.numero.$params.maxLength.max"
                :error-messages="numeroPErrors"
                autocomplete="off"
                :error-count="3"
              ></v-text-field>

              <v-select
                v-else
                :items="listaComunicazioniAuth"
                id="codiceComunicazioni"
                label="Scegli la comunicazione"
                v-model="cercaForm.comunicazioneScelta"
                :error-messages="comunicazioneSceltaErrors"
                :error-count="1"
              >
              </v-select>

              <tassa-auto-recaptcha
                :pCount="noCaptchaCount"
                v-on:recaptchaverified="updRecaptchaVerified()"
                v-on:recaptchanotverified="recaptchaVerified = false"
              />
              <v-btn
                depressed
                class="spaceTopButtonSubmit"
                type="submit"
                color="primary"
                aria-label="cerca la pratica"
              >
                {{ $t("general.buttons.search") }}
              </v-btn>
            </v-form>
            <v-form v-else @submit.prevent="verificaPratica">
              <v-text-field
                :error-messages="numeroPErrors"
                :maxLength="$v.cercaForm.numero.$params.maxLength.max"
                @change.native="resetErroriServer()"
                autocomplete="off"
                class="uppercase-input"
                clear-icon="mdi-close-circle"
                clearable
                id="numero"
                label="Numero protocollo"
                v-model="cercaForm.numero"
                :error-count="3"
                @focusout="toTrim()"
              ></v-text-field>

              <v-text-field
                :error-count="4"
                :error-messages="codFiscPartIvaErrors"
                :maxLength="$v.cercaForm.codFiscPartIva.$params.maxLength.max"
                @change.native="resetErroriServer()"
                autocomplete="off"
                class="uppercase-input"
                clear-icon="mdi-close-circle"
                clearable
                id="codFiscPartIva"
                label="Codice fiscale / P.IVA"
                v-model="cercaForm.codFiscPartIva"
              ></v-text-field>

              <tassa-auto-recaptcha
                :pCount="noCaptchaCount"
                v-on:recaptchanotverified="recaptchaVerified = false"
                v-on:recaptchaverified="updRecaptchaVerified()"
              />
              <v-btn
                class="spaceTopButtonSubmit"
                aria-label="cerca la pratica"
                color="primary"
                depressed
                type="submit"
              >
                {{ $t("general.buttons.search") }}
              </v-btn>
            </v-form>
          </div>
          <div class="form-verifica-pratica col-lg-10 offset-lg-1"></div>
        </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import {
  emailAttiva,
  smsAttivo,
  servizioAttivo,
  COD_FISCALE_MAX_LENGTH,
  NO_RECAPTCHA_ATTEMPTS,
  NUM_PROTOCOLLO_MAX_LENGTH
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import {
  PRATICA_ACCERTAMENTO,
  PRATICA_COMUNICAZIONI_LIST_AUTENTICATI,
  PRATICA_DISC_RIMB,
  PRATICA_ESENZIONI_DISABILI,
  PRATICA_OSSERVAZIONE,
  PRATICA_RATEIZZAZIONE,
  PRATICA_RESTITUZIONE_TASSA,
  PRATICA_TIPOLOGIA
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, alphaNum, maxLength } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha },
  data () {
    return {
      action: '',
      cercaForm: {
        numero: '',
        codFiscPartIva: '',
        comunicazioneScelta: ''
      },
      detailError: { message: '', title: '' },
      detailWarning: { message: '', title: '' },
      noCaptchaCount: 0,
      overlay: false,
      paginaDettaglio: '',
      recaptchaVerified: false,
      serverErrors: { identificativo: '', codiceFiscale: '' }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'listaComunicazioniAuth',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    introServizio: function () {
      let tipiDomanda = ''
      if (servizioAttivo('rateizzazione')) tipiDomanda += 'una richiesta di rateizzazione'
      if (tipiDomanda !== '') tipiDomanda += ' o '
      if (servizioAttivo('domanda_discarico_rimborso')) tipiDomanda += 'una domanda di discarico'
      if (tipiDomanda !== '') tipiDomanda += ', o se hai inviato '
      if (servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di scadenza/accertamento'
      if (servizioAttivo('osservazione_avviso_scadenza') && !servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di scadenza'
      if (!servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di accertamento'
      if (servizioAttivo('osservazione_avviso_scadenza') && !servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di scadenza'
      if (servizioAttivo('restituzione_tassa') && this.logged) tipiDomanda += 'richiesta di restituzione'
      if (servizioAttivo('esenzioni_disabili') && this.logged) tipiDomanda += 'richiesta di esenzione per motivi di disabilità'
      return 'Se hai fatto ' + tipiDomanda + ', qui ne puoi controllare il contenuto.'
    },
    valoreCodice () {
      return this.logged ? this.cercaForm.comunicazioneScelta.codice : this.cercaForm.numero
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    descrizServizio: function () {
      const pref = 'Il numero di protocollo si trova '
      const suf = ' dopo l\'inserimento della richiesta.'
      if (emailAttiva() && smsAttivo()) {
        return pref + 'nella e-mail e/o nell\'SMS ricevuti' + suf
      }
      if (emailAttiva()) {
        return pref + 'nella e-mail ricevuta' + suf
      }
      if (smsAttivo()) {
        return pref + 'nell\'SMS ricevuto' + suf
      }
    },
    inputParamsVerificaPratica: function () {
      return { identificativo: this.valoreCodice, codiceFiscale: this.userIdentity.cf }
    },
    inputParamsCercaPratica: function () {
      return { identificativo: this.valoreCodice, codiceFiscale: this.userIdentity.cf }
    },
    inputParamsCercaPraticaAuth: function () {
      return { numeroProtocollo: this.valoreCodice, codiceFiscale: this.userIdentity.cf }
    },
    numeroPErrors () {
      const errors = []
      if (!this.$v.cercaForm.numero.$dirty) return errors
      !this.$v.cercaForm.numero.required && errors.push('Il numero di protocollo è obbligatorio.')
      !this.$v.cercaForm.numero.maxLength && errors.push('Il numero di protocollo deve essere composto da massimo ' + this.$v.cercaForm.numero.$params.maxLength.max + ' caratteri.')
      !this.$v.cercaForm.numero.serverFailed && errors.push(this.serverErrors.identificativo)
      return errors
    },
    codFiscPartIvaErrors () {
      const errors = []
      if (!this.$v.cercaForm.codFiscPartIva.$dirty) return errors
      !this.$v.cercaForm.codFiscPartIva.required && errors.push('Il codice fiscale / P.IVA è obbligatorio.')
      !this.$v.cercaForm.codFiscPartIva.maxLength && errors.push('Il codice fiscale / P.IVA deve essere composto da massimo ' + this.$v.cercaForm.codFiscPartIva.$params.maxLength.max + ' caratteri.')
      !this.$v.cercaForm.codFiscPartIva.alphaNum && errors.push('Il codice fiscale / P.IVA deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.codFiscPartIva.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    },
    comunicazioneSceltaErrors () {
      const errors = []
      if (!this.$v.cercaForm.comunicazioneScelta.$dirty) return errors
      !this.$v.cercaForm.comunicazioneScelta.required && errors.push('Selezionare una comunicazione.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      numero: {
        maxLength: maxLength(NUM_PROTOCOLLO_MAX_LENGTH),
        required,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'identificativo')
        }
      },
      codFiscPartIva: {
        required,
        alphaNum,
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      },
      comunicazioneScelta: { required }
    }
  },
  methods: {
    toTrim () {
      this.cercaForm.numero = this.cercaForm.numero.replace(/\s/g, '').toUpperCase()
    },
    async cercaPratica (servizio) {
      if (this.action === '') return
      // l'invocazione dell'API di ricerca pratica presenta un controllo del tipo di servizio
      // per i servizi Richiesta esenzione 'EPD' e Richiesta restituzione 'RIM' vengono passati 2 parametri: numeroProtocollo e cf (inputParamsCercaPraticaAuth)
      // le api coinvolte sono: verificaPratica/cercaRestituzione e verificaPratica/cercaEsenzione
      // per i servizi Rateizzazione 'RAR' - Avvisi accertamento e scadenza 'OSSER' 'MEMOR' - discarico rimborso 'DTE' vengono passati 2 parametri: identificativo e cf (inputParamsCercaPratica)
      // le api coinvolte sono: verificaPratica/cercaRateizzazione, verificaPratica/cercaAccertamento, verificaPratica/cercaOsservazione, verificaPratica/cercaDTE
      await store
        .dispatch(this.action, (servizio === 'RIM' || servizio === 'EPD') ? this.inputParamsCercaPraticaAuth : this.inputParamsCercaPratica)
        .then(({ data }) => {
          this.$router.push({ name: this.paginaDettaglio })
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
              message: this.$i18n.t('pratica.verifica.errors.input_params_not_found')
            }
            this.serverErrors = {
              identificativo: this.$i18n.t('general.api.errors.param_not_found'),
              codiceFiscale: this.$i18n.t('general.api.errors.param_not_found')
            }
          } else if (error.response.status === 404) {
            const noResMsg = 'Nessuna comunicazione trovata per il numero identificativo ' + this.valoreCodice
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: noResMsg
            }
            this.serverErrors.identificativo = noResMsg
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },
    verificaPratica () {
      this.resetErroriServer()
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified && !this.logged) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }
      if (!NavigatorService.checkInternetConnection() && !this.logged) return
      this.overlay = true
      store
        .dispatch(PRATICA_TIPOLOGIA, this.inputParamsVerificaPratica)
        .then(({ data }) => {
          switch (data.codice) {
            case 'RIM':
              if (!this.logged) {
                this.overlay = false
                this.detailWarning = {
                  title: 'Servizio riservato agli utenti autenticati',
                  message: 'Per accedere al servizio si prega di autenticarsi '
                }
              } else {
                this.action = PRATICA_RESTITUZIONE_TASSA
                this.paginaDettaglio = 'verifica_restituzioni_tassa'
              }
              break
            case 'EPD':
              if (!this.logged) {
                this.overlay = false
                this.detailWarning = {
                  title: 'Servizio riservato agli utenti autenticati',
                  message: 'Per accedere al servizio si prega di autenticarsi '
                }
              } else {
                this.action = PRATICA_ESENZIONI_DISABILI
                this.paginaDettaglio = 'verifica_esenzioni_disabili'
              }
              break
            case 'OSSER':
              this.action = PRATICA_OSSERVAZIONE
              this.paginaDettaglio = 'verifica_osservazione'
              break
            case 'RAR':
              this.action = PRATICA_RATEIZZAZIONE
              this.paginaDettaglio = 'verifica_rateizzazione'
              break
            case 'MEMOR':
              this.action = PRATICA_ACCERTAMENTO
              this.paginaDettaglio = 'verifica_accertamento'
              break
            case 'DTE':
              this.action = PRATICA_DISC_RIMB
              this.paginaDettaglio = 'verifica_disc_rimb'
              break
            default:
              this.overlay = false
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('pratica.verifica.errors.input_params_not_found')
              }
              break
          }
          this.cercaPratica(data.codice)
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
              message: this.$i18n.t('pratica.verifica.errors.input_params_not_found')
            }
            this.serverErrors = {
              identificativo: this.$i18n.t('general.api.errors.param_not_found'),
              codiceFiscale: this.$i18n.t('general.api.errors.param_not_found')
            }
          } else if (error.response.status === 404) {
            const noResMsg = 'Nessuna comunicazione trovata per il numero identificativo ' + this.valoreCodice
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: noResMsg
            }
            this.serverErrors.identificativo = noResMsg
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = { identificativo: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    verificaPraticaRoute () {
      return this.$router.push({ name: 'cerca_pratica' })
    }
  },
  async created () {
    if (this.logged) {
      this.overlay = true
      await store
        .dispatch(PRATICA_COMUNICAZIONI_LIST_AUTENTICATI, this.userIdentity.cf)
        .then(() => { this.overlay = false })
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
              message: this.$i18n.t('pratica.verifica.errors.input_params_not_found')
            }
          } else if (error.response.status === 404) {
            const noResMsg = 'Nessuna comunicazione trovata per il codice fiscale ' + this.userIdentity.cf
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: noResMsg
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
          }
        })
    }
  }
}
</script>
