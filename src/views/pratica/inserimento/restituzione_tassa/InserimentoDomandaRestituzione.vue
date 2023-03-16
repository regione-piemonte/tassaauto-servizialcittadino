<template>
  <div class="container">
    <div>
      <div class="row inner-cont-bollo">
        <div
         class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2"
         v-html="descrizione + link"
        />
      </div>
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div class="row inner-cont-alert">
            <div class="text-intro col-lg-8 offset-lg-2">
              <BoxErrore :error="detailError" />
            </div>
          </div>
          <div class="row inner-cont-bollo">
            <div class="col-lg-8 offset-lg-2 justify-content-center">
              <Wizard :servizio="'restituzione_tassa'" :stepAttivo="0" />
            </div>
          </div>
          <div class="row inner-cont-bollo">
            <div class="col-lg-8 offset-lg-2">
              <template v-if="isResident !== false && contribuenteRestituzione">
                <DatiAnagraficiIntestatario
                  :denominazione="
                    contribuenteRestituzione.nome +
                    ' ' +
                    contribuenteRestituzione.cognome
                  "
                  :codiceFiscale="contribuenteRestituzione.codiceFiscale"
                  :provinciaNascita="contribuenteRestituzione.provinciaNascita"
                  :comuneNascita="contribuenteRestituzione.comuneNascita"
                  :email="contribuenteRestituzione.mail"
                  :sesso="contribuenteRestituzione.sesso"
                  :personaFisica="contribuenteRestituzione.personaFisica"
                  tipoDatiAnagrafici="contribuente"
                />
                <DatiIndirizzoIntestatario
                  :indirizzo="contribuenteRestituzione.indirizzo"
                  :comune="contribuenteRestituzione.descComune"
                  :provincia="contribuenteRestituzione.provincia"
                  :cap="contribuenteRestituzione.cap"
                  tipoDatiAnagrafici="contribuente"
                />
              </template>
              <NonResidenteForm ref="nonResidente" v-else />
              <v-form
                @submit.prevent="inserimentoDomanda"
                class="multiple-inline-form"
                enctype="multipart/form-data"
              >
                <OggettoDomandaRichiestaRestituzioneForm
                  ref="oggettoDomandaRichiestaRestituzione"
                  v-on:updateboxerr="updateDetailError($event)"
                />
                <DatiVeicoloVersamentiRestituzioneForm
                  ref="datiVeicoloVersamentiRestituzione"
                  v-on:updateboxerr="updateDetailError($event)"
                />
                <div
                  class="error-label"
                  v-if="
                    this.clickAvanti &&
                    !$refs.datiVeicoloVersamentiRestituzione.$v
                      .datiVeicoloVersamentiRestituzioneForm.$model
                      .veicoloSelezionato &&
                    $refs.datiVeicoloVersamentiRestituzione.$v
                      .datiVeicoloVersamentiRestituzioneForm.$model
                      .selectedItems.length === 0
                  "
                >
                  Assicurati che ci sia almeno un veicolo e un versamento
                </div>
                <div
                  class="error-label"
                  v-if="
                    this.clickAvanti &&
                    $refs.datiVeicoloVersamentiRestituzione.$v
                      .datiVeicoloVersamentiRestituzioneForm.$model
                      .selectedItems.length === 0
                  "
                >
                  Seleziona da uno ad un massimo di due versamenti versamenti
                </div>
                <ModalitaRestituzioneForm
                  ref="modalitaRestituzione"
                  v-on:updateboxerr="updateDetailError($event)"
                />
                <div class="space-section">
                  <h2>{{ $t("general.box_titles.allegati") }}</h2>
                  <v-alert
                    class="mt-5"
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
                          allegati a completamento della tua domanda di
                          restituzione. Si consiglia preferibilmente il formato
                          PDF ma sono anche ammessi i seguenti formati:
                          {{ tipiAllegato }}. Il dimensionamento massimo è di 2
                          mb.
                        </p>
                        <p>
                          La funzionalità "Scatta una foto" potrebbe non essere
                          disponibile su tutti i dispositivi; si consiglia di
                          utilizzarla solo in caso di uso di smartphone.
                        </p>
                      </v-col>
                    </v-row>
                  </v-alert>

                  <div class="row">
                    <div class="col-md-12">
                      <v-file-input
                        id="uploadFile"
                        :accept="tipiAllegato"
                        label="Seleziona allegato"
                        :disabled="
                          restituzioniTassaAllegati.length >= numMaxAllegati
                        "
                        @change="caricaAllegato()"
                        v-model="restituzioniTassaAllegatiForm.file"
                        browse-text="Sfoglia"
                        :error-count="2"
                        :error-messages="allegatiErrors"
                      />
                    </div>
                  </div>
                  <div
                    class="error-label container"
                    v-if="
                      this.clickAvanti &&
                      restituzioniTassaAllegati.length === 0 &&
                      pageEnv !== 'testing'
                    "
                  >
                    È obbligatorio caricare almeno un allegato.
                  </div>
                  <div
                    class="mt-2"
                    v-if="restituzioniTassaAllegati.length === 0"
                  >
                    {{ $t("general.messages.zero_allegati") }}
                  </div>
                  <div v-else>
                    <ul class="border-list">
                      <li
                        v-for="(item, index) in restituzioniTassaAllegati"
                        :key="index"
                      >
                        <a
                          href="#"
                          v-on:click="
                            scaricaAllegato(item.identificativoArchivio)
                          "
                          >{{ item.nomeAllegato }}</a
                        >
                        <a
                          @click="eliminaAllegato(item.identificativoArchivio)"
                        >
                          <v-icon color="error">mdi-trash-can</v-icon>
                        </a>
                        {{ item.identificativoArchivio }}
                      </li>
                    </ul>
                  </div>
                  <div class="error--text mt-2" v-if="downloadFileError !== null">
                    {{ downloadFileError }}
                  </div>
                  <div class="action-button-wide row mt-5">
                    <div class="col-md-6 offset-md-6 text-md-right">
                      <v-btn color="primary" depressed @click="openmodalFoto()" aria-label="scatta una foto per aggiungere un documento come allegato">
                        <v-icon class="mr-2">mdi-camera</v-icon>
                        {{ $t("general.buttons.foto") }}
                      </v-btn>
                    </div>
                  </div>
                  <div
                    class="error-label container"
                    v-if="this.clickAvanti && this.incomplete"
                  >
                    Sono presenti errori nella pagina, verificare la correttezza
                    dei dati inseriti
                  </div>

                  <ScattaFoto
                    ref="scattaFoto"
                    v-bind:imgFile.sync="restituzioniTassaAllegatiForm.file"
                    v-on:annullafile="restituzioniTassaAllegatiForm.file = null"
                    v-on:salvafile="restituzioniTassaAllegatiForm.file = $event"
                    v-on:caricaallegato="caricaAllegato()"
                  />
                  <br />
                  <DichiarazioneSostitutiva
                    ref="dichiarazioneSostitutiva"
                    :isChecked="false"
                    :text="'DICH_SOST_NOT'"
                  />
                </div>
                <div class="action-button-wide row">
                  <div class="col-md-6"></div>
                  <div class="col-md-6 text-md-right">
                    <v-btn
                      depressed
                      type="submit"
                      id="btnInvioInserimentoRestituzione"
                      color="primary"
                      aria-label="prosegui al prossimo step"
                      >Avanti</v-btn
                    >
                  </div>
                </div>
              </v-form>
            </div>
          </div>
        </v-card>
      </div>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
// import VueForm from 'vue-form'
import { mapGetters } from 'vuex'
import {
  ALLEGATI_MAX_NUM,
  ALLEGATO_MAX_SIZE,
  checkDimenAllegato,
  checkTipoAllegato,
  tipiAllegatoString,
  PAGE_ENV
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import store from '@/store'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import OggettoDomandaRichiestaRestituzioneForm from '@/components/pratica/restituzione_tassa/OggettoDomandaRichiestaRestituzioneForm'
import DatiVeicoloVersamentiRestituzioneForm from '@/components/pratica/restituzione_tassa/DatiVeicoloVersamentiRestituzioneForm'
import DichiarazioneSostitutiva from '@/components/pratica/DichiarazioneSostitutiva'
import ModalitaRestituzioneForm from '@/components/pratica/restituzione_tassa/ModalitaRestituzioneForm'
import NonResidenteForm from '@/components/pratica/NonResidenteForm'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import BtnBack from '@/components/layout/btn/BtnBack'
import { saveAs } from 'file-saver'
import { validationMixin } from 'vuelidate'
import ScattaFoto from '@/components/camera/ScattaFoto'
import {
  RESTITUZIONI_TASSA_CONTRIBUENTI,
  RESTITUZIONI_TASSA_CARICA_ALLEGATO,
  RESTITUZIONI_TASSA_ELIMINA_ALLEGATO
} from '@/store/actions.type'

import {
  SET_RESTITUZIONI_TASSA,
  SET_RESTITUZIONI_TASSA_CONTRIBUENTI,
  SET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO,
  SET_RESIDENT
} from '@/store/mutations.type'

export default {
  components: {
    BoxErrore,
    BtnBack,
    NonResidenteForm,
    OggettoDomandaRichiestaRestituzioneForm,
    DatiVeicoloVersamentiRestituzioneForm,
    ModalitaRestituzioneForm,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    DichiarazioneSostitutiva,
    Wizard,
    Spinner,
    ScattaFoto
  },
  data () {
    return {
      pageEnv: PAGE_ENV,
      clickAvanti: false,
      incomplete: false,
      detailError: { message: '', title: '' },
      restituzioniTassaAllegatiForm: {
        file: null
      },
      numMaxAllegati: ALLEGATI_MAX_NUM,
      overlay: false,
      tipiAllegato: tipiAllegatoString(),
      uploadFileError: null,
      modalFotoFirstTime: true,
      downloadFileError: null,
      descrizione: '<p>Il servizio permette al contribuente, in pochi e semplici passi, di inviare al "Settore Politiche Fiscali e Contenzioso Amministrativo" della Regione una richiesta per la restituzione degli importi corrisposti a titolo di tassa automobilistica nei seguenti casi: <b>doppio pagamento</b> (con la stessa scadenza), <b>pagamento in eccesso</b>, <b>pagamento non dovuto</b> (es.: perdita di possesso, esenzione).<br/></p>' +
        '<p>Prima di cominciare ricordati di avere a disposizione i <b>documenti</b> necessari da allegare. Se stai usando uno smartphone, puoi allegare i documenti <b>facendo una foto</b>;in questo caso assicurati della leggibilità del documento</p>',
      link: '<a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/restituzioni-della-tassa-automobilistica" target="_blank"><strong>Maggiori informazioni</strong></a>'
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    restituzioniTassaAllegatiForm: {
      file: {
        uploadFileFailed: function () {
          return !(this.uploadFileError != null && this.uploadFileError !== '')
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'restituzioniTassa',
      'restituzioniTassaAllegati',
      'elencoVeicoliVersamenti',
      'contribuenteRestituzione',
      'oggettoDomandaRestituzione',
      'datiVeicoloVersamentiRestituzione',
      'modalitaRestituzione',
      'userIdentity',
      'isResident'
    ]),
    allegatiErrors () {
      const errors = []
      if (!this.$v.restituzioniTassaAllegatiForm.file.$dirty) return errors
      !this.$v.restituzioniTassaAllegatiForm.file.uploadFileFailed && errors.push(this.uploadFileError)
      this.restituzioniTassaAllegati.length === this.numMaxAllegati && errors.push(this.$i18n.t('general.messages.limite_allegati'))
      return errors
    }
  },
  methods: {
    openmodalFoto () {
      this.$refs.scattaFoto.modalFoto = true
      if (!this.modalFotoFirstTime) this.$refs.scattaFoto.playVideo()
      this.modalFotoFirstTime = false
    },
    inserimentoDomanda () {
      this.clickAvanti = true
      let oggettoNonResidente = null
      const elencoVeicoliSelezionati = this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$model.selectedItems
      if (this.isResident === false) {
        this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$touch()
        this.$refs.nonResidente.$v.nonResidenteForm.$touch()
        this.$refs.oggettoDomandaRichiestaRestituzione.$v.oggDomRestituzioneForm.$touch()
        this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$touch()
        this.$refs.modalitaRestituzione.$v.modalitaRestituzioneForm.$touch()
        const NR = this.$refs.nonResidente.$v.nonResidenteForm.$model
        oggettoNonResidente = {
          altro: null,
          cap: NR.capResidenza,
          codiceFiscale: NR.codiceFiscale,
          cognome: NR.cognome,
          comuneNascita: NR.comuneAnagrafica && NR.provinciaAnagrafica ? NR.comuneAnagrafica.descrizione : null,
          comuneProvCap: NR.civicoResidenza,
          dataNascita: NR.dataDiNascita,
          denominazione: null,
          descComune: NR.comuneResidenza && NR.provinciaResidenza ? NR.comuneResidenza.descrizione : null,
          email: null,
          indirizzo: NR.indirizzoResidenza + ' ' + NR.civicoResidenza,
          indirizzoCompleto: null,
          nome: NR.nome,
          piva: null,
          provincia: NR.provinciaResidenza ? NR.provinciaResidenza.codice : null,
          provinciaNascita: NR.provinciaAnagrafica ? NR.provinciaAnagrafica.codice : null,
          sesso: NR.sesso,
          statoNascita: NR.nazioneAnagrafica ? NR.nazioneAnagrafica.descrizione : 'ITALIA',
          telefono: null
        }
      } else {
        this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$touch()
        this.$refs.oggettoDomandaRichiestaRestituzione.$v.oggDomRestituzioneForm.$touch()
        this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$touch()
        this.$refs.modalitaRestituzione.$v.modalitaRestituzioneForm.$touch()
      }
      this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$touch()
      this.$refs.oggettoDomandaRichiestaRestituzione.$v.oggDomRestituzioneForm.$touch()
      this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$touch()
      this.$refs.modalitaRestituzione.$v.modalitaRestituzioneForm.$touch()
      if (this.pageEnv !== 'testing') {
        if (this.restituzioniTassaAllegati.length === 0) return
      }
      if (this.isResident === false) {
        if (this.$refs.oggettoDomandaRichiestaRestituzione.$v.oggDomRestituzioneForm.$invalid ||
          this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$invalid ||
          this.$refs.modalitaRestituzione.$v.modalitaRestituzioneForm.$invalid || elencoVeicoliSelezionati.length === 0 || this.$refs.nonResidente.$v.nonResidenteForm.$invalid || this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$invalid) {
          this.incomplete = true
          setTimeout(() => { this.incomplete = false }, 3000)
          return
        }
      } else {
        if (this.$refs.oggettoDomandaRichiestaRestituzione.$v.oggDomRestituzioneForm.$invalid ||
          this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$invalid ||
          this.$refs.modalitaRestituzione.$v.modalitaRestituzioneForm.$invalid || elencoVeicoliSelezionati.length === 0 || this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$invalid) {
          this.incomplete = true
          setTimeout(() => { this.incomplete = false }, 3000)
          return
        }
      }
      // salvo nello store i vari input di oggetto domanda richiesta
      const oggDomModel = this.$refs.oggettoDomandaRichiestaRestituzione.$v.oggDomRestituzioneForm.$model
      const datVeicVerModel = this.$refs.datiVeicoloVersamentiRestituzione.$v.datiVeicoloVersamentiRestituzioneForm.$model
      const modRestModel = this.$refs.modalitaRestituzione.$v.modalitaRestituzioneForm.$model
      const ODR = this.oggettoDomandaRestituzione
      const DVV = this.datiVeicoloVersamentiRestituzione
      const MR = this.modalitaRestituzione
      if (oggDomModel.oggDomRestituzioneRadio === 'doppioPagamento') {
        ODR.doppioPagamento = true
        ODR.pagamentoEccessivo.checked = false
        ODR.pagamentoEccessivo.erroreMateriale = false
        ODR.pagamentoEccessivo.targaErrata = false
        ODR.pagamentoEccessivo.targa = ''
        ODR.pagamentoNonDovuto.checked = false
        ODR.pagamentoNonDovuto.motivo = ''
        ODR.perditaDiPossesso.checked = false
        ODR.perditaDiPossesso.restituzioneDifferenza = false
        ODR.perditaDiPossesso.restituzionePeriodo = false
      } else if (oggDomModel.oggDomRestituzioneRadio === 'pagamentoEccessivo') {
        ODR.doppioPagamento = false
        ODR.pagamentoEccessivo.checked = true
        ODR.pagamentoNonDovuto.checked = false
        ODR.pagamentoNonDovuto.motivo = ''
        ODR.perditaDiPossesso.checked = false
        ODR.perditaDiPossesso.restituzioneDifferenza = false
        ODR.perditaDiPossesso.restituzionePeriodo = false
        if (oggDomModel.radioPagamentoEccessivo === 'erroreMateriale') {
          ODR.pagamentoEccessivo.erroreMateriale = true
          ODR.pagamentoEccessivo.targaErrata = false
        } else {
          ODR.pagamentoEccessivo.erroreMateriale = false
          ODR.pagamentoEccessivo.targaErrata = true
          ODR.pagamentoEccessivo.targa = oggDomModel.targaErrataInput
        }
      } else if (oggDomModel.oggDomRestituzioneRadio === 'pagamentoNonDovuto') {
        ODR.doppioPagamento = false
        ODR.pagamentoEccessivo.checked = false
        ODR.pagamentoEccessivo.erroreMateriale = false
        ODR.pagamentoEccessivo.targaErrata = false
        ODR.pagamentoEccessivo.targa = ''
        ODR.pagamentoNonDovuto.checked = true
        ODR.pagamentoNonDovuto.motivo = oggDomModel.pagamentoNonDovutoInput
        ODR.perditaDiPossesso.checked = false
        ODR.perditaDiPossesso.restituzioneDifferenza = false
        ODR.perditaDiPossesso.restituzionePeriodo = false
      } else if (oggDomModel.oggDomRestituzioneRadio === 'perditaDiPossesso') {
        ODR.doppioPagamento = false
        ODR.pagamentoEccessivo.checked = false
        ODR.pagamentoEccessivo.erroreMateriale = false
        ODR.pagamentoEccessivo.targa = ''
        ODR.pagamentoEccessivo.targaErrata = false
        ODR.pagamentoNonDovuto.checked = false
        ODR.pagamentoNonDovuto.motivo = ''
        ODR.perditaDiPossesso.checked = true
        if (oggDomModel.radioPerditaDiPossesso === 'restituzionePeriodo') {
          ODR.perditaDiPossesso.restituzionePeriodo = true
          ODR.perditaDiPossesso.restituzioneDifferenza = false
        } else {
          ODR.perditaDiPossesso.restituzionePeriodo = false
          ODR.perditaDiPossesso.restituzioneDifferenza = true
        }
      } else {
        ODR.doppioPagamento = false
        ODR.pagamentoEccessivo.checked = false
        ODR.pagamentoEccessivo.erroreMateriale = false
        ODR.pagamentoEccessivo.targaErrata = false
        ODR.pagamentoEccessivo.targa = ''
        ODR.pagamentoNonDovuto.checked = false
        ODR.pagamentoNonDovuto.motivo = ''
        ODR.perditaDiPossesso.checked = false
      }
      // salvo nello store i vari input di dati veicolo e versamenti
      if (datVeicVerModel.datiVeicoloVersamentiRestituzioneRadio === 'versamentoErrato') {
        DVV.valueName = 'versamentoErrato'
        DVV.versamentoErrato.checked = true
        DVV.veicoloNonPresente.checked = false
        DVV.versamentoErrato.veicolo = datVeicVerModel.versamentoErrato
      } else {
        DVV.valueName = 'veicoloNonPresente'
        DVV.veicoloNonPresente.checked = true
        DVV.versamentoErrato.checked = false
        DVV.veicoloNonPresente.tipoVeicolo = datVeicVerModel.veicoloNonPresente
        DVV.veicoloNonPresente.targa = datVeicVerModel.targa
      }
      store.commit(SET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO, elencoVeicoliSelezionati)
      // salvo nello store i vari input di modalità restituzione
      if (modRestModel.modalitaRestituzioneRadio === 'accreditoCc') {
        MR.accreditoCc.checked = true
        MR.compensazione.checked = false
        MR.accreditoCc.iban = modRestModel.iban
        MR.compensazione.codiceFiscale = ''
        MR.compensazione.miaProprieta = false
        MR.compensazione.altroSoggetto = false
      } else {
        MR.accreditoCc.checked = false
        MR.compensazione.checked = true
        MR.accreditoCc.iban = ''
        if (modRestModel.radioCompensazione === 'miaProprieta') {
          MR.compensazione.miaProprieta = true
          MR.compensazione.altroSoggetto = false
          MR.compensazione.codiceFiscale = ''
        } else {
          MR.compensazione.miaProprieta = false
          MR.compensazione.altroSoggetto = true
          MR.compensazione.codiceFiscale = modRestModel.codiceFiscale
        }
      }
      // OGGETTONE
      const oggettoStore = {
        contribuente: this.contribuenteRestituzione === null ? oggettoNonResidente : this.contribuenteRestituzione,
        oggettoDomanda: this.oggettoDomandaRestituzione,
        datiVeicoloVersamenti: this.datiVeicoloVersamentiRestituzione,
        modalitaRestituzione: this.modalitaRestituzione,
        versamenti: this.elencoVeicoliVersamenti,
        allegati: this.restituzioniTassaAllegati
      }
      if (this.isResident === false) {
        store.commit(SET_RESTITUZIONI_TASSA_CONTRIBUENTI, oggettoNonResidente)
      }
      store.commit(SET_RESTITUZIONI_TASSA, oggettoStore)
      this.$router.push({ name: 'riepilogo_domanda_Restituzione' })
    },

    caricaAllegato () {
      this.uploadFileError = null
      this.downloadFileError = null
      if (this.restituzioniTassaAllegatiForm.file === null) return

      const fileExt = this.restituzioniTassaAllegatiForm.file.name.substr(this.restituzioniTassaAllegatiForm.file.name.lastIndexOf('.') + 1)
      if (!checkTipoAllegato(fileExt)) this.uploadFileError = 'Il documento ha un\'estensione non consentita.'
      if (!checkDimenAllegato(this.restituzioniTassaAllegatiForm.file.size)) this.uploadFileError = 'Il documento ha una dimensione che supera quella consentita (' + ALLEGATO_MAX_SIZE + 'MB).'

      this.$v.restituzioniTassaAllegatiForm.file.$touch()
      if (this.$v.restituzioniTassaAllegatiForm.file.$invalid) return

      const formData = new FormData()
      formData.append('upFile', this.restituzioniTassaAllegatiForm.file)
      formData.append('codiceFiscale', this.isResident !== false ? this.contribuenteRestituzione.codiceFiscale : this.$refs.nonResidente.$v.nonResidenteForm.$model.codiceFiscale ? this.$refs.nonResidente.$v.nonResidenteForm.$model.codiceFiscale : '')
      formData.append('cognome', this.isResident !== false ? this.contribuenteRestituzione.cognome : this.$refs.nonResidente.$v.nonResidenteForm.$model.cognome ? this.$refs.nonResidente.$v.nonResidenteForm.$model.cognome : '')

      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(RESTITUZIONI_TASSA_CARICA_ALLEGATO, formData)
        .then((response) => {
          this.overlay = false
          this.restituzioniTassaAllegatiForm.file = null
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
          } else if (error.response.status === 422) {
            this.uploadFileError = 'Formato errato parametri, controlla di aver compilato correttamente i campi in anagrafica'
          } else if (error.response.status === 500) {
            this.uploadFileError = this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    },

    scaricaAllegato (idAllegato) {
      this.downloadFileError = null
      const attach = this.restituzioniTassaAllegati.find(p => (p.identificativoArchivio === idAllegato))

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
        .dispatch(RESTITUZIONI_TASSA_ELIMINA_ALLEGATO, {
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
          const noDelFile = 'Eliminazione non consentita, '
          switch (error.response.status) {
            case 400:
              this.downloadFileError = noDelFile + 'parametri obbligatori non valorizzati'
              break
            case 404:
              this.downloadFileError = noDelFile + 'avviso non trovato'
              break
            case 409:
            case 500:
              this.downloadFileError = noDelFile + error.response.data.title
              break
            default:
              break
          }
        })
    },

    updateDetailError (detErr) {
      this.detailError = detErr
    }
  },
  async created () {
    this.overlay = true
    await store
      .dispatch(RESTITUZIONI_TASSA_CONTRIBUENTI, this.userIdentity.cf)
      .then(this.overlay = false)
      .catch((error) => {
        if (error === null) {
          this.$router.push({ name: 'pageErrorAuth', params: { errorStatus: null, errorMessage: 'Non è possibile accedere al servizio' } })
        }
        if (error.response.status === 404) {
          this.$store.commit(SET_RESIDENT, false)
          this.overlay = false
        }
        if (error.response.status && error.response.status !== 404) {
          this.$router.push({ name: 'pageErrorAuth', params: { errorStatus: error.response.data.status, errorMessage: error.response.data.title } })
        }
      })
  }
}
</script>

<style>
</style>
