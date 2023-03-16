<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <div class="row">
          <div class="text-intro text-descrizione-servizio col-lg-8">
            <p v-html="descrizione" />
          </div>
          <div class="col-lg-4 text-center">
            <v-img
              width="185px"
              :src="require('@/assets/images/loghi/piemonte/pagopa.png')"
              alt="Logo PagoPA"
            />
          </div>
        </div>
      </div>
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
          <div class="cerca-avviso col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="require('@/assets/images/ritagli/servizi/osservazioni.svg')"
              alt=""
              fluid
            />
            <div class="no-gutters-col mt-4">
              <v-dialog v-model="dialog" max-width="600" class="dialog-popup">
                <template v-slot:activator="{ on }">
                  <a href="javascript:null" role="button" name="modalAvvisoAccertamento" v-on="on">
                    Cos'è e dove si trova il n° di riferimento del piano/anno in
                    un piano di rateizzazione?
                  </a>
                </template>
                <v-card aria-hidden="true">
                  <v-card-title class="justify-end">
                    <v-icon @click="closeDialog()">mdi-close</v-icon>
                  </v-card-title>
                  <v-img
                    :src="
                      require(`@/assets/images/ritagli/${regione}/modal-rif_anno_piano_rateizzazione.jpg`)
                    "
                    alt="Dove è il numero di protocollo?"
                    fluid
                  />
                </v-card>
              </v-dialog>
            </div>
            <div  class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
              <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/tassa-automobilistica-rateizzazioni" target="_blank"><strong>Maggiori informazioni</strong></a>
            </div>
          </div>
          <div class="form-cerca-avviso-hp col-lg-4 col-md-6 offset-lg-1">
            <h2>Cerca un piano di rateizzazione</h2>
            <v-form @submit.prevent="cercaPianoRateizzazione" v-if="!logged">
              <v-text-field
                class="uppercase-input"
                clearable
                clear-icon="mdi-close-circle"
                label="Numero di riferimento del piano"
                id="numeroRiferimentoPiano"
                type="text"
                v-model="cercaForm.numeroRiferimentoPiano"
                @change.native="resetErroriServer()"
                :maxLength="
                  $v.cercaForm.numeroRiferimentoPiano.$params.maxLength.max
                "
                :error-messages="nRifPianoRatErrors"
                autocomplete="off"
                :error-count="4"
                @focusout="toTrim()"
              ></v-text-field>
              <v-select
                :items="anni"
                :label="'Anno di riferimento del piano'"
                id="anno"
                v-model="cercaForm.anno"
                @change.native="resetErroriServer()"
                :error-messages="anniErrors"
                :error-count="1"
              ></v-select>
              <v-text-field
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
                :error-count="4"
              ></v-text-field>
              <tassa-auto-recaptcha
                :pCount="noCaptchaCount"
                v-on:recaptchaverified="updRecaptchaVerified()"
                v-on:recaptchanotverified="recaptchaVerified = false"
              />
              <v-btn
                depressed
                class="spaceTopButtonSubmit"
                aria-label="cerca il piano di rateizzazione"
                type="submit"
                color="primary"
                :disabled="cercaPianoRateizzazioneDisabled"
              >
                Cerca
              </v-btn>
            </v-form>
            <v-form @submit.prevent="cercaPianoRateizzazioneAuth" v-else>
              <v-select
                :items="listaRateizzazioniAuth"
                :error-count="1"
                :error-messages="rateizzazioneSceltaErrors"
                id="codiceRateizzazione"
                label="Scegli la rateizzazione"
                v-model="rataFormAuth.rateizzazioneScelta"
                @change="recuperaDatiAuth()"
              >
              </v-select>
              <v-text-field
                disabled
                label="Numero di riferimento"
                v-if="rataFormAuth.rateizzazioneScelta !== ''"
                v-model="rataFormAuth.pianoRate"
              >
              </v-text-field>
              <v-text-field
                disabled
                label="Anno"
                v-if="rataFormAuth.rateizzazioneScelta !== ''"
                v-model="rataFormAuth.annoRate"
              ></v-text-field>
              <v-text-field
                disabled
                label="Codice fiscale"
                v-if="rataFormAuth.rateizzazioneScelta !== ''"
                v-model="userIdentity.cf"
              >
              </v-text-field>
              <v-btn
                depressed
                class="spaceTopButtonSubmit"
                aria-label="prosegui al prossimo step"
                id="btnIntVeicAvanti"
                type="submit"
                color="primary"
              >
                Avanti
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
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import {
  PIANO_RATEIZZAZIONE_MAX_LENGTH,
  NO_RECAPTCHA_ATTEMPTS,
  COD_FISCALE_MAX_LENGTH,
  COD_FISCALE_MIN_LENGTH,
  REGIONE_ABILITATA
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import {
  STAMPA_PIANO_RATEIZZAZIONE_CERCA,
  BOLLO_PAGO_LIST_ANNO_SCADENZA,
  RATEIZZAZIONE_LIST_AUTENTICATI
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import {
  alphaNum,
  maxLength,
  minLength,
  required
} from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, Spinner, TassaAutoRecaptcha, Wizard },
  data () {
    return {
      dialog: false,
      anni: [],
      detailError: { message: '', title: '' },
      cercaPianoRateizzazioneDisabled: false,
      cercaForm: {
        numeroRiferimentoPiano: '',
        codiceFiscale: '',
        anno: ''
      },
      descrizione: '',
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      serverErrors: { numeroRiferimentoPiano: '', codiceFiscale: '' },
      regione: REGIONE_ABILITATA,
      rataFormAuth: {
        rateizzazioneScelta: '',
        pianoRate: '',
        annoRate: ''
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    cercaForm: {
      numeroRiferimentoPiano: {
        alphaNum,
        maxLength: maxLength(PIANO_RATEIZZAZIONE_MAX_LENGTH),
        required,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(
            this.serverErrors,
            'numeroRiferimentoPiano'
          )
        }
      },
      anno: {
        required
      },
      codiceFiscale: {
        required,
        alphaNum,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(
            this.serverErrors,
            'codiceFiscale'
          )
        }
      }
    },
    rataFormAuth: {
      rateizzazioneScelta: {
        required
      }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost',
      'listaRateizzazioniAuth'
    ]),
    nRifPianoRatErrors () {
      const errors = []
      if (!this.$v.cercaForm.numeroRiferimentoPiano.$dirty) return errors
      !this.$v.cercaForm.numeroRiferimentoPiano.required &&
        errors.push('Il numero di riferimento del piano è obbligatorio.')
      !this.$v.cercaForm.numeroRiferimentoPiano.alphaNum &&
        errors.push(
          'Il numero di riferimento del piano  deve contenere solo lettere e numeri.'
        )
      !this.$v.cercaForm.numeroRiferimentoPiano.serverFailed &&
        errors.push(this.serverErrors.numeroRiferimentoPiano)
      return errors
    },
    cFiscaleErrors () {
      const errors = []
      if (!this.$v.cercaForm.codiceFiscale.$dirty) return errors
      !this.$v.cercaForm.codiceFiscale.required &&
        errors.push('Il Codice fiscale / P.IVA è obbligatorio.')
      !this.$v.cercaForm.codiceFiscale.minLength &&
        errors.push(
          'Il Codice fiscale / P.IVA deve avere una lunghezza minima di ' +
          this.$v.cercaForm.codiceFiscale.$params.minLength.min +
          ' caratteri.'
        )
      !this.$v.cercaForm.codiceFiscale.alphaNum &&
        errors.push(
          'Il Codice fiscale / P.IVA deve contenere solo lettere e numeri.'
        )
      !this.$v.cercaForm.codiceFiscale.serverFailed &&
        errors.push(this.serverErrors.codiceFiscale)
      return errors
    },
    anniErrors () {
      const errors = []
      if (!this.$v.cercaForm.anno.$dirty) return errors
      !this.$v.cercaForm.anno.required && errors.push('L\'anno del piano è obbligatorio')
      return errors
    },
    rateizzazioneSceltaErrors () {
      const errors = []
      if (!this.$v.rataFormAuth.rateizzazioneScelta.$dirty) return errors
      !this.$v.rataFormAuth.rateizzazioneScelta.required && errors.push('Il Numero di Riferimento è obbligatorio.')
      return errors
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    toTrim () {
      this.cercaForm.numeroRiferimentoPiano = this.cercaForm.numeroRiferimentoPiano.replace(/\s/g, '').toUpperCase()
    },
    recuperaDatiAuth () {
      this.resetErroriServer()
      this.rataFormAuth.pianoRate = this.rataFormAuth.rateizzazioneScelta.split('/').shift()
      this.rataFormAuth.annoRate = this.rataFormAuth.rateizzazioneScelta.split('/').pop()
    },
    async cercaPianoRateizzazione () {
      this.resetErrori()
      this.$v.cercaForm.$touch()
      if (this.$v.cercaForm.$invalid) return
      if (
        this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS &&
        !this.recaptchaVerified
      ) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }
      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      await store
        .dispatch(STAMPA_PIANO_RATEIZZAZIONE_CERCA, {
          idRiferimentoPiano: this.cercaForm.numeroRiferimentoPiano,
          anno: this.cercaForm.anno,
          cf: this.cercaForm.codiceFiscale.toUpperCase()
        })
        .then(() => {
          this.overlay = false
          this.$router.push({ name: 'riepilogo_piano_rateizzazione' })
        })
        .catch((error) => {
          this.overlay = false
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
                message: error.response.data.title
              }
              this.noCaptchaCount++
              break
            case 409:
              this.detailError = {
                title: 'Attenzione, impossibile proseguire.',
                message: error.response.data.title
              }
              this.serverErrors.numeroRiferimentoPiano =
                'Esiste un\'osservazione in lavorazione per il piano indicato.'
              this.noCaptchaCount++
              break
            case 412:
              this.detailError = {
                title: 'Attenzione, impossibile proseguire.',
                message:
                  error.response.data.title
              }
              this.serverErrors.numeroRiferimentoPiano =
                'Si sono verificati problemi nella ricerca del piano di rateizzazione'
              this.noCaptchaCount++
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t(
                  'general.api.errors.search_params_invalid'
                )
              }
              this.serverErrors = ApiError.serverValidationErrors(
                error.response.data.detail
              )
              this.noCaptchaCount++
              break
            case 500:
            case 503:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message:
                  this.$i18n.t('general.api.errors.service_unavailable') +
                  ' (' +
                  error.response.data.title +
                  ')'
              }
              break
            default:
              this.noCaptchaCount++
              break
          }
          document.getElementById('boxErrCmp').focus()
        })
    },
    async cercaPianoRateizzazioneAuth () {
      this.resetErrori()
      this.$v.rataFormAuth.$touch()
      if (this.$v.rataFormAuth.$invalid) return
      if (
        this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS &&
        !this.recaptchaVerified
      ) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }
      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      await store
        .dispatch(STAMPA_PIANO_RATEIZZAZIONE_CERCA, {
          idRiferimentoPiano: this.rataFormAuth.pianoRate,
          anno: this.rataFormAuth.annoRate,
          cf: this.userIdentity.cf
        })
        .then(() => {
          this.overlay = false
          this.$router.push({ name: 'riepilogo_piano_rateizzazione' })
        })
        .catch((error) => {
          this.overlay = false
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
                message: error.response.data.title
              }
              this.noCaptchaCount++
              break
            case 409:
              this.detailError = {
                title: 'Attenzione, impossibile proseguire.',
                message: error.response.data.title
              }
              this.serverErrors.numeroRiferimentoPiano =
                'Esiste un\'osservazione in lavorazione per il piano indicato.'
              this.noCaptchaCount++
              break
            case 412:
              this.detailError = {
                title: 'Attenzione, impossibile proseguire.',
                message:
                  error.response.data.title
              }
              this.serverErrors.numeroRiferimentoPiano =
                'Si sono verificati problemi nella ricerca del piano di rateizzazione'
              this.noCaptchaCount++
              break
            case 422:
              this.detailError = {
                title: this.$i18n.t('general.api.errors.no_results'),
                message: this.$i18n.t(
                  'general.api.errors.search_params_invalid'
                )
              }
              this.serverErrors = ApiError.serverValidationErrors(
                error.response.data.detail
              )
              this.noCaptchaCount++
              break
            case 500:
            case 503:
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message:
                  this.$i18n.t('general.api.errors.service_unavailable') +
                  ' (' +
                  error.response.data.title +
                  ')'
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
      this.serverErrors = {
        numeroRiferimentoPiano: '',
        anno: '',
        codiceFiscale: ''
      }
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    this.descrizione =
      '<p>Compila i campi sottostanti e procedi con la stampa del piano di rateizzazione <strong>concesso dalla Regione</strong> (e non da Soris S.p.A.!) e dei bollettini <strong>pagoPA</strong>.<p/><p>I bollettini di pagamento dovranno essere stampati solo se non risultano pagati.</p><p>La stampa del piano di rateizzazione può essere richiesta nel caso in cui il contribuente abbia smarrito il piano di rateizzazione o i bollettini di pagamento.<br>La stampa può essere richiesta specificando <br /><strong>n.° riferimento del piano/anno e codice fiscale.</strong></p>'
  },
  async mounted () {
    if (!NavigatorService.checkInternetConnection()) return
    store
      .dispatch(BOLLO_PAGO_LIST_ANNO_SCADENZA)
      .then(({ data }) => {
        this.anni.push({ text: 'Seleziona', value: null })
        for (let i = 0; i < data.length; i++) {
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
    if (this.logged) {
      await store
        .dispatch(RATEIZZAZIONE_LIST_AUTENTICATI, this.userIdentity.cf)
        .then()
        .catch((error) => {
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
  }
}
</script>
