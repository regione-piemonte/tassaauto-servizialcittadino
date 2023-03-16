<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <p><em>
          <strong>(!) Nota : </strong>non è possibile registrare più di
          <strong>10</strong> veicoli se questi hanno lo stesso mese di scadenza
        </em></p>
      </div>
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2"
          id="boxErrDiv">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="memo-hp col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="require('@/assets/images/ritagli/servizi/memobollo.svg')"
              alt=""
              fluid/>
            <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
              <strong>Per fortuna c'è Memobollo</strong>
              <p
                v-html="descrizione"
              />
              <router-link
                :to="{ name: 'video_tutorial', hash:'#memobollo_video'}"
                v-if="videoTutorial()">
                <strong><span class="d-sr-only">Vai al </span>Video tutorial di Memobollo</strong>
              </router-link>
            </div>
            <div  class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
              <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-avviso-scadenza" target="_blank"><strong>Maggiori informazioni</strong></a>
            </div>
          </div>
          <div class="form-memo-hp col-lg-4 col-md-6 offset-lg-1">
            <h3>
              Cerca un veicolo
            </h3>
            <v-form @submit.prevent="verificaMemo" id="verificaMemo" v-if="errorpage">
              <v-text-field
                :error-count="1"
                :error-messages="codiceFiscaleErrors"
                :maxLength="$v.cercaForm.codiceFiscale.$params.maxLength.max"
                @change.native="resetErroriServer()"
                autocomplete="off"
                class="uppercase-input"
                clear-icon="mdi-close-circle"
                clearable
                id="codiceFiscale"
                label="Codice fiscale / P.IVA"
                type="text"
                v-model="cercaForm.codiceFiscale"
              />
              <Targa
                ref="targa"
                :pServerErr="serverErrors.targa"
                v-on:targachanged="resetErroriServer()"
              />
              <v-select
                id="tipoVeicolo"
                :items="veicoli"
                label="Scegli il tipo di veicolo"
                v-model="cercaForm.tipoVeicolo"
                :error-messages="tipoVeicoloErrors"
                :error-count="1">
              </v-select>
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
                :disabled="cercaVeicoloDisabled">
                Cerca un veicolo
              </v-btn>
            </v-form>
            <div v-else>
              <div class="row inner-cont-alert" v-if="visureElencoVeicoli === null">
                <div class="text-intro col-12 mt-12">
                  <BoxNeutral
                    show
                    :msg="detailInfo"
                    class="printDisplay"
                  />
                </div>
              </div>
              <v-form @submit.prevent="verificaMemoAuth" id="verificaMemo" v-else>
                <v-select
                :items="listaVeicoliMemo"
                v-model="veicoloSceltoMemo"
                @change.native="resetErroriServer()"
                label="Seleziona un veicolo"
                :error-messages="veicoloSceltoErrors"
                :error-count="1">
                </v-select>
                <v-text-field
                disabled
                label="Codice fiscale"
                v-if="veicoloSceltoMemo !== null"
                v-model="userIdentity.cf">
                </v-text-field>
                <v-text-field
                disabled
                label="Targa / Telaio"
                v-if="veicoloSceltoMemo !== null"
                v-model="veicoloSceltoMemo.targa">
                </v-text-field>
                <v-text-field
                disabled
                label="Tipo di veicolo"
                v-if="veicoloSceltoMemo !== null"
                v-model="veicoloSceltoMemo.tipoVeicoloDescrizione"></v-text-field>
                <v-btn
                  depressed
                  class="spaceTopButtonSubmit"
                  type="submit"
                  color="primary">
                  Cerca un veicolo
                </v-btn>
              </v-form>
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
import {
  emailAttiva,
  smsAttivo,
  COD_FISCALE_MIN_LENGTH,
  COD_FISCALE_MAX_LENGTH,
  NO_RECAPTCHA_ATTEMPTS,
  REGIONE_PARAMS,
  videoServizio
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import Targa from '@/components/Targa'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import { MEMO_RESET_STATE, MEMO_VERIFICA, VEICOLO_LISTA, VISURE_CONTRIBUENTE } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha, Targa },
  data () {
    return {
      cercaVeicoloDisabled: false,
      detailError: { message: '', title: '' },
      veicoli: [],
      cercaForm: {
        codiceFiscale: '',
        tipoVeicolo: null
      },
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      serverErrors: { codiceFiscale: '', targa: '' },
      listaVeicoliMemo: [],
      veicoloSceltoMemo: {},
      errorpage: true
    }
  },
  computed: {
    ...mapGetters([
      'visureElencoVeicoli',
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    descrizione: function () {
      let descrRif = ''
      if (emailAttiva()) descrRif += 'una <strong>e-mail</strong>'
      if (descrRif !== '' && smsAttivo()) descrRif += ' e/o '
      if (smsAttivo()) descrRif += 'un <strong>SMS (gratuito)</strong>'
      return 'Iscriviti per ricevere ' + descrRif + ' che ti avvisa prima della scadenza del bollo auto.'
    },
    tipoVeicoloErrors () {
      const errors = []
      if (!this.$v.cercaForm.tipoVeicolo.$dirty && !this.$v.cercaForm.tipoVeicolo !== null) return errors
      !this.$v.cercaForm.tipoVeicolo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    },
    codiceFiscaleErrors () {
      const errors = []
      if (!this.$v.cercaForm.codiceFiscale.$dirty && !this.$v.cercaForm.codiceFiscale !== null) return errors
      !this.$v.cercaForm.codiceFiscale.required && errors.push(this.$i18n.t('general.validations.codiceFiscale.obbligatorio'))
      !this.$v.cercaForm.codiceFiscale.minLength && errors.push(this.$i18n.t('general.validations.codiceFiscale.lunghezza', { num: this.$v.cercaForm.codiceFiscale.$params.minLength.min }))
      !this.$v.cercaForm.codiceFiscale.alphaNum && errors.push(this.$i18n.t('general.validations.codiceFiscale.alfanumerico'))
      !this.$v.cercaForm.codiceFiscale.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    },
    veicoloSceltoErrors () {
      const errors = []
      if (!this.$v.veicoloSceltoMemo.$dirty && !this.$v.veicoloSceltoMemo !== null) return errors
      !this.$v.veicoloSceltoMemo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      codiceFiscale: {
        required,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      },
      tipoVeicolo: { required }
    },
    veicoloSceltoMemo: { required }
  },
  methods: {
    verificaMemo () {
      this.$v.cercaForm.$touch()
      this.$refs.targa.$v.targaForm.$touch()
      if (this.$v.cercaForm.$invalid || this.$refs.targa.$v.targaForm.$invalid) return

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
        .dispatch(MEMO_VERIFICA, {
          targa: this.$refs.targa.getValore(),
          tipoVeicolo: this.cercaForm.tipoVeicolo.toUpperCase(),
          codiceFiscale: this.cercaForm.codiceFiscale.toUpperCase()
        })
        .then(({ data }) => {
          this.$router.push({ name: 'attivazione_memo' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(MEMO_RESET_STATE)
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            }
          } else if (error.response.status === 403) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Codice fiscale non corrisponde al proprietario del veicolo'
            }
            this.noCaptchaCount++
            this.serverErrors.codiceFiscale = 'Codice fiscale non corrisponde al proprietario del veicolo'
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Veicolo non trovato'
            }
            this.noCaptchaCount++
            this.serverErrors.targa = 'Veicolo non trovato'
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.noCaptchaCount++
            this.serverErrors.targa = error.response.data.title
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.noCaptchaCount++
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },
    verificaMemoAuth () {
      this.$v.veicoloSceltoMemo.$touch()
      if (this.$v.veicoloSceltoMemo.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(MEMO_VERIFICA, {
          targa: this.veicoloSceltoMemo.targa,
          tipoVeicolo: this.veicoloSceltoMemo.tipoVeicolo,
          codiceFiscale: this.userIdentity.cf
        })
        .then(({ data }) => {
          this.$router.push({ name: 'attivazione_memo' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(MEMO_RESET_STATE)
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            }
          } else if (error.response.status === 403) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Codice fiscale non corrisponde al proprietario del veicolo'
            }
            this.noCaptchaCount++
            this.serverErrors.codiceFiscale = 'Codice fiscale non corrisponde al proprietario del veicolo'
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Veicolo non trovato'
            }
            this.noCaptchaCount++
            this.serverErrors.targa = 'Veicolo non trovato'
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.noCaptchaCount++
            this.serverErrors.targa = error.response.data.title
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.noCaptchaCount++
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          }
        })
    },

    resetErroriServer () {
      this.serverErrors = { codiceFiscale: '', targa: '' }
      this.detailError = { message: '', title: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('memo_bollo') !== '')
    },
    elencoVeicoliMemoBollo () {
      this.errorpage = false
      this.overlay = true
      if (store.getters.userIdentity) {
        store
          .dispatch(VISURE_CONTRIBUENTE, store.getters.userIdentity.cf)
          .then(() => {
            this.selezionaElencoVeicoliBollo()
            this.overlay = false
          })
          .catch((error) => {
            if (error === null) {
              this.overlay = false
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: 'Non è possibile accedere al servizio'
              }
            }
            if (error.response.status) {
              this.overlay = false
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              }
            }
            if (error.response.status === 404) {
              this.overlay = false
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
      this.listaVeicoliMemo.push({ text: 'Seleziona', value: null })
      for (let i = 0; i < this.visureElencoVeicoli.visure.length; i++) {
        if (this.visureElencoVeicoli.visure[i].dataFineProprieta === null) {
          this.listaVeicoliMemo.push({
            text: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione + ' - ' + this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
            value: {
              tipoVeicolo: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.codice,
              targa: this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
              tipoVeicoloDescrizione: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione
            }
          })
        }
      }
    }
  },
  async created () {
    if (!emailAttiva() && !smsAttivo()) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: 'Impossibile proseguire, i canali di comunicazione Email ed SMS sono disabilitati.'
      }
      this.cercaVeicoloDisabled = true
      return
    }
    store
      .dispatch(VEICOLO_LISTA, { filtro: 'true' }) // memo bollo solo per un sottoinsieme di veicoli
      .then((data) => {
        this.veicoli = data
      })
      .catch((error) => {
        if (error != null && error.message != null) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable') + '(' + error.message + ')'
          }
        }
      })
    if (this.logged) {
      this.elencoVeicoliMemoBollo()
    }
  }
}
</script>
