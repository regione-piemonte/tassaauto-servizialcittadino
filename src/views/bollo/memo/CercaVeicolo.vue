<template>
  <div class="app-container">
    <v-card class="card-view-page">
      <div class="app-row inner-cont-alert">
        <div class="text-intro col-xxl-8 offset-xxl-2"
        id="boxErrDiv">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="app-row inner-cont-bollo">
        <div class="memo-hp col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
          <v-img
            class="imgHomeServizio"
            width="178"
            :src="require('@/assets/images/ritagli/servizi/memobollo.svg')"
            alt=""
            fluid/>
          <div class="text-inner">
            <strong>Per fortuna c'è Memobollo</strong>
            <p
              v-html="descrizione"
            />
            <router-link
              :to="{ name: 'video_tutorial', hash:'#memobollo_video'}"
              v-if="videoTutorial()">
              <strong><span class="sr-only">Vai al </span>Video tutorial di Memobollo</strong>
            </router-link>
          </div>
        </div>
        <div class="form-memo-hp col-xxl-4 col-md-6 offset-xxl-1">
          <h3>
            Cerca un veicolo
          </h3>
          <v-form @submit.prevent="verificaMemo" id="verificaMemo">
            <v-text-field
              clearable
              clear-icon="mdi-close-circle"
              label="Codice fiscale / P.IVA"
              type="text"
              id="codiceFiscale"
              v-model="cercaForm.codiceFiscale"
              @change.native="resetErroriServer()"
              :maxLength="$v.cercaForm.codiceFiscale.$params.maxLength.max"
              :error-messages="codiceFiscaleErrors"
              autocomplete="off"
              :error-count="1"
            />
            <Targa
              ref="targa"
              :pServerErr="serverErrors.targa"
              v-on:targachanged="resetErroriServer()"
            />
            <v-select
              id="tipoVeicolo"
              :items="veicoli"
              label="Scegli il tipo di veicolo"
              v-model="cercaForm.tipoVeicolo"
              :error-messages="tipoVeicoloErrors"
              :error-count="1">
            </v-select>
            <tassa-auto-recaptcha
              :pCount="noCaptchaCount"
              v-on:recaptchaverified="updRecaptchaVerified()"
              v-on:recaptchanotverified="recaptchaVerified = false"
            />
            <v-btn
              class="spaceTopButtonSubmit"
              type="submit"
              color="primary"
              :disabled="cercaVeicoloDisabled">
              Cerca un veicolo
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
  COD_FISCALE_MIN_LENGTH,
  COD_FISCALE_MAX_LENGTH,
  NO_RECAPTCHA_ATTEMPTS,
  REGIONE_PARAMS,
  videoServizio
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import Targa from '@/components/Targa'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import { MEMO_RESET_STATE, MEMO_VERIFICA, VEICOLO_LISTA } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha, Targa },
  data () {
    return {
      cercaVeicoloDisabled: false,
      detailError: { message: '', title: '' },
      veicoli: [],
      cercaForm: {
        codiceFiscale: '',
        tipoVeicolo: null
      },
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      serverErrors: { codiceFiscale: '', targa: '' }
    }
  },
  computed: {
    descrizione: function () {
      let descrRif = ''
      if (emailAttiva()) descrRif += 'una <strong>e-mail</strong>'
      if (descrRif !== '' && smsAttivo()) descrRif += ' e/o '
      if (smsAttivo()) descrRif += 'un <strong>SMS (gratuito)</strong>'
      return 'Iscriviti per ricevere ' + descrRif + ' che ti avvisa prima della scadenza del bollo auto.'
    },
    tipoVeicoloErrors () {
      const errors = []
      if (!this.$v.cercaForm.tipoVeicolo.$dirty && !this.$v.cercaForm.tipoVeicolo !== null) return errors
      !this.$v.cercaForm.tipoVeicolo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    },
    codiceFiscaleErrors () {
      const errors = []
      if (!this.$v.cercaForm.codiceFiscale.$dirty && !this.$v.cercaForm.codiceFiscale !== null) return errors
      !this.$v.cercaForm.codiceFiscale.required && errors.push(this.$i18n.t('general.validations.codiceFiscale.obbligatorio'))
      !this.$v.cercaForm.codiceFiscale.minLength && errors.push(this.$i18n.t('general.validations.codiceFiscale.lunghezza', { num: this.$v.cercaForm.codiceFiscale.$params.minLength.min }))
      !this.$v.cercaForm.codiceFiscale.alphaNum && errors.push(this.$i18n.t('general.validations.codiceFiscale.alfanumerico'))
      !this.$v.cercaForm.codiceFiscale.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      codiceFiscale: {
        required,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      },
      tipoVeicolo: { required }
    }
  },
  methods: {
    verificaMemo () {
      this.$v.$touch()
      this.$refs.targa.$v.targaForm.$touch()
      if (this.$v.$invalid || this.$refs.targa.$v.targaForm.$invalid) return

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
        .dispatch(MEMO_VERIFICA, {
          targa: this.$refs.targa.getValore(),
          tipoVeicolo: this.cercaForm.tipoVeicolo,
          codiceFiscale: this.cercaForm.codiceFiscale
        })
        .then(({ data }) => {
          this.$router.push({ name: 'attivazione_memo' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(MEMO_RESET_STATE)
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
            this.noCaptchaCount++
            this.serverErrors.codiceFiscale = 'Codice fiscale non corrisponde al proprietario del veicolo'
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Veicolo non trovato'
            }
            this.noCaptchaCount++
            this.serverErrors.targa = 'Veicolo non trovato'
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
      this.serverErrors = { codiceFiscale: '', targa: '' }
      this.detailError = { message: '', title: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('memo_bollo') !== '')
    }
  },
  async created () {
    if (!emailAttiva() && !smsAttivo()) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: 'Impossibile proseguire, i canali di comunicazione Email ed SMS sono disabilitati.'
      }
      this.cercaVeicoloDisabled = true
      return
    }
    store
      .dispatch(VEICOLO_LISTA, { filtro: 'true' }) // memo bollo solo per un sottoinsieme di veicoli
      .then((data) => {
        this.veicoli = data
      })
      .catch((error) => {
        if (error != null && error.message != null) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable') + '(' + error.message + ')'
          }
        }
      })
  }
}
</script>
