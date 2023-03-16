<template>
  <div>
    <div class="row inner-cont-alert" v-if="visureElencoVeicoli === null">
      <div class="text-intro col-12 mt-12">
        <BoxNeutral
          show
          :msg="detailInfo"
          class="printDisplay"
        />
      </div>
    </div>
    <div v-else>
      <v-form @submit.prevent="iniziaPagamento">
        <v-select
          :items="listaVeicoliPago"
          v-model="veicoloSceltoPago"
          @change.native="resetErroriServer()"
          :disabled="errorpage"
          label="Seleziona un veicolo"
          @change="cambioVeicoloScelto()"
          :error-messages="veicoloSceltoErrors"
          :error-count="1">
        </v-select>
        <v-text-field
          disabled
          label="Codice fiscale"
          v-if="veicoloSceltoPago !== null"
          v-model="userIdentity.cf">
        </v-text-field>
        <v-text-field
          disabled
          label="Targa / Telaio"
          v-if="veicoloSceltoPago !== null"
          v-model="veicoloSceltoPago.targa">
        </v-text-field>
        <v-text-field
          disabled
          label="Tipo di veicolo"
          v-if="veicoloSceltoPago !== null"
          v-model="veicoloSceltoPago.tipoVeicoloDescrizione">
        </v-text-field>
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
        <div v-if="pagamentoSceltoProps">
          <v-text-field
            disabled
            label="Mese scadenza"
            v-model="targaForm.meseScadenza">
          </v-text-field>
          <v-text-field
            disabled
            label="Anno scadenza"
            v-model="targaForm.annoScadenza">
          </v-text-field>
          <v-text-field
            disabled
            label="Mesi validità"
            v-model="targaForm.mesiValidita">
          </v-text-field>
        </div>
        <div v-else>
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
            :error-messages="meseValiditaErrors"
            :error-count="1"
            v-if="
              canScadenzaPregressa && targaForm.scadenzaPregressa === 'yes_pregressa'
            "
          >
          </v-select>

        </div>
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
                id="calcolaBtn"
                type="submit"
                color="primary"
                aria-label="prosegui al prossimo step"
                :disabled="carrelloPagoBollo.length >= limiteCarrelloPagoBollo || errorpage"
              >
                {{ $t("general.buttons.calcola") }}
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn
                depressed
                id="riepilogoCarrelloBtn"
                outlined
                color="primary"
                type="button"
                aria-label="vai alla pagina del riepilogo dei pagamenti"
                :to="{ name: 'carrello_pagamenti' }"
                v-if="carrelloPagoBollo.length > 0"
              >
                Riepilogo
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import {
  BOLLO_PAGO_RINNOVO,
  BOLLO_PAGO_SCADENZA,
  BOLLO_PAGO_CONTROLLO_SCADENZA,
  BOLLO_PAGO_LIST_MESE_SCADENZA,
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  BOLLO_PAGO_LIST_VAL_SCADENZA,
  VEICOLO_LISTA,
  VISURE_CONTRIBUENTE,
  COMMON_PARAMETRI
} from '@/store/actions.type'
import TargaTelaio from '@/components/bollo/pago/TargaTelaio'
import BoxNeutral from '@/components/BoxNeutral.vue'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'FormPagamentoTargaAuth',
  props: {
    boxErr: { type: Object, required: true },
    targaScelta: { type: String },
    pagamentoScelto: { type: Object }
  },
  components: { TassaAutoRecaptcha, TargaTelaio, BoxNeutral },
  data () {
    return {
      canScadenzaPregressa: false,
      mesiScadenza: [],
      anniScadenza: [],
      listaMesiValidita: [],
      veicoli: [],
      targaForm: {
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
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      },
      listaVeicoliPago: [],
      veicoloSceltoPago: {},
      errorpage: true,
      pagamentoSceltoProps: (this.pagamentoScelto) ? this.pagamentoScelto : null,
      changeCCParams: { dataParametroAcc: '', dataParametroMod1CC: '', dataParametroMod1BolloCC: '', dataParamAppDateCC: '' }
    }
  },
  computed: {
    ...mapGetters([
      'carrelloPagoBollo',
      'limiteCarrelloPagoBollo',
      'visureElencoVeicoli',
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost',
      'parametri'
    ]),
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
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    veicoloSceltoErrors () {
      const errors = []
      if (!this.$v.veicoloSceltoPago.$dirty && !this.$v.veicoloSceltoPago !== null) return errors
      !this.$v.veicoloSceltoPago.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    targaForm: {
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
    },
    veicoloSceltoPago: { required }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },

    iniziaPagamento () {
      this.$v.veicoloSceltoPago.$touch()
      this.$v.targaForm.$touch()
      if (this.$v.targaForm.$invalid || this.$v.veicoloSceltoPago.$invalid) return

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
        targa: this.veicoloSceltoPago.targa,
        tipoVeicolo: this.veicoloSceltoPago.tipoVeicolo,
        codiceFiscale: this.userIdentity.cf,
        parametroAcc: this.changeCCParams.dataParametroAcc,
        parametroMod1CC: this.changeCCParams.dataParametroMod1CC,
        parametroMod1BolloCC: this.changeCCParams.dataParametroMod1BolloCC,
        paramAppDateCC: this.changeCCParams.dataParamAppDateCC
      }
      if (this.targaForm.scadenzaPregressa === 'yes_pregressa') {
        action = BOLLO_PAGO_SCADENZA
        if (this.pagamentoSceltoProps) {
          const meseScadenzaScelto = this.mesiScadenza.find(p => (p.text === this.targaForm.meseScadenza))
          inParams.meseScadenza = meseScadenzaScelto.value
        } else {
          inParams.meseScadenza = this.targaForm.meseScadenza
        }
        inParams.annoScadenza = this.targaForm.annoScadenza
        inParams.validita = this.targaForm.mesiValidita
      }

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

    cambioVeicoloScelto () {
      this.canScadenzaPregressa = false
      this.targaForm.scadenzaPregressa = 'no_pregressa'
      this.targaForm.meseScadenza = null
      this.targaForm.annoScadenza = null
      this.targaForm.mesiValidita = null
      this.pagamentoSceltoProps = null
      this.verificaScadenzaPregressa()
    },

    verificaScadenzaPregressa () {
      if (!NavigatorService.checkInternetConnection()) return

      store
        .dispatch(BOLLO_PAGO_CONTROLLO_SCADENZA, {
          tipoVeicolo: this.veicoloSceltoPago.tipoVeicolo
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
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    },
    elencoVeicoliPagoBollo () {
      this.errorpage = false
      this.$emit('controlspinner', { running: true })
      if (store.getters.userIdentity) {
        store
          .dispatch(VISURE_CONTRIBUENTE, store.getters.userIdentity.cf)
          .then(() => {
            this.selezionaElencoVeicoliBollo()
            this.$emit('controlspinner', { running: false })
          })
          .catch((error) => {
            this.errorpage = true
            this.$emit('controlspinner', { running: false })
            if (error === null) {
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: 'Non è possibile accedere al servizio'
              })
            }
            if (error.response.status) {
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              })
            }
            if (error.response.status === 404) {
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              })
            }
          })
      }
    },
    selezionaElencoVeicoliBollo () {
      this.listaVeicoliPago.push({ text: 'Seleziona', value: null })
      // nel caso in cui data fine proprietà sia valorizzata inserire questo dato nella select di ricerca
      for (let i = 0; i < this.visureElencoVeicoli.visure.length; i++) {
        this.listaVeicoliPago.push({
          text: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione + ' - ' + this.visureElencoVeicoli.visure[i].tipoVeicolo.targa + ((this.visureElencoVeicoli.visure[i].dataFineProprieta) ? ' - fine proprietà ' + this.formatDate(this.visureElencoVeicoli.visure[i].dataFineProprieta) : ''),
          value: {
            tipoVeicolo: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.codice,
            targa: this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
            tipoVeicoloDescrizione: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione
          }
        })
      }
    },
    sceltaVeicolo () {
      const veicoloSceltoService = this.visureElencoVeicoli.visure.find(p => (p.tipoVeicolo.targa === this.targaScelta))
      this.veicoloSceltoPago = {
        text: veicoloSceltoService.tipoVeicolo.tipoVeicolo.descrizione + ' - ' + veicoloSceltoService.tipoVeicolo.targa,
        value: {
          tipoVeicolo: veicoloSceltoService.tipoVeicolo.tipoVeicolo.codice,
          targa: veicoloSceltoService.tipoVeicolo.targa,
          tipoVeicoloDescrizione: veicoloSceltoService.tipoVeicolo.tipoVeicolo.descrizione
        },
        targa: veicoloSceltoService.tipoVeicolo.targa,
        tipoVeicoloDescrizione: veicoloSceltoService.tipoVeicolo.tipoVeicolo.descrizione,
        tipoVeicolo: veicoloSceltoService.tipoVeicolo.tipoVeicolo.codice
      }
      this.verificaScadenzaPregressa()
    },
    sceltaPagamentoVeicolo () {
      const veicoloSceltoService = this.visureElencoVeicoli.visure.find(p => (p.tipoVeicolo.targa === this.pagamentoSceltoProps.targa))
      this.veicoloSceltoPago = {
        text: veicoloSceltoService.tipoVeicolo.tipoVeicolo.descrizione + ' - ' + veicoloSceltoService.tipoVeicolo.targa,
        value: {
          tipoVeicolo: veicoloSceltoService.tipoVeicolo.tipoVeicolo.codice,
          targa: veicoloSceltoService.tipoVeicolo.targa,
          tipoVeicoloDescrizione: veicoloSceltoService.tipoVeicolo.tipoVeicolo.descrizione
        },
        targa: veicoloSceltoService.tipoVeicolo.targa,
        tipoVeicoloDescrizione: veicoloSceltoService.tipoVeicolo.tipoVeicolo.descrizione,
        tipoVeicolo: veicoloSceltoService.tipoVeicolo.tipoVeicolo.codice
      }

      this.targaForm.scadenzaPregressa = 'yes_pregressa'
      this.datiScadenzaPregressa(this.targaForm.scadenzaPregressa)
      this.targaForm.meseScadenza = this.pagamentoSceltoProps.scadenza.split('/').shift()
      this.targaForm.annoScadenza = this.pagamentoSceltoProps.scadenza.split('/').pop()
      this.targaForm.mesiValidita = this.pagamentoSceltoProps.validita
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
    if (this.logged) {
      await this.elencoVeicoliPagoBollo()
      if (this.targaScelta) {
        await this.sceltaVeicolo()
      }
      if (this.pagamentoScelto) {
        this.pagamentoSceltoProps = this.pagamentoScelto
        await this.sceltaPagamentoVeicolo()
      }
    }
  }
}
</script>
