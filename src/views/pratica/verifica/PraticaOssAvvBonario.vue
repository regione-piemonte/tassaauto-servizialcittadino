<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
      <div class="row inner-cont-bollo">
        <div class="col-12 col-lg-8 offset-lg-2">
          <div class="risultati-ricerca">
            <h2>
              {{ $t('pratica.verifica.accertamento.risultato') }}
            </h2>
            <div class="box-grigio mb-10 p-md-9" id="box-protocollo">
              <div class="h2">
                N° di protocollo {{ esitoVerificaPratica.numeroProtocollo }}
              </div>
              <strong>Tipo di pratica</strong>: osservazione su avviso bonario.<br>
            </div>
            <DatiAnagraficiIntestatario
              :denominazione="intestatarioAvviso"
              :codiceFiscale="esitoVerificaPratica.avvisoBonario.intestatario.codiceFiscale"
              :tipoDatiAnagrafici="'intestatario avviso'"
            />
            <DatiVeicolo
              :descrizione="esitoVerificaPratica.avvisoBonario.veicolo.tipoVeicolo.descrizione"
              :targa="esitoVerificaPratica.avvisoBonario.veicolo.targa"
            />
            <DatiAvvisoBonario
              :numeroRiferimento="esitoVerificaPratica.avvisoBonario.numeroProtocollo"
              :scadenza="esitoVerificaPratica.avvisoBonario.scadenza"
              :dataInvio="esitoVerificaPratica.avvisoBonario.dataInvio"
            />
            <OssAvvAccertamento
              :grigliaAccPagato="esitoVerificaPratica.grigliaAvvisoBonario.grigliaAvvisoBonarioPagato"
              :grigliaAccNonPagato="esitoVerificaPratica.grigliaAvvisoBonario.grigliaAvvisoBonarioNonPagato"
              :grigliaAccAltroMotivo="esitoVerificaPratica.grigliaAvvisoBonario.grigliaAvvisoBonarioAltro"
            />
            <Note
              :pTesto="esitoVerificaPratica.note"
            />
            <NoteComunicazione
              :pTesto="esitoVerificaPratica.noteComunicazione"
            />
            <Allegati
              :codiceFiscale="esitoVerificaPratica.avvisoBonario.intestatario.codiceFiscale"
              :numeroProtocollo="esitoVerificaPratica.numeroProtocollo"
              :listaAllegati="esitoVerificaPratica.allegati"
              :pLocal="false"
            />
            <RiferimentiPraticaModifica
              :actionModifica="actionMod"
              :codiceFiscale="esitoVerificaPratica.avvisoBonario.intestatario.codiceFiscale"
              :idComunicazione="esitoVerificaPratica.idComunicazione"
              :numeroIdentificativo="esitoVerificaPratica.numeroProtocollo"
              :targa="esitoVerificaPratica.avvisoBonario.veicolo.targa"
              :statoOsservazione="esitoVerificaPratica.stato.descrizione"
              :tipoVeicolo="esitoVerificaPratica.avvisoBonario.veicolo.tipoVeicolo.descrizione"
              :propEmail="rifEmail"
              :propTelefono="rifTelefono"
              :propButtonDisabled="false"
            />
            <div class="action-button-wide row">
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
import NoteComunicazione from '@/components/pratica/NoteComunicazione'
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import DatiAvvisoBonario from '@/components/pratica/osservazione/avviso_bonario/DatiAvvisoBonario'
import OssAvvAccertamento from '@/components/pratica/osservazione/avviso_accertamento/OssAvvAccertamento'
import BtnBack from '@/components/layout/btn/BtnBack'
import { PRATICA_BONARIO_MODIFICA } from '@/store/actions.type'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnBack,
    BtnStampaPagina,
    DatiVeicolo,
    DatiAvvisoBonario,
    DatiAnagraficiIntestatario,
    Note,
    NoteComunicazione,
    OssAvvAccertamento,
    RiferimentiPraticaModifica
  },
  data () {
    return {
      actionMod: PRATICA_BONARIO_MODIFICA
    }
  },
  computed: {
    ...mapGetters([
      'esitoVerificaPratica'
    ]),
    intestatarioAvviso: function () {
      const denominazione = this.esitoVerificaPratica.avvisoBonario.intestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.esitoVerificaPratica.avvisoBonario.intestatario.nome + ' ' + this.esitoVerificaPratica.avvisoBonario.intestatario.cognome
    },
    intestatarioRettif: function () {
      const nome = this.esitoVerificaPratica.attributi.datiAnagraficiRettifica.nome
      const intest = (nome !== null && nome !== '') ? nome + ' ' : ''
      return intest + this.esitoVerificaPratica.attributi.datiAnagraficiRettifica.cognomeDenominazione
    },
    rifEmail: function () {
      if (emailAttiva) return this.esitoVerificaPratica.email ? this.esitoVerificaPratica.email.toLowerCase() : this.esitoVerificaPratica.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.esitoVerificaPratica.telefono
      return null
    }
  }
}
</script>
