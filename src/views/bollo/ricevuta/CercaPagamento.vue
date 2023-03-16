<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <p>
          {{ $t("bollo.ricevuta.service_description_1") }}<br />
          Si possono scaricare solo le ricevute di pagamenti effettuati tramite
          <strong>PagoPa</strong><em> (per gli accertamenti <strong>solo</strong> con anno di pagamento fino al 2019 compreso; per le rate <strong>solo</strong> per i piani concessi da Regione e non da Soris S.p.a.).</em>
        </p>
      </div>
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div
            class="text-intro col-lg-8 offset-lg-2"
            id="boxErrDiv"
            tabindex="-1"
          >
            <box-errore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="ricevuta-hp col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="
                require('@/assets/images/ritagli/servizi/scarica_ricevuta.svg')
              "
              fluid
            />
            <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
              <p>
                Il codice IUV (Identificativo Univoco di Versamento) è disponibile
                all’interno della e-mail che viene inviata in seguito all’esito positivo del versamento;
                la ricevuta telematica è allegata alla suddetta e-mail.
              </p>
              <p>Il <strong>codice di avviso di pagamento</strong> si trova:</p>
              <ul>
                <li v-if="cardAttiva('osservazione_avviso_scadenza')">
                  Nell'
                  <v-dialog
                    v-model="dialogScad"
                    max-width="600"
                    class="dialog-popup"
                  >
                    <template v-slot:activator="{ on }">
                      <a href="javascript:void(0)" role="button" name="modalAvvisoScadenza" aria-label="il codice di avviso pagamento è presente nell'avviso di scadenza ricevuto" v-on="on"
                        >avviso di scadenza</a
                      >
                    </template>
                    <v-card aria-hidden="true">
                      <v-card-title class="justify-end">
                        <v-icon @click="closeDialog('scadenza')" role="button" aria-label="chiusura finestra per trovare il codice di avviso pagamento in un avviso di scadenza">mdi-close</v-icon>
                      </v-card-title>
                      <v-img
                        :src="
                          require(`@/assets/images/ritagli/${regione}/modal-bollo_codice_avviso_pagamento.jpg`)
                        "
                        alt="Dove è il codice avviso di pagamento?"
                        fluid
                      />
                    </v-card>
                  </v-dialog>
                </li>
                <li v-if="cardAttiva('osservazione_avviso_accertamento')">
                  Nell'
                  <v-dialog
                    v-model="dialogAcc"
                    max-width="600"
                    class="dialog-popup"
                  >
                    <template v-slot:activator="{ on }">
                      <a href="javascript:void(0)" role="button" name="modalAvvisoScadenza" aria-label="il codice di avviso pagamento è presente nell'avviso di accertamento ricevuto" v-on="on"
                        >avviso di accertamento</a
                      >
                    </template>
                    <v-card aria-hidden="true">
                      <v-card-title class="justify-end">
                        <v-icon @click="closeDialog('accertamento')" role="button" aria-label="chiusura finestra per trovare il codice di avviso pagamento in un avviso di accertamento">mdi-close</v-icon>
                      </v-card-title>
                      <v-img
                        :src="
                          require(`@/assets/images/ritagli/${regione}/modal-num_protocollo_avviso_acc.jpg`)
                        "
                        alt="Dove è il codice avviso di pagamento?"
                        fluid
                      />
                    </v-card>
                  </v-dialog>
                </li>
                <li v-if="cardAttiva('rateizzazione')">
                  Nel
                  <v-dialog
                    v-model="dialogRat"
                    max-width="600"
                    class="dialog-popup"
                  >
                    <template v-slot:activator="{ on }">
                      <a href="javascript:void(0)" role="button" name="modalAvvisoScadenza" aria-label="il codice di avviso pagamento è presente nel piano di rateizzazione ricevuto" v-on="on"
                        >piano di rateizzazione</a
                      >
                    </template>
                    <v-card aria-hidden="true">
                      <v-card-title class="justify-end">
                        <v-icon @click="closeDialog('rateizzazione')" role="button" aria-label="chiusura finestra per trovare il codice di avviso pagamento in un piano di rateizzazione">mdi-close</v-icon>
                      </v-card-title>
                      <v-img
                        :src="
                          require(`@/assets/images/ritagli/${regione}/modal-num_protocollo_piano_rateizzazioni.jpg`)
                        "
                        alt="Dove è il codice avviso di pagamento?"
                        fluid
                      />
                    </v-card>
                  </v-dialog>
                </li>
              </ul>
            </div>
            <div class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
              <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-pagamenti-on-line" target="_blank"><strong>Maggiori informazioni</strong></a>
            </div>
          </div>
          <div class="ricevuta-hp-form col-lg-4 col-md-6 offset-lg-1">
            <h2>
              {{ $t("bollo.ricevuta.cerca_titolo") }}
            </h2>
            <div v-if="!logged">
              <v-form @submit.prevent="cercaPagamento" id="cercaPagamento">
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
                  @focusout="toTrim()"
                ></v-text-field>
                <tassa-auto-recaptcha
                  :pCount="noCaptchaCount"
                  v-on:recaptchaverified="updRecaptchaVerified()"
                  v-on:recaptchanotverified="recaptchaVerified = false"
                />
                <v-btn
                  depressed
                  class="spaceTopButtonSubmit"
                  type="submit"
                  color="primary"
                >
                  {{ $t("general.buttons.search") }}
                </v-btn>
              </v-form>
            </div>
            <div v-else>
              <div v-if="stepCercaiuv === 1">
                <v-form @submit.prevent="caricaElencoIuv">
                  <v-select
                    :items="anniScadenza"
                    @change.native="resetErroriServer()"
                    id="annoScadenza"
                    :error-messages="anniErrors"
                    :error-count="1"
                    label="Inserisci anno pagamento"
                    v-model="iuvForm.anni"
                  >
                  </v-select>
                  <v-select
                    id="tipoPagamento"
                    @change.native="resetErroriServer()"
                    :error-messages="tipoPagamentoErrors"
                    :error-count="1"
                    :items="tipoIuv"
                    label="Scelta tipo pagamento"
                    v-model="iuvForm.tipoIuv"
                  >
                  </v-select>
                  <v-btn
                    depressed
                    class="spaceTopButtonSubmit"
                    type="submit"
                    color="primary"
                  >
                    {{ $t("general.buttons.avanti") }}
                  </v-btn>
                </v-form>
              </div>
              <div v-if="stepCercaiuv === 2">
                <v-form @submit.prevent="cercaPagamentoAuth">
                  <v-select
                    @change.native="resetErroriServer()"
                    :items="listaPagamentoIuvAuth"
                    id="codiceIuv"
                    :error-messages="codiceIuvErrors"
                    :error-count="1"
                    label="Scegli lo IUV"
                    v-model="iuvFormScelto.iuvScelto"
                  >
                  </v-select>
                  <div class="action-button-wide row mt-6">
                    <div class="col-md-6">
                      <v-btn
                      depressed
                      @click.prevent="backStep()"
                      color="primary"
                      outlined>
                        {{ $t("general.buttons.indietro") }}
                      </v-btn>
                    </div>
                    <div class="col-md-6 text-md-right">
                      <v-btn
                        depressed
                        id="btnRappLegCerca"
                        type="submit"
                        color="primary"
                      >
                        {{ $t("general.buttons.avanti") }}
                      </v-btn>
                    </div>
                  </div>
                </v-form>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import { IUV_LENGTH, NO_RECAPTCHA_ATTEMPTS, REGIONE_ABILITATA, servizioAttivo } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import {
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  RICEVUTA_PAGAMENTO,
  RICEVUTA_PAGAMENTO_RESET_STATE,
  RICEVUTA_LIST_AUTENTICATI
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, alphaNum, maxLength } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha },
  data () {
    return {
      dialogScad: false,
      dialogAcc: false,
      dialogRat: false,
      detailError: { message: '', title: '' },
      cercaForm: { iuv: '' },
      tipoIuv: [
        {
          text: 'Pagamento Bollo',
          value: 'B'
        },
        {
          text: 'Pagamento Rate',
          value: 'R'
        }
      ],
      anniScadenza: [],
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      regione: REGIONE_ABILITATA,
      serverErrors: { iuv: '' },
      iuvForm: {
        anni: '',
        tipoIuv: ''
      },
      iuvFormScelto: {
        iuvScelto: ''
      },
      stepCercaiuv: 1
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
    },
    iuvForm: {
      anni: { required },
      tipoIuv: { required }
    },
    iuvFormScelto: {
      iuvScelto: { required }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost',
      'listaPagamentoIuvAuth'
    ]),
    iuvErrors () {
      const errors = []
      this.detailError = { message: '', title: '' }
      if (!this.$v.cercaForm.iuv.$dirty) return errors
      !this.$v.cercaForm.iuv.required && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_required'))
      !this.$v.cercaForm.iuv.alphaNum && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_required'))
      !this.$v.cercaForm.iuv.serverFailed && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuv_not_found'))
      return errors
    },
    anniErrors () {
      const errors = []
      this.detailError = { message: '', title: '' }
      if (!this.$v.iuvForm.anni.$dirty) return errors
      !this.$v.iuvForm.anni.required && errors.push(this.$i18n.t('bollo.ricevuta.errors.anno_required'))
      return errors
    },
    tipoPagamentoErrors () {
      const errors = []
      this.detailError = { message: '', title: '' }
      if (!this.$v.iuvForm.tipoIuv.$dirty) return errors
      !this.$v.iuvForm.tipoIuv.required && errors.push(this.$i18n.t('bollo.ricevuta.errors.tipoIuv_required'))
      return errors
    },
    codiceIuvErrors () {
      const errors = []
      this.detailError = { message: '', title: '' }
      if (!this.$v.iuvFormScelto.iuvScelto.$dirty) return errors
      !this.$v.iuvFormScelto.iuvScelto.required && errors.push(this.$i18n.t('bollo.ricevuta.errors.iuvSelect_required'))
      return errors
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    toTrim () {
      this.cercaForm.iuv = this.cercaForm.iuv.replace(/\s/g, '').toUpperCase()
    },
    caricaElencoIuv () {
      this.detailError = { message: '', title: '' }
      this.$v.iuvForm.$touch()
      if (this.$v.iuvForm.$invalid) return

      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      const params = {
        cf: this.userIdentity.cf,
        anno: this.iuvForm.anni,
        tipo: this.iuvForm.tipoIuv
      }
      store
        .dispatch(RICEVUTA_LIST_AUTENTICATI, params)
        .then(() => {
          this.overlay = false
          this.stepCercaiuv = 2
          this.detailError = { message: '', title: '' }
        })
        .catch((error) => {
          this.overlay = false
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
          }
        })
    },
    cercaPagamentoAuth () {
      this.$v.iuvFormScelto.$touch()
      if (this.$v.iuvFormScelto.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      store
        .dispatch(RICEVUTA_PAGAMENTO, this.iuvFormScelto.iuvScelto)
        .then(({ data }) => {
          this.$router.push({ name: 'esito_ricevuta' })
        })
        .catch((error) => {
          this.overlay = false
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
    cercaPagamento () {
      this.$v.cercaForm.$touch()
      if (this.$v.cercaForm.$invalid) return
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
    closeDialog (dialog) {
      switch (dialog) {
        case 'scadenza':
          this.dialogScad = false
          return this.dialogScad
        case 'accertamento':
          this.dialogAcc = false
          return this.dialogAcc
        case 'rateizzazione':
          this.dialogRat = false
          return this.dialogRat
        default:
          break
      }
    },
    backStep () {
      this.stepCercaiuv = 1
      this.detailError = { message: '', title: '' }
    },
    anniScadenzaElenco () {
      store
        .dispatch(BOLLO_PAGO_LIST_ANNO_SCADENZA)
        .then(({ data }) => {
          this.anniScadenza.push({ text: 'Seleziona', value: null })
          for (let i = 0; i < data.length; i++) {
            this.anniScadenza.push({ text: data[i].nome, value: data[i].valore })
          }
        })
        .catch((error) => {
          if (error == null) return
          this.$emit('updateboxerr', {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          })
        })
    },
    cardAttiva (nome) {
      return servizioAttivo(nome)
    }
  },
  mounted () {
    if (this.logged) {
      this.anniScadenzaElenco()
    }
  }
}
</script>
