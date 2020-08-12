<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2"
      id="boxErrDiv">
        <box-errore
          :error="detailError"
        />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="calcolo-sicuro col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
        <v-img
          class="imgHomeServizio"
          width="178"
          :src="require('@/assets/images/ritagli/servizi/calcola_bollo.svg')"
          fluid
        />
        <div class="text-inner">
          <strong>{{ $t('bollo.calcolo.title') }}</strong>
          <p>
            Con questo servizio puoi conoscere subito <strong>l'importo</strong> da pagare per il bollo della tua auto.
          </p>
        </div>
      </div>
      <div class="form-cerca-veicolo col-xxl-4 col-md-6 offset-xxl-1">
        <h2>
          Cerca un veicolo
        </h2>
        <v-form @submit.prevent="calcolaImporto">
          <Targa
            ref="targa"
            :pServerErr="serverErrors.targa"
            v-on:targachanged="resetErrori()"
          />
          <v-select
            id="tipoVeicolo"
            :items="veicoli"
            label="Scegli il tipo di veicolo"
            v-model="calcForm.tipoVeicolo"
            @change.native="resetErrori()"
            :error-messages="tipoVeicoloErrors"
            :error-count="1">
          </v-select>

          <tassa-auto-recaptcha
            :pCount="noCaptchaCount"
            v-on:recaptchaverified="updRecaptchaVerified()"
            v-on:recaptchanotverified="recaptchaVerified = false"
          />
          <v-btn type="submit" color="primary" class="spaceTopButtonSubmit">
            {{ $t('general.buttons.calcola') }}
          </v-btn>
        </v-form>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import Targa from '@/components/Targa'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import { BOLLO_CALCOLO, BOLLO_CALCOLO_RESET_STATE, VEICOLO_LISTA } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha, Targa },
  data () {
    return {
      detailError: { message: '', title: '' },
      veicoli: [],
      calcForm: {
        tipoVeicolo: null
      },
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      serverErrors: { targa: '' }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    calcForm: {
      tipoVeicolo: { required }
    }
  },
  computed: {
    tipoVeicoloErrors () {
      const errors = []
      if (!this.$v.calcForm.tipoVeicolo.$dirty) return errors
      !this.$v.calcForm.tipoVeicolo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    }
  },
  methods: {
    calcolaImporto () {
      this.resetErrori()
      this.$refs.targa.$v.targaForm.$touch()
      this.$v.$touch()
      if (this.$v.$invalid || this.$refs.targa.$v.targaForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }

      this.overlay = true
      store
        .dispatch(BOLLO_CALCOLO, { tipo_veicolo: this.calcForm.tipoVeicolo, targa: this.$refs.targa.getValore() })
        .then(() => {
          this.$router.push({ name: 'esito_calcolo' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(BOLLO_CALCOLO_RESET_STATE)
          if (error == null || error.response.status === 500 || error.response.status === 503) {
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
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.serverErrors.targa = error.response.data.title
            this.noCaptchaCount++
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.targa_invalid')
            }
            this.serverErrors.targa = this.$i18n.t('general.api.errors.targa_invalid')
            this.noCaptchaCount++
          }
        })
    },

    resetErrori () {
      this.$v.$reset()
      this.detailError = { message: '', title: '' }
      this.resetErroriServer()
    },

    resetErroriServer () {
      this.serverErrors.targa = ''
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    }
  },
  async created () {
    store
      .dispatch(VEICOLO_LISTA, { filtro: 'true' }) // calcolo bollo solo per un sottoinsieme di veicoli
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
