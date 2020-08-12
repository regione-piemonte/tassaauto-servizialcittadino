<template>
  <div class="col-xxl-4 col-md-6 second-col d-flex">
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoSms.stato=='INATTIVO'">
      <div class="alert alert-form alert-quaternary">
        <div
          class="d-block"
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
                @change.native="resetErroriServer()"
                :maxlength="$v.smsForm.cell.$params.maxLength.max"
                :error-messages="cellErrors"
                autocomplete="off"
                :error-count="5"
                ></v-text-field>
              <div class="inline-check-submit">
                <div class="tooltip-field">
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
                      class="contextual-info"
                      @click="$refs.mwPrivacy.mostraModalePrivacy()">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div class="confirm-send mt-5">
                <v-btn type="submit" class="btn-block">Attiva</v-btn>
              </div>
              <div class="error-label"
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
        <div class="d-block">
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
                block=""
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
      v-if="esitoMemoVerifica.statoSms.stato == 'ATTESA_REVOCA'">
      <v-alert
        class="alert-form"
        type="warning"
        border="left">
        <div class="d-block">
          <div
            v-if="esitoMemoVerifica.statoSms.stato == 'ATTESA_REVOCA'">
            <h4 class="alert-heading">
              Revoca Memobollo via SMS
            </h4>
            <p>
              <strong>Attenzione!</strong> Stai revocando Memobollo via SMS. Per confermare la revoca inserisci <strong>qui sotto</strong> il codice che ti abbiamo appena <strong>inviato via SMS</strong>
            </p>
          </div>
          <v-form
            id="confermaCodice"
            @submit.prevent="confermaCodice"
          >
            <v-text-field
              clearable
              clear-icon="mdi-close-circle"
              background-color="#666"
              outlined
              :label="Codice"
              id="token"
              type="text"
              v-model="codiceForm.token"
              @change.native="resetErroriServer()"
              :error-messages="codiceTokenErrors"
              autocomplete="off"
              :error-count="3"
            />
            <div class="alert-form-fields">
              <v-btn
                type="submit"
                color="primary">
                Conferma
              </v-btn>
            </div>
          </v-form>
          <p>
            Non hai ricevuto l'SMS per la revoca? Fai click <a class="only-text" @click="richiediRevoca()">QUI</a>
          </p>
        </div>
      </v-alert>
    </div>
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoSms.stato == 'ATTIVO' && revocaAttivazione == false">
      <v-alert
        color="success"
        dense
        outlined
        aria-live="off" show class="w-100 pa-8 alertSuccessMemo">
        <div class="d-block">
          <h4 class="alert-heading-success">Memobollo attivo via SMS</h4>
          <small class="alert-sub-heading">attivo dal: <strong>{{ new Date(esitoMemoVerifica.statoSms.dataAttivazione) | dateFormat('DD/MM/YYYY')  }}</strong></small>
          <v-list flat>
            <v-list-item-group :no-action="true">
              <v-list-item id="" :inactive="true" :ripple="false">
                Numero di telefono mobile: <strong class="d-block">{{ esitoMemoVerifica.statoSms.destinatario }}</strong>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <div class="alert-form-fields">
            <div class="pt-6">
              <v-btn
                @click="richiediRevoca()"
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
      <v-alert class="alert-form" color="danger" outlined show >
        <div class="d-block">
          <h4 class="alert-heading">
            Revoca memobollo via SMS
          </h4>
          <small class="alert-sub-heading">attivo dal: <strong>{{ new Date(esitoMemoVerifica.statoSms.dataAttivazione) | dateFormat('DD/MM/YYYY')  }}</strong></small>
          <v-list class="text-uppercase mb-4" flat>
            <v-list-item-group :no-action="true">
              <v-list-item id="" :inactive="true" :ripple="false">
                Numero di telefono mobile: <strong class="d-block">{{ esitoMemoVerifica.statoSms.destinatario }}</strong>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <p>
            <strong>Attenzione!</strong> Stai revocando Memobollo via SMS. Per confermare la revoca inserisci <strong>qui sotto</strong> il codice che ti abbiamo appena <strong>inviato via SMS</strong>
          </p>
          <div class="alert-form-fields">
            <v-form
            id="confermaCodice"
              @submit.prevent="confermaCodice">
              <v-text-field
                clearable
                clear-icon="mdi-close-circle"
                background-color="#666"
                outlined
                :label="Codice"
                id="token"
                type="text"
                v-model="codiceForm.token"
                @change.native="resetErroriServer()"
                :error-messages="codiceTokenErrors"
                autocomplete="off"
                :error-count="3"
                ></v-text-field>
            </v-form>
            <v-btn
              @click="confermaRevoca()"
              color="primary">
              <v-icon>mdi-trash-can</v-icon> Revoca
            </v-btn>
            <v-btn
              @click="revocaAttivazione=false">
              Annulla
            </v-btn>
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
import { MEMO_RICHIESTA_ATT_SMS, MEMO_RICHIESTA_REV_SMS, MEMO_ATTIVAZ_SMS, MEMO_REVOCA_SMS } from '@/store/actions.type'
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
      !this.$v.smsForm.cell.serverFailed && errors.push(this.serverErrors.cell)
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
          message: this.$i18n.t('general.api.errors.search_params_invalid')
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
      const actionConf = (this.esitoMemoVerifica.statoSms.stato === 'IN_ATTESA') ? MEMO_ATTIVAZ_SMS : MEMO_REVOCA_SMS
      store
        .dispatch(actionConf, {
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
