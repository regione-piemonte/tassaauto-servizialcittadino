<template>
  <div class="app-container" ref="formContainer">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class=" col-xxl-8 offset-xxl-2 justify-content-center">
        <Wizard
          :servizio="'osservazione'"
          :stepAttivo="3"
        />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div
        class=" col-xxl-8 offset-xxl-2"
        v-if="osservazioneCreata == null">
        {{ $t('general.labels.pagina_scaduta') }}
      </div>
      <div
        class=" col-xxl-8 offset-xxl-2"
        v-else>
        <DomandaEsitoBox
          :numeroProtocollo="osservazioneCreata.numeroProtocollo"
        />
        <DatiAnagraficiIntestatario
          :denominazione="intestAvvAcc"
          :codiceFiscale="osservazioneCreata.avvisoAccertamento.intestatario.codiceFiscale"
          :tipoDatiAnagrafici="'intestatario avviso'"
        />
        <DatiVeicolo
          :descrizione="osservazioneCreata.avvisoAccertamento.tipoVeicolo.descrizione"
          :targa="osservazioneCreata.avvisoAccertamento.targaVeicolo"
        />
        <DatiAvvisoAccertamento
          :numeroRiferimento="osservazioneCreata.avvisoAccertamento.numeroProtocollo"
          :scadenza="osservazioneCreata.avvisoAccertamento.scadenza"
          :tributoDovuto="osservazioneCreata.avvisoAccertamento.tributoDovuto"
          :dataInvio="osservazioneCreata.avvisoAccertamento.dataInvio"
          :violazioneAccertata="osservazioneCreata.avvisoAccertamento.violazioneAccertata"
          :dataNotifica="osservazioneCreata.avvisoAccertamento.dataNotifica"
        />
        <OssAvvAccertamento
          :grigliaAccPagato="osservazioneCreata.grigliaAccertamento.grigliaAccertamentoPagato"
          :grigliaAccNonPagato="osservazioneCreata.grigliaAccertamento.grigliaAccertamentoNonPagato"
          :grigliaAccAltroMotivo="osservazioneCreata.grigliaAccertamento.grigliaAccertamentoAltro"
        />
        <Note
          :pTesto="osservazioneCreata.note"
        />
        <Allegati
          :codiceFiscale="osservazioneCreata.avvisoAccertamento.intestatario.codiceFiscale"
          :numeroProtocollo="osservazioneCreata.numeroProtocollo"
          :listaAllegati="osservazioneCreata.allegati"
          :pLocal="false"
        />
        <Riferimenti
          :pEmail="rifEmail"
          :pTelefono="rifTelefono"
        />
        <div class="action-button-wide">
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
</template>

<script>
import { emailAttiva, smsAttivo } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Wizard from '@/components/layout/Wizard'
import Allegati from '@/components/pratica/Allegati'
import Note from '@/components/pratica/Note'
import Riferimenti from '@/components/pratica/Riferimenti'
import DatiAvvisoAccertamento from '@/components/pratica/osservazione/avviso_accertamento/DatiAvvisoAccertamento'
import OssAvvAccertamento from '@/components/pratica/osservazione/avviso_accertamento/OssAvvAccertamento'
import store from '@/store'
import { OSS_AVV_ACCERTAMENTO_RESET_STATE } from '@/store/actions.type'

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
    DatiAvvisoAccertamento,
    DatiAnagraficiIntestatario,
    DomandaEsitoBox,
    Note,
    OssAvvAccertamento,
    Riferimenti,
    Wizard
  },
  computed: {
    intestAvvAcc: function () {
      const denominazione = this.osservazioneCreata.avvisoAccertamento.intestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.osservazioneCreata.avvisoAccertamento.intestatario.nome + ' ' + this.osservazioneCreata.avvisoAccertamento.intestatario.cognome
    },
    rifEmail: function () {
      if (emailAttiva) return this.osservazioneCreata.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.osservazioneCreata.telefono
      return null
    }
  },
  async created () {
    store.dispatch(OSS_AVV_ACCERTAMENTO_RESET_STATE)
  }
}
</script>
