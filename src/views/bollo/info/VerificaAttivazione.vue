<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <p v-html="descrizione" />
        <p>
          <strong>Iscriviti a Infobollo!</strong><br>
          Se sei già iscritto a Infobollo, qui puoi modificare le tue preferenze o cancellarti dalla ricezione delle news.
        </p>
      </div>
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore :error="detailError" />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="form-infobollo col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
          <v-img
            class="imgHomeServizio"
            width="178"
            :src="require('@/assets/images/ritagli/servizi/infobollo.svg')"
            fluid
          />
      </div>
      <div class="infobollo-hp col-xxl-5 col-md-6 offset-xxl-1">
        <div v-if="canaleEmailAttivo" class="canaleEmailAttivo">
          <h2>
            Infobollo via e-mail
          </h2>
          <v-form
            @submit.prevent="verificaEmail"
            id="verificaEmail">
            <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            :label="$t('bollo.info.labels.email')"
            id="email"
            v-model="emailForm.email"
            :error-messages="emailErrors"
            autocomplete="off"
            :error-count="2"
            ></v-text-field>
            <tassa-auto-recaptcha
              :pCount="noCaptchaCount"
              v-on:recaptchaverified="updRecaptchaVerified()"
              v-on:recaptchanotverified="recaptchaVerified = false"
            />
            <v-btn
              id="verifInfobolloEmailBtn"
              class="spaceTopButtonSubmit"
              type="submit"
              color="primary">
              {{ $t('general.buttons.attiva_revoca') }}
            </v-btn>
          </v-form>
        </div>
        <div v-if="canaleSmsAttivo" class="canaleSmsAttivo">
          <h2>
            Infobollo via SMS (gratuito)
          </h2>
          <v-form @submit.prevent="verificaSms"
          id="verificaSms">
            <v-text-field
            clearable
            type="tel"
            clear-icon="mdi-close-circle"
            :label="$t('bollo.info.labels.cell')"
            id="cell"
            v-model="smsForm.cell"
            :error-messages="telefonoErrors"
            @change.native="resetErroriServer()"
            :maxLength="$v.smsForm.cell.$params.maxLength.max"
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
              id="verifInfobolloSmsBtn"
              type="submit"
              color="primary">
              {{ $t('general.buttons.attiva_revoca') }}
            </v-btn>
          </v-form>
        </div>
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
  CELL_MAX_LENGTH,
  CELL_MIN_LENGTH,
  NO_RECAPTCHA_ATTEMPTS
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import {
  INFO_VERIFICA_EMAIL,
  INFO_VERIFICA_SMS,
  INFO_RESET_STATE
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength, numeric } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha },
  data () {
    return {
      canaleEmailAttivo: emailAttiva(),
      canaleSmsAttivo: smsAttivo(),
      detailError: { message: '', title: '' },
      emailForm: { email: '' },
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      smsForm: { sms: '' },
      serverErrors: { email: '', cell: '' }
    }
  },
  computed: {
    descrizione: function () {
      let descrRif = ''
      if (this.canaleEmailAttivo) descrRif += 'una <strong>e-mail</strong>'
      if (descrRif !== '' && this.canaleSmsAttivo) descrRif += ' e/o '
      if (this.canaleSmsAttivo) descrRif += 'un <strong>SMS (gratuito)</strong>'
      return 'Vuoi ricevere ' + descrRif + ' con informazioni e notizie sul bollo auto?'
    },
    emailErrors () {
      const errors = []
      if (!this.$v.emailForm.email.$dirty) return errors
      !this.$v.emailForm.email.required && errors.push('L\'indirizzo e-mail è obbligatorio.')
      !this.$v.emailForm.email.email && errors.push('Digitare un indirizzo e-mail corretto.')
      return errors
    },
    telefonoErrors () {
      const errors = []
      if (!this.$v.smsForm.cell.$dirty) return errors
      !this.$v.smsForm.cell.required && errors.push('Il numero di telefono mobile è obbligatorio.')
      !this.$v.smsForm.cell.numeric && errors.push('Il numero di telefono mobile deve essere composto da soli numeri.')
      !this.$v.smsForm.cell.minLength && errors.push('Il numero di telefono mobile deve essere composto da almeno ' + this.$v.smsForm.cell.$params.minLength.min + ' numeri.')
      !this.$v.smsForm.cell.maxLength && errors.push('Il numero di telefono mobile deve essere composto da massimo' + this.$v.smsForm.cell.$params.maxLength.max + 'numeri.')
      !this.$v.smsForm.cell.serverFailed && errors.push(this.serverErrors.cell)
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    emailForm: {
      email: {
        required,
        email,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'email')
        }
      }
    },
    smsForm: {
      cell: {
        required,
        minLength: minLength(CELL_MIN_LENGTH),
        maxLength: maxLength(CELL_MAX_LENGTH),
        numeric,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'cell')
        }
      }
    }
  },
  methods: {
    isRobot () {
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return true
      }
      return false
    },

    verificaEmail () {
      this.$v.emailForm.$touch()
      if (this.$v.emailForm.$invalid) return
      if (this.isRobot()) return
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(INFO_VERIFICA_EMAIL, { email: this.emailForm.email })
        .then(({ data }) => {
          this.$router.push({ name: 'attivazione_email_info' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(INFO_RESET_STATE)
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
              message: this.$i18n.t('general.api.errors.fields_missed')
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

    verificaSms () {
      this.$v.smsForm.$touch()
      if (this.$v.smsForm.$invalid) return
      if (this.isRobot()) return
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(INFO_VERIFICA_SMS, { cell: this.smsForm.cell })
        .then(({ data }) => {
          this.$router.push({ name: 'attivazione_sms_info' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(INFO_RESET_STATE)
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
              message: this.$i18n.t('general.api.errors.fields_missed')
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
      this.serverErrors = { email: '', cell: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    }
  },
  async created () {
    if (!this.canaleEmailAttivo && !this.canaleSmsAttivo) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: 'Impossibile proseguire, i canali di comunicazione Email ed SMS sono disabilitati.'
      }
    }
  }
}
</script>
