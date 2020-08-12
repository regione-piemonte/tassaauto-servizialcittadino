<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <p>
          Se hai richiesto la <strong>rateizzazione</strong> a seguito di un avviso di accertamento del bollo auto,
          con questo servizio puoi pagare le rate.
          <br/>
          Gli importi proposti sono quelli del piano di rateizzazione ricevuti a casa (bollettini postali inviati dalla Regione).
        </p>
        <p>
          Il pagamento avviene secondo le modalità messe a disposizione dal prestatore del servizio di pagamento selezionato e può prevedere una commissione.
        </p>
        <p>
          Prima di cominciare ricordati di avere a disposizione i <strong>bollettini</strong> per inserire il <strong>numero di riferimento / anno</strong> che è un identificativo
          univoco del piano di rateizzazione inviato dalla Regione.
        </p>
      </div>
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <Wizard :servizio="'pago_bollo'" :stepAttivo="0" />
      </div>
    </div>
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
      <div class="cerca-avviso col-xxl-4 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
        <v-img
          class="imgHomeServizio"
          width="178"
          :src="require('@/assets/images/ritagli/servizi/pagamenti_online.svg')"
          fluid
          />
        <div class="text-inner">
          <p>
            <span class="sr-only">Per accedere al servizio sarà richiesto il numero di riferimento.</span>
            Il numero di riferimento/anno si trova nel
            <v-dialog v-model="dialog" max-width="600">
              <template v-slot:activator="{ on }">
                <a role="button" name="modalpianoRateizzazione" v-on="on">piano di rateizzazione</a>
              </template>
              <v-card class="card-view-page">
                <v-card-title class="justify-end">
                  <v-icon @click="closeDialog()">mdi-close</v-icon>
                </v-card-title>
                <v-img
                  :src="require(`@/assets/images/ritagli/${regione}/modal-rif_anno_piano_rateizzazione.jpg`)"
                  alt="Dove è il riferimento avviso?"
                />
              </v-card>
            </v-dialog>
            <span class="sr-only">piano di rateizzazione</span> che hai ricevuto.
          </p>
          <router-link
            :to="{ name: 'video_tutorial', hash:'#pagamentiOnline_video'}"
            v-if="videoTutorial()">
            <strong><span class="sr-only">Vai al </span>Video tutorial di pagamenti online</strong>
          </router-link>
        </div>
      </div>
      <div class="form-cerca-avviso-hp col-xxl-4 col-md-6 offset-xxl-1">
        <h2>
          Cerca le rate da pagare
        </h2>
        <v-form
          @submit.prevent="iniziaPagamento">
          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            :label="this.$i18n.t('bollo.pago.rate.labels.cerca_rate.n_riferimento')"
            id="numeroRiferimento"
            type="text"
            v-model="rataForm.numeroRiferimento"
            @change.native="resetErroriServer()"
            :maxlength="$v.rataForm.numeroRiferimento.$params.maxLength.max"
            :error-messages="nRiferimentoErrors"
            autocomplete="off"
            :error-count="4"
          ></v-text-field>
          <v-select
            :items="anni"
            :label="this.$i18n.t('bollo.pago.rate.labels.cerca_rate.anno')"
            v-model="rataForm.anno"
            @change.native="resetErroriServer()"
            :error-messages="anniErrors"
            :error-count="1">
          </v-select>

          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            :label="this.$i18n.t('bollo.pago.rate.labels.cerca_rate.cod_fis_piva')"
            id="codicefiscale"
            type="text"
            v-model="rataForm.codiceFiscale"
            @change.native="resetErroriServer()"
            :error-messages="codFiscaleErrors"
            autocomplete="off"
            :error-count="3"
          ></v-text-field>

          <v-btn
            class="spaceTopButtonSubmit"
            type="submit"
            color="primary">
            {{ $t('bollo.pago.rate.labels.cerca_rate.cerca') }}
          </v-btn>
        </v-form>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import {
  PAGO_RATE_NUM_RIFERIMENTO_MAX_LENGTH,
  REGIONE_ABILITATA,
  REGIONE_PARAMS,
  videoServizio
} from '@/common/config'
import Wizard from '@/components/layout/Wizard'
import ApiError from '@/common/api.error'
import NavigatorService from '@/common/navigator.service'
import { BOLLO_PAGO_LIST_ANNO_SCADENZA, BOLLO_PAGO_RATE_CERCA } from '@/store/actions.type'
import Spinner from '@/components/layout/Spinner'
import { validationMixin } from 'vuelidate'
import { required, alphaNum, maxLength } from 'vuelidate/lib/validators'
import BoxErrore from '@/components/BoxErrore'
import store from '@/store'

export default {
  components: { BoxErrore, Spinner, Wizard },
  data () {
    return {
      anni: [],
      detailError: { message: '', title: '' },
      overlay: false,
      regione: REGIONE_ABILITATA,
      rataForm: {
        numeroRiferimento: '',
        anno: null,
        codiceFiscale: ''
      },
      serverErrors: { numeroRiferimento: '', codiceFiscale: '' },
      dialog: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    rataForm: {
      numeroRiferimento: {
        required,
        alphaNum,
        maxLength: maxLength(PAGO_RATE_NUM_RIFERIMENTO_MAX_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroRiferimento')
        }
      },
      anno: {
        required
      },
      codiceFiscale: {
        required,
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      }
    }
  },
  computed: {
    nRiferimentoErrors () {
      const errors = []
      if (!this.$v.rataForm.numeroRiferimento.$dirty) return errors
      !this.$v.rataForm.numeroRiferimento.required && errors.push('Il Numero di Riferimento è obbligatorio.')
      !this.$v.rataForm.numeroRiferimento.$params.maxLength.max && errors.push('Il Numero di Riferimento non è corretto')
      !this.$v.rataForm.numeroRiferimento.alphaNum && errors.push('Il Numero di Riferimento deve contenere solo lettere e numeri.')
      !this.$v.rataForm.numeroRiferimento.serverFailed && errors.push(this.serverErrors.numeroRiferimento)
      return errors
    },
    anniErrors () {
      const errors = []
      if (!this.$v.rataForm.anno.$dirty) return errors
      !this.$v.rataForm.anno.required && errors.push('L\'anno è obbligatorio.')
      return errors
    },
    codFiscaleErrors () {
      const errors = []
      if (!this.$v.rataForm.codiceFiscale.$dirty) return errors
      !this.$v.rataForm.codiceFiscale.required && errors.push('Il Codice fiscale / P. IVA è obbligatorio.')
      !this.$v.rataForm.codiceFiscale.alphaNum && errors.push('Il Codice fiscale / P. IVA deve contenere solo lettere e numeri.')
      !this.$v.rataForm.codiceFiscale.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    }
  },
  methods: {
    iniziaPagamento () {
      this.$v.rataForm.$touch()
      if (this.$v.rataForm.$invalid) return

      if (!NavigatorService.checkInternetConnection()) return
      const inParams = {
        cf: this.rataForm.codiceFiscale,
        numeroRiferimento: this.rataForm.numeroRiferimento,
        anno: this.rataForm.anno
      }

      this.overlay = true
      store
        .dispatch(BOLLO_PAGO_RATE_CERCA, inParams)
        .then(() => {
          this.$router.push({ name: 'esito_ricerca_pagamento_rate' })
        })
        .catch((error) => {
          console.log({ error })
          this.overlay = false
          if (error.response == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.message
            }
            return
          }
          switch (error.response.status) {
            case 400:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Parametri obbligatori non valorizzati'
              }
              break
            case 403:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non corrisponde al codice fiscale in input'
              }
              this.serverErrors.codiceFiscale = 'Proprietario non corrisponde al codice fiscale in input'
              break
            case 404:
            case 409:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              }
              break
            case 412:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non trovato'
              }
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t('general.api.errors.search_params_invalid')
              }
              this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
              break
            case 500:
            case 503:
            case 505:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            default:
              break
          }
          document.getElementById('boxErrDiv').focus()
        })
    },
    resetErroriServer () {
      this.serverErrors = { numeroRiferimento: '', codiceFiscale: '' }
      this.detailError = { message: '', title: '' }
    },
    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('pago_rate') !== '')
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },

  async mounted () {
    if (!NavigatorService.checkInternetConnection()) return
    store
      .dispatch(BOLLO_PAGO_LIST_ANNO_SCADENZA)
      .then(({ data }) => {
        this.anni.push({ text: 'Seleziona', value: null })
        for (var i = 0; i < data.length; i++) {
          this.anni.push({ text: data[i].nome, value: data[i].valore })
        }
      })
      .catch((error) => {
        if (error == null) return
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        }
      })
  }
}
</script>
