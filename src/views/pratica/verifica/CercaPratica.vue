<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <p
          v-html="introServizio"
        />
      </div>
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore :error="detailError" />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="verifica-pratica-hp col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
        <v-img
          class="imgHomeServizio"
          width="178"
          :src="require('@/assets/images/ritagli/servizi/consulta_pratica.svg')"
          alt=""
          fluid/>
        <div class="text-inner">
          <p
            v-html="descrizServizio"
          />
        </div>
      </div>
      <div class="form-verifica-pratica col-xxl-4 col-md-6 offset-xxl-1">
        <h2>
          {{ $t('pratica.verifica.cerca_titolo') }}
        </h2>
        <v-form
          @submit.prevent="verificaPratica">

          <v-text-field
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

          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="Codice fiscale / P.IVA"
            id="codFiscPartIva"
            v-model="cercaForm.codFiscPartIva"
            @change.native="resetErroriServer()"
            :maxLength="$v.cercaForm.codFiscPartIva.$params.maxLength.max"
            :error-messages="codFiscPartIvaErrors"
            autocomplete="off"
            :error-count="4"
            ></v-text-field>

          <tassa-auto-recaptcha
            :pCount="noCaptchaCount"
            v-on:recaptchaverified="updRecaptchaVerified()"
            v-on:recaptchanotverified="recaptchaVerified = false"
          />
          <v-btn
            class="spaceTopButtonSubmit"
            type="submit"
            color="primary">
            {{ $t('general.buttons.search') }}
          </v-btn>
        </v-form>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
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
  PRATICA_OSSERVAZIONE,
  PRATICA_RATEIZZAZIONE,
  PRATICA_ACCERTAMENTO,
  PRATICA_TIPOLOGIA,
  PRATICA_DISC_RIMB
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
        codFiscPartIva: ''
      },
      detailError: { message: '', title: '' },
      noCaptchaCount: 0,
      overlay: false,
      paginaDettaglio: '',
      recaptchaVerified: false,
      serverErrors: { identificativo: '', codiceFiscale: '' }
    }
  },
  computed: {
    introServizio: function () {
      let tipiDomanda = ''
      if (servizioAttivo('rateizzazione')) tipiDomanda += 'una richiesta di rateizzazione'
      if (tipiDomanda !== '') tipiDomanda += ' o '
      if (servizioAttivo('domanda_discarico_rimborso')) tipiDomanda += 'una domanda di discarico/rimborso'
      if (tipiDomanda !== '') tipiDomanda += ', o se hai inviato '
      if (servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di scadenza/accertamento'
      if (servizioAttivo('osservazione_avviso_scadenza') && !servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di scadenza'
      if (!servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) tipiDomanda += 'una osservazione su avviso di accertamento'
      return 'Se hai fatto ' + tipiDomanda + ', qui la puoi controllare.'
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
    inputParams: function () {
      return { identificativo: this.cercaForm.numero, codiceFiscale: this.cercaForm.codFiscPartIva }
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
      }
    }
  },
  methods: {
    cercaPratica () {
      if (this.action === '') return
      store
        .dispatch(this.action, this.inputParams)
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
            const noResMsg = 'Nessuna comunicazione provata per il numero identificativo ' + this.cercaForm.numero
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
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(PRATICA_TIPOLOGIA, this.inputParams)
        .then(({ data }) => {
          switch (data.codice) {
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
                message: this.$i18n.t('general.api.errors.service_unavailable')
              }
              break
          }
          this.cercaPratica()
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
              message: this.$i18n.t('pratica.verifica.errors.tipologia_non_gestita')
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('pratica.verifica.errors.input_params_not_found')
            }
            this.serverErrors = {
              identificativo: this.$i18n.t('general.api.errors.param_not_found'),
              codiceFiscale: this.$i18n.t('general.api.errors.param_not_found')
            }
            this.noCaptchaCount++
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
            this.noCaptchaCount++
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = { identificativo: '', codiceFiscale: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    }
  }
}
</script>
