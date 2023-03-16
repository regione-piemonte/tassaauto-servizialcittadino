<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'domanda_discarico_rimborso'" :stepAttivo="1" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="this.detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <div class="space-section">
              <DatiAnagraficiIntestatario
                :denominazione="soggettoDomDisRim"
                :codiceFiscale="cfDomDisRim"
                :dataNascita="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.dataNascita"
                :comuneNascita="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.comuneNascita"
                :provinciaNascita="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.provinciaNascita"
                :sesso="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.sesso"
                :tipoDatiAnagrafici="'intestatario ingiunzione / cartella'"
                :personaFisica="personaFisica"
              />
            </div>
          </div>
          <div
            class="col-lg-8 offset-lg-2"
            v-if="rappresentanteLegaleDomanda !== null">
            <DatiAnagRapprLegale
              :denominazione="rappresentanteLegaleDomanda.nome + ' ' + rappresentanteLegaleDomanda.cognome"
              :codiceFiscale="rappresentanteLegaleDomanda.codiceFiscaleR"
              :sesso="rappresentanteLegaleDomanda.sesso"
              :dataDiNascita="rappresentanteLegaleDomanda.dataDiNascita"
              :comuneDiNascita="rappresentanteLegaleDomanda.comune"
              :provinciaDiNascita="rappresentanteLegaleDomanda.provincia"
            />
          </div>
          <div class="col-lg-8 offset-lg-2">
            <DatiIndirizzoIntestatario
              :indirizzo="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.indirizzo"
              :comune="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.descComune"
              :provincia="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.provincia"
              :cap="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.cap"
              :tipoDatiAnagrafici="'ingiunzione / cartella'"
            />
          </div>
          <div class="col-lg-8 offset-lg-2">
            <div class="space-section">
              <h2>
                {{ $t('pratica.domanda_discarico_rimborso.crea.titolo_esecutivo') }}
              </h2>
              <BoxWarning :warning="detailWarn" />
              <v-form
                @submit.prevent="compilaDomanda"
                class="multiple-inline-form"
                enctype="multipart/form-data">
                <div class="tab-content-notHp">
                  <v-tabs
                  fixed-tabs
                  show-arrows="mobile"
                  centered
                  class="tabServizi"
                  v-model="tabs">
                    <v-tab
                      :disabled="ingiunzFiscTabDisabled"
                      :active="ingiunzFiscaleTab"
                      @click="ingiunzFiscaleTab = true">
                      Ingiunzione
                    </v-tab>
                    <v-tab
                      :active="!ingiunzFiscaleTab"
                      @click="ingiunzFiscaleTab = false">
                      Cartella
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items class="container"
                  v-model="tabs">
                    <v-tab-item>
                      <DomDisRimbFormRadioIng
                        ref="formRadioIngiunzione"
                        :elencoIngiunzione = "listaNumeriIngiunzione"
                        :pNumIngiunzione = "ingiunzioneFiscaleDiscRimb.numeroIngiunzione"
                      />
                    </v-tab-item>
                    <v-tab-item>
                      <DomDisRimbFormRadioCart
                        ref="formRadioCartella"
                        :pNumCartellaEsattoriale = "cartellaEsattorialeDiscRimb.numeroCartellaEsattoriale"
                        :ingiunzFiscaleTab ="ingiunzFiscaleTab"
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </div>
                <dati-opzionali
                  ref="datiOpzionali"
                  :pDataNotif="domandaDiscaricoRimborso.dataNotifica"
                  :pImportoTotRiscos="Number(domandaDiscaricoRimborso.importoTotaleRiscossione)"
                  :pIngiunzFiscaleTab="ingiunzFiscaleTab"
                />
                <div class="space-section row">
                  <div class="col-12">
                    <strong class="fix-align">
                     {{ $t('pratica.domanda_discarico_rimborso.crea.codice_tributi') }}
                    </strong>
                    <ul class="list-group list-group-horizontal vertical-divider">
                      <li v-for="codice in codiceTributiElenco" :key="codice" class="list-group-item"> {{ codice }}</li>
                    </ul>
                  </div>
                </div>
                <oggetto-domanda-form
                  ref="oggettoDomandaBox"
                  :pOggettoDomanda="domandaDiscaricoRimborso.oggettoDomanda"
                />
                <motivo-domanda-form
                  ref="motivoDomandaBox"
                  :pMotivoDomanda="domandaDiscaricoRimborso.motivo"
                />
                <div class="space-section">
                <h2>
                  {{ $t('general.box_titles.allegati') }}
                </h2>
                <v-alert
                show
                aria-live="off"
                type="info"
                border="left"
                :icon="false">
                  <v-row class="pl-6 pl-md-12">
                    <v-col cols="12" md="1">
                      <v-img
                        width="40"
                        :src="require(`@/assets/images/icone/alert/info.svg`)"
                        :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"/>
                    </v-col>
                    <v-col cols="12" md="10" class="bodyAlertDark">
                      <p>
                        {{ $t('general.services.scatta_foto.par_1', { numMaxAllegati: numMaxAllegati, tipiAllegato: tipiAllegato } ) }}
                      </p>
                      <p>
                        {{ $t('general.services.scatta_foto.par_2') }}
                      </p>
                    </v-col>
                  </v-row>
                </v-alert>
                <div class="row">
                  <div class="col-md-5">
                    <v-file-input
                      id="uploadFile"
                      :accept="tipiAllegato"
                      label="Seleziona allegato"
                      :disabled="domDiscaricoRimborsoAllegati.length >= numMaxAllegati"
                      @change="caricaAllegato()"
                      v-model="domDiscaricoForm.file"
                      browse-text="Sfoglia"
                      :error-count="2"
                      :error-messages="allegatiErrors"/>
                  </div>
                </div>
                <div class="mt-2"
                  v-if="domDiscaricoRimborsoAllegati.length === 0">
                  {{ $t('general.messages.zero_allegati') }}
                </div>
                <div v-else>
                  <ul class="border-list">
                    <li v-for="(item, index) in domDiscaricoRimborsoAllegati" :key="index">
                      <a href="#" v-on:click="scaricaAllegato(item.identificativoArchivio)">
                        {{ item.nomeAllegato }}
                      </a>
                      <v-btn
                        depressed
                        text
                        @click="eliminaAllegato(item.identificativoArchivio)">
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </li>
                  </ul>
                </div>
                <div class="error--text mt-2"
                  v-if="downloadFileError !== null">
                  {{ downloadFileError }}
                </div>
              </div>
              <div class="action-button-wide row">
                <div class="col-md-6 offset-md-6 text-md-right">
                  <v-btn
                    depressed
                    color="primary"
                    @click="openmodalFoto()">
                    <v-icon class="mr-2">mdi-camera</v-icon> {{ $t('general.buttons.foto') }}
                  </v-btn>
                </div>
              </div>
              <div class="action-button-wide row">
                <div class="col-md-6">
                  <BtnBack
                    :backUrl="'richiesta_domanda_discarico_rimborso'"
                    :backType="'back'"/>
                </div>
                <div class="col-md-6 text-md-right">
                  <v-btn
                    depressed
                    id="stepAvanti"
                    type="submit"
                    color="primary">
                    Avanti
                  </v-btn>
                </div>
              </div>
            </v-form>
          </div>
        </div>
        <ScattaFoto
          ref="scattaFoto"
          v-bind:imgFile.sync="domDiscaricoForm.file"
          v-on:annullafile="domDiscaricoForm.file = null"
          v-on:salvafile="domDiscaricoForm.file = $event"
          v-on:caricaallegato="caricaAllegato()"
        />
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
  checkDimenAllegato,
  checkTipoAllegato,
  tipiAllegatoString
} from '@/common/config'
import { mapGetters } from 'vuex'
import BoxErrore from '@/components/BoxErrore'
import BoxWarning from '@/components/BoxWarning'
import NavigatorService from '@/common/navigator.service'
import Spinner from '@/components/layout/Spinner'
import store from '@/store'
import NotePratica from '@/components/pratica/NotePratica'
import DatiOpzionali from '@/components/pratica/domanda_discarico_rimborso/DatiOpzionali'
import DomDisRimbFormRadioIng from '@/components/pratica/domanda_discarico_rimborso/DomDisRimbFormRadioIng'
import DomDisRimbFormRadioCart from '@/components/pratica/domanda_discarico_rimborso/DomDisRimbFormRadioCart'
import MotivoDomandaForm from '@/components/pratica/domanda_discarico_rimborso/MotivoDomandaForm'
import OggettoDomandaForm from '@/components/pratica/domanda_discarico_rimborso/OggettoDomandaForm'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'
import {
  CREAZIONE_DOMANDA_DISCARICO_RIMBORSO,
  DOM_DISC_RIMB_CARICA_ALLEGATO,
  DOM_DISC_RIMB_ELIMINA_ALLEGATO,
  LISTA_CODICE_TRIBUTI,
  LISTA_NUMERO_INGIUNZIONE
} from '@/store/actions.type'
import ScattaFoto from '@/components/camera/ScattaFoto'
import BtnBack from '@/components/layout/btn/BtnBack'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import { saveAs } from 'file-saver'
import Wizard from '@/components/layout/Wizard'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    BoxErrore,
    BoxWarning,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiAnagRapprLegale,
    DatiIndirizzoIntestatario,
    DatiOpzionali,
    DomDisRimbFormRadioCart,
    DomDisRimbFormRadioIng,
    MotivoDomandaForm,
    OggettoDomandaForm,
    NotePratica,
    ScattaFoto,
    Spinner,
    Wizard
  },
  data () {
    return {
      tabs: null,
      codiceTributiElenco: [],
      detailError: { message: '', title: '' },
      detailWarn: { message: '', title: '' },
      listaNumeriIngiunzione: [],
      numMaxAllegati: ALLEGATI_MAX_NUM,
      overlay: false,
      modalFotoFirstTime: true,
      tipiAllegato: tipiAllegatoString(),
      uploadFileError: null,
      downloadFileError: null,
      ingiunzFiscaleTab: true,
      ingiunzFiscTabDisabled: false,
      domDiscaricoForm: {
        file: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'datiDomandaDiscaricoIntestatario',
      'domDiscaricoRimborsoAllegati',
      'rappresentanteLegaleDomanda',
      'ingiunzioneFiscaleDiscRimb',
      'cartellaEsattorialeDiscRimb',
      'domandaDiscaricoRimborso']),
    soggettoDomDisRim: function () {
      if (this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione !== null) return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione
      return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.nome + ' ' + this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.cognome
    },
    cfDomDisRim: function () {
      if (this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione !== null) return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.piva
      return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.codiceFiscale
    },
    personaFisica: function () {
      if (this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione !== null) return false
      return true
    },
    soggettoDomDisRimLeg: function () {
      if (this.rappresentanteLegaleDomanda === null) return null
      return this.rappresentanteLegaleDomanda.nome + ' ' + this.rappresentanteLegaleDomanda.cognome
    },
    allegatiErrors () {
      const errors = []
      if (!this.$v.domDiscaricoForm.file.$dirty) return errors
      !this.$v.domDiscaricoForm.file.uploadFileFailed && errors.push(this.uploadFileError)
      this.domDiscaricoRimborsoAllegati.length === this.numMaxAllegati && errors.push(this.$i18n.t('general.messages.limite_allegati'))
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    domDiscaricoForm: {
      file: {
        uploadFileFailed: function () {
          return !(this.uploadFileError != null && this.uploadFileError !== '')
        }
      }
    }
  },
  methods: {
    openmodalFoto () {
      this.$refs.scattaFoto.modalFoto = true
      if (!this.modalFotoFirstTime) this.$refs.scattaFoto.playVideo()
      this.modalFotoFirstTime = false
    },
    compilaDomanda () {
      if (!this.formValido()) return
      const datiDomanda = { }
      if (this.ingiunzFiscaleTab) {
        datiDomanda.isIngiunzioneFiscale = true
        datiDomanda.numeroIngiunzione = this.$refs.formRadioIngiunzione.datiDomanda.numeroIngiunzione
      } else {
        datiDomanda.isIngiunzioneFiscale = false
        datiDomanda.numeroCartellaEsattoriale = this.$refs.formRadioCartella.datiDomanda.numeroCartellaEsattoriale
      }

      const datiOpz = this.$refs.datiOpzionali.getDataImportoTot()
      datiDomanda.dataNotifica = ('dataNotifica' in datiOpz) ? datiOpz.dataNotifica : null
      datiDomanda.importoTotaleRiscossione = ('importoTotaleRiscossione' in datiOpz) ? datiOpz.importoTotaleRiscossione : null

      datiDomanda.oggettoDomanda = this.$refs.oggettoDomandaBox.updDatiOggDomanda()
      datiDomanda.motivo = this.$refs.motivoDomandaBox.updDatiMotDomanda()

      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      store
        .dispatch(CREAZIONE_DOMANDA_DISCARICO_RIMBORSO, datiDomanda)
        .then(() => {
          this.overlay = false
          this.$router.push({ name: 'riepilogo_domanda_discarico_rimborso' })
        })
        .catch((error) => {
          this.overlay = false
          console.log({ error } + error + JSON.stringify(error))
        })
    },

    formValido () {
      let formValid = true
      if (this.ingiunzFiscaleTab) {
        this.$refs.formRadioIngiunzione.$v.datiDomanda.$touch()
        if (this.$refs.formRadioIngiunzione.$v.datiDomanda.$invalid) formValid = false
      } else {
        this.$refs.formRadioCartella.$v.datiDomanda.$touch()
        if (this.$refs.formRadioCartella.$v.datiDomanda.$invalid) formValid = false
      }

      this.$refs.datiOpzionali.$v.datOpzForm.$touch()
      if (this.$refs.datiOpzionali.$v.datOpzForm.$invalid) formValid = false

      this.$refs.oggettoDomandaBox.$v.oggDomandaForm.$touch()
      if (this.$refs.oggettoDomandaBox.$v.oggDomandaForm.$invalid) formValid = false

      this.$refs.motivoDomandaBox.$v.motivoForm.$touch()
      if (this.$refs.motivoDomandaBox.$v.motivoForm.$invalid) formValid = false
      return formValid
    },

    caricaAllegato () {
      this.uploadFileError = null
      this.downloadFileError = null
      if (this.domDiscaricoForm.file === null) return

      const fileExt = this.domDiscaricoForm.file.name.substr(this.domDiscaricoForm.file.name.lastIndexOf('.') + 1)
      if (!checkTipoAllegato(fileExt)) this.uploadFileError = 'Il documento ha un\'estensione non consentita.'
      if (!checkDimenAllegato(this.domDiscaricoForm.file.size)) this.uploadFileError = 'Il documento ha una dimensione che supera quella consentita (' + ALLEGATO_MAX_SIZE + 'MB).'

      this.$v.domDiscaricoForm.file.$touch()
      if (this.$v.domDiscaricoForm.file.$invalid) return

      const formData = new FormData()
      formData.append('upFile', this.domDiscaricoForm.file)
      formData.append('codiceFiscale', this.cfDomDisRim)
      formData.append('cognome', this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.cognome)
      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(DOM_DISC_RIMB_CARICA_ALLEGATO, formData)
        .then((response) => {
          this.overlay = false
          this.domDiscaricoForm.file = null
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
      const attach = this.domDiscaricoRimborsoAllegati.find(p => (p.identificativoArchivio === idAllegato))

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
        .dispatch(DOM_DISC_RIMB_ELIMINA_ALLEGATO, {
          slug: idAllegato,
          codiceFiscale: this.cfDomDisRim
        })
        .then(() => {
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.downloadFileError = this.$i18n.t('general.api.errors.service_unavailable')
            return
          }
          switch (error.response.status) {
            case 400:
              this.downloadFileError = 'Parametri obbligatori non valorizzati'
              break
            case 404:
              this.downloadFileError = 'Avviso non trovato'
              break
            case 409:
              this.downloadFileError = 'Esiste un ruolo in lavorazione per l\'avviso indicato'
              break
            case 500:
              this.downloadFileError = this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
              break
            default : break
          }
        })
    }
  },
  async created () {
    if (!NavigatorService.checkInternetConnection()) return

    if (this.cartellaEsattorialeDiscRimb.value) this.ingiunzFiscaleTab = false

    this.overlay = true
    store
      .dispatch(LISTA_NUMERO_INGIUNZIONE, { cf: this.cfDomDisRim })
      .then(({ data }) => {
        this.listaNumeriIngiunzione = data
        if (this.listaNumeriIngiunzione.length === 0) {
          this.ingiunzFiscTabDisabled = true
          this.ingiunzFiscaleTab = false
          this.detailWarn = {
            title: this.$i18n.t('general.warning'),
            message: 'Non risultano ingiuzioni fiscali associate al codice fiscale inserito.'
          }
        }
      })
      .catch((error) => {
        console.log('error', { error })
        this.overlay = false
        this.ingiunzFiscTabDisabled = true
        this.ingiunzFiscaleTab = false
        if (error == null || error.response.status === 500) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Errori occorsi durante la ricerca dei numeri d\'ingiunzione legati al Codice fiscale inserito.<br>' +
              'Impossibile chiedere l\'annullamento / rimborso per una ingiunzione.'
          }
          return
        }
        this.detailError = {
          title: this.$i18n.t('general.api.errors.no_results'),
          message: 'La ricerca dei numeri d\'ingiunzione legati al Codice fiscale inserito non ha prodotto risultati.<br>' +
            'Impossibile chiedere l\'annullamento / rimborso per una ingiunzione.'
        }
      })

    store
      .dispatch(LISTA_CODICE_TRIBUTI)
      .then(({ data }) => {
        this.overlay = false
        this.codiceTributiElenco = data
      })
      .catch((error) => {
        this.overlay = false
        if (error == null || error.response.status === 500) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          }
        }
      })
  }
}
</script>
