<template>
  <v-form @submit.prevent="iniziaPagamento">
    <v-text-field
      :error-count="4"
      :error-messages="cfErrors"
      :maxLength="$v.targaForm.codiceFiscale.$params.maxLength.max"
      @change.native="resetErroriServer()"
      autocomplete="off"
      class="uppercase-input"
      clear-icon="mdi-close-circle"
      clearable
      id="codiceFiscale"
      label="Codice fiscale"
      type="text"
      v-model="targaForm.codiceFiscale"
    ></v-text-field>
  <TargaTelaio
      ref="targa"
      :pServerErr="serverErrors.targa"
      v-on:targachanged="resetErroriServer()"
    />
    <v-select
      :error-count="1"
      :error-messages="tipoVeicoloErrors"
      :items="veicoli"
      @change="verificaScadenzaPregressa()"
      id="tipoVeicolo"
      label="Scegli il tipo di veicolo"
      v-model="targaForm.tipoVeicolo"
    >
    </v-select>
    <v-switch
      :ripple="false"
      @change="datiScadenzaPregressa"
      id="scadenzaPregressa"
      label="Voglio pagare un'annualità pregressa"
      unchecked-value="no_pregressa"
      v-if="canScadenzaPregressa"
      v-model="targaForm.scadenzaPregressa"
      value="yes_pregressa"
    >
    </v-switch>

    <v-select
      id="meseScadenza"
      :items="mesiScadenza"
      label="Mese scadenza"
      v-model="targaForm.meseScadenza"
      :error-messages="meseScadenzaErrors"
      :error-count="1"
      v-if="
        canScadenzaPregressa && targaForm.scadenzaPregressa === 'yes_pregressa'
      "
    >
    </v-select>

    <v-select
      id="annoScadenza"
      :items="anniScadenza"
      label="Anno scadenza"
      v-model="targaForm.annoScadenza"
      :error-messages="annoScadenzaErrors"
      :error-count="1"
      v-if="
        canScadenzaPregressa && targaForm.scadenzaPregressa === 'yes_pregressa'
      "
    >
    </v-select>

    <v-select
      id="mesiValidità"
      :items="listaMesiValidita"
      label="Mesi validità"
      v-model="targaForm.mesiValidita"
      @change="verificaScadenzaPregressa()"
      :error-messages="meseValiditaErrors"
      :error-count="1"
      v-if="
        canScadenzaPregressa && targaForm.scadenzaPregressa === 'yes_pregressa'
      "
    >
    </v-select>
    <tassa-auto-recaptcha
      :pCount="noCaptchaCount"
      v-on:recaptchaverified="updRecaptchaVerified()"
      v-on:recaptchanotverified="recaptchaVerified = false"
    />
    <div class="action-button-wide row spaceTopButtonSubmit">
      <v-row class="container">
        <v-col cols="12" md="6">
          <v-btn
            depressed
            aria-label="vai alla pagina di calcola il bollo"
            id="calcolaBtn"
            type="submit"
            color="primary"
            :disabled="carrelloPagoBollo.length >= limiteCarrelloPagoBollo"
          >
            {{ $t("general.buttons.calcola") }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            depressed
            id="riepilogoCarrelloBtn"
            aria-label="vai alla pagina di riepilogo pagamenti"
            outlined
            color="primary"
            type="button"
            :to="{ name: 'carrello_pagamenti' }"
            v-if="carrelloPagoBollo.length > 0"
          >
            Riepilogo
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import { NO_RECAPTCHA_ATTEMPTS, COD_FISCALE_MIN_LENGTH, COD_FISCALE_MAX_LENGTH } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import {
  BOLLO_PAGO_RINNOVO,
  BOLLO_PAGO_SCADENZA,
  BOLLO_PAGO_CONTROLLO_SCADENZA,
  BOLLO_PAGO_LIST_MESE_SCADENZA,
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  BOLLO_PAGO_LIST_VAL_SCADENZA,
  VEICOLO_LISTA,
  COMMON_PARAMETRI
} from '@/store/actions.type'
import TargaTelaio from '@/components/bollo/pago/TargaTelaio'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { alphaNum, required, requiredIf, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'FormPagamentoTarga',
  props: {
    boxErr: { type: Object, required: true }
  },
  components: { TassaAutoRecaptcha, TargaTelaio },
  data () {
    return {
      canScadenzaPregressa: false,
      mesiScadenza: [],
      anniScadenza: [],
      listaMesiValidita: [],
      veicoli: [],
      targaForm: {
        codiceFiscale: '',
        scadenzaPregressa: 'no_pregressa',
        tipoVeicolo: null,
        meseScadenza: null,
        annoScadenza: null,
        mesiValidita: null
      },
      noCaptchaCount: 0,
      recaptchaVerified: false,
      serverErrors: {
        tipoVeicolo: '',
        targa: '',
        codiceFiscale: '',
        meseScadenza: '',
        annoScadenza: '',
        validita: ''
      },
      changeCCParams: { dataParametroAcc: '', dataParametroMod1CC: '', dataParametroMod1BolloCC: '', dataParamAppDateCC: '' }
    }
  },
  computed: {
    ...mapGetters([
      'carrelloPagoBollo',
      'limiteCarrelloPagoBollo',
      'parametri'
    ]),
    cfErrors () {
      const errors = []
      if (!this.$v.targaForm.codiceFiscale.$dirty) return errors
      !this.$v.targaForm.codiceFiscale.required && errors.push('Il codice fiscale è obbligatorio.')
      !this.$v.targaForm.codiceFiscale.minLength && errors.push('Il codice fiscale deve avere una lunghezza minima di ' + this.$v.targaForm.codiceFiscale.$params.minLength.min + ' caratteri.')
      !this.$v.targaForm.codiceFiscale.alphaNum && errors.push('Il codice fiscale deve contenere solo lettere e numeri.')
      !this.$v.targaForm.codiceFiscale.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    },
    tipoVeicoloErrors () {
      const errors = []
      if (!this.$v.targaForm.tipoVeicolo.$dirty) return errors
      !this.$v.targaForm.tipoVeicolo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    },
    meseScadenzaErrors () {
      const errors = []
      if (!this.$v.targaForm.meseScadenza.$dirty) return errors
      !this.$v.targaForm.meseScadenza.required && errors.push('Specificare il mese di scadenza.')
      return errors
    },
    annoScadenzaErrors () {
      const errors = []
      if (!this.$v.targaForm.annoScadenza.$dirty) return errors
      !this.$v.targaForm.annoScadenza.required && errors.push('Specificare l\'anno di scadenza.')
      return errors
    },
    meseValiditaErrors () {
      const errors = []
      if (!this.$v.targaForm.mesiValidita.$dirty) return errors
      !this.$v.targaForm.mesiValidita.required && errors.push('Specificare i mesi di validità.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    targaForm: {
      codiceFiscale: {
        required,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      },
      tipoVeicolo: { required },
      meseScadenza: {
        required: requiredIf(function () {
          return this.targaForm.scadenzaPregressa === 'yes_pregressa'
        })
      },
      annoScadenza: {
        required: requiredIf(function () {
          return this.targaForm.scadenzaPregressa === 'yes_pregressa'
        })
      },
      mesiValidita: {
        required: requiredIf(function () {
          return this.targaForm.scadenzaPregressa === 'yes_pregressa'
        })
      }
    }
  },
  methods: {
    iniziaPagamento () {
      this.resetErroriServer()
      this.$refs.targa.$v.targaForm.$touch()
      this.$v.targaForm.$touch()
      if (this.$v.targaForm.$invalid || this.$refs.targa.$v.targaForm.$invalid) return

      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      let action = BOLLO_PAGO_RINNOVO
      const inParams = {
        tipoVeicolo: this.targaForm.tipoVeicolo,
        targa: this.$refs.targa.getValore().toUpperCase(),
        codiceFiscale: this.targaForm.codiceFiscale.toUpperCase(),
        parametroAcc: this.changeCCParams.dataParametroAcc,
        parametroMod1CC: this.changeCCParams.dataParametroMod1CC,
        parametroMod1BolloCC: this.changeCCParams.dataParametroMod1BolloCC,
        paramAppDateCC: this.changeCCParams.dataParamAppDateCC
      }
      if (this.targaForm.scadenzaPregressa === 'yes_pregressa') {
        action = BOLLO_PAGO_SCADENZA
        inParams.meseScadenza = this.targaForm.meseScadenza
        inParams.annoScadenza = this.targaForm.annoScadenza
        inParams.validita = this.targaForm.mesiValidita
      }
      console.log('marts iniParama forPagamentotarga inParams parametroAcc ' + inParams.parametroAcc)
      this.$emit('controlspinner', { running: true })
      store
        .dispatch(action, inParams)
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          this.$router.push({ name: 'esito_ricerca_pagamento' })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error.response == null) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: error.message
            })
            return
          }

          switch (error.response.status) {
            case 400:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Parametri obbligatori non valorizzati'
              })
              this.noCaptchaCount++
              break
            case 403:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non corrisponde al codice fiscale in input'
              })
              this.noCaptchaCount++
              this.serverErrors.codiceFiscale = 'Proprietario non corrisponde al codice fiscale in input'
              break
            case 406:
              this.$emit('updateboxwarn', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              })
              this.noCaptchaCount++
              this.serverErrors.iuv = error.response.data.title
              break
            case 409:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: error.response.data.title
              })
              this.noCaptchaCount++
              break
            case 412:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Proprietario non trovato'
              })
              this.noCaptchaCount++
              this.serverErrors.codiceFiscale = 'Errore - Proprietario non trovato'
              break
            case 422:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t('general.api.errors.search_params_invalid')
              })
              this.noCaptchaCount++
              this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
              break
            case 500:
            case 503:
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              })
              break
            default:
              break
          }
        })
    },

    datiScadenzaPregressa (checked) {
      if (!checked) return
      if (this.mesiScadenza.length > 0 && this.anniScadenza.length > 0 && this.listaMesiValidita.length > 0) return
      if (!NavigatorService.checkInternetConnection()) return

      store
        .dispatch(BOLLO_PAGO_LIST_MESE_SCADENZA)
        .then(({ data }) => {
          this.mesiScadenza.push({ text: 'Seleziona', value: null })
          for (let i = 0; i < data.length; i++) {
            this.mesiScadenza.push({ text: data[i].nome, value: data[i].valore })
          }
        })
        .catch((error) => {
          if (error == null) return
          this.$emit('updateboxerr', {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          })
        })

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

      store
        .dispatch(BOLLO_PAGO_LIST_VAL_SCADENZA)
        .then(({ data }) => {
          this.listaMesiValidita.push({ text: 'Seleziona', value: null })
          for (let i = 0; i < data.length; i++) {
            this.listaMesiValidita.push({ text: data[i].nome, value: data[i].valore })
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

    verificaScadenzaPregressa () {
      if (!NavigatorService.checkInternetConnection()) return

      store
        .dispatch(BOLLO_PAGO_CONTROLLO_SCADENZA, {
          tipoVeicolo: this.targaForm.tipoVeicolo
        })
        .then(({ data }) => {
          if (data.esito === 'OK') {
            this.canScadenzaPregressa = true
            return
          }
          this.canScadenzaPregressa = false
          this.targaForm.scadenzaPregressa = 'no_pregressa'
          this.targaForm.meseScadenza = null
          this.targaForm.annoScadenza = null
          this.targaForm.mesiValidita = null
        })
        .catch((error) => {
          console.log(error)
          this.$emit('updateboxerr', {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          })
        })
    },

    resetErroriServer () {
      this.serverErrors = {
        tipoVeicolo: '',
        targa: '',
        codiceFiscale: '',
        meseScadenza: '',
        annoScadenza: '',
        validita: ''
      }
      this.$emit('updateboxerr', { message: '', title: '' })
      this.$emit('updateboxwarn', { message: '', title: '' })
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  },
  async created () {
    store
      .dispatch(VEICOLO_LISTA)
      .then((data) => {
        this.veicoli = data
      })
      .catch((error) => {
        if (error == null) return
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        })
      })
    await store
      .dispatch(COMMON_PARAMETRI, 'MDP_COD_APPLICATIVO_ACC')
      .then(() => {
        this.overlay = false
        this.changeCCParams.dataParametroAcc = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParametroAcc)
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    await store.dispatch(COMMON_PARAMETRI, 'MDP_MOD1_BOLLO')
      .then(() => {
        this.changeCCParams.dataParametroMod1CC = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParametroMod1CC)
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    await store.dispatch(COMMON_PARAMETRI, 'MDP_MOD1_BOLLO_CC')
      .then(() => {
        this.changeCCParams.dataParametroMod1BolloCC = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParametroMod1BolloCC)
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    await store.dispatch(COMMON_PARAMETRI, 'MDP_DATE_CC')
      .then(() => {
        this.changeCCParams.dataParamAppDateCC = this.parametri
        console.log('marts create: ' + this.changeCCParams.dataParamAppDateCC)
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
  }
}
</script>
