<template>
  <div class="col-lg-4 col-md-6 second-col d-flex">
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoSms.stato=='INATTIVO'">
      <div class="alert alert-form alert-quaternary mr-lg-7 mb-xl-0">
        <div
          class="d-block d-block-memo"
          id="boxAttivaSms">
          <h4>
            Attiva Memobollo via SMS
          </h4>
          <div class="alert-form-fields">
            <v-form
            id="nuovaAttivazioneCell"
              @submit.prevent="nuovaAttivazione">
              <v-text-field
                clearable
                clear-icon="mdi-close-circle"
                :label="$t('bollo.info.labels.cell')"
                id="cell"
                type="text"
                v-model="smsForm.cell"
                @focus="resetErroriServer()"
                :maxlength="$v.smsForm.cell.$params.maxLength.max"
                :error-messages="cellErrors"
                autocomplete="off"
                :error-count="5"
                ></v-text-field>
              <div class="inline-check-submit no-gutters-col">
                <div class="tooltip-field col-lg-12 col-md-7 py-md-0 pr-lg-0 text-left">
                  <div class="position-relative d-inline-block">
                    <v-checkbox
                      id="privacySms"
                      v-model="smsForm.privacy"
                      @change="$v.smsForm.privacy.$touch()"
                      :error-messages="privacyErrors"
                      :state="!$v.smsForm.privacy.$error"
                      value="accepted"
                      unchecked-value="not_accepted"
                      :label="this.$i18n.t('general.privacy')">
                    </v-checkbox>
                    <v-btn
                      fab
                      aria-label="Privacy Policy per i servizi di Tassa Auto"
                      depressed
                      class="contextual-info privacy-btn"
                      @click="$refs.mwPrivacy.mostraModalePrivacy()">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div class="confirm-send col-md-4 offset-md-1 mt-5">
                <v-btn
                  color="primary"
                  outlined
                  aria-label="attiva il servizio"
                  depressed
                  type="submit">
                  Attiva
                </v-btn>
              </div>
              <div class="error--text"
                v-if="this.clickCb && !$v.smsForm.privacy.acceptedPrivacy">
                Il consenso all'informativa sulla privacy è obbligatorio.
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoSms.stato == 'IN_ATTESA'">
      <v-alert
      color="warning"
      border="left"
      class="w-100"
      show>
        <div class="d-block d-block-memo">
          <h4 class="alert-heading">
            Attivazione Memobollo via SMS
          </h4>
          <p>
            Per confermare il numero di telefono mobile inserisci <strong>qui sotto</strong> il codice che ti abbiamo appena <strong>inviato via SMS</strong>
          </p>
          <div class="alert-form-fields">
            <v-form
              id="confermaCodice"
              @submit.prevent="confermaCodice"
            >
              <v-text-field
                clearable
                clear-icon="mdi-close-circle"
                outlined
                label="Codice"
                id="token"
                type="text"
                v-model="codiceForm.token"
                @change.native="resetErroriServer()"
                :error-messages="codiceTokenErrors"
                autocomplete="off"
                :error-count="3"
              />
              <v-btn
                depressed
                block=""
                aria-label="conferma il servizio"
                type="submit"
                color="primary">
                Conferma
              </v-btn>
            </v-form>
            <p>
              Non hai ricevuto l'SMS per l'attivazione? Fai click <a class="only-text" @click="nuovoToken()">QUI</a>
            </p>
          </div>
        </div>
      </v-alert>
    </div>
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoSms.stato == 'ATTIVO' && revocaAttivazione == false">
      <v-alert
        color="success"
        dense
        outlined
        aria-live="off" show class="w-100 pa-6 alertSuccessMemo">
        <div class="d-block d-block-memo">
          <h4 class="alert-heading-success">
            Memobollo attivo <br/>via SMS
          </h4>
          <small class="alert-sub-heading">
            attivo dal: <strong>{{ new Date(esitoMemoVerifica.statoSms.dataAttivazione) | dateFormat('DD/MM/YYYY')  }}</strong>
          </small>
          <v-list flat>
            <v-list-item-group :no-action="true" aria-label="dati numero di telefono">
              <v-list-item id="" :inactive="true" :ripple="false">
                Numero di telefono mobile:&nbsp;<strong class="d-block d-block-memo"> {{ esitoMemoVerifica.statoSms.destinatario }}</strong>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <div class="alert-form-fields">
            <div class="pt-6">
              <v-btn
                id="revocaSmsBtn"
                aria-label="revoca il servizio"
                depressed
                @click="revocaAttivazione = true"
                color="primary"
                block><v-icon>mdi-trash-can</v-icon> Revoca
              </v-btn>
            </div>
          </div>
        </div>
      </v-alert>
    </div>
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoSms.stato == 'ATTIVO' && revocaAttivazione == true">
      <v-alert
        class="alert-form"
        dense
        outlined
        color="error"
        aria-live="off"
        show
      >
        <div class="d-block d-block-memo">
          <h4 class="alert-heading">
            Revoca Memobollo via SMS
          </h4>
          <small class="alert-sub-heading">
            attivo dal: <strong>{{ new Date(esitoMemoVerifica.statoSms.dataAttivazione) | dateFormat('DD/MM/YYYY')  }}</strong>
          </small>
          <v-list class="text-uppercase mb-4" flat>
            <v-list-item-group :no-action="true" aria-label="dati numero di telefono">
              <v-list-item id="" :inactive="true" :ripple="false">
                Numero di telefono mobile: <strong class="d-block d-block-memo">{{ esitoMemoVerifica.statoSms.destinatario }}</strong>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <p>
            <strong>Attenzione!</strong> Stai revocando Memobollo via SMS.
          </p>
          <div class="alert-form-fields">
            <div class="pt-6">
              <v-btn
                id="confermaRevocaSms"
                aria-label="conferma la revoca del servizio"
                depressed
                @click="richiediRevoca()"
                color="primary">
                <v-icon>mdi-trash-can</v-icon> Revoca
              </v-btn>
              <v-btn
                depressed
                aria-label="annulla la revoca del servizio"
                @click="revocaAttivazione=false">
                Annulla
              </v-btn>
            </div>
          </div>
        </div>
      </v-alert>
    </div>
    <ModalePrivacy
      ref="mwPrivacy"
      v-on:privacyaccepted="smsForm.privacy = 'accepted'"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import NavigatorService from '@/common/navigator.service'
import ModalePrivacy from '@/components/privacy/ModalePrivacy'
import { MEMO_RICHIESTA_ATT_SMS, MEMO_RICHIESTA_REV_SMS, MEMO_ATTIVAZ_SMS } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import { acceptedPrivacy } from '@/validators/bolloweb.validator'

export default {
  name: 'AttivazioneSmsMemo',
  props: {
    boxErr: { type: Object, required: true }
  },
  components: { ModalePrivacy },
  data () {
    return {
      clickCb: false,
      revocaAttivazione: false,
      codiceForm: { token: '' },
      smsForm: { cell: '', privacy: 'not_accepted' },
      serverErrors: { cell: '', token: '' }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    codiceForm: {
      token: {
        required,
        numeric,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'token')
        }
      }
    },
    smsForm: {
      cell: {
        required,
        minLength: minLength(9),
        maxLength: maxLength(10),
        numeric,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'cell')
        }
      },
      privacy: { acceptedPrivacy }
    }
  },
  computed: {
    ...mapGetters([
      'esitoMemoVerifica'
    ]),
    codiceTokenErrors () {
      const errors = []
      if (!this.$v.codiceForm.token.$dirty) return errors
      !this.$v.codiceForm.token.required && errors.push('Il codice è obbligatorio.')
      !this.$v.codiceForm.token.numeric && errors.push('Il codice deve essere composto da soli numeri.')
      !this.$v.codiceForm.token.serverFailed && errors.push(this.serverErrors.token)
      return errors
    },
    cellErrors () {
      const errors = []
      if (!this.$v.smsForm.cell.$dirty) return errors
      !this.$v.smsForm.cell.required && errors.push('Il numero di telefono mobile è obbligatorio.')
      !this.$v.smsForm.cell.minLength && errors.push('Il telefono mobile deve essere composto da almeno ' + this.$v.smsForm.cell.$params.minLength.min + ' numeri.')
      !this.$v.smsForm.cell.maxLength && errors.push('Il telefono mobile deve essere composto da massimo ' + this.$v.smsForm.cell.$params.maxLength.max + ' numeri.')
      !this.$v.smsForm.cell.numeric && errors.push('Il telefono mobile deve essere composto da soli numeri.')
      !this.$v.smsForm.cell.serverFailed && errors.push(this.$i18n.t('general.api.errors.phone_error'))
      return errors
    },
    privacyErrors () {
      const errors = []
      if (!this.$v.smsForm.privacy.$error) return errors
      !this.$v.smsForm.privacy.acceptedPrivacy && errors.push('')
      return errors
    }
  },
  methods: {
    erroriRichAttRev (error) {
      if (error == null || error.response.status === 500) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        })
        return
      }
      if (error.response.status === 400) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.api.errors.no_results'),
          message: 'Parametri obbligatori non valorizzati'
        })
      } else if (error.response.status === 403) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.api.errors.no_results'),
          message: 'Codice fiscale non corrisponde al proprietario del veicolo'
        })
      } else if (error.response.status === 404) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.api.errors.no_results'),
          message: 'Veicolo non trovato'
        })
      } else if (error.response.status === 422) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.api.errors.no_results'),
          message: this.$i18n.t('general.api.errors.pratica_invalid'),
          fieldError: ApiError.serverValidationErrors(error.response.data.detail)
        })
        const detail = error.response.data.detail
        this.serverErrors = ApiError.serverValidationErrors(detail)
      }
    },

    nuovaAttivazione () {
      this.clickCb = true
      this.$v.smsForm.$touch()
      if (this.$v.smsForm.$invalid) return
      this.richiediAttRev(MEMO_RICHIESTA_ATT_SMS, this.smsForm.cell)
    },

    nuovoToken () {
      this.richiediAttRev(MEMO_RICHIESTA_ATT_SMS, this.esitoMemoVerifica.statoSms.destinatario)
    },

    richiediRevoca () {
      this.richiediAttRev(MEMO_RICHIESTA_REV_SMS, this.esitoMemoVerifica.statoSms.destinatario)
    },

    richiediAttRev (action, cell) {
      this.$emit('updateboxerr', {
        title: '',
        message: ''
      })
      const qParams = {
        codiceFiscale: this.esitoMemoVerifica.codiceFiscale,
        targa: this.esitoMemoVerifica.targa,
        tipoVeicolo: this.esitoMemoVerifica.tipoVeicolo.codice,
        cell: cell
      }
      if (!NavigatorService.checkInternetConnection()) return

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(action, qParams)
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          if (data.esito === 'OK') {
            this.$parent.$parent.updateMemo(
              this.esitoMemoVerifica.codiceFiscale,
              this.esitoMemoVerifica.targa,
              this.esitoMemoVerifica.tipoVeicolo.codice)
            this.revocaAttivazione = false
          } else {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
            })
          }
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          this.erroriRichAttRev(error)
        })
    },

    confermaCodice () {
      this.$v.codiceForm.$touch()
      if (this.$v.codiceForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(MEMO_ATTIVAZ_SMS, {
          cell: this.esitoMemoVerifica.statoSms.destinatario,
          token: this.codiceForm.token
        })
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          if (data.esito === 'OK') {
            this.$parent.$parent.updateMemo(
              this.esitoMemoVerifica.codiceFiscale,
              this.esitoMemoVerifica.targa,
              this.esitoMemoVerifica.tipoVeicolo.codice)
          } else {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
            })
          }
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error == null || error.response.status === 500) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            })
            return
          }
          if (error.response.status === 400) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Token di sicurezza non valido/scaduto'
            })
            this.serverErrors.token = 'Token di sicurezza non valido/scaduto'
          } else if (error.response.status === 404) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('destinatario non trovato')
            })
          } else if (error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.params_invalid')
            })
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = { cell: '', token: '' }
    }
  }
}
</script>
