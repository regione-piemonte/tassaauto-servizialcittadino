<template>
  <div>
    <v-form @submit.prevent="iniziaRichiestaRateizzazione">
      <codice-fiscale
        :pServerErr="serverErrors.codiceFiscale"
        :servizioCF="'IntestatarioVeicolo'"
        ref="codiceFiscale"
        v-on:cfchanged="serverErrors.codiceFiscale = ''"
      />
      <v-text-field
        :error-count="3"
        :error-messages="numeroProtocolloErrors"
        :maxlength="$v.cercaForm.numeroProtocollo.$params.maxLength.max"
        @change.native="resetErroriServer()"
        autocomplete="off"
        class="uppercase-input"
        clear-icon="mdi-close-circle"
        clearable
        id="numeroProtocollo"
        label="Numero protocollo"
        type="text"
        v-model="cercaForm.numeroProtocollo"
      ></v-text-field>
      <div
        v-html="this.$i18n.t('pratica.rateizzazione.cerca.text_info')"
        class="mb-5"
      />

      <tassa-auto-recaptcha
        :pCount="noCaptchaCount"
        v-on:recaptchaverified="updRecaptchaVerified()"
        v-on:recaptchanotverified="recaptchaVerified = false"
      />
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
</template>

<script>
import ApiError from '@/common/api.error'
import { NO_RECAPTCHA_ATTEMPTS, NUM_PROTOCOLLO_MAX_LENGTH } from '@/common/config'
import CodiceFiscale from '@/components/CodiceFiscale'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import NavigatorService from '@/common/navigator.service'
import store from '@/store'
import { PRATICA_RICHIESTA_INTESTATARIO, DATI_INTESTATARIO } from '@/store/actions.type'
import { validationMixin } from 'vuelidate'
import { required, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'IntestatarioVeicolo',
  components: { CodiceFiscale, TassaAutoRecaptcha },
  data () {
    return {
      cercaForm: {
        numeroProtocollo: '',
        rateizzazioneScelta: ''
      },
      noCaptchaCount: 0,
      recaptchaVerified: false,
      serverErrors: { codiceFiscale: '', numeroProtocollo: '' }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      numeroProtocollo: {
        required,
        maxLength: maxLength(NUM_PROTOCOLLO_MAX_LENGTH),
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroProtocollo')
        }
      }
    }
  },
  computed: {
    numeroProtocolloErrors () {
      const errors = []
      if (!this.$v.cercaForm.numeroProtocollo.$dirty) return errors
      !this.$v.cercaForm.numeroProtocollo.required && errors.push('Il numero di protocollo è obbligatorio.')
      !this.$v.cercaForm.numeroProtocollo.alphaNum && errors.push('Il numero di protocollo deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.numeroProtocollo.serverFailed && errors.push(this.serverErrors.numeroProtocollo)
      return errors
    }
  },
  methods: {
    formValido () {
      let formValid = true
      if (this.logged) {
        return true
      }
      this.$refs.codiceFiscale.$v.cfForm.$touch()
      if (this.$refs.codiceFiscale.$v.cfForm.$invalid) formValid = false
      this.$v.cercaForm.$touch()
      if (this.$v.cercaForm.$invalid) formValid = false
      return formValid
    },

    iniziaRichiestaRateizzazione () {
      this.$emit('updateboxerr', { title: '', message: '' })
      this.$emit('updateboxwarn', { title: '', message: '' })

      if (!this.formValido() && !this.logged) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified && !this.logged) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection() && !this.logged) return

      const codFiscale = this.$refs.codiceFiscale.getValore().toUpperCase()
      this.$emit('controlspinner', { running: true })
      store
        .dispatch(DATI_INTESTATARIO, codFiscale)
        .then(({ data }) => {
          if (!data.personaFisica) {
            this.$emit('controlspinner', { running: false })
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Per poter inserire una domanda di discarico per una persona giuridica, è necessario utilizzare la ricerca per persona giuridica.'
            })
            return
          }
          this.listaAvvisiAccertamento(codFiscale)
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error === null || error.response === undefined) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            })
          }
          if (error.response.status === 400) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            })
          } else if (error.response.status === 404) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.subject_not_found')
            })
            this.noCaptchaCount++
          } else if (error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            })
            this.noCaptchaCount++
            this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
          } else if (error.response.status === 500) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            })
          }
        })
    },

    listaAvvisiAccertamento (cf) {
      store
        .dispatch(PRATICA_RICHIESTA_INTESTATARIO, {
          codiceFiscale: cf,
          numeroProtocollo: this.cercaForm.numeroProtocollo.toUpperCase()
        })
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          if (data.length === 0) {
            this.$emit('updateboxwarn', {
              title: this.$i18n.t('general.warning'),
              message: 'Non risultano avvisi accertamento da rateizzare associati al codice fiscale ' +
                ' e al numero di protocollo inseriti.'
            })
            return
          }
          this.$router.push({ name: 'numero_rate' })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error == null || error.response === undefined) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: error.message
            })
            return
          }

          if (error.response.status === 400) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            })
            this.noCaptchaCount++
          } else if (error.response.status === 403) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.cf_not_found')
            })
            this.noCaptchaCount++
            this.serverErrors = { codiceFiscale: error.response.data.title, numeroProtocollo: '' }
          } else if (error.response.status === 404) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Avviso di accertamento non trovato'
            })
            this.serverErrors = { codiceFiscale: '', numeroProtocollo: 'Avviso di accertamento non trovato' }
          } else if (error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              // message: 'Impossibile aggiungere l\'accertamento in quanto risulta prescritto'
              message: error.response.data.title
            })
            this.noCaptchaCount++
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          } else if (error.response.status === 500) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              // message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              message: this.$i18n.t('general.api.errors.service_unavailable')
            })
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = { numeroProtocollo: '', codiceFiscale: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  }
}
</script>
