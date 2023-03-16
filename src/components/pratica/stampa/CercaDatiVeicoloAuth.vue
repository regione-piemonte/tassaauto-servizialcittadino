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
      <v-form
        @submit.prevent="cercaDatiVeicolo">
        <v-select
          :items="listaVeicoliStampaScad"
          v-model="veicoloSceltoStampaScad"
          @change.native="resetErroriServer()"
          :disabled="errorpage"
          label="Seleziona un veicolo"
          :error-messages="veicoloSceltoErrors"
          :error-count="1">
        </v-select>
        <v-text-field
          disabled
          label="Codice fiscale"
          v-if="veicoloSceltoStampaScad !== null"
          v-model="datiUtente.cf">
        </v-text-field>
        <v-text-field
          disabled
          label="Targa / Telaio"
          v-if="veicoloSceltoStampaScad !== null"
          v-model="veicoloSceltoStampaScad.targa">
        </v-text-field>
        <v-text-field
          disabled
          label="Tipo di veicolo"
          v-if="veicoloSceltoStampaScad !== null"
          v-model="veicoloSceltoStampaScad.tipoVeicoloDescrizione">
        </v-text-field>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import Targa from '@/components/Targa'
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxNeutral from '@/components/BoxNeutral.vue'
import {
  BOLLO_PAGO_LIST_MESE_SCADENZA,
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  BOLLO_PAGO_LIST_VAL_SCADENZA,
  STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO,
  STAMPA_AVV_SCADENZA_CERCA_VEICOLO,
  VISURE_CONTRIBUENTE
} from '@/store/actions.type'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CercaDatiVeicoloAuth',
  props: {
    boxErr: { type: Object, required: true },
    pStampaAccertamento: { type: Boolean, required: true },
    datiUtente: { type: Object }
  },
  components: { TassaAutoRecaptcha, BoxNeutral, Targa },
  data () {
    return {
      mesiScadenza: [],
      anniScadenza: [],
      listaMesiValidita: [],
      veicoli: [],
      targaForm: {
        meseScadenza: null,
        annoScadenza: null,
        mesiValidita: null
      },
      serverErrors: {
        meseScadenza: '',
        annoScadenza: '',
        mesiValidita: ''
      },
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      },
      listaVeicoliStampaScad: [],
      veicoloSceltoStampaScad: {},
      noCaptchaCount: 0,
      recaptchaVerified: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    targaForm: {
      meseScadenza: {
        required
      },
      annoScadenza: {
        required
      },
      mesiValidita: {
        required
      }
    },
    veicoloSceltoStampaScad: {
      required
    }
  },
  computed: {
    ...mapGetters([
      'visureElencoVeicoli'
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
    veicoloSceltoErrors () {
      const errors = []
      if (!this.$v.veicoloSceltoStampaScad.$dirty && !this.$v.veicoloSceltoStampaScad !== null) return errors
      !this.$v.veicoloSceltoStampaScad.required && errors.push('Specificare il veicolo.')
      return errors
    }
  },
  methods: {
    elencoVeicoliCalcoloBollo () {
      this.errorpage = false
      this.$emit('controlspinner', { running: true })
      if (this.datiUtente) {
        store
          .dispatch(VISURE_CONTRIBUENTE, this.datiUtente.cf)
          .then(() => {
            this.selezionaElencoVeicoliBollo()
            this.$emit('controlspinner', { running: false })
          })
          .catch((error) => {
            if (error === null) {
              this.$emit('controlspinner', { running: false })
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: 'Non è possibile accedere al servizio'
              }
            }
            if (error.response.status) {
              this.$emit('controlspinner', { running: false })
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              }
            }
            if (error.response.status === 404) {
              this.$emit('controlspinner', { running: false })
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              }
              this.errorpage = true
            }
          })
      }
    },
    selezionaElencoVeicoliBollo () {
      this.listaVeicoliStampaScad.push({ text: 'Seleziona', value: null })
      for (let i = 0; i < this.visureElencoVeicoli.visure.length; i++) {
        if (this.visureElencoVeicoli.visure[i].dataFineProprieta === null) {
          this.listaVeicoliStampaScad.push({
            text: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione + ' - ' + this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
            value: {
              tipoVeicolo: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.codice,
              targa: this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
              tipoVeicoloDescrizione: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione
            }
          })
        }
      }
    },
    cercaDatiVeicolo () {
      this.resetErroriServer()
      this.$v.veicoloSceltoStampaScad.$touch()
      this.$v.targaForm.$touch()
      if (this.$v.targaForm.$invalid || this.$v.veicoloSceltoStampaScad.$invalid) return
      if (this.$v.$invalid) return
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
        codiceFiscale: this.datiUtente.cf.toUpperCase(),
        targa: this.veicoloSceltoStampaScad.targa.toUpperCase(),
        idTipoVeicolo: this.veicoloSceltoStampaScad.tipoVeicolo,
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
    this.elencoVeicoliCalcoloBollo()
  }
}
</script>
