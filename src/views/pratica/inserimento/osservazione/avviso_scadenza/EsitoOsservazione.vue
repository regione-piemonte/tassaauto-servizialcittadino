<template>
  <div class="container" ref="formContainer">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class=" col-lg-8 offset-lg-2 justify-content-center">
            <Wizard :servizio="'osservazione'" :stepAttivo="3" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div
            class=" col-lg-8 offset-lg-2"
            v-if="osservazioneCreata === null">
            {{ $t('general.labels.pagina_scaduta') }}
          </div>
          <div
            class=" col-lg-8 offset-lg-2"
            v-else>
            <DomandaEsitoBox
              :numeroProtocollo="osservazioneCreata.numeroProtocollo"
            />
            <DatiAnagraficiIntestatario
              :denominazione="intestatarioAvviso"
              :codiceFiscale="osservazioneCreata.avvisoScadenza.intestatario.codiceFiscale"
              :tipoDatiAnagrafici="'intestatario avviso'"
            />
            <DatiAnagRettOssAvvScadenza
              v-if="osservazioneCreata.attributi.datiAnagraficiRettifica !== null && osservazioneCreata.attributi.datiAnagraficiRettifica.value"
              :denominazione="intestatarioRettif"
              :codiceFiscale="osservazioneCreata.attributi.datiAnagraficiRettifica.codiceFiscale"
              :indirizzo="osservazioneCreata.attributi.datiAnagraficiRettifica.indirizzo"
              :comune="osservazioneCreata.attributi.datiAnagraficiRettifica.domicilioFiscale"
            />
            <DatiVeicolo
              :descrizione="osservazioneCreata.avvisoScadenza.tipoVeicolo.descrizione"
              :targa="osservazioneCreata.avvisoScadenza.targa"
              :scadenza="osservazioneCreata.avvisoScadenza.scadenza"
              :validita="Number(osservazioneCreata.avvisoScadenza.validita)"
              :tassa="osservazioneCreata.avvisoScadenza.tassa"
            />
            <DatiAvvisoScadenza
              :numeroRiferimento="osservazioneCreata.avvisoScadenza.numeroRiferimento"
            />
            <OssAvvScadenza
              :attributi="osservazioneCreata.attributi"
            />
            <Allegati
              :codiceFiscale="osservazioneCreata.avvisoScadenza.intestatario.codiceFiscale"
              :numeroProtocollo="osservazioneCreata.numeroProtocollo"
              :listaAllegati="osservazioneCreata.allegati"
              :pLocal="false"
            />
            <Riferimenti
              :pEmail="rifEmail"
              :pTelefono="rifTelefono"
            />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnStampaPagina
                  :label="'Stampa riepilogo'"
                />
              </div>
              <div class="col-md-6 text-md-right">
                <BtnHome />
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>

  </div>
</template>

<script>
import { emailAttiva, smsAttivo } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import Wizard from '@/components/layout/Wizard'
import Allegati from '@/components/pratica/Allegati'
import Riferimenti from '@/components/pratica/Riferimenti'
import DatiAvvisoScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAvvisoScadenza'
import DatiAnagRettOssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAnagRettOssAvvScadenza'
import OssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/OssAvvScadenza'
import store from '@/store'
import { OSS_AVV_SCADENZA_RESET_STATE } from '@/store/actions.type'

export default {
  props: {
    osservazioneCreata: { type: Object, required: true }
  },
  components: {
    Allegati,
    BoxErrore,
    BtnHome,
    BtnStampaPagina,
    DatiVeicolo,
    DatiAvvisoScadenza,
    DatiAnagraficiIntestatario,
    DatiAnagRettOssAvvScadenza,
    DomandaEsitoBox,
    OssAvvScadenza,
    Riferimenti,
    Wizard
  },
  computed: {
    intestatarioAvviso: function () {
      const denominazione = this.osservazioneCreata.avvisoScadenza.intestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.osservazioneCreata.avvisoScadenza.intestatario.nome + ' ' + this.osservazioneCreata.avvisoScadenza.intestatario.cognome
    },
    intestatarioRettif: function () {
      if (this.osservazioneCreata.attributi.datiAnagraficiRettifica === null) return null
      const nome = this.osservazioneCreata.attributi.datiAnagraficiRettifica.nome
      const intest = (nome !== null && nome !== '') ? nome + ' ' : ''
      return intest + this.osservazioneCreata.attributi.datiAnagraficiRettifica.cognomeDenominazione
    },
    rifEmail: function () {
      if (emailAttiva) return this.osservazioneCreata.email ? this.osservazioneCreata.email.toLowerCase() : this.osservazioneCreata.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.osservazioneCreata.telefono
      return null
    }
  },
  async created () {
    store.dispatch(OSS_AVV_SCADENZA_RESET_STATE)
  }
}
</script>
