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
              <p>Il numero di riferimento si trova:</p>
              <ul>
                <li>
                  sull'
                  <v-dialog
                    v-model="dialog"
                    max-width="600"
                    class="dialog-popup"
                  >
                    <template v-slot:activator="{ on }">
                      <a href="javascript:null" role="button" name="modalAvvisoScadenza" v-on="on"
                        >avviso di scadenza</a
                      >
                    </template>
                    <v-card aria-hidden="true">
                      <v-card-title class="justify-end">
                        <v-icon @click="closeDialog()">mdi-close</v-icon>
                      </v-card-title>
                      <v-img
                        width="871"
                        :src="
                          require(`@/assets/images/ritagli/${regione}/modal-riferimento_avviso_scadenza.jpg`)
                        "
                        alt="Dove è il riferimento avviso?"
                        fluid
                      />
                    </v-card>
                  </v-dialog>
                  <span class="d-sr-only">avviso di scadenza</span> cartaceo.
                </li>
                <li>
                  nella e-mail (per chi si è registrato alla ricezione
                  dell'avviso di scadenza elettronico con canale e-mail).
                </li>
              </ul>
              <router-link
                :to="{
                  name: 'video_tutorial',
                  hash: '#osservazioni_scadenza_video',
                }"
                v-if="videoTutorial()"
              >
                <strong
                  ><span class="d-sr-only">Vai al </span>Video tutorial di
                  osservazioni</strong
                >
              </router-link>
              <div class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
                <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-avviso-scadenza" target="_blank"><strong>Maggiori informazioni</strong></a>
              </div>
            </div>
          </div>
          <div class="form-cerca-avviso-hp col-lg-4 col-md-6 offset-lg-1">
            <h2>
              {{ $t("bollo.avviso.cerca") }}
            </h2>
            <v-form v-if="!logged" @submit.prevent="cercaAvviso">
              <v-text-field
                :error-count="4"
                :error-messages="nRiferimentoErrors"
                :maxlength="
                  $v.cercaForm.numeroRiferimento.$params.maxLength.max
                "
                @change.native="resetErroriServer()"
                autocomplete="off"
                class="uppercase-input"
                clear-icon="mdi-close-circle"
                clearable
                id="numeroRiferimento"
                label="N° di riferimento dell'avviso"
                type="text"
                v-model="cercaForm.numeroRiferimento"
                @focusout="toTrim()"
              ></v-text-field>
              <v-text-field
                :error-count="4"
                :error-messages="codFiscaleErrors"
                :maxlength="$v.cercaForm.codiceFiscale.$params.maxLength.max"
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
              <v-select
                :error-count="1"
                :error-messages="tipoVeicoloErrors"
                :items="veicoli"
                @change.native="resetErroriServer()"
                id="tipoVeicolo"
                label="Tipo veicolo"
                v-model="cercaForm.tipoVeicolo"
              >
              </v-select>
              <targa
                :pServerErr="serverErrors.targa"
                ref="targa"
                v-on:targachanged="resetErroriServer()"
              />
              <tassa-auto-recaptcha
                :pCount="noCaptchaCount"
                v-on:recaptchanotverified="recaptchaVerified = false"
                v-on:recaptchaverified="updRecaptchaVerified()"
              />
              <v-btn
                :disabled="cercaAvvisoDisabled"
                class="spaceTopButtonSubmit"
                color="primary"
                depressed
                type="submit"
              >
                Cerca avviso
              </v-btn>
            </v-form>
            <v-form v-else @submit.prevent="cercaAvviso">
              <v-select
                :items="listaAvvisiScaAuth"
                id="codiceAvvisi"
                label="Scegli l'avviso"
                v-model="cercaFormAuth.avvisoScelto"
                :disabled="cercaAvvisoDisabled"
                :error-count="1"
                :error-messages="avvisoSceltoErrors"
              >
              </v-select>
              <v-text-field
              disabled
              label="N° di riferimento dell'avviso"
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
                :disabled="cercaAvvisoDisabled"
                class="spaceTopButtonSubmit"
                color="primary"
                depressed
                type="submit"
              >
                Cerca avviso
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
import Targa from '@/components/Targa'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import {
  AVV_SCADENZA_CERCA,
  CATEGORIE_EURO_LISTA,
  COMBUSTIBILI_LISTA,
  OSS_AVV_SCADENZA_RESET_STATE,
  VEICOLO_LISTA_FILTRATA,
  OSS_AVV_SCADENZA_LIST_AUTENTICATI
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { alphaNum, maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha, Targa, Wizard },
  data () {
    return {
      detailError: { message: '', title: '' },
      cercaForm: {
        numeroRiferimento: '',
        codiceFiscale: '',
        tipoVeicolo: null
      },
      cercaAvvisoDisabled: false,
      descrizione: '',
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      regione: REGIONE_ABILITATA,
      serverErrors: { numeroRiferimento: '', codiceFiscale: '', targa: '', tipoVeicolo: '' },
      veicoli: [],
      dialog: false,
      cercaFormAuth: {
        avvisoScelto: ''
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      numeroRiferimento: {
        alphaNum,
        maxLength: maxLength(NUM_PROTOCOLLO_MAX_LENGTH),
        required,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroRiferimento')
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
      },
      tipoVeicolo: { required }
    },
    cercaFormAuth: {
      avvisoScelto: { required }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'listaAvvisiScaAuth',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    nRiferimentoErrors () {
      const errors = []
      if (!this.$v.cercaForm.numeroRiferimento.$dirty) return errors
      !this.$v.cercaForm.numeroRiferimento.required && errors.push('Il numero di riferimento dell\'avviso è obbligatorio.')
      !this.$v.cercaForm.numeroRiferimento.alphaNum && errors.push('Il numero di riferimento dell\'avviso deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.numeroRiferimento.serverFailed && errors.push(this.serverErrors.numeroRiferimento)
      return errors
    },
    tipoVeicoloErrors () {
      const errors = []
      if (!this.$v.cercaForm.tipoVeicolo.$dirty) return errors
      !this.$v.cercaForm.tipoVeicolo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    },
    codFiscaleErrors () {
      const errors = []
      if (!this.$v.cercaForm.codiceFiscale.$dirty) return errors
      !this.$v.cercaForm.codiceFiscale.required && errors.push('Il Codice fiscale / P. IVA è obbligatorio.')
      !this.$v.cercaForm.codiceFiscale.alphaNum && errors.push('Il Codice fiscale / P. IVA deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.codiceFiscale.minLength && errors.push('Il Codice fiscale deve essere composto da almeno ' + this.$v.cercaForm.codiceFiscale.$params.minLength.min + ' caratteri.')
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
      this.cercaForm.numeroRiferimento = this.cercaForm.numeroRiferimento.replace(/\s/g, '').toUpperCase()
    },
    async cercaAvviso () {
      if (!this.logged) {
        this.resetErrori()
        this.$refs.targa.$v.targaForm.$touch()
        this.$v.cercaForm.$touch()
        if (this.$v.cercaForm.$invalid || this.$refs.targa.$v.targaForm.$invalid) return
        if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Dimostra di non essere un robot'
          }
          return
        }
        if (!NavigatorService.checkInternetConnection()) return
      } else {
        this.resetErrori()
        this.$v.cercaFormAuth.$touch()
        if (this.$v.cercaFormAuth.$invalid) return
      }
      this.overlay = true
      await store
        .dispatch(AVV_SCADENZA_CERCA, {
          numeroRiferimento: this.logged ? this.cercaFormAuth.avvisoScelto.nriferimento : this.cercaForm.numeroRiferimento.toUpperCase(),
          codiceFiscale: this.logged ? this.userIdentity.cf : this.cercaForm.codiceFiscale.toUpperCase(),
          targa: this.logged ? this.cercaFormAuth.avvisoScelto.targa : this.$refs.targa.getValore().toUpperCase(),
          tipoVeicolo: this.logged ? this.cercaFormAuth.avvisoScelto.tipoVeicolo.codice : this.cercaForm.tipoVeicolo
        })
        .then(() => {
          this.$router.push({ name: 'crea_osservazione_avviso' })
          this.cercaFormAuth.avvisoScelto = ''
        })
        .catch((error) => {
          this.cercaFormAuth.avvisoScelto = ''
          this.overlay = false
          store.dispatch(OSS_AVV_SCADENZA_RESET_STATE)
          if (this.logged && this.listaAvvisiScaAuth.length < 1) {
            this.overlay = true
            store
              .dispatch(OSS_AVV_SCADENZA_LIST_AUTENTICATI, this.userIdentity.cf)
              .then(() => {
                this.overlay = false
              })
              .catch((error) => {
                this.cercaAvvisoDisabled = true
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
          if (error == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati.'
            }
            this.noCaptchaCount++
          } else if (error.response.status === 404) {
            // 404 (se la combinazione dei dati in input non produce un risultato)
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Avviso non trovato.'
            }
            this.noCaptchaCount++
          } else if (error.response.status === 409) {
            this.detailError = {
              title: 'Attenzione!',
              message: error.response.data.title
            }
            this.noCaptchaCount++
            this.serverErrors.numeroRiferimento = error.response.data.title
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
            this.noCaptchaCount++
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          } else if (error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
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
      this.serverErrors = { numeroRiferimento: '', codiceFiscale: '', targa: '', tipoVeicolo: '' }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('osservazione_avviso_scadenza') !== '')
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    if (this.logged) {
      this.overlay = true
      await store
        .dispatch(OSS_AVV_SCADENZA_LIST_AUTENTICATI, this.userIdentity.cf)
        .then(() => {
          this.overlay = false
        })
        .catch((error) => {
          this.cercaAvvisoDisabled = true
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

    this.descrizione = '<p>Hai ricevuto un avviso di <strong>scadenza</strong> del bollo auto ' +
      'ma hai delle segnalazioni da inviare?<br/>' +
      'Il bollo <strong>non è dovuto</strong>? Hai <strong>venduto</strong> il veicolo? I dati sono sbagliati?</p>' +
      '<p>Invia qui la tua segnalazione, ti arriverà '
    if (emailAttiva()) this.descrizione += 'una e-mail'
    if (emailAttiva() && smsAttivo()) this.descrizione += ' e/o '
    if (smsAttivo()) this.descrizione += 'un SMS (gratuito)'
    this.descrizione += ' con il <strong>numero di protocollo</strong> che potrai utilizzare per consultare la tua richiesta.</p>' +
      '<p>Prima di cominciare ricordati di avere a disposizione i <strong>documenti</strong> che ritieni utile allegare. ' +
      'Se stai usando uno smartphone, puoi allegare i documenti <strong>facendo una foto</strong>.</p>'

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
      .then((data) => {
        this.veicoli = data
      })
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
