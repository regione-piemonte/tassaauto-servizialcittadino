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
              :denominazione="intestatarioAvviso"
              :codiceFiscale="avvisoScadenza.intestatario.codiceFiscale"
              :tipoDatiAnagrafici="'intestatario avviso'"
            />
            <DatiAnagRettOssAvvScadenza
              v-if="ossAvvScadDatiAnagRett.value"
              :denominazione="intestatarioRettif"
              :codiceFiscale="ossAvvScadDatiAnagRett.codiceFiscale"
              :indirizzo="ossAvvScadDatiAnagRett.indirizzo"
              :comune="ossAvvScadDatiAnagRett.domicilioFiscale"
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
            <OssAvvScadenza
              :attributi="attributiOssAvvScad"
            />
            <Allegati
              :codiceFiscale="''"
              :numeroProtocollo="''"
              :listaAllegati="ossAvvScadenzaAllegati"
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
                  :backUrl="'crea_osservazione_avviso'"
                  :backType="'backMod'"/>
              </div>
              <div class="col-md-6 text-md-right">
                <v-btn
                  depressed
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
import ApiError from '@/common/api.error'
import { mapGetters } from 'vuex'
import { emailAttiva, smsAttivo } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import Allegati from '@/components/pratica/Allegati'
import BtnBack from '@/components/layout/btn/BtnBack'
import RiferimentiPratica from '@/components/pratica/RiferimentiPratica'
import DatiAvvisoScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAvvisoScadenza'
import DatiAnagRettOssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAnagRettOssAvvScadenza'
import OssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/OssAvvScadenza'
import { OSS_AVV_SCADENZA_CREA } from '@/store/actions.type'
import store from '@/store'

export default {
  components: {
    Allegati,
    BoxErrore,
    BtnBack,
    DatiAvvisoScadenza,
    DatiAnagraficiIntestatario,
    DatiAnagRettOssAvvScadenza,
    DatiVeicolo,
    OssAvvScadenza,
    RiferimentiPratica,
    Spinner,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '', fieldError: null },
      intestatarioAvviso: '',
      intestatarioRettif: '',
      intestatarioResidenzaRettif: '',
      inviaOssDisabled: false,
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'attributiOssAvvScad',
      'avvisoScadenza',
      'ossAvvScadDatiAnagRett',
      'ossAvvScadenzaAllegati'
    ])
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

      const dataCorrente = new Date()
      let mese = (dataCorrente.getMonth() + 1).toString()
      if (mese.length === 1) mese = '0' + mese
      this.attributiOssAvvScad.dataCompilazione = dataCorrente.getFullYear().toString() + '-' + mese + '-' + dataCorrente.getDate().toString()
      const attachDocs = this.ossAvvScadenzaAllegati
      attachDocs.forEach(function (v) { delete v.upFile })

      // Dati Anagrafici Rettificati
      if (this.ossAvvScadDatiAnagRett.value) this.attributiOssAvvScad.datiAnagraficiRettifica = this.ossAvvScadDatiAnagRett

      const requestCreaOsserAvvScad = {
        idScadenzaVeicolo: this.avvisoScadenza.idScadenzaVeicolo,
        attributi: this.attributiOssAvvScad,
        allegati: attachDocs
      }
      const rifObj = this.$refs.rifPratica.getRiferimenti()
      if (emailAttiva()) requestCreaOsserAvvScad.email = rifObj.email.toLowerCase()
      if (smsAttivo()) requestCreaOsserAvvScad.cell = rifObj.telefono

      this.overlay = true
      store
        .dispatch(OSS_AVV_SCADENZA_CREA, requestCreaOsserAvvScad)
        .then(({ data }) => {
          this.overlay = false
          this.$router.push(
            { name: 'esito_osservazione_avviso', params: { osservazioneCreata: data } }
          )
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
          const noSentOss = 'Osservazione non inviata, '
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: noSentOss + 'avviso non trovato.'
            }
          } else if (error.response.status === 409 || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: noSentOss + error.response.data.title
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
    },

    mailTelefonoVuoti () {
      if ((this.rifForm.email == null || this.rifForm.email === '') &&
      (this.rifForm.telefono == null || this.rifForm.telefono === '')) return true
      return false
    }
  },
  async created () {
    // intestatario avviso anagrafica
    if (this.avvisoScadenza.intestatario.denominazione !== null && this.avvisoScadenza.intestatario.denominazione !== '') {
      // persona giuridica
      this.intestatarioAvviso = this.avvisoScadenza.intestatario.denominazione
    } else {
      this.intestatarioAvviso = this.avvisoScadenza.intestatario.nome + ' ' + this.avvisoScadenza.intestatario.cognome
    }
    // fine intestatario avviso anagrafica

    // intestatario avviso dati rettificati anagrafici
    const nomeRett = this.ossAvvScadDatiAnagRett.nome
    const cognomeDenominazioneRett = this.ossAvvScadDatiAnagRett.cognomeDenominazione
    if (this.avvisoScadenza.intestatario.denominazione !== null && this.avvisoScadenza.intestatario.denominazione !== '') {
      // persona giuridica
      this.intestatarioRettif = cognomeDenominazioneRett
    } else {
      this.intestatarioRettif = (nomeRett !== null && nomeRett !== '') ? nomeRett + ' ' : this.avvisoScadenza.intestatario.nome + ' '
      this.intestatarioRettif += (cognomeDenominazioneRett !== null && cognomeDenominazioneRett !== '') ? cognomeDenominazioneRett : this.avvisoScadenza.intestatario.cognome
    }
    if (this.intestatarioRettif === this.intestatarioAvviso) this.intestatarioRettif = null
    const indirizzoRett = this.ossAvvScadDatiAnagRett.indirizzo
    const domicilioFiscaleRett = this.ossAvvScadDatiAnagRett.domicilioFiscale
    this.intestatarioResidenzaRettif = (indirizzoRett !== null && indirizzoRett !== '') ? indirizzoRett : null
    this.intestatarioResidenzaRettif += (domicilioFiscaleRett !== null && domicilioFiscaleRett !== '') ? domicilioFiscaleRett : null
    // fine intestatario avviso dati rettificati anagrafici
  }
}
</script>
