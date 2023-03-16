<template>
  <div class="container" ref="formContainer">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class=" col-lg-8 offset-lg-2 justify-content-center">
            <Wizard
              :servizio="'osservazione'"
              :stepAttivo="3"
            />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div
            class=" col-lg-8 offset-lg-2"
            v-if="osservazioneCreata == null">
            {{ $t('general.labels.pagina_scaduta') }}
          </div>
          <div
            class=" col-lg-8 offset-lg-2"
            v-else>
            <DomandaEsitoBox
              :numeroProtocollo="osservazioneCreata.numeroProtocollo"
            />
            <DatiAnagraficiIntestatario
              :denominazione="intestAvvAcc"
              :codiceFiscale="osservazioneCreata.avvisoBonario.intestatario.codiceFiscale"
              :tipoDatiAnagrafici="'intestatario avviso'"
            />
            <DatiVeicolo
              :descrizione="osservazioneCreata.avvisoBonario.veicolo.tipoVeicolo.descrizione"
              :targa="osservazioneCreata.avvisoBonario.veicolo.targa"
            />
            <DatiAvvisoBonario
            :numeroRiferimento="osservazioneCreata.avvisoBonario.numeroProtocollo"
            :scadenza="osservazioneCreata.avvisoBonario.scadenza"
            :dataInvio="osservazioneCreata.avvisoBonario.dataInvio"
            />
            <OssAvvAccertamento
              :grigliaAccPagato="osservazioneCreata.grigliaAvvisoBonario.grigliaAvvisoBonarioPagato"
              :grigliaAccNonPagato="osservazioneCreata.grigliaAvvisoBonario.grigliaAvvisoBonarioNonPagato"
              :grigliaAccAltroMotivo="osservazioneCreata.grigliaAvvisoBonario.grigliaAvvisoBonarioAltro"
            />
            <Note
              :pTesto="osservazioneCreata.note"
            />
            <Allegati
              :codiceFiscale="osservazioneCreata.avvisoBonario.intestatario.codiceFiscale"
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
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Wizard from '@/components/layout/Wizard'
import Allegati from '@/components/pratica/Allegati'
import Note from '@/components/pratica/Note'
import Riferimenti from '@/components/pratica/Riferimenti'
import DatiAvvisoBonario from '@/components/pratica/osservazione/avviso_bonario/DatiAvvisoBonario'
import OssAvvAccertamento from '@/components/pratica/osservazione/avviso_accertamento/OssAvvAccertamento'
import store from '@/store'
import { OSS_AVV_BONARIO_RESET_STATE } from '@/store/actions.type'

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
    DatiAvvisoBonario,
    DatiAnagraficiIntestatario,
    DomandaEsitoBox,
    Note,
    OssAvvAccertamento,
    Riferimenti,
    Wizard
  },
  computed: {
    intestAvvAcc: function () {
      const denominazione = this.osservazioneCreata.avvisoBonario.intestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.osservazioneCreata.avvisoBonario.intestatario.nome + ' ' + this.osservazioneCreata.avvisoBonario.intestatario.cognome
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
    store.dispatch(OSS_AVV_BONARIO_RESET_STATE)
  }
}
</script>
