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
            <DatiAnagOssAvvScadenza
              ref="rettificaDatiAnagForm"
            />
            <DatiVeicolo
              :descrizione="avvisoScadenza.tipoVeicolo.descrizione"
              :targa="avvisoScadenza.targa"
              :scadenza="avvisoScadenza.scadenza"
              :validita="Number(avvisoScadenza.validita)"
              :tassa="avvisoScadenza.tassa"
            />
            <DatiAvvisoScadenza
              :numeroRiferimento="avvisoScadenza.numeroRiferimento"
            />
            <v-form
              @submit.prevent="aggiungiMotivazione"
              class="multiple-inline-form"
              enctype="multipart/form-data">
              <OssAvvScadenzaFormRadio
                ref="formRadio"
                v-on:updateboxerr="updateDetailError($event)"
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
                        Puoi inserire fino a {{ numMaxAllegati }} documenti allegati a completamento della tua osservazione.
                        Formati ammessi: {{ tipiAllegato }}.
                      </p>
                      <p>
                        La funzionalità "Scatta una foto" potrebbe non essere disponibile su tutti i dispositivi; si consiglia di utilizzarla solo in caso di uso di smartphone.
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
                      :disabled="ossAvvScadenzaAllegati.length >= numMaxAllegati"
                      @change="caricaAllegato()"
                      v-model="tipoOssForm.file"
                      browse-text="Sfoglia"
                      :error-count="2"
                      :error-messages="allegatiErrors"/>
                  </div>
                </div>
                <div class="mt-2"
                  v-if="ossAvvScadenzaAllegati.length === 0">
                  {{ $t('general.messages.zero_allegati') }}
                </div>
                <div
                  v-else>
                  <ul class="border-list">
                    <li v-for="(item, index) in ossAvvScadenzaAllegati" :key="index">
                      <a href="#" v-on:click="scaricaAllegato(item.identificativoArchivio)">
                        {{ item.nomeAllegato }}
                      </a>
                      <a @click="eliminaAllegato(item.identificativoArchivio)">
                        <v-icon>mdi-trash-can</v-icon>
                      </a>
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
              <p v-if="errorRettifica" class="error--text my-9" aria-live="polite" aria-atomic="false" role="alert">
                <strong>Attenzione! Sono presenti errori in pagina</strong>
              </p>
              <div class="action-button-wide row">
                <div class="col-md-6">
                  <BtnBack
                    :backUrl="'cerca_avviso_scadenza'"
                    :backType="'back'"
                  />
                </div>
                <div class="col-md-6 text-md-right">
                  <v-btn
                    depressed
                    type="submit"
                    color="primary">
                    Avanti
                  </v-btn>
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
  OSS_AVV_SCADENZA_CARICA_ALLEGATO,
  OSS_AVV_SCADENZA_ELIMINA_ALLEGATO,
  OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA
} from '@/store/actions.type'
import store from '@/store'

import BoxErrore from '@/components/BoxErrore'
import DatiVeicolo from '@/components/DatiVeicolo'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiAvvisoScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAvvisoScadenza'
import DatiAnagOssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAnagOssAvvScadenza'
import OssAvvScadenzaFormRadio from '@/components/pratica/osservazione/avviso_scadenza/OssAvvScadenzaFormRadio'
import BtnBack from '@/components/layout/btn/BtnBack'
import ScattaFoto from '@/components/camera/ScattaFoto'
import { saveAs } from 'file-saver'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    BoxErrore,
    BtnBack,
    DatiVeicolo,
    Wizard,
    ComposizioneImporto,
    DatiAvvisoScadenza,
    DatiAnagOssAvvScadenza,
    OssAvvScadenzaFormRadio,
    ScattaFoto,
    Spinner
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      tipoOssForm: { file: null },
      numMaxAllegati: ALLEGATI_MAX_NUM,
      overlay: false,
      modalFotoFirstTime: true,
      tipiAllegato: tipiAllegatoString(),
      uploadFileError: null,
      downloadFileError: null
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
      'avvisoScadenza',
      'ossAvvScadenzaAllegati',
      'ossAvvScadDatiAnagRett',
      'errorRettifica'
    ]),
    allegatiErrors () {
      const errors = []
      if (!this.$v.tipoOssForm.file.$dirty) return errors
      !this.$v.tipoOssForm.file.uploadFileFailed && errors.push(this.uploadFileError)
      this.ossAvvScadenzaAllegati.length === this.numMaxAllegati && errors.push(this.$i18n.t('general.messages.limite_allegati'))
      return errors
    }
  },
  methods: {
    openmodalFoto () {
      this.$refs.scattaFoto.modalFoto = true
      if (!this.modalFotoFirstTime) this.$refs.scattaFoto.playVideo()
      this.modalFotoFirstTime = false
    },
    convalidaValidazione () {
      store.dispatch(OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA, true)
    },
    annullaValidazione () {
      store.dispatch(OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA, false)
    },
    aggiungiMotivazione () {
      if (this.ossAvvScadDatiAnagRett.value) {
        this.$refs.rettificaDatiAnagForm.confermaModifica()
        if (this.errorRettifica) return
        this.$refs.rettificaDatiAnagForm.$v.ossAvvScadDatiAnagRett.$touch()
        if (this.$refs.rettificaDatiAnagForm.$v.ossAvvScadDatiAnagRett.$invalid) {
          this.convalidaValidazione()
          return
        } else {
          this.annullaValidazione()
        }
        if (this.$refs.formRadio.ossAvvScadForm.osservazRadio !== null && this.$refs.formRadio.ossAvvScadForm.osservazRadio !== '') {
          this.$refs.formRadio.$v.ossAvvScadForm.$touch()
          if (this.$refs.formRadio.$v.ossAvvScadForm.$invalid) {
            this.convalidaValidazione()
            return
          } else {
            this.annullaValidazione()
          }
          this.$refs.formRadio.$v.attributiOssAvvScad.$touch()
          if (this.$refs.formRadio.$v.attributiOssAvvScad.$invalid) return
          this.$refs.formRadio.updMotivazioneOss()
        }
      } else {
        this.$refs.formRadio.$v.ossAvvScadForm.$touch()
        if (this.$refs.formRadio.$v.ossAvvScadForm.$invalid) {
          this.convalidaValidazione()
          return
        } else {
          this.annullaValidazione()
        }
        this.$refs.formRadio.$v.attributiOssAvvScad.$touch()
        if (this.$refs.formRadio.$v.attributiOssAvvScad.$invalid) {
          this.convalidaValidazione()
          return
        } else {
          this.annullaValidazione()
        }
        this.$refs.formRadio.updMotivazioneOss()
      }
      this.$router.push({ name: 'riepilogo_osservazione_avviso' })
    },

    resetForm () {
      this.$refs.rettificaDatiAnagForm.$v.ossAvvScadDatiAnagRett.$reset()
      this.$refs.formRadio.$v.ossAvvScadForm.$reset()
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
      formData.append('numeroRiferimento', this.avvisoScadenza.numeroRiferimento)
      formData.append('codiceFiscale', this.avvisoScadenza.intestatario.codiceFiscale)
      formData.append('targa', this.avvisoScadenza.targa)
      formData.append('cognome', this.avvisoScadenza.intestatario.cognome)

      if (!NavigatorService.checkInternetConnection()) return

      this.overlay = true
      store
        .dispatch(OSS_AVV_SCADENZA_CARICA_ALLEGATO, formData)
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
          } else if (error.response.status === 422) {
            this.uploadFileError = 'Formato errato parametri'
          } else if (error.response.status === 500) {
            this.uploadFileError = this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    },

    scaricaAllegato (idAllegato) {
      this.downloadFileError = null
      const attach = this.ossAvvScadenzaAllegati.find(p => (p.identificativoArchivio === idAllegato))

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
        .dispatch(OSS_AVV_SCADENZA_ELIMINA_ALLEGATO, {
          slug: idAllegato,
          idScadenzaVeicolo: this.avvisoScadenza.idScadenzaVeicolo
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
  }
}
</script>
