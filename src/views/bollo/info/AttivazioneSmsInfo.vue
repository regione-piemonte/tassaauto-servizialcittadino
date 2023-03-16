<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
            <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="wrap-view" v-if="this.mostraForm">
          <div class="inner-cont-bollo">
            <div id="boxAttiva" class="col-lg-8 offset-lg-2">
              <v-alert class="alert-form pa-0">
                <h2 class="alert-heading">
                  Conferma numero di telefono mobile
                </h2>
                <div class="rfs-30">{{  esitoInfoVerificaSms.destinatario}}</div>
                <div class="alert-form-fields">
                  <div class="inline-check-submit no-gutters-col">
                    <v-form inline @submit.prevent="richiedi" class="row">
                      <div class="tooltip-field col-md-7 py-md-0 pr-lg-0">
                        <div class="position-relative d-inline-block">
                          <v-checkbox
                            id="privacy"
                            v-model="smsForm.privacy"
                            @change="$v.smsForm.privacy.$touch()"
                            :state="!$v.smsForm.privacy.$error"
                            value="accepted"
                            unchecked-value="not_accepted"
                            :error-messages="privacyErrors"
                            :label="this.$i18n.t('general.privacy')">
                          </v-checkbox>
                          <v-btn
                            fab
                            depressed
                            class="contextual-info privacy-btn"
                            @click="$refs.mwPrivacy.mostraModalePrivacy()">
                            <v-icon>mdi-information</v-icon>
                          </v-btn>
                        </div>
                        <div class="error--text" v-if="this.clickCb && !$v.smsForm.privacy.acceptedPrivacy">
                          Il consenso all'informativa sulla privacy è obbligatorio.
                        </div>
                      </div>
                      <div class="confirm-send col-md-4 offset-md-1">
                        <v-btn
                          depressed
                          type="submit"
                          color="primary" >
                          {{ labelBtnAttivaRevoca }}
                        </v-btn>
                      </div>
                    </v-form>
                  </div>
                </div>
              </v-alert>
              <div class="action-button-wide row">
                <div class="text-left">
                  <BtnBack
                    :backUrl="'verifica_attivazione_info'"
                    :backType="'back'"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="wrap-view col-lg-8 offset-lg-2" v-if="this.mostraEsito">
          <div class="row justify-content-center">
            <v-alert color="warning" show class="alert-form">
              <h4 class="alert-heading">Conferma numero di telefono mobile</h4>
              <p>Per confermare il numero di telefono mobile inserisci qui sotto il codice che ti abbiamo appena inviato via SMS.</p>
              <div class="alert-form-fields">
                <v-form @submit.prevent="confermaCodice">
                  <v-text-field
                    clearable
                    clear-icon="mdi-close-circle"
                    label="Codice"
                    id="token"
                    type="text"
                    v-model="codiceForm.token"
                    @change.native="resetErroriServer()"
                    :error-messages="tokenErrors"
                    autocomplete="off"
                    :error-count="3">
                  </v-text-field>
                  <div class="action-button-wide row">
                    <div class="col-12 text-md-right">
                      <v-btn type="submit" color="primary" depressed>
                        Conferma
                      </v-btn>
                    </div>
                  </div>
                </v-form>
              </div>
            </v-alert>
          </div>
          <div class="action-button-wide row">
            <div class="col-12 text-left">
              <BtnBack
                :backUrl="'verifica_attivazione_info'"
                :backType="'back'"/>
            </div>
          </div>
        </div>
        <div class="wrap-view col-lg-8 offset-lg-2" v-if="this.mostraEsitoConferma">
          <div class="row justify-content-center">
            <div class="form-cerca-veicolo">
              <v-alert color="success" show>
                <p>{{ msgEsitoConferma }}</p>
              </v-alert>
            </div>
          </div>
          <div class="action-button-wide row">
            <div class="col-12 text-md-right">
              <BtnHome />
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <ModalePrivacy
      ref="mwPrivacy"
      v-on:privacyaccepted="smsForm.privacy = 'accepted'"
    />
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnBack from '@/components/layout/btn/BtnBack'
import Spinner from '@/components/layout/Spinner'
import ModalePrivacy from '@/components/privacy/ModalePrivacy'
import {
  INFO_RICHIESTA_ATT_SMS,
  INFO_RICHIESTA_REV_SMS,
  INFO_ATTIVAZ_SMS,
  INFO_REVOCA_SMS
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'
import { acceptedPrivacy } from '@/validators/bolloweb.validator'

export default {
  components: {
    BoxErrore,
    BtnHome,
    BtnBack,
    ModalePrivacy,
    Spinner
  },
  data () {
    return {
      detailError: { title: '', message: '' },
      clickCb: false,
      smsForm: { privacy: 'not_accepted' },
      codiceForm: { token: '' },
      mostraForm: true,
      mostraEsito: false,
      mostraEsitoConferma: false,
      msgEsitoConferma: 'La ricezione di Infobollo via SMS è stata correttamente ',
      overlay: false,
      serverErrors: { token: '' }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    smsForm: {
      privacy: { acceptedPrivacy }
    },
    codiceForm: {
      token: {
        required,
        numeric,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'token')
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'esitoInfoVerificaSms'
    ]),
    labelBtnAttivaRevoca: function () {
      return (this.esitoInfoVerificaSms.dataAttivazione === null || this.esitoInfoVerificaSms.dataAttivazione === '') ? this.$i18n.t('general.buttons.attiva') : this.$i18n.t('general.buttons.revoca')
    },
    privacyErrors () {
      const errors = []
      if (!this.$v.smsForm.privacy.$error) return errors
      !this.$v.smsForm.privacy.acceptedPrivacy && errors.push('')
      return errors
    },
    tokenErrors () {
      const errors = []
      if (!this.$v.codiceForm.token.$dirty) return errors
      !this.$v.codiceForm.token.required && errors.push('Il codice fiscale è obbligatorio.')
      !this.$v.codiceForm.token.numeric && errors.push('Il codice deve essere composto da soli numeri.')
      !this.$v.codiceForm.token.serverFailed && errors.push(this.serverErrors.token)
      return errors
    }
  },
  methods: {
    richiedi () {
      this.clickCb = true
      if (this.$v.smsForm.privacy.$invalid) {
        this.$v.smsForm.privacy.$touch()
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      const actionReq =
        (this.esitoInfoVerificaSms.dataAttivazione === null || this.esitoInfoVerificaSms.dataAttivazione === '') ? INFO_RICHIESTA_ATT_SMS : INFO_RICHIESTA_REV_SMS
      this.overlay = true
      store
        .dispatch(actionReq, { cell: this.esitoInfoVerificaSms.destinatario })
        .then(({ data }) => {
          this.overlay = false
          if (data.esito === 'OK') {
            this.mostraEsito = true
            this.mostraForm = false
          } else {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
            }
          }
        })
        .catch((error) => {
          this.overlay = false
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    },
    confermaCodice () {
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const actionConf = (this.esitoInfoVerificaSms.dataAttivazione === null || this.esitoInfoVerificaSms.dataAttivazione === '') ? INFO_ATTIVAZ_SMS : INFO_REVOCA_SMS
      this.msgEsitoConferma += (this.esitoInfoVerificaSms.dataAttivazione === null || this.esitoInfoVerificaSms.dataAttivazione === '') ? 'attivata' : 'disattivata'
      this.overlay = true
      store
        .dispatch(actionConf, {
          cell: this.esitoInfoVerificaSms.destinatario,
          token: this.codiceForm.token
        })
        .then(({ data }) => {
          this.overlay = false
          if (data.esito === 'OK') {
            this.mostraEsito = false
            this.mostraForm = false
            this.mostraEsitoConferma = true
            this.msgEsitoConferma += ' sul numero: ' + this.esitoInfoVerificaSms.destinatario
          } else {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
            }
          }
        })
        .catch((error) => {
          this.overlay = false
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Token di sicurezza non valido/scaduto'
            }
            this.serverErrors.token = 'Token di sicurezza non valido/scaduto'
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('destinatario non trovato')
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.params_invalid')
            }
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },
    resetErroriServer () {
      this.serverErrors.token = ''
    }
  }
}
</script>
