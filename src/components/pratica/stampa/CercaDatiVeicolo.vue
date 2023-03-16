<template>
  <v-form
    @submit.prevent="cercaDatiVeicolo">
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
    <Targa
      ref="targa"
      :pServerErr="serverErrors.targa"
      v-on:targachanged="serverErrors.targa=''"/>
    <v-select
      id="tipoVeicolo"
      :items="veicoli"
      label="Scegli il tipo di veicolo"
      v-model="targaForm.tipoVeicolo"
      :error-messages="tipoVeicoloErrors"
      :error-count="1">
    </v-select>
    <v-select
      id="meseScadenza"
      :items="mesiScadenza"
      label="Mese scadenza"
      v-model="targaForm.meseScadenza"
      :error-messages="meseScadenzaErrors"
      :error-count="1">
    </v-select>

    <v-select
      id="annoScadenza"
      :items="anniScadenza"
      label="Anno scadenza"
      v-model="targaForm.annoScadenza"
      :error-messages="annoScadenzaErrors"
      :error-count="1">
    </v-select>

    <v-select
      id="Validitamesi"
      :items="listaMesiValidita"
      label="Validità (mesi)"
      v-model="targaForm.mesiValidita"
      :error-messages="meseValiditaErrors"
      :error-count="1">
    </v-select>

    <tassa-auto-recaptcha
      :pCount="noCaptchaCount"
      v-on:recaptchaverified="updRecaptchaVerified()"
      v-on:recaptchanotverified="recaptchaVerified = false"
    />
    <div class="action-button-wide row mt-6">
      <div class="col-12">
        <v-btn
          depressed
          class="spaceTopButtonSubmit"
          id="cercaPagamVeicoloBtn"
          type="submit"
          color="primary">
          {{ $t('general.buttons.search') }}
        </v-btn>
      </div>
    </div>
  </v-form>
</template>

<script>
import ApiError from '@/common/api.error'
import Targa from '@/components/Targa'
import { NO_RECAPTCHA_ATTEMPTS, COD_FISCALE_MIN_LENGTH, COD_FISCALE_MAX_LENGTH } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import {
  BOLLO_PAGO_LIST_MESE_SCADENZA,
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  BOLLO_PAGO_LIST_VAL_SCADENZA,
  STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO,
  STAMPA_AVV_SCADENZA_CERCA_VEICOLO,
  VEICOLO_LISTA
} from '@/store/actions.type'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { alphaNum, required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'CercaDatiVeicolo',
  props: {
    boxErr: { type: Object, required: true },
    pStampaAccertamento: { type: Boolean, required: true }
  },
  components: { TassaAutoRecaptcha, Targa },
  data () {
    return {
      mesiScadenza: [],
      anniScadenza: [],
      listaMesiValidita: [],
      veicoli: [],
      targaForm: {
        codiceFiscale: '',
        targa: '',
        tipoVeicolo: null,
        meseScadenza: null,
        annoScadenza: null,
        mesiValidita: null
      },
      serverErrors: {
        codiceFiscale: '',
        targa: '',
        idTipoVeicolo: '',
        meseScadenza: '',
        annoScadenza: '',
        mesiValidita: ''
      },
      noCaptchaCount: 0,
      recaptchaVerified: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    targaForm: {
      codiceFiscale: {
        required,
        alphaNum,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      },
      tipoVeicolo: { required },
      meseScadenza: {
        required
      },
      annoScadenza: {
        required
      },
      mesiValidita: {
        required
      }
    }
  },
  computed: {
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
  methods: {
    cercaDatiVeicolo () {
      this.resetErroriServer()
      this.$v.targaForm.$touch()
      this.$refs.targa.$v.targaForm.$touch()
      if (this.$v.targaForm.$invalid || this.$refs.targa.$v.targaForm.$invalid) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      const action = (this.pStampaAccertamento) ? STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO : STAMPA_AVV_SCADENZA_CERCA_VEICOLO
      const esito = (this.pStampaAccertamento) ? 'riepilogo_avviso_accertamento' : 'riepilogo_avviso_scadenza'

      const inParams = {
        codiceFiscale: this.targaForm.codiceFiscale.toUpperCase(),
        targa: this.$refs.targa.getValore().toUpperCase(),
        idTipoVeicolo: this.targaForm.tipoVeicolo,
        meseScadenza: this.targaForm.meseScadenza,
        annoScadenza: this.targaForm.annoScadenza,
        mesiValidita: this.targaForm.mesiValidita
      }

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(action, inParams)
        .then(() => {
          this.$emit('controlspinner', { running: false })
          this.$router.push({ name: esito })
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

          if (error.response.status === 404 || error.response.status === 409) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            })
            this.noCaptchaCount++
          } else if (error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            })
            this.noCaptchaCount++
            this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
          } else if (error.response.status === 500) {
            if (error.response.data.title) {
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              })
            } else {
              this.$emit('updateboxerr', {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable')
              })
            }
          } else if (error.response.status === 505) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            })
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = {
        codiceFiscale: '',
        targa: '',
        idTipoVeicolo: '',
        meseScadenza: '',
        annoScadenza: '',
        mesiValidita: ''
      }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  },
  async created () {
    if (!NavigatorService.checkInternetConnection()) return
    store
      .dispatch(VEICOLO_LISTA, { filtro: 'true' }) // oss. avviso scadenza / accertamento solo per un sottoinsieme di veicoli
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
  }
}
</script>
