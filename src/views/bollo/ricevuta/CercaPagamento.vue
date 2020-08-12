<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <p>
          {{ $t('bollo.ricevuta.service_description_1') }}<br>
          Si possono scaricare solo le ricevute di pagamenti effettuati tramite <strong>PagoPa</strong>.
        </p>
      </div>
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2"
        id="boxErrDiv"
        tabindex="-1">
        <box-errore
          :error="detailError"
        />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="ricevuta-hp col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
        <v-img
          class="imgHomeServizio"
          width="178"
          :src="require('@/assets/images/ritagli/servizi/scarica_ricevuta.svg')"
          fluid
        />
        <div class="text-inner">
          <p>
            Il codice IUV (Identificativo Unico Versamento) si trova nella mail Pagamento online della <strong>Tassa Automobilistica: ricevuta di pagamento.</strong>
          </p>
          <p>
            Il <strong>codice avviso di pagamento</strong> si trova:
          </p>
          <ul>
            <li>
              nel documento <strong>sintesi di pagamento</strong><span class="sr-only">.</span>
            </li>
            <li>
              nell'
              <v-dialog v-model="dialog" max-width="600">
                <template v-slot:activator="{ on }">
                  <a role="button" name="modalAvvisoScadenza" v-on="on">avviso di scadenza</a>
                </template>
                <v-card class="card-view-page">
                  <v-card-title class="justify-end">
                    <v-icon @click="closeDialog()">mdi-close</v-icon>
                  </v-card-title>
                  <v-img
                    :src="require(`@/assets/images/ritagli/${regione}/modal-bollo_codice_avviso_pagamento.jpg`)"
                    alt="Dove è il codice avviso di pagamento?" fluid
                  />
                </v-card>
              </v-dialog>
              <span class="sr-only">avviso di scadenza</span> cartaceo<span class="sr-only">.</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="ricevuta-hp-form col-xxl-4 col-md-6 offset-xxl-1">
        <h2>
          {{ $t('bollo.ricevuta.cerca_titolo') }}
        </h2>

        <v-form
          @submit.prevent="cercaPagamento"
          id="cercaPagamento">
            <v-text-field
              clearable
              clear-icon="mdi-close-circle"
              label="IUV / Codice di avviso di pagamento"
              id="iuv"
              type="text"
              v-model="cercaForm.iuv"
              @change.native="resetErroriServer()"
              :maxlength="$v.cercaForm.iuv.$params.maxLength.max"
              :error-messages="iuvErrors"
              autocomplete="off"
              :error-count="3"
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
import { IUV_LENGTH, NO_RECAPTCHA_ATTEMPTS, REGIONE_ABILITATA } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import { RICEVUTA_PAGAMENTO, RICEVUTA_PAGAMENTO_RESET_STATE } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, alphaNum, maxLength } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha },
  data () {
    return {
      dialog: false,
      detailError: { message: '', title: '' },
      cercaForm: { iuv: '' },
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      regione: REGIONE_ABILITATA,
      serverErrors: { iuv: '' }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      iuv: {
        required,
        alphaNum,
        maxLength: maxLength(IUV_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'iuv')
        }
      }
    }
  },
  computed: {
    iuvErrors () {
      const errors = []
      if (!this.$v.cercaForm.iuv.$dirty) return errors
      !this.$v.cercaForm.iuv.required && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_required'))
      !this.$v.cercaForm.iuv.alphaNum && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_required'))
      !this.$v.cercaForm.iuv.serverFailed && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_not_found'))
      return errors
    }
  },
  methods: {
    cercaPagamento () {
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
        .dispatch(RICEVUTA_PAGAMENTO, this.cercaForm.iuv)
        .then(({ data }) => {
          this.$router.push({ name: 'esito_ricevuta' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(RICEVUTA_PAGAMENTO_RESET_STATE)
          if (error == null || error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }

          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('bollo.ricevuta.errors.iuv_not_found')
            }
            this.noCaptchaCount++
            this.serverErrors.iuv = this.$i18n.t('bollo.ricevuta.errors.iuv_not_found')
          }
          document.getElementById('boxErrDiv').focus()
        })
    },

    resetErroriServer () {
      this.serverErrors.iuv = ''
      this.detailError = { message: '', title: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  }
}
</script>
