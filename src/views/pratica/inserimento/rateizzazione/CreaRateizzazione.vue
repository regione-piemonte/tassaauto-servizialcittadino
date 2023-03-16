<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'richiesta_rateizzazione'" :stepAttivo="1" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <div class="space-section">
              <DatiAnagraficiIntestatario
                :denominazione="soggettoRateizz"
                :codiceFiscale="datiContribuente.codiceFiscale"
                :tipoDatiAnagrafici="'del contribuente'"
              />
            </div>
            <div class="space-section" v-if="rappresentanteLegale !== null">
              <DatiAnagRapprLegale
                :denominazione="rappresentanteLegale.nome + ' ' + rappresentanteLegale.cognome"
                :codiceFiscale="rappresentanteLegale.codiceFiscaleR"
                :sesso="rappresentanteLegale.sesso"
                :dataDiNascita="rappresentanteLegale.dataDiNascita"
                :comuneDiNascita="rappresentanteLegale.comune"
                :provinciaDiNascita="rappresentanteLegale.provincia"
              />
            </div>
            <div class="space-section" id="elencoRate">
              <h2>Rate</h2>
              <v-alert
                show
                aria-live="off"
                type="info"
                border="left"
                :icon="false"
              >
                <v-row class="pl-6 pl-md-12">
                  <v-col cols="12" md="1">
                    <v-img
                      width="40"
                      :src="require(`@/assets/images/icone/alert/info.svg`)"
                      :lazy-src="
                        require(`@/assets/images/icone/alert/info.svg`)
                      "
                    />
                  </v-col>
                  <v-col cols="12" md="10" class="bodyAlertDark">
                    <p v-if="regione === 'piemonte'">
                      Il numero di rate previsto varia in relazione all'importo
                      totale della richiesta ma non può essere superiore a 30.
                    </p>
                    <p v-if="regione === 'vda'">
                      Il numero di rate previsto varia in relazione all'importo
                      totale della richiesta. Puoi scegliere il numero di rate
                      tra quelli proposti di seguito.
                    </p>
                  </v-col>
                </v-row>
              </v-alert>
              <v-alert
                show
                aria-live="off"
                type="warning"
                border="left"
                :icon="false"
                v-if="regione === 'vda' && totaleCarrelloRateizzazione < 150"
              >
                <v-row class="pl-6 pl-md-12">
                  <v-col cols="12" md="1">
                    <img
                      width="40"
                      :src="require(`@/assets/images/icone/alert/warning.svg`)"
                    />
                  </v-col>
                  <v-col cols="12" md="10" class="bodyAlertDark">
                    <p>
                      Se l'importo da rateizzare è inferiore a 150 Euro non è
                      possibile proseguire con la richiesta
                    </p>
                  </v-col>
                </v-row>
              </v-alert>
              <div v-for="(item, index) in accertamentiRateiz" :key="index">
                <div
                  v-if="!item.checked"
                  class="p-md-9 container container-accertRateizzazione"
                >
                  <div class="row" :class="index > 0 ? 'fascia-row' : ''">
                    <div
                      id="importoElencoRate"
                      class="col-9 col-md-auto col-lg-6 boxInfo align-self-center"
                    >
                      Importo:
                      <strong>{{ item.totale | formatCurrency }}</strong>
                    </div>
                    <div
                      id="nProtElencoAnno"
                      class="col-9 col-md-auto boxInfo align-self-center"
                      v-if="regione === 'piemonte'"
                    >
                      Anno <strong>{{ item.anno }}</strong>
                    </div>
                    <div
                      id="nProtElencoRate"
                      class="col-9 col-md-5 boxInfo align-self-center"
                    >
                      N. Protocollo <strong>{{ item.protocollo }}</strong>
                    </div>
                    <div class="col-md-1 col-sm-6 align-self-center">
                      <v-btn
                        text
                        depressed
                        @click="showDelete(index)"
                        :ripple="false"
                        alt="Cancella il pagamento"
                        aria-label="Cancella il pagamento"
                        :id="'deleteBtn_' + index"
                        color="error"
                      >
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
                <div v-if="item.checked">
                  <v-alert color="error" show>
                    <div class="h5 inline-block">
                      Attenzione, rimuovere l’accertamento selezionato?
                    </div>
                    <div class="inline-block">
                      <v-btn
                        depressed
                        @click="closeDelete(index)"
                        aria-label="annulla l'azione"
                        color="primary"
                        :id="'closeDelete_' + index"
                        >No</v-btn
                      >
                      <v-btn
                        depressed
                        @click="removeFile(index, item)"
                        color="primary"
                        aria-label="conferma di cancellare l'accertamento"
                        outlined
                        :id="'removeFile_' + index"
                        >Si</v-btn
                      >
                    </div>
                  </v-alert>
                </div>
              </div>
              <div class="boxBlu space-section">
                <div class="row align-center">
                  <div class="col-12 col-md-6">
                    <div class="textRiepilogo h4">
                      TOTALE: {{ totaleCarrelloRateizzazione | formatCurrency }}
                    </div>
                  </div>
                  <div class="col-12 col-md-auto">
                    <div
                      class="textRiepilogo"
                      v-if="totaleCarrelloRateizzazione > 0"
                    >
                      <div class="reset-margin">
                        <div class="inline-check-submit no-gutters-col">
                          <div
                            class="tooltip-field col-lg-12 col-md-7 py-md-0 pr-lg-0"
                          >
                            <div class="position-relative d-inline-block">
                              <span
                                v-if="
                                  regione === 'vda' && rataSelezionata === null
                                "
                              >
                                Selezionare almeno una rata
                              </span>
                              <span v-if="regione === 'piemonte'"
                                >Numero rate da pagare
                                {{ numeroRateDaPagare }}
                              </span>
                              <span
                                v-if="
                                  regione === 'vda' &&
                                  totaleCarrelloRateizzazione >= 150 &&
                                  rataSelezionata !== null
                                "
                                >Numero rate da pagare
                                {{ rataSelezionata }}</span
                              >
                              <v-btn
                                fab
                                depressed
                                class="contextual-info privacy-btn-info"
                                aria-label="modale con la tabelle delle fasce"
                                @click="$refs.mwFasce.mostraModaleFasce()"
                                id="btnMostraFasce"
                              >
                                <v-icon>mdi-information</v-icon>
                              </v-btn>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="textRiepilogo" v-else>
                      Aggiungere un nuovo protocollo
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  regione === 'vda' &&
                  totaleCarrelloRateizzazione >= 150 &&
                  selectRate !== null
                "
                class="col-sm-6"
              >
                Selezionare il numero di rate
                <v-select
                  :items="selectRate"
                  v-model="rataSelezionata"
                  label="N° rate"
                  :error-count="1"
                  :error-messages="rataSelezionataErrors"
                ></v-select>
              </div>
            </div>
            <v-expansion-panels
              :accordion="true"
              class="space-section accordionAddItemsBtn"
              v-if="accertamentiRateiz.length < numMaxProtocolli"
              aria-live="polite"
              aria-atomic="false"
            >
              <v-expansion-panel>
                <v-expansion-panel-header
                  id="addProtocollo"
                  class="bold text-center"
                >
                  <span class="mr-2">Aggiungi numero di protocollo</span>
                  <span class="d-sr-only"
                    >Dettaglio dati veicolo e pagamento</span
                  >
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <BoxErrore :error="detailErrorAdd" />
                  <div class="col-11 mx-auto my-3 p-7 addMoreRat p-md-9">
                    <p v-if="rappresentanteLegale === null">
                      Codice fiscale<br />{{ datiContribuente.codiceFiscale }}
                    </p>
                    <v-form @submit.prevent="iniziaRichiestaRateizzazione">
                      <div class="row">
                        <div class="col-12 col-md-7">
                          <div class="reset-margin">
                            <div class="inline-check-submit no-gutters-col">
                              <div
                                class="tooltip-field col-lg-12 col-md-7 py-md-0 pr-lg-0"
                              >
                                <div class="position-relative d-block">
                                  <v-text-field
                                    clearable
                                    clear-icon="mdi-close-circle"
                                    label="Numero Protocollo"
                                    id="numeroProtocollo"
                                    type="text"
                                    v-model="cercaForm.numeroProtocollo"
                                    @change.native="resetErroriServer()"
                                    :error-messages="numeroProtocolloErrors"
                                    autocomplete="off"
                                    :error-count="4"
                                  ></v-text-field>
                                  <v-btn
                                    fab
                                    aria-label="privacy policy di tassa auto"
                                    depressed
                                    class="contextual-info privacy-btn"
                                    @click.stop="modalIuv = true"
                                    aria-hidden="true"
                                  >
                                    <v-icon>mdi-information</v-icon>
                                  </v-btn>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <v-btn depressed type="submit" color="primary" aria-label="aggiungi un altro protocollo">
                        Aggiungi Protocollo
                      </v-btn>
                    </v-form>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-alert
              show
              aria-live="off"
              type="info"
              border="left"
              :icon="false"
              v-if="regione === 'vda'"
            >
              <v-row class="pl-6 pl-md-12">
                <v-col cols="12" md="1">
                  <v-img
                    width="40"
                    :src="require(`@/assets/images/icone/alert/info.svg`)"
                    :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
                  />
                </v-col>
                <v-col cols="12" md="10" class="bodyAlertDark">
                  <p>
                    Se il totale da rateizzare è inferiore a 270 Euro è
                    necessario allegare alla richiesta di rateizzazione un
                    I.S.E.E. in corso di validità non eccedente l'importo di €
                    15.000,00.
                  </p>
                </v-col>
              </v-row>
            </v-alert>
            <div
              class="space-section"
              v-if="
                this.numeroRateDaPagare < numeroMaxRate &&
                regione === 'piemonte'
              "
            >
              <h2>Variazione rate</h2>
              <v-alert
                show
                aria-live="off"
                type="info"
                border="left"
                :icon="false"
              >
                <v-row class="pl-6 pl-md-12">
                  <v-col cols="12" md="1">
                    <v-img
                      width="40"
                      :src="require(`@/assets/images/icone/alert/info.svg`)"
                      :lazy-src="
                        require(`@/assets/images/icone/alert/info.svg`)
                      "
                    />
                  </v-col>
                  <v-col cols="12" md="10" class="bodyAlertDark">
                    <p>
                      In caso di particolare disagio economico, autocertificato
                      dal contribuente, può essere concesso un numero maggiore
                      di rate rispetto a quelle previste ma sempre e non oltre
                      le 30. In questo caso è consigliabile allegare documenti
                      comprovanti la situazione, per permettere la valutazione
                      della richiesta.
                    </p>
                  </v-col>
                </v-row>
              </v-alert>
              <v-form id="formModRata" @submit.prevent>
                <div class="space-section">
                  <div class="switchBtn">
                    <v-switch
                      :ripple="false"
                      id="disagioEconomico"
                      v-model="datiRateizzazione.checked"
                      name="check-button"
                      label="Dichiaro di trovarmi in una situazione di disagio economico e chiedo di poter ottenere un numero maggiore di rate"
                    >
                    </v-switch>
                  </div>
                </div>
                <v-row>
                  <v-col md="6">
                    <v-text-field
                      clearable
                      clear-icon="mdi-close-circle"
                      label="Numero Rate"
                      min="0"
                      v-model="datiRateizzazione.numeroRateUtente"
                      id="numeroRate"
                      type="number"
                      @change.native="resetErroriServer()"
                      :error-messages="numeroRateUtenteErrors"
                      :disabled="datiRateizzazione.checked === false"
                      autocomplete="off"
                      :error-count="4"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </div>
            <div class="space-section boxAllegati">
              <h2>Allegati</h2>
              <v-alert
                show
                aria-live="off"
                type="info"
                border="left"
                :icon="false"
              >
                <v-row class="pl-6 pl-md-12">
                  <v-col cols="12" md="1">
                    <v-img
                      width="40"
                      :src="require(`@/assets/images/icone/alert/info.svg`)"
                      :lazy-src="
                        require(`@/assets/images/icone/alert/info.svg`)
                      "
                    />
                  </v-col>
                  <v-col cols="12" md="10" class="bodyAlertDark">
                    <p>
                      Puoi inserire fino a {{ numMaxAllegati }} documenti
                      allegati a completamento della tua osservazione. Formati
                      ammessi: {{ tipiAllegato }}.
                    </p>
                    <p>
                      La funzionalità "Scatta una foto" potrebbe non essere
                      disponibile su tutti i dispositivi.
                    </p>
                  </v-col>
                </v-row>
              </v-alert>
              <div class="row">
                <div class="col-12 col-md-6 inputAttach">
                  <v-file-input
                    id="uploadFile"
                    :accept="tipiAllegato"
                    label="Seleziona allegato"
                    :disabled="allegati.length >= numMaxAllegati"
                    @change="caricaAllegato()"
                    v-model="cercaForm.file"
                    :error-count="2"
                    :error-messages="allegatiErrors"
                  />
                </div>
                <div class="col-md-6 text-md-right takePhoto">
                  <v-btn depressed color="primary" @click="openmodalFoto()" aria-label="scatta una foto per aggiungere un documento alla lista degli allegati">
                    <v-icon class="mr-2">mdi-camera</v-icon> Scatta una foto
                  </v-btn>
                </div>
                <div class="col-12 listAttach">
                  <div class="mt-2" v-if="allegati.length === 0">
                    {{ $t("general.messages.zero_allegati") }}
                  </div>
                  <div v-else>
                    <ul class="border-list">
                      <li v-for="(item, index) in allegati" :key="index">
                        <a
                          href="#"
                          v-on:click="
                            scaricaAllegato(item.identificativoArchivio)
                          "
                          >{{ item.nomeAllegato }}</a
                        >
                        <a
                          @click="eliminaAllegato(item.identificativoArchivio)"
                          class="ml-5"
                        >
                          <v-icon>mdi-trash-can</v-icon>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="error--text mt-2" v-if="downloadFileError !== null">
                    {{ downloadFileError }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                regione === 'vda' &&
                rataSelezionataFormError &&
                rataSelezionata === null
              "
              class="error--text"
            >
              Selezionare almeno una rata
            </div>
            <div
              v-if="
                detailError.message !== null &&
                detailError.message !== undefined
              "
              role="alert"
              id="msgError_422"
            >
              <h4 class="error--text h1">
                {{ detailError.message }}
              </h4>
              <v-list flat v-if="detailError.fieldError">
                <v-list-item :inactive="true" :ripple="false" v-for="(errorFieldMsg, n)  in detailError.fieldError" :key="n" class="error--text">
                  {{errorFieldMsg.fieldMessage}}
                </v-list-item>
              </v-list>
            </div>
            <div class="action-button-wide row">
              <div class="offset-md-6 col-md-6 text-md-right">
                <v-btn
                  depressed
                  type="button"
                  @click="creaRateizzazione()"
                  aria-label="prosegui al prossimo step"
                  color="primary"
                  :disabled="accertamentiRateiz.length <= 0"
                >
                  Avanti
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <ModaleFasceRateizzazione ref="mwFasce" />
    <v-dialog
      v-model="modalIuv"
      id="modalIuv"
      max-width="400"
      class="dialog-popup"
    >
      <v-card>
        <v-card-title class="justify-end">
          <v-icon @click="modalIuv = false">mdi-close</v-icon>
        </v-card-title>
        <v-img
          :src="
            require(`@/assets/images/ritagli/${regione}/modal-num_protocollo_avviso_accertamento.jpg`)
          "
          alt="Dove è il numero di protocollo?"
        />
      </v-card>
    </v-dialog>
    <ScattaFoto
      ref="scattaFoto"
      v-bind:imgFile.sync="cercaForm.file"
      v-on:annullafile="cercaForm.file = null"
      v-on:salvafile="cercaForm.file = $event"
      v-on:caricaallegato="caricaAllegato()"
    />
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ApiError from '@/common/api.error'
import {
  ALLEGATI_MAX_NUM,
  ALLEGATO_MAX_SIZE,
  NUM_PROTOCOLLO_MAX_LENGTH,
  NUM_PROTOCOLLO_RATE_MAX,
  checkDimenAllegato,
  checkTipoAllegato,
  tipiAllegatoString,
  PAGE_ENV
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'
import ModaleFasceRateizzazione from '@/components/pratica/rateizzazione/ModaleFasceRateizzazione'
import store from '@/store'
import {
  PRATICA_RICHIESTA_INTESTATARIO,
  RATEIZZA_ALLEGATO_CARICA,
  RATEIZZA_ALLEGATO_ELIMINA,
  RATEIZZAZIONE_ELIMINA_DAL_CARRELLO,
  RATEIZZAZIONE_VALIDA,
  SCELTA_RATA_UTENTE
} from '@/store/actions.type'
import ScattaFoto from '@/components/camera/ScattaFoto'
import { saveAs } from 'file-saver'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, minLength, alphaNum, numeric } from 'vuelidate/lib/validators'
export default {
  components: {
    BoxErrore,
    DatiAnagraficiIntestatario,
    DatiAnagRapprLegale,
    ModaleFasceRateizzazione,
    ScattaFoto,
    Spinner,
    Wizard
  },
  data () {
    return {
      pageEnv: PAGE_ENV,
      cercaForm: {
        numeroProtocollo: null,
        file: null
      },
      serverErrors: { numeroProtocollo: '', numeroRate: '' },
      detailError: { message: '', title: '', fieldError: null },
      detailErrorAdd: { message: '', title: '' },
      addPay: false,
      showEdit: false,
      deleteIndex: null,
      modForm: {
        numeroRate: null,
        check: Boolean
      },
      numeroMaxRate: NUM_PROTOCOLLO_RATE_MAX,
      numMaxAllegati: ALLEGATI_MAX_NUM,
      numMaxProtocolli: NUM_PROTOCOLLO_MAX_LENGTH,
      overlay: false,
      modalFotoFirstTime: true,
      tipiAllegato: tipiAllegatoString(),
      uploadFileError: null,
      downloadFileError: null,
      modalIuv: false,
      rataSelezionataFormError: false,
      rataSelezionata: null
    }
  },
  computed: {
    ...mapGetters([
      'datiContribuente',
      'accertamentiRateiz',
      'carrelloRateizzazione',
      'totaleCarrelloRateizzazione',
      'datiRateizzazione',
      'numeroRateDaPagare',
      'rappresentanteLegale',
      'allegati',
      'selectRate',
      'regione'
    ]),
    soggettoRateizz: function () {
      if (!this.datiContribuente.personaFisica) return this.datiContribuente.denominazione
      return this.datiContribuente.nome + ' ' + this.datiContribuente.cognome
    },
    allegatiErrors () {
      const errors = []
      if (!this.$v.cercaForm.file.$dirty) return errors
      !this.$v.cercaForm.file.uploadFileFailed && errors.push(this.uploadFileError)
      this.allegati.length === this.numMaxAllegati && errors.push(this.$i18n.t('general.messages.limite_allegati'))
      return errors
    },
    numeroProtocolloErrors () {
      const errors = []
      if (!this.$v.cercaForm.numeroProtocollo.$dirty) return errors
      !this.$v.cercaForm.numeroProtocollo.required && errors.push('Il numero protocollo è obbligatorio.')
      !this.$v.cercaForm.numeroProtocollo.minLength && errors.push('Il numero protocollo deve avere una lunghezza minima di ' + this.$v.cercaForm.numeroProtocollo.$params.minLength.min + ' caratteri.')
      !this.$v.cercaForm.numeroProtocollo.alphaNum && errors.push('Il numero protocollo deve contenere solo lettere e numeri.')
      !this.$v.cercaForm.numeroProtocollo.serverFailed && errors.push(this.serverErrors.numeroProtocollo)
      return errors
    },
    numeroRateUtenteErrors () {
      const errors = []
      if (this.datiRateizzazione.checked && !this.$v.datiRateizzazione.numeroRateUtente.$dirty) return errors
      !this.$v.datiRateizzazione.numeroRateUtente.required && errors.push('Il numero di rate è obbligatorio.')
      !this.$v.datiRateizzazione.numeroRateUtente.numeric && errors.push('Il numero di rate deve essere composto da soli numeri.')
      !this.$v.datiRateizzazione.numeroRateUtente.lowerMax && errors.push('Il numero di rate deve essere inferiore o uguale al numero massimo di rate consentite (' + this.numeroMaxRate + ')')
      !this.$v.datiRateizzazione.numeroRateUtente.greaterApiCount && errors.push('Il numero di rate deve essere superiore al numero di rate calcolato dalla procedura (' + this.numeroRateDaPagare + ')')
      return errors
    },
    rataSelezionataErrors () {
      const errors = []
      if (!this.$v.rataSelezionata.$dirty) return errors
      !this.$v.rataSelezionata.required && errors.push('Il numero di rate è obbligatorio.')
      return errors
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cercaForm: {
      numeroProtocollo: {
        required,
        minLength: minLength(10),
        alphaNum,
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'numeroProtocollo')
        }
      },
      file: {
        uploadFileFailed: function () {
          return !(this.uploadFileError != null && this.uploadFileError !== '')
        }
      }
    },
    datiRateizzazione: {
      numeroRateUtente: {
        required: requiredIf(function () { return this.datiRateizzazione.checked }),
        numeric,
        lowerMax: function () {
          return this.checkLowerMax()
        },
        greaterApiCount: function () {
          return this.checkGreaterApiCount()
        }
      }
    },
    rataSelezionata: {
      required
    }
  },
  methods: {
    openmodalFoto () {
      this.$refs.scattaFoto.modalFoto = true
      if (!this.modalFotoFirstTime) this.$refs.scattaFoto.playVideo()
      this.modalFotoFirstTime = false
    },
    checkLowerMax () {
      return (this.datiRateizzazione.numeroRateUtente <= this.numeroMaxRate)
    },
    checkGreaterApiCount () {
      return (this.datiRateizzazione.numeroRateUtente > this.numeroRateDaPagare)
    },

    resetErroriServer () {
      this.serverErrors = { numeroProtocollo: '', numeroRate: '' }
    },

    iniziaRichiestaRateizzazione () {
      this.detailError = { message: '', title: '', fieldError: null }
      if (this.$v.cercaForm.$invalid) {
        this.$v.cercaForm.$touch()
        return
      }
      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      store
        .dispatch(PRATICA_RICHIESTA_INTESTATARIO, {
          codiceFiscale: this.datiContribuente.codiceFiscale,
          numeroProtocollo: this.cercaForm.numeroProtocollo
        })
        .then(() => {
          this.overlay = false
          this.addPay = false
          this.cercaForm.numeroProtocollo = null
          this.rataSelezionata = null
          this.resetErroriServer()
          this.$root.$emit('bv::toggle::collapse', 'collapse-addItems')
          this.detailErrorAdd = { message: '', title: '' }
          this.detailError = { message: '', title: '', fieldError: null }
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          if (error === null || error.response === undefined) {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.error'),
              message: error.message
            }
            return
          }
          if (error.response.status === 500) {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
            return
          }
          if (error.response.status === 400) {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            }
          } else if (error.response.status === 403) {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.api.errors.cf_not_found'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
            this.serverErrors = { codiceFiscale: error.response.data.title, numeroProtocollo: '' }
          } else if (error.response.status === 404) {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Avviso di accertamento non trovato'
            }
            this.serverErrors = { codiceFiscale: '', numeroProtocollo: 'Avviso di accertamento non trovato' }
          } else if (error.response.status === 422) {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            const detail = error.response.data.detail
            this.serverErrors = ApiError.serverValidationErrors(detail)
          } else if (error === 'Numero di protocollo già presente') {
            this.detailErrorAdd = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Avviso di accertamento non trovato'
            }
          }
        })
    },
    showDelete (index) {
      Vue.set(this.accertamentiRateiz[index], 'checked', true)
    },
    closeDelete (index) {
      Vue.set(this.accertamentiRateiz[index], 'checked', false)
    },
    removeFile (deleteIndex, item) {
      this.detailError = { message: '', title: '', fieldError: null }
      this.overlay = true
      store
        .dispatch(RATEIZZAZIONE_ELIMINA_DAL_CARRELLO, deleteIndex)
        .then(() => {
          this.overlay = false
          if (this.regione === 'vda') {
            this.rataSelezionata = null
          }
        })
        .catch((error) => {
          console.log('Fallita rimozione dal carrello', { error })
        })
    },

    creaRateizzazione () {
      if (this.numeroRateDaPagare <= 0) {
        this.detailError = {
          message: 'Impossibile presentare la domanda perché l’importo da rateizzare è sottosoglia',
          title: this.$i18n.t('general.error')
        }
        return
      }
      this.detailError = { message: '', title: '', fieldError: null }
      if (this.datiRateizzazione.checked) {
        this.$v.datiRateizzazione.$touch()
        if (this.$v.datiRateizzazione.$invalid) return
      }
      if (this.regione === 'vda') {
        if (this.$v.rataSelezionata.$invalid || this.$v.rataSelezionata === null) {
          if (this.totaleCarrelloRateizzazione < 150) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Impossibile presentare la domanda perché l’importo da rateizzare è sottosoglia'
            }
            return
          }
          this.$v.rataSelezionata.$touch()
          this.rataSelezionataFormError = true
          return
        } else this.rataSelezionataFormError = false
        store
          .dispatch(SCELTA_RATA_UTENTE, this.rataSelezionata)
          .then(() => {
            this.$router.push({ name: 'riepilogo_rateizzazione' })
          })
          .catch((error) => {
            console.log('Fallita rimozione dal carrello', { error })
          })
      }

      if (this.rappresentanteLegale !== null) {
        // logica concordata in data 24/05/2019 dovuta alla mancanza di campi specifici
        // per rappresentante legale. cfr issue https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/125
        this.datiContribuente.codiceFiscaleLegale = this.rappresentanteLegale.codiceFiscaleR
        this.datiContribuente.cognome = this.rappresentanteLegale.cognome
        this.datiContribuente.nome = this.rappresentanteLegale.nome
        this.datiContribuente.sesso = this.rappresentanteLegale.sesso
        this.datiContribuente.dataDiNascita = this.rappresentanteLegale.dataDiNascita
        this.datiContribuente.comuneDiNascita = this.rappresentanteLegale.comune
        this.datiContribuente.provinciaDiNascita = this.rappresentanteLegale.provincia
      }

      const dataCorrente = new Date()
      this.carrelloRateizzazione.dataCompilazione = dataCorrente.getFullYear() + '-' + (dataCorrente.getMonth() + 1) + '-' + dataCorrente.getDate()
      this.allegati.forEach(function (v) { delete v.upFile })
      this.carrelloRateizzazione.soggetto = this.datiContribuente
      this.carrelloRateizzazione.accertamenti = this.accertamentiRateiz
      this.carrelloRateizzazione.allegati = this.allegati
      const carrelloRateizzazioneValida = this.carrelloRateizzazione
      carrelloRateizzazioneValida.accertamenti.forEach(function (v) { delete v.checked })
      carrelloRateizzazioneValida.diffEconomiche = this.datiRateizzazione.checked
      if (this.datiRateizzazione.checked) {
        carrelloRateizzazioneValida.fascia.numeroRate = this.datiRateizzazione.numeroRateUtente
      } else {
        carrelloRateizzazioneValida.fascia.numeroRate = this.numeroRateDaPagare
      }
      this.overlay = true
      if (this.pageEnv === 'testing') {
        this.$router.push({ name: 'riepilogo_rateizzazione' })
        return
      }
      store
        .dispatch(RATEIZZAZIONE_VALIDA, carrelloRateizzazioneValida)
        .then(({ data }) => {
          this.overlay = false
          this.$router.push({ name: 'riepilogo_rateizzazione', params: { rateizzazioneCreata: data } })
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
            return
          }
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata.'
            }
          }
          if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata, esiste una pratica in lavorazione.'
            }
          }
          if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title,
              fieldError: ApiError.serverValidationErrorsArray(error.response.data.detail)
            }
          }
        })
    },

    caricaAllegato () {
      this.uploadFileError = null
      this.downloadFileError = null
      if (this.cercaForm.file === null) return

      const fileExt = this.cercaForm.file.name.substr(this.cercaForm.file.name.lastIndexOf('.') + 1)
      if (!checkTipoAllegato(fileExt)) this.uploadFileError = 'Il documento ha un\'estensione non consentita.'
      if (!checkDimenAllegato(this.cercaForm.file.size)) this.uploadFileError = 'Il documento ha una dimensione che supera quella consentita (' + ALLEGATO_MAX_SIZE + 'MB).'

      this.$v.cercaForm.file.$touch()
      if (this.$v.cercaForm.file.$invalid) return

      const formData = new FormData()
      formData.append('upFile', this.cercaForm.file)
      formData.append('codiceFiscale', this.datiContribuente.codiceFiscale)
      formData.append('cognome', this.datiContribuente.cognome)

      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(RATEIZZA_ALLEGATO_CARICA, formData)
        .then((response) => {
          this.overlay = false
          this.cercaForm.file = null
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.uploadFileError = this.$i18n.t('general.api.errors.service_unavailable')
            return
          }
          if (error.response.status === 400) {
            this.uploadFileError = 'Parametri obbligatori non valorizzati.'
          } else if (error.response.status === 406) {
            this.uploadFileError = 'Il documento ha un\'estensione non consentita.'
          } else if (error.response.status === 412) {
            this.uploadFileError = 'Il documento ha una dimensione che supera quella consentita (' + ALLEGATO_MAX_SIZE + 'MB).'
          } else if (error.response.status === 500) {
            this.uploadFileError = this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    },

    scaricaAllegato (idAllegato) {
      this.downloadFileError = null
      const attach = this.allegati.find(p => (p.identificativoArchivio === idAllegato))

      if (attach === undefined) {
        this.downloadFileError = 'Impossibile scaricare il documento allegato.'
        return
      }
      saveAs(attach.upFile, attach.nomeAllegato)
    },

    eliminaAllegato (idAllegato) {
      this.downloadFileError = null
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(RATEIZZA_ALLEGATO_ELIMINA, {
          slug: idAllegato
        })
        .then((response) => {
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.downloadFileError = this.$i18n.t('general.api.errors.service_unavailable')
            return
          }
          if (error.response.status === 404) {
            this.downloadFileError = 'Eliminazione non consentita, avviso di scadenza non trovato.'
          } else if (error.response.status === 409) {
            this.downloadFileError = 'Eliminazione non consentita, esiste un\'osservazione in lavorazione per l\'avviso indicato.'
          } else if (error.response.status === 500) {
            this.downloadFileError = this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    }
  }
}
</script>
