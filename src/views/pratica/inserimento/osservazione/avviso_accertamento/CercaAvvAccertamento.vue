<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div
        class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2"
        v-html="descrizione"
      />
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div
            class="text-intro col-lg-8 offset-lg-2"
            id="boxErrCmp"
            tabindex="-1"
          >
            <box-errore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2 justify-content-center">
            <Wizard :servizio="'osservazione'" :stepAttivo="0" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="cerca-avviso col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="require('@/assets/images/ritagli/servizi/osservazioni.svg')"
              alt=""
              fluid
            />
            <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
              <p>
                Il protocollo dell'avviso si trova nell'
                <v-dialog v-model="dialog" max-width="600" class="dialog-popup">
                  <template v-slot:activator="{ on }">
                    <a
                      href="javascript:null"
                      role="button"
                      name="modalAvvisoAccetamento"
                      v-on="on"
                      aria-hidden="true"
                      >avviso di accertamento</a
                    >
                  </template>
                  <v-card aria-hidden="true">
                    <v-card-title class="justify-end">
                      <v-icon @click="closeDialog()">mdi-close</v-icon>
                    </v-card-title>
                    <v-img
                      width="871"
                      :src="
                        require(`@/assets/images/ritagli/${regione}/modal-num_protocollo_avviso_accertamento.jpg`)
                      "
                      alt="Dove è il protocollo avviso?"
                      fluid
                    />
                  </v-card>
                </v-dialog>
                <span class="d-sr-only">avviso di accertamento</span> che hai
                ricevuto.
              </p>
              <router-link
                :to="{
                  name: 'video_tutorial',
                  hash: '#osservazioni_accertamento_video',
                }"
                v-if="videoTutorial()"
              >
                <strong
                  ><span class="d-sr-only">Vai al </span>Video tutorial di
                  osservazioni</strong
                >
              </router-link>
              <div class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
                <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/tassa-automobilistica-avviso-accertamento" target="_blank"><strong>Maggiori informazioni</strong></a>
              </div>
            </div>
          </div>
          <div class="form-cerca-avviso-hp col-lg-4 col-md-6 offset-lg-1">
            <h2>Cerca un avviso di accertamento</h2>
            <v-form @submit.prevent="cercaAvviso" v-if="!logged">
              <v-text-field
                :error-count="4"
                :error-messages="nProtErrors"
                :maxLength="$v.cercaForm.numeroProtocollo.$params.maxLength.max"
                @change.native="resetErroriServer()"
                autocomplete="off"
                class="uppercase-input"
                clear-icon="mdi-close-circle"
                clearable
                id="numeroProtocollo"
                label="N° di protocollo dell'avviso"
                type="text"
                v-model="cercaForm.numeroProtocollo"
                @focusout="toTrim()"
              ></v-text-field>

              <v-text-field
                :error-count="4"
                :error-messages="cFiscaleErrors"
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
                :disabled="cercaAvvisoDisabled"
              >
                Cerca avviso
              </v-btn>
            </v-form>
            <v-form @submit.prevent="cercaAvvisoAuth" v-else>
              <v-select
                :items="listaAvvisiAccAuth"
                id="codiceAvvisi"
                label="Scegli l'avviso"
                v-model="cercaFormAuth.avvisoScelto"
                :error-count="1"
                :error-messages="avvisoSceltoErrors"
              >
              </v-select>
               <v-text-field
              disabled
              label="N° protocollo dell'avviso"
              v-if="cercaFormAuth.avvisoScelto !== ''"
              v-model="cercaFormAuth.avvisoScelto.nriferimento"></v-text-field>
              <v-text-field
              disabled
              label="Codice fiscale"
              v-if="cercaFormAuth.avvisoScelto !== ''"
              v-model="userIdentity.cf">
              </v-text-field>
              <v-text-field
              disabled
              label="Tipo veicolo"
              v-if="cercaFormAuth.avvisoScelto !== ''"
              v-model="cercaFormAuth.avvisoScelto.tipoVeicolo.descrizione"></v-text-field>
              <v-text-field
              disabled
              label="Targa"
              v-if="cercaFormAuth.avvisoScelto !== ''"
              v-model="cercaFormAuth.avvisoScelto.targa">
              </v-text-field>
              <v-text-field
                id="meseScadenza"
                label="Mese scadenza"
                disabled
                v-if="cercaFormAuth.avvisoScelto !== ''"
                v-model="cercaFormAuth.avvisoScelto.meseScadenza"
              >
              </v-text-field>
              <v-text-field
                id="annoScadenza"
                disabled
                label="Anno scadenza"
                v-if="cercaFormAuth.avvisoScelto !== ''"
                v-model="cercaFormAuth.avvisoScelto.annoScadenza"
              >
              </v-text-field>
              <v-btn
                depressed
                class="spaceTopButtonSubmit"
                type="submit"
                color="primary"
                :disabled="cercaAvvisoDisabled"
              >
                {{ $t("general.buttons.search") }}
              </v-btn>
            </v-form>
          </div>
        </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import ApiError from '@/common/api.error'
import { mapGetters } from 'vuex'
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
  VEICOLO_LISTA_FILTRATA,
  OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI
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
        codiceFiscale: '',
        avvisoScelto: ''
      },
      cercaFormAuth: {
        avvisoScelto: ''
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
    },
    cercaFormAuth: {
      avvisoScelto: { required }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'listaAvvisiAccAuth',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    nProtErrors () {
      const errors = []
      if (!this.$v.cercaForm.numeroProtocollo.$dirty) return errors
      !this.$v.cercaForm.numeroProtocollo.required && errors.push('Il numero di protocollo dell\'avviso è obbligatorio.')
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
    },
    avvisoSceltoErrors () {
      const errors = []
      if (!this.$v.cercaFormAuth.avvisoScelto.$dirty) return errors
      !this.$v.cercaFormAuth.avvisoScelto.required && errors.push('Il Numero di Riferimento è obbligatorio.')
      return errors
    }
  },
  methods: {
    toTrim () {
      this.cercaForm.numeroProtocollo = this.cercaForm.numeroProtocollo.replace(/\s/g, '').toUpperCase()
    },
    async cercaAvviso () {
      this.resetErrori()
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
      await store
        .dispatch(AVV_ACCERTAMENTO_CERCA, {
          numeroRiferimento: this.cercaForm.numeroProtocollo.toUpperCase(),
          codiceFiscale: this.cercaForm.codiceFiscale.toUpperCase()
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
    async cercaAvvisoAuth () {
      this.resetErrori()
      this.$v.cercaFormAuth.$touch()
      if (this.$v.cercaFormAuth.$invalid) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }
      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      await store
        .dispatch(AVV_ACCERTAMENTO_CERCA, {
          numeroRiferimento: this.cercaFormAuth.avvisoScelto.nriferimento,
          codiceFiscale: this.userIdentity.cf
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
    if (this.logged) {
      await store
        .dispatch(OSS_AVV_ACCERTAMENTO_LIST_AUTENTICATI, this.userIdentity.cf)
        .catch((error) => {
          this.cercaAvvisoDisabled = true
          this.overlay = true
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
        })
    }
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
