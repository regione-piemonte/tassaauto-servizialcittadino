<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class=" col-lg-8 offset-lg-2 justify-content-center">
            <Wizard :servizio="'osservazione'" :stepAttivo="1" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class=" col-lg-8 offset-lg-2">
            <DatiAnagraficiIntestatario
              :denominazione="intestAvvAcc"
              :codiceFiscale="avvisoBonario.intestatario.codiceFiscale"
              :tipoDatiAnagrafici="'intestatario avviso'"
            />
            <DatiVeicolo
              :descrizione="avvisoBonario.veicolo.tipoVeicolo.descrizione"
              :targa="avvisoBonario.veicolo.targa"
            />
            <DatiAvvisoBonario
              :numeroRiferimento="avvisoBonario.numeroProtocollo"
              :scadenza="avvisoBonario.scadenza"
              :dataInvio="avvisoBonario.dataInvio"
            />
            <v-form
              @submit.prevent="aggiungiMotivazione"
              class="multiple-inline-form"
              enctype="multipart/form-data">
              <div class="tab-content-notHp">
                <v-tabs
                fixed-tabs
                class="tabServizi"
                show-arrows="mobile"
                centered
                v-model="activeTab"
                aria-live="polite"
                aria-atomic="false">
                  <v-tab
                    :active="(activeTab === 0)">
                    Ho pagato
                  </v-tab>
                  <v-tab
                    :active="(activeTab === 1)">
                    Non ho pagato
                  </v-tab>
                  <v-tab
                    :active="(activeTab === 2)">
                    Altro
                  </v-tab>
                </v-tabs>
                <v-tabs-items
                v-model="activeTab">
                  <v-tab-item>
                    <OssAvvBonarioFormRadioP
                      ref="formRadioPagato"
                      v-on:updateboxerr="updateDetailError($event)"/>
                  </v-tab-item>
                  <v-tab-item>
                    <OssAvvBonarioFormRadioNP
                      ref="formRadioNonPagato"
                      v-on:updateboxerr="updateDetailError($event)"/>
                  </v-tab-item>
                  <v-tab-item>
                    <OssAvvBonarioFormRadioAltro
                      ref="formRadioAltroMotivo"
                      v-on:updateboxerr="updateDetailError($event)"/>
                  </v-tab-item>
                </v-tabs-items>
              </div>
              <NotePratica
                ref="note"
                :pNote="ossAvvBonarioNote"
              />
              <div class="space-section">
                <h2>{{ $t('general.box_titles.allegati') }}</h2>
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
                        Puoi inserire fino a {{ numMaxAllegati }} documenti allegati a completamento della tua osservazione.
                        Formati ammessi: {{ tipiAllegato }}.
                      </p>
                      <p>La funzionalità "Scatta una foto" potrebbe non essere disponibile su tutti i dispositivi; si consiglia di utilizzarla solo in caso di uso di smartphone.</p>
                    </v-col>
                  </v-row>
                </v-alert>
                <div class="row">
                  <div class="col-md-5">
                    <v-file-input
                      :accept="tipiAllegato"
                      label="Seleziona allegato"
                      :disabled="ossAvvBonarioAllegati.length >= numMaxAllegati"
                      @change="caricaAllegato()"
                      v-model="tipoOssForm.file"
                      browse-text="Sfoglia"
                      :error-count="2"
                      :error-messages="allegatiErrors"/>
                  </div>
                </div>
                <div class="mt-2" v-if="ossAvvBonarioAllegati.length === 0">
                  {{ $t('general.messages.zero_allegati') }}
                </div>
                <div v-else>
                  <ul class="border-list">
                    <li v-for="(item, index) in ossAvvBonarioAllegati" :key="index">
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
                    <v-icon class="mr-2">mdi-camera</v-icon> Scatta una foto
                  </v-btn>
                </div>
              </div>
              <div class="action-button-wide row">
                <div class="col-md-6">
                  <BtnBack
                  :backUrl="'cerca_avviso_bonario'"
                  :backType="'back'"/>
                </div>
                <div class="col-md-6 text-md-right">
                  <v-btn depressed type="submit" color="primary">Avanti</v-btn>
                </div>
              </div>
            </v-form>
          </div>
        </div>
      </v-card>
    </div>

    <ScattaFoto
      ref="scattaFoto"
      v-bind:imgFile.sync="tipoOssForm.file"
      v-on:annullafile="tipoOssForm.file = null"
      v-on:salvafile="tipoOssForm.file = $event"
      v-on:caricaallegato="caricaAllegato()"
    />
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import OsservazioneService from '@/common/osservazione.service'
import { mapGetters } from 'vuex'
import {
  ALLEGATI_MAX_NUM,
  ALLEGATO_MAX_SIZE,
  checkDimenAllegato,
  checkTipoAllegato,
  tipiAllegatoString
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import {
  OSS_AVV_BONARIO_SALVA_NOTE,
  OSS_AVV_BONARIO_CARICA_ALLEGATO,
  OSS_AVV_BONARIO_ELIMINA_ALLEGATO
} from '@/store/actions.type'
import store from '@/store'
import BoxErrore from '@/components/BoxErrore'
import DatiVeicolo from '@/components/DatiVeicolo'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiAvvisoBonario from '@/components/pratica/osservazione/avviso_bonario/DatiAvvisoBonario'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import NotePratica from '@/components/pratica/NotePratica'
import OssAvvBonarioFormRadioP from '@/components/pratica/osservazione/avviso_bonario/OssAvvBonarioFormRadioP'
import OssAvvBonarioFormRadioNP from '@/components/pratica/osservazione/avviso_bonario/OssAvvBonarioFormRadioNP'
import OssAvvBonarioFormRadioAltro from '@/components/pratica/osservazione/avviso_bonario/OssAvvBonarioFormRadioAltro'
import BtnBack from '@/components/layout/btn/BtnBack'
import ScattaFoto from '@/components/camera/ScattaFoto'
import { saveAs } from 'file-saver'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    BoxErrore,
    BtnBack,
    ComposizioneImporto,
    DatiAvvisoBonario,
    DatiAnagraficiIntestatario,
    DatiVeicolo,
    NotePratica,
    OssAvvBonarioFormRadioP,
    OssAvvBonarioFormRadioNP,
    OssAvvBonarioFormRadioAltro,
    ScattaFoto,
    Spinner,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      tipoOssForm: {
        file: null
      },
      numMaxAllegati: ALLEGATI_MAX_NUM,
      overlay: false,
      modalFotoFirstTime: true,
      tipiAllegato: tipiAllegatoString(),
      uploadFileError: null,
      downloadFileError: null,
      activeTab: 0
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    tipoOssForm: {
      file: {
        uploadFileFailed: function () {
          return !(this.uploadFileError != null && this.uploadFileError !== '')
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'avvisoBonario',
      'grigliaAvvisoBonarioPagato',
      'grigliaAvvisoBonarioNonPagato',
      'grigliaAvvisoBonarioAltro',
      'ossAvvBonarioAllegati',
      'ossAvvBonarioNote'
    ]),
    intestAvvAcc: function () {
      if (this.avvisoBonario.intestatario.denominazione !== null && this.avvisoBonario.intestatario.denominazione !== '') {
        // persona giuridica
        return this.avvisoBonario.intestatario.denominazione
      } else {
        return this.avvisoBonario.intestatario.nome + ' ' + this.avvisoBonario.intestatario.cognome
      }
    },
    allegatiErrors () {
      const errors = []
      if (!this.$v.tipoOssForm.file.$dirty) return errors
      !this.$v.tipoOssForm.file.uploadFileFailed && errors.push(this.uploadFileError)
      this.ossAvvBonarioAllegati.length === this.numMaxAllegati && errors.push('Non puoi allegare altri documenti.')
      return errors
    }
  },
  methods: {
    openmodalFoto () {
      this.$refs.scattaFoto.modalFoto = true
      if (!this.modalFotoFirstTime) this.$refs.scattaFoto.playVideo()
      this.modalFotoFirstTime = false
    },
    aggiungiMotivazione () {
      switch (this.activeTab) {
        case 0:
          this.$refs.formRadioPagato.$v.ossAvvAccForm.$touch()
          if (this.$refs.formRadioPagato.$v.ossAvvAccForm.$invalid) return
          this.$refs.formRadioPagato.$v.grigliaAvvisoBonarioPagato.$touch()
          if (this.$refs.formRadioPagato.$v.grigliaAvvisoBonarioPagato.$invalid) return
          this.$refs.formRadioPagato.updMotivOssPagato()
          break
        case 1:
          this.$refs.formRadioNonPagato.$v.ossAvvAccForm.$touch()
          if (this.$refs.formRadioNonPagato.$v.ossAvvAccForm.$invalid) return
          this.$refs.formRadioNonPagato.$v.grigliaAvvisoBonarioNonPagato.$touch()
          if (this.$refs.formRadioNonPagato.$v.grigliaAvvisoBonarioNonPagato.$invalid) return
          this.$refs.formRadioNonPagato.updMotivOssNonPagato()
          break
        case 2:
          this.$refs.formRadioAltroMotivo.$v.ossAvvAccForm.$touch()
          if (this.$refs.formRadioAltroMotivo.$v.ossAvvAccForm.$invalid) return
          this.$refs.formRadioAltroMotivo.$v.grigliaAvvisoBonarioAltro.$touch()
          if (this.$refs.formRadioAltroMotivo.$v.grigliaAvvisoBonarioAltro.$invalid) return
          this.$refs.formRadioAltroMotivo.updMotivOssAltroMotivo()
          break
      }

      const note = this.$refs.note.getTestoNote()
      if (note !== '') store.dispatch(OSS_AVV_BONARIO_SALVA_NOTE, note)

      this.$router.push({ name: 'riepilogo_osservazione_avviso_bonario' })
    },

    caricaAllegato () {
      this.uploadFileError = null
      this.downloadFileError = null
      if (this.tipoOssForm.file === null) return

      const fileExt = this.tipoOssForm.file.name.substr(this.tipoOssForm.file.name.lastIndexOf('.') + 1)
      if (!checkTipoAllegato(fileExt)) this.uploadFileError = 'Il documento ha un\'estensione non consentita.'
      if (!checkDimenAllegato(this.tipoOssForm.file.size)) this.uploadFileError = 'Il documento ha una dimensione che supera quella consentita (' + ALLEGATO_MAX_SIZE + 'MB).'

      this.$v.tipoOssForm.file.$touch()
      if (this.$v.tipoOssForm.file.$invalid) return

      const formData = new FormData()
      formData.append('upFile', this.tipoOssForm.file)
      formData.append('numeroProtocollo', this.avvisoBonario.numeroProtocollo)
      formData.append('codiceFiscale', this.avvisoBonario.intestatario.codiceFiscale)
      formData.append('targa', this.avvisoBonario.veicolo.targa)
      formData.append('cognome', this.avvisoBonario.intestatario.cognome)

      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(OSS_AVV_BONARIO_CARICA_ALLEGATO, formData)
        .then((response) => {
          this.overlay = false
          this.tipoOssForm.file = null
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
      const attach = this.ossAvvBonarioAllegati.find(p => (p.identificativoArchivio === idAllegato))

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
        .dispatch(OSS_AVV_BONARIO_ELIMINA_ALLEGATO, {
          slug: idAllegato,
          idAvviso: this.avvisoBonario.idAvvisoBonario
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
    },

    updateDetailError (detErr) {
      this.detailError = detErr
    }
  },
  async created () {
    if (OsservazioneService.motivoOssAvvBonarioNonPagato(this.grigliaAvvisoBonarioNonPagato) !== '') {
      this.activeTab = 1
      return this.activeTab
    }
    if (OsservazioneService.motivoOssAvvBonarioAltroMotivo(this.grigliaAvvisoBonarioAltro) !== '') {
      this.activeTab = 2
      return this.activeTab
    }
    this.activeTab = 0
  }
}
</script>
