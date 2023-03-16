<template>
  <div>
    <v-form @submit.prevent="iniziaPagamentoIuv">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Codice di avviso di pagamento"
        id="iuv"
        type="text"
        v-model="iuvForm.iuv"
        @change.native="resetErroriServer()"
        :error-messages="iuvErrors"
        autocomplete="off"
        :error-count="3"
        @focusout="toTrim()"
      ></v-text-field>
      <tassa-auto-recaptcha
        :pCount="noCaptchaCount"
        v-on:recaptchaverified="updRecaptchaVerified()"
        v-on:recaptchanotverified="recaptchaVerified = false"
      />
      <v-row class="action-button-wide">
        <v-col cols="12" md="6">
          <v-btn
            depressed
            class="spaceTopButtonSubmit"
            id="cercaIuvBtn"
            aria-label="ricerca i pagamenti"
            type="submit"
            color="primary"
            :disabled="carrelloPagoBollo.length >= limiteCarrelloPagoBollo"
          >
            {{ $t("general.buttons.search") }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            depressed
            aria-label="vai al riepilogo dei pagamenti"
            class="spaceTopButtonSubmit"
            outlined
            color="primary"
            id="riepilogoCarrelloBtn"
            type="button"
            :to="{ name: 'carrello_pagamenti' }"
            v-if="carrelloPagoBollo.length > 0"
          >
            Riepilogo
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import { BOLLO_PAGO_IUV, COMMON_PARAMETRI } from '@/store/actions.type'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'FormPagamentoIuv',
  props: {
    boxErr: { type: Object, required: true }
  },
  components: { TassaAutoRecaptcha },
  data () {
    return {
      iuvForm: { iuv: '' },
      noCaptchaCount: 0,
      recaptchaVerified: false,
      serverErrors: { iuv: '' },
      changeCCParams: { dataParametroAcc: '', dataParametroMod1CC: '', dataParametroMod1BolloCC: '', dataParamAppDateCC: '' }
    }
  },
  computed: {
    ...mapGetters([
      'carrelloPagoBollo',
      'limiteCarrelloPagoBollo',
      'parametri'
    ]),
    iuvErrors () {
      const errors = []
      if (!this.$v.iuvForm.iuv.$dirty) return errors
      !this.$v.iuvForm.iuv.required && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_required'))
      !this.$v.iuvForm.iuv.alphaNum && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_alphaNum'))
      !this.$v.iuvForm.iuv.serverFailed && errors.push(this.serverErrors.iuv)
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    iuvForm: {
      iuv: {
        required,
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'iuv')
        }
      }
    }
  },
  methods: {
    toTrim () {
      this.iuvForm.iuv = this.iuvForm.iuv.replace(/\s/g, '').toUpperCase()
    },
    iniziaPagamentoIuv () {
      this.resetErroriServer()
      this.$v.iuvForm.iuv.$touch()
      if (this.$v.iuvForm.iuv.$invalid) return

      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      this.$emit('controlspinner', { running: true })
      console.log('Marts form: ' + this.changeCCParams.dataParametroAcc)
      const inParams = {
        iuv: this.iuvForm.iuv,
        parametroAcc: this.changeCCParams.dataParametroAcc,
        parametroMod1CC: this.changeCCParams.dataParametroMod1CC,
        parametroMod1BolloCC: this.changeCCParams.dataParametroMod1BolloCC,
        paramAppDateCC: this.changeCCParams.dataParamAppDateCC
      }
      store
        .dispatch(BOLLO_PAGO_IUV, inParams)
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          this.$router.push({ name: 'esito_ricerca_pagamento' })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error.response == null) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: error.message
            })
            return
          }
          switch (error.response.status) {
            case 400:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Parametri obbligatori non valorizzati'
              })
              this.noCaptchaCount++
              this.serverErrors.iuv = 'Errore'
              break
            case 404:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t('bollo.ricevuta.errors.iuv_not_found')
              })
              this.noCaptchaCount++
              // in data.title: "IUV non trovato", la stringa in 'iuv_not_found' e' piu' chiara
              this.serverErrors.iuv = this.$i18n.t('bollo.ricevuta.errors.iuv_not_found')
              break
            case 406:
              this.$emit('updateboxwarn', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              })
              this.noCaptchaCount++
              this.serverErrors.iuv = error.response.data.title
              break
            case 409:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              })
              this.noCaptchaCount++
              this.serverErrors.iuv = error.response.data.title
              break
            case 412:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non trovato'
              })
              this.noCaptchaCount++
              this.serverErrors.iuv = 'Proprietario non trovato'
              break
            case 500:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              })
              break
            case 503:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              })
              break
            default:
              break
          }
        })
    },

    resetErroriServer () {
      this.serverErrors.iuv = ''
      this.$emit('updateboxerr', { message: '', title: '' })
      this.$emit('updateboxwarn', { message: '', title: '' })
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  },
  async created () {
    this.overlay = true
    await store
      .dispatch(COMMON_PARAMETRI, 'MDP_COD_APPLICATIVO_ACC')
      .then(() => {
        this.overlay = false
        this.changeCCParams.dataParametroAcc = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParametroAcc)
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    this.overlay = true
    await store.dispatch(COMMON_PARAMETRI, 'MDP_MOD1_BOLLO')
      .then(() => {
        this.changeCCParams.dataParametroMod1CC = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParametroMod1CC)
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    this.overlay = true
    await store.dispatch(COMMON_PARAMETRI, 'MDP_MOD1_BOLLO_CC')
      .then(() => {
        this.changeCCParams.dataParametroMod1BolloCC = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParametroMod1BolloCC)
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    this.overlay = true
    await store.dispatch(COMMON_PARAMETRI, 'MDP_DATE_CC')
      .then(() => {
        this.changeCCParams.dataParamAppDateCC = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParamAppDateCC)
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
  }
}
</script>
