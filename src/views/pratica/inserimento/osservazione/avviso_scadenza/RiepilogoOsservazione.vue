<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore
          :error="detailError"
        />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class=" col-xxl-8 offset-xxl-2 justify-content-center">
        <Wizard
          :servizio="'osservazione'"
          :stepAttivo="2"
        />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class=" col-xxl-8 offset-xxl-2">
        <DatiAnagraficiIntestatario
          :denominazione="intestatarioAvviso"
          :codiceFiscale="avvisoScadenza.intestatario.codiceFiscale"
          :tipoDatiAnagrafici="'intestatario avviso'"
        />
        <DatiAnagRettOssAvvScadenza
          v-if="ossAvvScadDatiAnagRett.value"
          :denominazione="intestatarioRettif"
          :codiceFiscale="ossAvvScadDatiAnagRett.codiceFiscale"
          :indirizzo="ossAvvScadDatiAnagRett.indirizzo + ' - '  + ossAvvScadDatiAnagRett.domicilioFiscale"
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
        />
        <div class="action-button-wide">
          <div class="col-md-6">
            <BtnBack
              :backUrl="'crea_osservazione_avviso'"
              :backType="'backMod'"/>
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
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
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
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
      detailError: { message: '', title: '' },
      intestatarioAvviso: '',
      intestatarioRettif: '',
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
    inviaOsservazione () {
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
      if (emailAttiva()) requestCreaOsserAvvScad.email = rifObj.email
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
          }
        })
    },

    mailTelefonoVuoti () {
      if ((this.rifForm.email == null || this.rifForm.email === '') &&
      (this.rifForm.telefono == null || this.rifForm.telefono === '')) return true
      return false
    }
  },
  async created () {
    if (this.avvisoScadenza.intestatario.denominazione !== null && this.avvisoScadenza.intestatario.denominazione !== '') {
      // persona giuridica
      this.intestatarioAvviso = this.avvisoScadenza.intestatario.denominazione
    } else {
      this.intestatarioAvviso = this.avvisoScadenza.intestatario.nome + ' ' + this.avvisoScadenza.intestatario.cognome
    }

    const nomeRett = this.ossAvvScadDatiAnagRett.nome
    this.intestatarioRettif = (nomeRett !== null && nomeRett !== '') ? nomeRett + ' ' : ''
    this.intestatarioRettif += this.ossAvvScadDatiAnagRett.cognomeDenominazione
  }
}
</script>
