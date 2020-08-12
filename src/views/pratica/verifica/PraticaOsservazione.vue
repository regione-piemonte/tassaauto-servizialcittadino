<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="col-12 col-lg-8 offset-lg-2">
        <div class="risultati-ricerca">
          <h2>
            Risultato della ricerca
          </h2>
          <div class="box-grigio mb-10">
            <div class="h2" id="numeroProtocollo">
              N° di protocollo {{ esitoVerificaPratica.numeroProtocollo }}
            </div>
            <strong>Tipo di pratica</strong>: osservazione su avviso di scadenza.<br>
          </div>
          <DatiAnagraficiIntestatario
            :denominazione="intestatarioAvviso"
            :codiceFiscale="esitoVerificaPratica.avvisoScadenza.intestatario.codiceFiscale"
            :tipoDatiAnagrafici="'intestatario avviso'"
          />
          <DatiAnagRettOssAvvScadenza
            v-if="esitoVerificaPratica.attributi.datiAnagraficiRettifica !== null && esitoVerificaPratica.attributi.datiAnagraficiRettifica.value"
            :denominazione="intestatarioRettif"
            :codiceFiscale="esitoVerificaPratica.attributi.datiAnagraficiRettifica.codiceFiscale"
            :indirizzo="esitoVerificaPratica.attributi.datiAnagraficiRettifica.indirizzo + ' - '  + esitoVerificaPratica.attributi.datiAnagraficiRettifica.domicilioFiscale"
          />
          <DatiVeicolo
            :descrizione="esitoVerificaPratica.avvisoScadenza.tipoVeicolo.descrizione"
            :targa="esitoVerificaPratica.avvisoScadenza.targa"
            :scadenza="esitoVerificaPratica.avvisoScadenza.scadenza"
            :validita="Number(esitoVerificaPratica.avvisoScadenza.validita)"
            :tassa="esitoVerificaPratica.avvisoScadenza.tassa"
          />
          <DatiAvvisoScadenza
            :numeroRiferimento="esitoVerificaPratica.avvisoScadenza.numeroRiferimento"
          />
          <OssAvvScadenza
            :attributi="esitoVerificaPratica.attributi"
          />
          <Allegati
            :codiceFiscale="esitoVerificaPratica.avvisoScadenza.intestatario.codiceFiscale"
            :numeroProtocollo="esitoVerificaPratica.numeroProtocollo"
            :listaAllegati="esitoVerificaPratica.allegati"
            :pLocal="false"
          />
          <RiferimentiPraticaModifica
            :actionModifica="actionMod"
            :codiceFiscale="esitoVerificaPratica.avvisoScadenza.intestatario.codiceFiscale"
            :idComunicazione="esitoVerificaPratica.idComunicazione"
            :numeroIdentificativo="esitoVerificaPratica.numeroProtocollo"
            :targa="esitoVerificaPratica.avvisoScadenza.targa"
            :statoOsservazione="esitoVerificaPratica.stato.descrizione"
            :tipoVeicolo="esitoVerificaPratica.avvisoScadenza.tipoVeicolo.descrizione"
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
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import DatiAnagRettOssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAnagRettOssAvvScadenza'
import DatiAvvisoScadenza from '@/components/pratica/osservazione/avviso_scadenza/DatiAvvisoScadenza'
import OssAvvScadenza from '@/components/pratica/osservazione/avviso_scadenza/OssAvvScadenza'
import BtnBack from '@/components/layout/btn/BtnBack'
import { PRATICA_OSSERVAZIONE_MODIFICA } from '@/store/actions.type'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnBack,
    BtnStampaPagina,
    DatiVeicolo,
    DatiAvvisoScadenza,
    DatiAnagraficiIntestatario,
    DatiAnagRettOssAvvScadenza,
    OssAvvScadenza,
    RiferimentiPraticaModifica
  },
  data () {
    return {
      actionMod: PRATICA_OSSERVAZIONE_MODIFICA
    }
  },
  computed: {
    ...mapGetters([
      'esitoVerificaPratica'
    ]),
    intestatarioAvviso: function () {
      const denominazione = this.esitoVerificaPratica.avvisoScadenza.intestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.esitoVerificaPratica.avvisoScadenza.intestatario.nome + ' ' + this.esitoVerificaPratica.avvisoScadenza.intestatario.cognome
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
