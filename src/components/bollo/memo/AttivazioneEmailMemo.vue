<template>
  <div class="col-xxl-4 offset-xxl-2 col-md-6 first-col d-flex">
    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoEmail.stato=='INATTIVO'">
      <div class="alert alert-form alert-quaternary">
        <div
          class="d-block"
          id="boxAttivaEmail">
          <h4>
            Attiva Memobollo via email
          </h4>
          <div class="alert-form-fields">
            <v-form
              id="nuovaAttivazioneEmaill"
              @submit.prevent="nuovaAttivazione">
              <v-text-field
                clearable
                clear-icon="mdi-close-circle"
                :label="$t('bollo.info.labels.email')"
                id="email"
                type="email"
                v-model="emailForm.email"
                @change.native="resetErroriServer()"
                :error-messages="emailErrors"
                autocomplete="off"
                :error-count="3"
                ></v-text-field>
              <div class="inline-check-submit">
                <div class="tooltip-field">
                  <div class="position-relative d-inline-block">
                    <v-checkbox
                      id="privacy"
                      v-model="emailForm.privacy"
                      @change="$v.emailForm.privacy.$touch()"
                      :error-messages="privacyErrors"
                      :state="!$v.emailForm.privacy.$error"
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
              <div class="confirm-send pt-6">
                <v-btn
                  type="submit"
                  class="btn-block">
                  Attiva
                </v-btn>
              </div>
              <div class="error-label"
                v-if="this.clickCb && !$v.emailForm.privacy.acceptedPrivacy">
                Il consenso all'informativa sulla privacy è obbligatorio.
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex w-100 h-100"
      v-if="esitoMemoVerifica.statoEmail.stato == 'IN_ATTESA' || esitoMemoVerifica.statoEmail.stato == 'ATTESA_REVOCA'">
        <v-alert
          class="alert-form"
          type="warning"
          border="left"
          show>
          <div class="d-block">
            <div v-if="esitoMemoVerifica.statoEmail.stato == 'IN_ATTESA'">
              <h4 class="alert-heading">
                Attivazione Memobollo via e-mail
              </h4>
              <p class="sr-only">Hai inoltrato richiesta di attivazione di Memobollo via e-mail</p>
              <p>
                Per confermare l'attivazione di Memobollo <strong>controlla la tua email e clicca sul link entro 24 ore!</strong>
              </p>
              <p>
                Non hai ricevuto la mail per l'attivazione? Fai click <a class="only-text" color="link" @click="nuovoToken()">QUI</a>
              </p>
            </div>
            <div v-if="esitoMemoVerifica.statoEmail.stato == 'ATTESA_REVOCA'">
              <h4 class="alert-heading">
                Revoca Memobollo via email
              </h4>
              <p class="sr-only">Hai inoltrato richiesta di revoca di Memobollo via e-mail</p>
              <p>
                Per confermare la revoca di Memobollo <strong>controlla la tua email e clicca sul link entro 24 ore!</strong>
              </p>
              <p>
                Non hai ricevuto la mail per la revoca? Fai click <a class="only-text" text @click="revoca()">QUI</a>
              </p>
            </div>
          </div>
        </v-alert>
    </div>

    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoEmail.stato == 'ATTIVO' && revocaAttivazione == false">
      <v-alert
        color="success"
        dense
        outlined
        aria-live="off" show class="w-100 pa-8 alertSuccessMemo">
        <div class="d-block">
          <h4 class="alert-heading-success">
            Memobollo attivo via email
          </h4>
          <small class="alert-sub-heading">attivo dal: <strong>{{ new Date(esitoMemoVerifica.statoEmail.dataAttivazione) | dateFormat('DD/MM/YYYY')  }}</strong></small>
          <v-list flat class="listAlign">
            <v-list-item-group :no-action="true">
              <v-list-item id="" :inactive="true" :ripple="false">
                Indirizzo email: <strong class="dataMemoActive">{{ esitoMemoVerifica.statoEmail.destinatario }}</strong>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <div class="alert-form-fields">
            <div class="pt-6">
              <v-btn color="primary"
                class="btn-block"
                id="revocaEmailBtn"
                @click="revocaAttivazione=true">
                <v-icon>mdi-trash-can</v-icon> Revoca
              </v-btn>
            </div>
          </div>
        </div>
      </v-alert>
    </div>

    <div class="d-flex w-100"
      v-if="esitoMemoVerifica.statoEmail.stato == 'ATTIVO' && revocaAttivazione == true">
        <v-alert class="alert-form"
        dense
        outlined
        color="error"
        aria-live="off" show >
          <div class="d-block">
            <h4 class="alert-heading">
              Revoca memobollo via email
            </h4>
            <small class="alert-sub-heading">attivo dal: {{ new Date(esitoMemoVerifica.statoEmail.dataAttivazione) | dateFormat('DD/MM/YYYY')  }}</small>
            <p>
              <strong>Attenzione!</strong> Stai revocando Memobollo via e-mail. Per confermare la revoca di Memobollo <strong>controlla la tua email e clicca sul link entro 24 ore!</strong>
            </p>
            <div class="alert-form-fields">
              <div class="pt-6">
                <v-btn color="error" class="btn-block"
                  id="confermaRevocaEmail"
                  @click="revoca()"><v-icon>mdi-trash-can</v-icon> Revoca
                </v-btn>
                <v-btn class="btn-block"
                  id="annullaRevocaEmail"
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
      v-on:privacyaccepted="emailForm.privacy = 'accepted'"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import ModalePrivacy from '@/components/privacy/ModalePrivacy'
import NavigatorService from '@/common/navigator.service'
import { MEMO_RICHIESTA_ATT_EMAIL, MEMO_RICHIESTA_REV_EMAIL } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { acceptedPrivacy } from '@/validators/bolloweb.validator'

export default {
  name: 'AttivazioneEmailMemo',
  props: {
    boxErr: { type: Object, required: true }
  },
  components: { ModalePrivacy },
  data () {
    return {
      clickCb: false,
      emailForm: { email: '', privacy: 'not_accepted' },
      revocaAttivazione: false,
      serverErrors: { email: '' }
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
      },
      privacy: { acceptedPrivacy }
    }
  },
  computed: {
    ...mapGetters([
      'esitoMemoVerifica'
    ]),
    emailErrors () {
      const errors = []
      if (!this.$v.emailForm.email.$dirty) return errors
      !this.$v.emailForm.email.required && errors.push('L\'indirizzo e-mail è obbligatorio.')
      !this.$v.emailForm.email.email && errors.push('Digitare un indirizzo e-mail corretto.')
      !this.$v.emailForm.email.serverFailed && errors.push(this.serverErrors.email)
      return errors
    },
    privacyErrors () {
      const errors = []
      if (!this.$v.emailForm.privacy.$error) return errors
      !this.$v.emailForm.privacy.acceptedPrivacy && errors.push('')
      return errors
    }
  },
  methods: {
    erroriRichAttRev (error) {
      if (error == null || error.response.status === 500) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
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
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.attivaRevocaMemo(MEMO_RICHIESTA_ATT_EMAIL, this.emailForm.email)
    },

    nuovoToken () {
      this.attivaRevocaMemo(MEMO_RICHIESTA_ATT_EMAIL, this.esitoMemoVerifica.statoEmail.destinatario)
    },

    revoca () {
      this.attivaRevocaMemo(MEMO_RICHIESTA_REV_EMAIL, this.esitoMemoVerifica.statoEmail.destinatario)
    },

    attivaRevocaMemo (action, email) {
      const qParams = {
        codiceFiscale: this.esitoMemoVerifica.codiceFiscale,
        targa: this.esitoMemoVerifica.targa,
        tipoVeicolo: this.esitoMemoVerifica.tipoVeicolo.codice,
        email: email
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

    resetErroriServer () {
      this.serverErrors.email = ''
    }
  }
}
</script>
