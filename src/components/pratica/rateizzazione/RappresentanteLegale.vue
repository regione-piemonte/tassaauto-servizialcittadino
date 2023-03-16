<template>
  <div>
    <div v-show="step === 1">
      <sub-wizard
        :servizio="'richiesta_rappresentante_legale'"
        :stepAttivo="0"
      />
      <rappresentante-legale-box
        ref="RappresentanteLegaleBox"
      />
      <v-btn
        depressed
        id="btnRappLegStep2"
        @click="next()"
        type="submit"
        color="primary">
        {{ $t('general.buttons.avanti') }}
      </v-btn>
    </div>
    <div v-show="step === 2">
      <sub-wizard
        :servizio="'richiesta_rappresentante_legale'"
        :stepAttivo="1"
      />
      <div class="space-section">
        <h2>
          Dati soggetto rappresentato
        </h2>
        <v-form
          @submit.prevent="iniziaRichiestaRateizzazione">
          <codice-fiscale
            ref="cFSoggRapp"
            :servizioCF="'RappresentanteLegale'"
            :pServerErr="serverErrors.codiceFiscale"
            v-on:cfchanged="serverErrors.codiceFiscale=''"
          />
          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="Numero Protocollo"
            id="numProt"
            type="text"
            v-model="cercaFormRap.numeroProtocollo"
            @change.native="resetErroriServer()"
            :error-messages="nProtErrors"
            autocomplete="off"
            :error-count="4"></v-text-field>

          <div
            v-html="this.$i18n.t('pratica.rateizzazione.cerca.text_info')"
            class="mb-5"
          />
          <tassa-auto-recaptcha
            :pCount="noCaptchaCount"
            v-on:recaptchaverified="updRecaptchaVerified()"
            v-on:recaptchanotverified="recaptchaVerified = false"
          />
          <div class="action-button-wide row">
            <div class="col-md-6">
              <v-btn
                depressed
                @click.prevent="step = 1">
                Indietro
              </v-btn>
            </div>
            <div class="col-md-6 text-md-right">
              <v-btn
                depressed
                id="btnRappLegCerca"
                type="submit"
                color="primary">
                {{ $t('general.buttons.avanti') }}
              </v-btn>
            </div>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import ApiError from '@/common/api.error'
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import CodiceFiscale from '@/components/CodiceFiscale'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import SubWizard from '@/components/layout/SubWizard'
import RappresentanteLegaleBox from '@/components/pratica/RappresentanteLegaleBox'
import { required, minLength, alphaNum } from 'vuelidate/lib/validators'
import NavigatorService from '@/common/navigator.service'
import store from '@/store'
import {
  DATI_INTESTATARIO,
  DATI_LEGALE_RAPPRESENTANTE,
  PRATICA_RICHIESTA_INTESTATARIO
} from '@/store/actions.type'
import { validationMixin } from 'vuelidate'

export default {
  name: 'RappresentanteLegale',
  components: {
    CodiceFiscale,
    RappresentanteLegaleBox,
    SubWizard,
    TassaAutoRecaptcha
  },
  props: {
    boxErr: { type: Object, required: true }
  },
  data () {
    return {
      cercaFormRap: {
        numeroProtocollo: null
      },
      serverErrors: {
        codiceFiscale: '',
        numeroProtocollo: ''
      },
      noCaptchaCount: 0,
      recaptchaVerified: false,
      step: 1
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaFormRap: {
      numeroProtocollo: {
        required,
        minLength: minLength(10),
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroProtocollo')
        }
      }
    }
  },
  computed: {
    nProtErrors () {
      const errors = []
      if (!this.$v.cercaFormRap.numeroProtocollo.$dirty) return errors
      !this.$v.cercaFormRap.numeroProtocollo.required && errors.push('Il numero di protocollo è obbligatorio.')
      !this.$v.cercaFormRap.numeroProtocollo.minLength && errors.push('Il numero di protocollo deve avere una lunghezza di ' + this.$v.cercaFormRap.numeroProtocollo.$params.minLength.min + ' caratteri.')
      !this.$v.cercaFormRap.numeroProtocollo.alphaNum && errors.push('Il numero di protocollo deve contenere solo lettere e numeri.')
      !this.$v.cercaFormRap.numeroProtocollo.serverFailed && errors.push(this.serverErrors.numeroProtocollo)
      return errors
    }
  },
  methods: {
    next () {
      if (!this.$refs.RappresentanteLegaleBox.datiRapprLegaleValidi()) return
      this.step = 2
    },

    formValido () {
      let formValid = true
      this.$refs.cFSoggRapp.$v.cfForm.$touch()
      if (this.$refs.cFSoggRapp.$v.cfForm.$invalid) formValid = false
      this.$v.cercaFormRap.$touch()
      if (this.$v.cercaFormRap.$invalid) formValid = false
      return formValid
    },

    iniziaRichiestaRateizzazione () {
      this.$emit('updateboxerr', { title: '', message: '' })
      this.$emit('updateboxwarn', { title: '', message: '' })

      if (!this.formValido()) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }

      const datiRapprLegale = this.$refs.RappresentanteLegaleBox.datiRappresentanteLegale()
      store.dispatch(DATI_LEGALE_RAPPRESENTANTE, datiRapprLegale)

      if (!NavigatorService.checkInternetConnection()) return
      const codiceFiscale = this.$refs.cFSoggRapp.getValore().toUpperCase()
      this.$emit('controlspinner', { running: true })
      store
        .dispatch(DATI_INTESTATARIO, codiceFiscale)
        .then(({ data }) => {
          if (data.personaFisica) {
            // come Rappresentante Legale è possibile chiedere la rateizzazione solo per le persone giuridiche
            this.$emit('controlspinner', { running: false })
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Il Codice fiscale specificato in <i>Dati soggetto rappresentato</i> corrisponde ad una persona fisica, ' +
                'come Rappresentante Legale è possibile chiedere la rateizzazione solo per le persone giuridiche.'
            })
            return
          }
          this.listaAvvisiAccertamento(codiceFiscale)
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error === null || error.response === undefined) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            })
            return
          }
          if (error.response.status === 400) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.params_not_found')
            })
            this.noCaptchaCount++
          } else if (error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.params_invalid')
            })
            this.noCaptchaCount++
            this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
          } else if (error.response.status === 500 || error.response.status === 503) {
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
          numeroProtocollo: this.cercaFormRap.numeroProtocollo.toUpperCase()
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
          } else if (error.response.status === 500 || error.response.status === 503) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              // message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              message: this.$i18n.t('general.api.errors.service_unavailable')
            })
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = {
        codiceFiscale: '',
        numeroProtocollo: ''
      }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  }
}
</script>
