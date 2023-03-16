<template>
  <div>
    <div class="row inner-cont-alert" v-if="listaStampaAvvisiAuth === null">
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
          :items="listaStampaAvvisiAuth"
          v-model="veicoloSceltoStampaAcc"
          @change.native="resetErroriServer()"
          label="Seleziona un veicolo"
          :error-messages="veicoloSceltoErrors"
          :error-count="1">
        </v-select>
        <v-text-field
          disabled
          label="Codice fiscale"
          v-if="veicoloSceltoStampaAcc !== null"
          v-model="datiUtente.cf">
        </v-text-field>
        <v-text-field
          disabled
          label="Targa / Telaio"
          v-if="veicoloSceltoStampaAcc !== null"
          v-model="veicoloSceltoStampaAcc.targa">
        </v-text-field>
        <v-text-field
          disabled
          label="Tipo di veicolo"
          v-if="veicoloSceltoStampaAcc !== null"
          v-model="veicoloSceltoStampaAcc.tipoVeicolo.descrizione">
        </v-text-field>
        <v-text-field
          id="meseScadenza"
          label="Mese scadenza"
          disabled
          v-if="veicoloSceltoStampaAcc !== null"
          v-model="veicoloSceltoStampaAcc.meseScadenza"
        >
        </v-text-field>
        <v-text-field
          id="annoScadenza"
          disabled
          label="Anno scadenza"
          v-if="veicoloSceltoStampaAcc !== null"
          v-model="veicoloSceltoStampaAcc.annoScadenza"
        >
        </v-text-field>

        <v-text-field
          id="Validitamesi"
          disabled
          label="Validità (mesi)"
          v-if="veicoloSceltoStampaAcc !== null"
          v-model="veicoloSceltoStampaAcc.validita"
        >
        </v-text-field>

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
              id="cercaDatiAccertamento"
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
  STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO,
  STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI
} from '@/store/actions.type'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CercaDatiVeicoloAccertamentoAuth',
  props: {
    boxErr: { type: Object, required: true },
    pStampaAccertamento: { type: Boolean, required: true },
    datiUtente: { type: Object }
  },
  components: { TassaAutoRecaptcha, BoxNeutral, Targa },
  data () {
    return {
      veicoli: [],
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      },
      veicoloSceltoStampaAcc: null,
      noCaptchaCount: 0,
      recaptchaVerified: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    veicoloSceltoStampaAcc: {
      required
    }
  },
  computed: {
    ...mapGetters([
      'listaStampaAvvisiAuth'
    ]),
    veicoloSceltoErrors () {
      const errors = []
      if (!this.$v.veicoloSceltoStampaAcc.$dirty && !this.$v.veicoloSceltoStampaAcc !== null) return errors
      !this.$v.veicoloSceltoStampaAcc.required && errors.push('Specificare il veicolo.')
      return errors
    }
  },
  methods: {
    async elencoVeicoliAccertamento () {
      this.$emit('controlspinner', { running: true })
      await store
        .dispatch(STAMPA_OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI, this.datiUtente.cf)
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error === null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Non è possibile accedere al servizio'
            }
          }
          if (error.response.status) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            }
          }
        })
    },
    cercaDatiVeicolo () {
      this.resetErroriServer()
      this.$v.veicoloSceltoStampaAcc.$touch()
      if (this.$v.veicoloSceltoStampaAcc.$invalid) return
      if (this.$v.$invalid) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      const action = STAMPA_AVV_ACCERTAMENTO_CERCA_VEICOLO
      const esito = 'riepilogo_avviso_accertamento'

      const inParams = {
        codiceFiscale: this.datiUtente.cf.toUpperCase(),
        targa: this.veicoloSceltoStampaAcc.targa.toUpperCase(),
        idTipoVeicolo: this.veicoloSceltoStampaAcc.tipoVeicolo.codice,
        meseScadenza: this.veicoloSceltoStampaAcc.meseScadenza,
        annoScadenza: this.veicoloSceltoStampaAcc.annoScadenza,
        mesiValidita: this.veicoloSceltoStampaAcc.validita
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
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            })
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
    this.elencoVeicoliAccertamento()
  }
}
</script>
