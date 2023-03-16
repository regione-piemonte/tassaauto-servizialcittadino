<template>
  <div class="container">
    <div v-if="contribuente">
      <div class="row inner-cont-bollo">
        <div
          class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2"
          v-html="descrizione  + link"
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
              <Wizard :servizio="'esenzioni_disabili'" :stepAttivo="0" />
            </div>
          </div>
          <div class="row inner-cont-bollo">
            <div class="col-lg-8 offset-lg-2">
              <DatiAnagraficiIntestatario
                :denominazione="contribuente.nome + ' ' + contribuente.cognome"
                :codiceFiscale="contribuente.codiceFiscale"
                :provinciaNascita="contribuente.provinciaNascita"
                :comuneNascita="contribuente.comuneNascita"
                :email="contribuente.mail"
                :sesso="contribuente.sesso"
                :personaFisica="contribuente.personaFisica"
                tipoDatiAnagrafici="contribuente"
              />
              <DatiIndirizzoIntestatario
                :indirizzo="contribuente.indirizzo"
                :comune="contribuente.descComune"
                :provincia="contribuente.provincia"
                :cap="contribuente.cap"
                tipoDatiAnagrafici="contribuente"
              />
              <v-form
                @submit.prevent="inserimentoDomanda"
                class="multiple-inline-form"
                enctype="multipart/form-data"
              >
                <OggettoDomandaDisabiliFormRadio
                  ref="oggettoDisabiliformRadio"
                  v-on:updateboxerr="updateDetailError($event)"
                />
                <DichiarazioneDisabiliFormRadio
                  ref="dichiarazioneDisabiliformRadio"
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
                          Allegare sempre la documentazione medico legale
                          pertinente al requisito di cui si è dichiarato il
                          possesso. Puoi inserire fino a
                          {{ numMaxAllegati }} documenti allegati a
                          completamento della tua domanda di esenzione. Si
                          consiglia preferibilmente il formato PDF ma sono anche
                          ammessi i seguenti formati: {{ tipiAllegato }}. Il
                          dimensionamento massimo è di 2 mb.
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
                          esenzioniDisabiliAllegati.length >= numMaxAllegati
                        "
                        @change="caricaAllegato()"
                        v-model="esenzioniAllegatiForm.file"
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
                      $store.getters.esenzioniDisabiliAllegati.length === 0
                    "
                  >
                    È obbligatorio caricare almeno un allegato.
                  </div>
                  <div
                    class="mt-2"
                    v-if="esenzioniDisabiliAllegati.length === 0"
                  >
                    {{ $t("general.messages.zero_allegati") }}
                  </div>
                  <div v-else>
                    <ul class="border-list">
                      <li
                        v-for="(item, index) in esenzioniDisabiliAllegati"
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
                  <div
                    class="error-label container"
                    v-if="this.clickAvanti && this.incomplete"
                  >
                    Sono presenti errori nella pagina, verificare la correttezza
                    dei dati inseriti
                  </div>
                  <div class="action-button-wide row mt-5">
                    <div class="col-md-6 offset-md-6 text-md-right">
                      <v-btn @click="openmodalFoto()" color="primary" depressed>
                        <v-icon class="mr-2">mdi-camera</v-icon>
                        {{ $t("general.buttons.foto") }}
                      </v-btn>
                    </div>
                  </div>

                  <ScattaFoto
                    ref="scattaFoto"
                    v-bind:imgFile.sync="esenzioniAllegatiForm.file"
                    v-on:annullafile="esenzioniAllegatiForm.file = null"
                    v-on:salvafile="esenzioniAllegatiForm.file = $event"
                    v-on:caricaallegato="caricaAllegato()"
                  />
                  <br />
                  <DichiarazioneSostitutiva
                    ref="dichiarazioneSostitutiva"
                    :isChecked="false"
                    :text="'DICH_SOST_CERT'"
                    @dichSostEvent="dichEvent($event)"
                  />
                </div>
                <div class="action-button-wide row">
                  <div class="col-md-6"></div>
                  <div class="col-md-6 text-md-right">
                    <v-btn
                      depressed
                      type="submit"
                      id="btnInvioInserimentoEsenzione"
                      color="primary"
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
    <div class="col-lg-10 mx-lg-auto" v-else>
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxNeutral
              show
              :msg="detailInfo"
              class="printDisplay"
            />
          </div>
        </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>

import {
  ALLEGATI_MAX_NUM,
  ALLEGATO_MAX_SIZE,
  PAGE_ENV,
  checkDimenAllegato,
  checkTipoAllegato,
  tipiAllegatoString
} from '@/common/config'
import {
  ESENZIONI_DISABILI_CONTRIBUENTI,
  ESENZIONI_DISABILI_CARICA_ALLEGATO,
  ESENZIONI_DISABILI_ELIMINA_ALLEGATO
} from '@/store/actions.type'
import { SET_ESENZIONI_DISABILI } from '@/store/mutations.type'
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral.vue'
import BtnBack from '@/components/layout/btn/BtnBack'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import DichiarazioneDisabiliFormRadio from '@/components/pratica/esenzioni_disabili/DichiarazioneDisabiliFormRadio'
import DichiarazioneSostitutiva from '@/components/pratica/DichiarazioneSostitutiva'
import { mapGetters } from 'vuex'
import NavigatorService from '@/common/navigator.service'
import OggettoDomandaDisabiliFormRadio from '@/components/pratica/esenzioni_disabili/OggettoDomandaDisabiliFormRadio'
import ScattaFoto from '@/components/camera/ScattaFoto'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import store from '@/store'
import { saveAs } from 'file-saver'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    BoxErrore,
    BoxNeutral,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    DichiarazioneDisabiliFormRadio,
    DichiarazioneSostitutiva,
    OggettoDomandaDisabiliFormRadio,
    ScattaFoto,
    Spinner,
    Wizard
  },
  data () {
    return {
      pageEnv: PAGE_ENV,
      clickAvanti: false,
      incomplete: false,
      detailError: { message: '', title: '' },
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      },
      esenzioniAllegatiForm: {
        file: null
      },
      numMaxAllegati: ALLEGATI_MAX_NUM,
      overlay: false,
      modalFotoFirstTime: true,
      tipiAllegato: tipiAllegatoString(),
      uploadFileError: null,
      downloadFileError: null,
      descrizione: '<p>Il servizio permette al contribuente, in pochi e semplici passi, di inviare al "Settore Politiche Fiscali e Contenzioso Amministrativo" della Regione una <strong>richiesta di esenzione per disabilità</strong>.<br/></p>' +
        '<p>Prima di cominciare ricordati di avere a disposizione i <strong>documenti</strong> necessari da allegare. Ove possibile utilizzare il <strong>formato PDF</strong>.<br/> Se stai usando uno smartphone, puoi allegare i documenti facendo una <strong>foto</strong>; in questo caso assicurati della leggibilità del documento</p>',
      link: '<a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/esenzioni-dalla-tassa-automobilistica-per-persone-disabili" target="_blank"><strong>Maggiori informazioni</strong></a>'
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    esenzioniAllegatiForm: {
      file: {
        uploadFileFailed: function () {
          return !(this.uploadFileError != null && this.uploadFileError !== '')
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'esenzioniDisabili',
      'esenzioniDisabiliAllegati',
      'contribuente',
      'dichiarazione',
      'oggettoDomanda',
      'userIdentity'
    ]),
    allegatiErrors () {
      const errors = []
      if (!this.$v.esenzioniAllegatiForm.file.$dirty) return errors
      !this.$v.esenzioniAllegatiForm.file.uploadFileFailed && errors.push(this.uploadFileError)
      this.esenzioniDisabiliAllegati.length === this.numMaxAllegati && errors.push(this.$i18n.t('general.messages.limite_allegati'))
      return errors
    }
  },
  methods: {
    dichEvent (m) {
      this.detailError = m
    },
    openmodalFoto () {
      this.$refs.scattaFoto.modalFoto = true
      if (!this.modalFotoFirstTime) this.$refs.scattaFoto.playVideo()
      this.modalFotoFirstTime = false
    },
    inserimentoDomanda () {
      this.clickAvanti = true
      this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$touch()
      this.$refs.oggettoDisabiliformRadio.$v.domandaDisabiliForm.$touch()
      this.$refs.dichiarazioneDisabiliformRadio.$v.dichiarazioneDisabiliForm.$touch()
      if (this.pageEnv !== 'testing') {
        if (store.getters.esenzioniDisabiliAllegati.length === 0) return
      }
      if (this.$refs.oggettoDisabiliformRadio.$v.domandaDisabiliForm.$invalid ||
        this.$refs.dichiarazioneDisabiliformRadio.$v.dichiarazioneDisabiliForm.$invalid || this.$refs.dichiarazioneSostitutiva.$v.dichSostForm.$invalid
      ) {
        this.incomplete = true
        setTimeout(() => { this.incomplete = false }, 3000)
        return
      }
      // salvo nello store i vari input di oggetto domanda
      const ODM = this.$refs.oggettoDisabiliformRadio.$v.domandaDisabiliForm.$model
      const DM = this.$refs.dichiarazioneDisabiliformRadio.$v.dichiarazioneDisabiliForm.$model
      const OD = this.oggettoDomanda
      const DIC = this.dichiarazione

      if (ODM.disabiliOggettoDomandaRadio === 'primaRichiesta') {
        OD.valueName = 'primaRichiesta'
        OD.primaRichiestaEsenzione.checked = true
        OD.trasferimentoEsenzione.checked = false
        OD.trasferimentoEsenzione.targa = ''
      } else {
        OD.valueName = 'trasferimentoEsenzione'
        OD.trasferimentoEsenzione.checked = true
        OD.primaRichiestaEsenzione.checked = false
        OD.trasferimentoEsenzione.targa = ODM.targaEsentato
      }
      OD.primaRichiestaEsenzione.veicolo = ODM.selezionaVeicoloPR
      OD.trasferimentoEsenzione.veicolo = ODM.selezionaVeicoloTE
      // salvo nello store i vari input di dichiarazione

      if (DM.disabiliDichiarazioneRadio === 'proprietarioDisabile') {
        DIC.proprietarioDisabile.checked = true
        DIC.disabileFamiliare.checked = false
        DIC.disabileFamiliare.cfFamiliare = ''
        DIC.disabileFamiliare.disabilitaGrave = false
        DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = false
        DIC.disabileFamiliare.disabilitaPsichicaMentale = false
        DIC.disabileFamiliare.parentela = false
        DIC.disabileComproprietario.checked = false
        DIC.disabileComproprietario.cfFamiliare = ''
        DIC.disabileComproprietario.disabilitaGrave = false
        DIC.disabileComproprietario.disabilitaNonVedenteIpovedente = false
        DIC.disabileComproprietario.disabilitaPsichicaMentale = false
        DIC.disabileComproprietario.comproprietario = false
        DIC.disabileComproprietario.parentela = ''
      } else if (DM.disabiliDichiarazioneRadio === 'disabileFamiliare') {
        DIC.disabileFamiliare.checked = true
        DIC.proprietarioDisabile.checked = false
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = false
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = false
        DIC.proprietarioDisabile.personaVedenteIpovedente = false
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = false
        DIC.disabileComproprietario.checked = false
        DIC.disabileComproprietario.cfFamiliare = ''
        DIC.disabileComproprietario.disabilitaGrave = false
        DIC.disabileComproprietario.disabilitaNonVedenteIpovedente = false
        DIC.disabileComproprietario.disabilitaPsichicaMentale = false
        DIC.disabileComproprietario.comproprietario = false
        DIC.disabileComproprietario.parentela = ''
        if (DM.selezionaParentela) {
          DIC.disabileFamiliare.parentela = DM.selezionaParentela.codice
        }
        DIC.disabileFamiliare.cfFamiliare = DM.cfFamiliare
      } else if (DM.disabiliDichiarazioneRadio === 'disabileComproprietario') {
        DIC.disabileComproprietario.checked = true
        DIC.disabileFamiliare.checked = false
        DIC.disabileFamiliare.cfFamiliare = ''
        DIC.disabileFamiliare.disabilitaGrave = false
        DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = false
        DIC.disabileFamiliare.disabilitaPsichicaMentale = false
        DIC.disabileFamiliare.parentela = ''
        DIC.proprietarioDisabile.checked = false
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = false
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = false
        DIC.proprietarioDisabile.personaVedenteIpovedente = false
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = false
        if (DM.selezionaParentela) {
          DIC.disabileComproprietario.parentela = DM.selezionaParentela.codice
        }
        DIC.disabileComproprietario.cfFamiliare = DM.cfFamiliare
      } else {
        DIC.proprietarioDisabile.checked = false
        DIC.disabileFamiliare.checked = false
      }
      // input proprietarioDisabile
      if (DM.radioProprietario === 'riconosciutoPersonaDisabile') {
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = true
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = false
        DIC.proprietarioDisabile.personaVedenteIpovedente = false
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = false
      } else if (DM.radioProprietario === 'personaDisabilitaPsichicaMentale') {
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = false
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = true
        DIC.proprietarioDisabile.personaVedenteIpovedente = false
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = false
      } else if (DM.radioProprietario === 'personaVedenteIpovedente') {
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = false
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = false
        DIC.proprietarioDisabile.personaVedenteIpovedente = true
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = false
      } else if (DM.radioProprietario === 'invalidoRidotteImpediteCapacitaMotorie') {
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = false
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = false
        DIC.proprietarioDisabile.personaVedenteIpovedente = false
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = true
      } else {
        DIC.proprietarioDisabile.riconosciutoPersonaDisabile = false
        DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale = false
        DIC.proprietarioDisabile.personaVedenteIpovedente = false
        DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie = false
      }
      // input disabileFamiliare
      if (DM.disabiliDichiarazioneRadio !== 'disabileComproprietario') {
        if (DM.radioDisabileFamiliare === 'disabilitaGrave') {
          DIC.disabileFamiliare.disabilitaGrave = true
          DIC.disabileFamiliare.disabilitaPsichicaMentale = false
          DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = false
        } else if (DM.radioDisabileFamiliare === 'disabilitaPsichicaMentale') {
          DIC.disabileFamiliare.disabilitaGrave = false
          DIC.disabileFamiliare.disabilitaPsichicaMentale = true
          DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = false
        } else if (DM.radioDisabileFamiliare === 'disabilitaNonVedenteIpovedente') {
          DIC.disabileFamiliare.disabilitaGrave = false
          DIC.disabileFamiliare.disabilitaPsichicaMentale = false
          DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = true
        } else {
          DIC.disabileFamiliare.disabilitaGrave = false
          DIC.disabileFamiliare.disabilitaPsichicaMentale = false
          DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = false
        }
      }
      if (DM.disabiliDichiarazioneRadio === 'disabileComproprietario') {
        if (DM.radioDisabileFamiliare === 'disabilitaGrave') {
          DIC.disabileComproprietario.disabilitaGrave = true
          DIC.disabileComproprietario.disabilitaPsichicaMentale = false
          DIC.disabileComproprietario.disabilitaNonVedenteIpovedente = false
          DIC.disabileComproprietario.comproprietario = false
        } else if (DM.radioDisabileFamiliare === 'disabilitaPsichicaMentale') {
          DIC.disabileComproprietario.disabilitaGrave = false
          DIC.disabileComproprietario.disabilitaPsichicaMentale = true
          DIC.disabileComproprietario.disabilitaNonVedenteIpovedente = false
          DIC.disabileComproprietario.comproprietario = false
        } else if (DM.radioDisabileFamiliare === 'disabilitaNonVedenteIpovedente') {
          DIC.disabileComproprietario.disabilitaGrave = false
          DIC.disabileComproprietario.disabilitaPsichicaMentale = false
          DIC.disabileComproprietario.disabilitaNonVedenteIpovedente = true
          DIC.disabileComproprietario.comproprietario = false
        } else if (DM.radioDisabileFamiliare === 'comproprietario') {
          DIC.disabileComproprietario.disabilitaGrave = false
          DIC.disabileComproprietario.disabilitaPsichicaMentale = false
          DIC.disabileComproprietario.disabilitaNonVedenteIpovedente = false
          DIC.disabileComproprietario.comproprietario = true
        } else {
          DIC.disabileFamiliare.disabilitaGrave = false
          DIC.disabileFamiliare.disabilitaPsichicaMentale = false
          DIC.disabileFamiliare.disabilitaNonVedenteIpovedente = false
        }
      }
      // OGGETTONE
      const oggettoStore = {
        contribuente: this.contribuente,
        oggettoDomanda: this.oggettoDomanda,
        dichiarazione: this.dichiarazione,
        allegati: this.esenzioniDisabiliAllegati
      }
      store.commit(SET_ESENZIONI_DISABILI, oggettoStore)
      this.$router.push({ name: 'riepilogo_domanda_esenzione' })
    },
    caricaAllegato () {
      this.uploadFileError = null
      this.downloadFileError = null
      if (this.esenzioniAllegatiForm.file === null) return
      const fileExt = this.esenzioniAllegatiForm.file.name.substr(this.esenzioniAllegatiForm.file.name.lastIndexOf('.') + 1)
      if (!checkTipoAllegato(fileExt)) this.uploadFileError = 'Il documento ha un\'estensione non consentita.'
      if (!checkDimenAllegato(this.esenzioniAllegatiForm.file.size)) this.uploadFileError = 'Il documento ha una dimensione che supera quella consentita (' + ALLEGATO_MAX_SIZE + 'MB).'

      this.$v.esenzioniAllegatiForm.file.$touch()
      if (this.$v.esenzioniAllegatiForm.file.$invalid) return

      const formData = new FormData()
      formData.append('upFile', this.esenzioniAllegatiForm.file)
      formData.append('codiceFiscale', this.contribuente.codiceFiscale)
      formData.append('cognome', this.contribuente.cognome)

      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      store
        .dispatch(ESENZIONI_DISABILI_CARICA_ALLEGATO, formData)
        .then((response) => {
          this.overlay = false
          this.esenzioniAllegatiForm.file = null
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
            this.uploadFileError = 'Formato errato parametri'
          } else if (error.response.status === 500) {
            this.uploadFileError = this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    },

    scaricaAllegato (idAllegato) {
      this.downloadFileError = null
      const attach = this.esenzioniDisabiliAllegati.find(p => (p.identificativoArchivio === idAllegato))

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
        .dispatch(ESENZIONI_DISABILI_ELIMINA_ALLEGATO, {
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
      .dispatch(ESENZIONI_DISABILI_CONTRIBUENTI, store.getters.userIdentity.cf)
      .then(this.overlay = false)
      .catch((error) => {
        this.overlay = false
        if (error === null) {
          this.$router.push({ name: 'pageErrorAuth', params: { errorStatus: null, errorMessage: 'Non è possibile accedere al servizio' } })
        }
        if (error.response.status) {
          this.$router.push({ name: 'pageErrorAuth', params: { errorStatus: error.response.data.status, errorMessage: error.response.data.title } })
        }
      })
  }
}
</script>
