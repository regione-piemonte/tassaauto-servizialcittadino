<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div
        class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2"
        v-html="descrizione"
      />
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2"
        id="boxErrCmp"
        tabindex="-1">
        <box-errore
          :error="detailError"
        />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="col-xxl-8 offset-xxl-2 justify-content-center">
        <Wizard :servizio="'osservazione'" :stepAttivo="0" />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="cerca-avviso col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
        <v-img
          class="imgHomeServizio"
          width="178"
          :src="require('@/assets/images/ritagli/servizi/osservazioni.svg')"
          alt=""
          fluid/>
        <div class="text-inner">
          <p>
            Il protocollo dell'avviso si trova nell'
            <v-dialog v-model="dialog" max-width="600">
              <template v-slot:activator="{ on }">
                <a role="button" name="modalAvvisoAccetamento" v-on="on" aria-hidden="true">avviso di accertamento</a>
              </template>
              <v-card class="card-view-page">
                <v-card-title class="justify-end">
                  <v-icon @click="closeDialog()">mdi-close</v-icon>
                </v-card-title>
                <v-img
                  :src="require(`@/assets/images/ritagli/${regione}/modal-num_protocollo_avviso_accertamento.jpg`)"
                  alt="Dove è il protocollo avviso?"
                  fluid
                />
              </v-card>
            </v-dialog>
            <span class="sr-only">avviso di accertamento</span> che hai ricevuto.
          </p>
          <router-link
            :to="{ name: 'video_tutorial', hash:'#osservazioni_accertamento_video'}"
            v-if="videoTutorial()">
            <strong><span class="sr-only">Vai al </span>Video tutorial di osservazioni</strong>
          </router-link>
        </div>
      </div>
      <div class="form-cerca-avviso-hp col-xxl-4 col-md-6 offset-xxl-1">
        <h2>
          Cerca un avviso di accertamento
        </h2>
        <v-form
          @submit.prevent="cercaAvviso">
          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="N° di protocollo dell'avviso"
            id="numeroProtocollo"
            type="text"
            v-model="cercaForm.numeroProtocollo"
            @change.native="resetErroriServer()"
            :maxLength="$v.cercaForm.numeroProtocollo.$params.maxLength.max"
            :error-messages="nProtErrors"
            autocomplete="off"
            :error-count="4"
            ></v-text-field>

          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="Codice fiscale / P.IVA"
            id="codiceFiscale"
            type="text"
            v-model="cercaForm.codiceFiscale"
            @change.native="resetErroriServer()"
            :maxLength="$v.cercaForm.codiceFiscale.$params.maxLength.max"
            :error-messages="cFiscaleErrors"
            autocomplete="off"
            :error-count="4"
            ></v-text-field>

          <tassa-auto-recaptcha
            :pCount="noCaptchaCount"
            v-on:recaptchaverified="updRecaptchaVerified()"
            v-on:recaptchanotverified="recaptchaVerified = false"
          />
          <v-btn
            class="spaceTopButtonSubmit"
            type="submit"
            color="primary"
            :disabled="cercaAvvisoDisabled">
            Cerca avviso
          </v-btn>
        </v-form>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import ApiError from '@/common/api.error'
import {
  emailAttiva,
  smsAttivo,
  COD_FISCALE_MAX_LENGTH,
  COD_FISCALE_MIN_LENGTH,
  NO_RECAPTCHA_ATTEMPTS,
  NUM_PROTOCOLLO_MAX_LENGTH,
  REGIONE_ABILITATA,
  REGIONE_PARAMS,
  videoServizio
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import {
  AVV_ACCERTAMENTO_CERCA,
  CATEGORIE_EURO_LISTA,
  COMBUSTIBILI_LISTA,
  OSS_AVV_ACCERTAMENTO_RESET_STATE,
  VEICOLO_LISTA_FILTRATA
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { alphaNum, maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha, Wizard },
  data () {
    return {
      detailError: { message: '', title: '' },
      cercaAvvisoDisabled: false,
      cercaForm: {
        numeroProtocollo: '',
        codiceFiscale: ''
      },
      descrizione: '',
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      regione: REGIONE_ABILITATA,
      serverErrors: { numeroProtocollo: '', codiceFiscale: '' },
      dialog: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      numeroProtocollo: {
        alphaNum,
        maxLength: maxLength(NUM_PROTOCOLLO_MAX_LENGTH),
        required,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroProtocollo')
        }
      },
      codiceFiscale: {
        required,
        alphaNum,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'codiceFiscale')
        }
      }
    }
  },
  computed: {
    nProtErrors () {
      const errors = []
      if (!this.$v.cercaForm.numeroProtocollo.$dirty) return errors
      !this.$v.cercaForm.numeroProtocollo.required && errors.push('Il numero di protocollo dell\'avviso è obbligatorio.')
      !this.$v.cercaForm.numeroProtocollo.minLength && errors.push('Il numero di protocollo dell\'avviso deve essere composto da massimo ' + this.$v.cercaForm.numeroProtocollo.$params.maxLength.max + ' caratteri.')
      !this.$v.cercaForm.numeroProtocollo.alphaNum && errors.push('Il numero di protocollo dell\'avviso deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.numeroProtocollo.serverFailed && errors.push(this.serverErrors.numeroProtocollo)
      return errors
    },
    cFiscaleErrors () {
      const errors = []
      if (!this.$v.cercaForm.codiceFiscale.$dirty) return errors
      !this.$v.cercaForm.codiceFiscale.required && errors.push('Il Codice fiscale / P.IVA è obbligatorio.')
      !this.$v.cercaForm.codiceFiscale.minLength && errors.push('Il Codice fiscale / P.IVA deve avere una lunghezza minima di ' + this.$v.cercaForm.codiceFiscale.$params.minLength.min + ' caratteri.')
      !this.$v.cercaForm.codiceFiscale.alphaNum && errors.push('Il Codice fiscale / P.IVA deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.codiceFiscale.serverFailed && errors.push(this.serverErrors.codiceFiscale)
      return errors
    }
  },
  methods: {
    cercaAvviso () {
      this.resetErrori()

      this.$v.$touch()
      if (this.$v.$invalid) return
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
        .dispatch(AVV_ACCERTAMENTO_CERCA, {
          numeroRiferimento: this.cercaForm.numeroProtocollo,
          codiceFiscale: this.cercaForm.codiceFiscale
        })
        .then(() => {
          this.$router.push({ name: 'crea_osservazione_accertamento' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(OSS_AVV_ACCERTAMENTO_RESET_STATE)
          if (error === null || error.response === undefined) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }

          switch (error.response.status) {
            case 400:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Parametri obbligatori non valorizzati.'
              }
              this.noCaptchaCount++
              break
            case 404:
              // 404 (se la combinazione dei dati in input non produce un risultato)
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: 'Avviso non trovato.'
              }
              this.noCaptchaCount++
              break
            case 409:
              this.detailError = {
                title: 'Attenzione, impossibile proseguire.',
                message: 'Esiste un\'osservazione in lavorazione per l\'avviso indicato.'
              }
              this.serverErrors.numeroProtocollo = 'Esiste un\'osservazione in lavorazione per l\'avviso indicato.'
              this.noCaptchaCount++
              break
            case 412:
              this.detailError = {
                title: 'Attenzione, impossibile proseguire.',
                message: 'E\' stato riscontrato un\'errore. Contattare l\'assistenza'
              }
              this.serverErrors.numeroProtocollo = 'Si sono verificati problemi nella ricerca dell\'accertamento'
              this.noCaptchaCount++
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t('general.api.errors.search_params_invalid')
              }
              this.serverErrors = ApiError.serverValidationErrors(error.response.data.detail)
              this.noCaptchaCount++
              break
            case 500:
            case 503:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              }
              break
            default:
              this.noCaptchaCount++
              break
          }
          document.getElementById('boxErrCmp').focus()
        })
    },

    resetErrori () {
      this.$v.$reset()
      this.detailError = { message: '', title: '' }
      this.resetErroriServer()
    },

    resetErroriServer () {
      this.serverErrors = { numeroProtocollo: '', codiceFiscale: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('osservazione_avviso_accertamento') !== '')
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    this.overlay = true
    if (!emailAttiva() && !smsAttivo()) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: 'Impossibile proseguire, i canali di comunicazione E-mail ed SMS sono disabilitati.'
      }
      this.cercaAvvisoDisabled = true
      return
    }

    this.descrizione = '<p>Hai ricevuto un avviso di <strong>accertamento</strong> del bollo auto ' +
      'ma hai delle segnalazioni da inviare e <strong>vuoi contestarlo</strong>?<br/>' +
      'Hai già pagato? Il pagamento <strong>non è dovuto</strong>?</p>' +
      '<p>Invia qui la tua segnalazione, ti arriverà '
    if (emailAttiva()) this.descrizione += 'una e-mail'
    if (emailAttiva() && smsAttivo()) this.descrizione += ' e/o '
    if (smsAttivo()) this.descrizione += 'un SMS (gratuito)'
    this.descrizione += ' con il <strong>numero di protocollo</strong> che potrai utilizzare per consultare la tua richiesta.</p>' +
      '<p>Prima di cominciare ricordati di avere a disposizione i <strong>documenti</strong> che ritieni utile allegare. ' +
      'Se stai usando uno smartphone, puoi allegare i documenti <strong>facendo una foto</strong>.</p>'

    // ATTENZIONE: parte identica in CercaAvviso perché non è detto che entrambi i servizi siano attivi
    store
      .dispatch(CATEGORIE_EURO_LISTA)
      .catch((error) => {
        if (error == null) return
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.message + ')'
        }
        this.cercaAvvisoDisabled = true
      })

    store
      .dispatch(COMBUSTIBILI_LISTA)
      .catch((error) => {
        if (error == null) return
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.message + ')'
        }
        this.cercaAvvisoDisabled = true
      })

    store
      .dispatch(VEICOLO_LISTA_FILTRATA) // oss. avviso scadenza/accertamento solo per un sottoinsieme di veicoli
      .catch((error) => {
        if (error == null) return
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.message + ')'
        }
        this.cercaAvvisoDisabled = true
      })
    this.overlay = false
  }
}
</script>
