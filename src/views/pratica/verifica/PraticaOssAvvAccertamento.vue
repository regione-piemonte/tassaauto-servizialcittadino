<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="col-12 col-lg-8 offset-lg-2">
        <div class="risultati-ricerca">
          <h2>
            {{ $t('pratica.verifica.accertamento.risultato') }}
          </h2>
          <div class="box-grigio mb-10" id="box-protocollo">
            <div class="h2">
              N° di protocollo {{ esitoVerificaPratica.numeroProtocollo }}
            </div>
            <strong>Tipo di pratica</strong>: osservazione su avviso di accertamento.<br>
          </div>
          <DatiAnagraficiIntestatario
            :denominazione="intestatarioAvviso"
            :codiceFiscale="esitoVerificaPratica.avvisoAccertamento.intestatario.codiceFiscale"
            :tipoDatiAnagrafici="'intestatario avviso'"
          />
          <DatiVeicolo
            :descrizione="esitoVerificaPratica.avvisoAccertamento.tipoVeicolo.descrizione"
            :targa="esitoVerificaPratica.avvisoAccertamento.targaVeicolo"
          />
          <DatiAvvisoAccertamento
            :numeroRiferimento="esitoVerificaPratica.avvisoAccertamento.numeroProtocollo"
            :scadenza="esitoVerificaPratica.avvisoAccertamento.scadenza"
            :tributoDovuto="esitoVerificaPratica.avvisoAccertamento.tributoDovuto"
            :violazioneAccertata="esitoVerificaPratica.avvisoAccertamento.violazioneAccertata"
            :dataInvio="esitoVerificaPratica.avvisoAccertamento.dataInvio"
            :dataNotifica="esitoVerificaPratica.avvisoAccertamento.dataNotifica"
          />
          <OssAvvAccertamento
            :grigliaAccPagato="esitoVerificaPratica.grigliaAccertamento.grigliaAccertamentoPagato"
            :grigliaAccNonPagato="esitoVerificaPratica.grigliaAccertamento.grigliaAccertamentoNonPagato"
            :grigliaAccAltroMotivo="esitoVerificaPratica.grigliaAccertamento.grigliaAccertamentoAltro"
          />
          <Note
            :pTesto="esitoVerificaPratica.note"
          />
          <Allegati v-if="esitoVerificaPratica.allegati !== null"
            :codiceFiscale="esitoVerificaPratica.avvisoAccertamento.intestatario.codiceFiscale"
            :numeroProtocollo="esitoVerificaPratica.numeroProtocollo"
            :listaAllegati="esitoVerificaPratica.allegati"
            :pLocal="false"
          />
          <RiferimentiPraticaModifica
            :actionModifica="actionMod"
            :codiceFiscale="esitoVerificaPratica.avvisoAccertamento.intestatario.codiceFiscale"
            :idComunicazione="esitoVerificaPratica.idComunicazione"
            :numeroIdentificativo="esitoVerificaPratica.numeroProtocollo"
            :targa="esitoVerificaPratica.avvisoAccertamento.targaVeicolo"
            :statoOsservazione="esitoVerificaPratica.stato.descrizione"
            :tipoVeicolo="esitoVerificaPratica.avvisoAccertamento.tipoVeicolo.descrizione"
            :propEmail="rifEmail"
            :propTelefono="rifTelefono"
          />
          <div class="action-button-wide">
            <div class="col-md-6">
              <BtnBack
              :backUrl="'cerca_pratica'"
              :backType="'back'"/>
              <BtnHome :cssClass="'btn-secondary'" />
            </div>
            <div class="col-md-6 text-md-right">
              <BtnStampaPagina
                :label="'Stampa riepilogo'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { emailAttiva, smsAttivo } from '@/common/config'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Allegati from '@/components/pratica/Allegati'
import Note from '@/components/pratica/Note'
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import DatiAvvisoAccertamento from '@/components/pratica/osservazione/avviso_accertamento/DatiAvvisoAccertamento'
import OssAvvAccertamento from '@/components/pratica/osservazione/avviso_accertamento/OssAvvAccertamento'
import BtnBack from '@/components/layout/btn/BtnBack'
import { PRATICA_ACCERTAMENTO_MODIFICA } from '@/store/actions.type'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnBack,
    BtnStampaPagina,
    DatiVeicolo,
    DatiAvvisoAccertamento,
    DatiAnagraficiIntestatario,
    Note,
    OssAvvAccertamento,
    RiferimentiPraticaModifica
  },
  data () {
    return {
      actionMod: PRATICA_ACCERTAMENTO_MODIFICA
    }
  },
  computed: {
    ...mapGetters([
      'esitoVerificaPratica'
    ]),
    intestatarioAvviso: function () {
      const denominazione = this.esitoVerificaPratica.avvisoAccertamento.intestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.esitoVerificaPratica.avvisoAccertamento.intestatario.nome + ' ' + this.esitoVerificaPratica.avvisoAccertamento.intestatario.cognome
    },
    intestatarioRettif: function () {
      const nome = this.esitoVerificaPratica.attributi.datiAnagraficiRettifica.nome
      const intest = (nome !== null && nome !== '') ? nome + ' ' : ''
      return intest + this.esitoVerificaPratica.attributi.datiAnagraficiRettifica.cognomeDenominazione
    },
    rifEmail: function () {
      if (emailAttiva) return this.esitoVerificaPratica.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.esitoVerificaPratica.telefono
      return null
    }
  }
}
</script>
