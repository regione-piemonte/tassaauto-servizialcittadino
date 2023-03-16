<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
      <div class="row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-2">
          <BoxErrore
            :error="detailError"
          />
        </div>
      </div>
      <div class="row inner-cont-bollo">
        <div class=" col-lg-8 offset-lg-2 justify-content-center">
          <Wizard
            :servizio="'osservazione'"
            :stepAttivo="2"
          />
        </div>
      </div>
      <div class="row inner-cont-bollo">
        <div class=" col-lg-8 offset-lg-2">
          <DatiAnagraficiIntestatario
            :denominazione="intestAvvAcc"
            :codiceFiscale="avvisoAccertamento.intestatario.codiceFiscale"
            :tipoDatiAnagrafici="'intestatario avviso'"
          />
          <DatiVeicolo
            :descrizione="avvisoAccertamento.tipoVeicolo.descrizione"
            :targa="avvisoAccertamento.targaVeicolo"
          />
          <DatiAvvisoAccertamento
            :numeroRiferimento="avvisoAccertamento.numeroProtocollo"
            :scadenza="avvisoAccertamento.scadenza"
            :tributoDovuto="avvisoAccertamento.tributoDovuto"
            :dataInvio="avvisoAccertamento.dataInvio"
            :violazioneAccertata="avvisoAccertamento.violazioneAccertata"
            :dataNotifica="avvisoAccertamento.dataNotifica"
          />
          <OssAvvAccertamento
            :grigliaAccPagato="grigliaAccertamentoPagato"
            v-if="pagNonPag === 'pagato'"
          />
          <OssAvvAccertamento
            :grigliaAccNonPagato="grigliaAccertamentoNonPagato"
            v-if="pagNonPag === 'non_pagato'"
          />
          <OssAvvAccertamento
            :grigliaAccAltroMotivo="grigliaAccertamentoAltro"
            v-if="pagNonPag === 'altro'"
          />
          <Note
            :pTesto="ossAvvAccNote"
          />
          <Allegati
            :codiceFiscale="''"
            :numeroProtocollo="''"
            :listaAllegati="ossAvvAccertamentoAllegati"
            :pLocal="true"
          />
          <RiferimentiPratica
            ref="rifPratica"
            v-on:bloccainvioosservazione="inviaOssDisabled = true"
            :errorMsgPratica = detailError.fieldError
            @resetMsgErrorsPage="removeMsg"
          />
          <div class="action-button-wide row">
            <div class="col-md-6">
              <BtnBack
                :backUrl="'crea_osservazione_accertamento'"
                :backType="'backMod'"/>
            </div>
            <div class="col-md-6 text-md-right">
              <v-btn
                depressed
                id="submitForm"
                type="submit"
                @click.prevent="inviaOsservazione"
                color="primary"
                :disabled="inviaOssDisabled">
                Invia Osservazione
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    </div>

    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { emailAttiva, smsAttivo } from '@/common/config'
import ApiError from '@/common/api.error'
import NavigatorService from '@/common/navigator.service'
import OsservazioneService from '@/common/osservazione.service'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import Allegati from '@/components/pratica/Allegati'
import Note from '@/components/pratica/Note'
import RiferimentiPratica from '@/components/pratica/RiferimentiPratica'
import DatiAvvisoAccertamento from '@/components/pratica/osservazione/avviso_accertamento/DatiAvvisoAccertamento'
import OssAvvAccertamento from '@/components/pratica/osservazione/avviso_accertamento/OssAvvAccertamento'
import BtnBack from '@/components/layout/btn/BtnBack'
import { OSS_AVV_ACCERTAMENTO_CREA } from '@/store/actions.type'
import store from '@/store'

export default {
  components: {
    Allegati,
    BoxErrore,
    BtnBack,
    DatiAvvisoAccertamento,
    DatiAnagraficiIntestatario,
    DatiVeicolo,
    Note,
    OssAvvAccertamento,
    RiferimentiPratica,
    Spinner,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '', fieldError: null },
      inviaOssDisabled: false,
      intestAvvAcc: '',
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'avvisoAccertamento',
      'grigliaAccertamentoPagato',
      'grigliaAccertamentoNonPagato',
      'grigliaAccertamentoAltro',
      'ossAvvAccertamentoAllegati',
      'ossAvvAccNote'
    ]),
    pagNonPag: function () {
      if (OsservazioneService.motivoOssAvvAccPagato(this.grigliaAccertamentoPagato) !== '') return 'pagato'
      if (OsservazioneService.motivoOssAvvAccNonPagato(this.grigliaAccertamentoNonPagato) !== '') return 'non_pagato'
      if (OsservazioneService.motivoOssAvvAccAltroMotivo(this.grigliaAccertamentoAltro) !== '') return 'altro'
      return ''
    }
  },
  methods: {
    removeMsg (params) {
      if (params === true) {
        this.resetErrori()
      }
    },
    inviaOsservazione () {
      this.detailError = { message: '', title: '', fieldError: null }
      this.$refs.rifPratica.iniziaValidazione()
      this.$refs.rifPratica.$v.rifForm.$touch()
      if (this.$refs.rifPratica.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const attrOssAvvAcc = { }
      switch (this.pagNonPag) {
        case 'pagato':
          attrOssAvvAcc.grigliaAccertamentoPagato = this.grigliaAccertamentoPagato
          break
        case 'non_pagato':
          attrOssAvvAcc.grigliaAccertamentoNonPagato = this.grigliaAccertamentoNonPagato
          break
        case 'altro':
          attrOssAvvAcc.grigliaAccertamentoAltro = this.grigliaAccertamentoAltro
          break
        default:
          break
      }

      const attachDocs = this.ossAvvAccertamentoAllegati
      attachDocs.forEach(function (v) { delete v.upFile })

      const requestCreaOsserAvvAcc = {
        idAccertamentoVeicolo: this.avvisoAccertamento.idAvvisoAccertamento,
        attributi: attrOssAvvAcc,
        allegati: attachDocs
      }
      if (this.ossAvvAccNote !== '') requestCreaOsserAvvAcc.note = this.ossAvvAccNote

      const rifObj = this.$refs.rifPratica.getRiferimenti()
      if (emailAttiva()) requestCreaOsserAvvAcc.email = rifObj.email.toLowerCase()
      if (smsAttivo()) requestCreaOsserAvvAcc.cell = rifObj.telefono

      this.overlay = true
      store
        .dispatch(OSS_AVV_ACCERTAMENTO_CREA, requestCreaOsserAvvAcc)
        .then(({ data }) => {
          this.overlay = false
          this.$router.push(
            { name: 'esito_osservazione_accertamento', params: { osservazioneCreata: data } }
          )
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
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Osservazione non inviata, avviso non trovato.'
            }
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Osservazione non inviata, esiste un\'osservazione in lavorazione per l\'avviso indicato.'
            }
          } else if (error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.pratica_invalid'),
              fieldError: ApiError.serverValidationErrors(error.response.data.detail)
            }
          }
        })
    },
    resetErrori () {
      this.detailError = { message: '', title: '', fieldError: null }
    }
  },
  async created () {
    if (this.avvisoAccertamento.intestatario.denominazione !== null && this.avvisoAccertamento.intestatario.denominazione !== '') {
      // persona giuridica
      this.intestAvvAcc = this.avvisoAccertamento.intestatario.denominazione
    } else {
      this.intestAvvAcc = this.avvisoAccertamento.intestatario.nome + ' ' + this.avvisoAccertamento.intestatario.cognome
    }
  }
}
</script>
