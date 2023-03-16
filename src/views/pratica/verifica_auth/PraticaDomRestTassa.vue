<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <div class="risultati-ricerca">
              <h2>
                {{ $t("pratica.verifica.accertamento.risultato") }}
              </h2>
              <div class="box-grigio mb-10 p-md-9" id="box-protocollo">
                <div class="h2">
                  N° di protocollo {{ esitoVerificaPraticaAuth.numeroProtocollo }}
                </div>
                <strong>Tipo di pratica</strong>: richiesta di restituzione.<br />
              </div>
            <DatiAnagraficiIntestatario
              :denominazione="
                esitoVerificaPraticaAuth.contribuente.nome +
                ' ' +
                esitoVerificaPraticaAuth.contribuente.cognome
              "
              :codiceFiscale="
                esitoVerificaPraticaAuth.contribuente.codiceFiscale
              "
              :dataNascita="
                  esitoVerificaPraticaAuth.contribuente.dataNascita
                "
              :provinciaNascita="
                esitoVerificaPraticaAuth.contribuente.provinciaNascita
              "
              :comuneNascita="
                esitoVerificaPraticaAuth.contribuente.comuneNascita
              "
              :email="esitoVerificaPraticaAuth.contribuente.mail"
              :sesso="esitoVerificaPraticaAuth.contribuente.sesso"
              :auth="true"
              tipoDatiAnagrafici="contribuente"
            />
            <DatiIndirizzoIntestatario
              :indirizzo="esitoVerificaPraticaAuth.contribuente.indirizzo"
              :comune="esitoVerificaPraticaAuth.contribuente.descComune"
              :provincia="
                esitoVerificaPraticaAuth.contribuente.provinciaNascita
              "
              :cap="esitoVerificaPraticaAuth.contribuente.cap"
              tipoDatiAnagrafici="contribuente"
            />
            <OggettoDomandaRichiestaRestituzione
              :attributi="esitoVerificaPraticaAuth.oggettoDomanda"
            />
            <DatiVeicoloVersamentiRestituzione
              :veicolo="esitoVerificaPraticaAuth.versamenti[0].veicolo"
              :riepilogo="true"
              :elencoVersamentiVerifica="esitoVerificaPraticaAuth.versamenti"
            />
            <ModalitaRestituzione
              :attributi="esitoVerificaPraticaAuth.modalitaRestituzione"
            />
            <DichiarazioneSostitutiva
              ref="dichiarazioneSostitutiva"
              :isChecked="true"
              :text="'DICH_SOST_NOT'"
              v-if="esitoVerificaPraticaAuth.isDichiarazione"
            />
            <Allegati
              v-if="esitoVerificaPraticaAuth.allegati !== null"
              :codiceFiscale="
                esitoVerificaPraticaAuth.contribuente.codiceFiscale
              "
              :numeroProtocollo="esitoVerificaPraticaAuth.numeroProtocollo"
              :listaAllegati="esitoVerificaPraticaAuth.allegati"
              :pLocal="false"
            />
            <RiferimentiPraticaModifica
              :actionModifica="actionMod"
              :codiceFiscale="codiceFiscaleSoggetto"
              :idComunicazione="esitoVerificaPraticaAuth.idComunicazione"
              :numeroIdentificativo="esitoVerificaPraticaAuth.numeroProtocollo"
              :propEmail="rifEmail"
              :propTelefono="rifTelefono"
              :statoOsservazione="esitoVerificaPraticaAuth.statoDomanda"
              :tipoVeicolo="descrizioneVeicolo"
              :targa="targa"
            />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="'cerca_pratica'"
                  :backType="'back'"
                />
                <BtnHome :cssClass="'btn-secondary'" />
              </div>
              <div class="col-md-6 text-md-right">
                <BtnStampaPagina :label="'Stampa riepilogo'" />
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
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import OggettoDomandaRichiestaRestituzione from '@/components/pratica/restituzione_tassa/OggettoDomandaRichiestaRestituzione'
import DatiVeicoloVersamentiRestituzione from '@/components/pratica/restituzione_tassa/DatiVeicoloVersamentiRestituzione'
import ModalitaRestituzione from '@/components/pratica/restituzione_tassa/ModalitaRestituzione'
import DatiVeicolo from '@/components/DatiVeicolo'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Allegati from '@/components/pratica/Allegati'
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import DatiAvvisoAccertamento from '@/components/pratica/osservazione/avviso_accertamento/DatiAvvisoAccertamento'
import BtnBack from '@/components/layout/btn/BtnBack'
import { PRATICA_RESTITUZIONI_TASSA_MODIFICA } from '@/store/actions.type'
import DichiarazioneSostitutiva from '@/components/pratica/DichiarazioneSostitutiva'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnBack,
    BtnStampaPagina,
    DatiVeicolo,
    DatiAvvisoAccertamento,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    DatiVeicoloVersamentiRestituzione,
    ModalitaRestituzione,
    OggettoDomandaRichiestaRestituzione,
    RiferimentiPraticaModifica,
    DichiarazioneSostitutiva
  },
  data () {
    return {
      actionMod: PRATICA_RESTITUZIONI_TASSA_MODIFICA
    }
  },
  computed: {
    ...mapGetters([
      'esitoVerificaPraticaAuth'
    ]),
    codiceFiscaleSoggetto: function () {
      if (this.esitoVerificaPraticaAuth.contribuente.denominazione !== null) return this.esitoVerificaPraticaAuth.contribuente.piva
      return this.esitoVerificaPraticaAuth.contribuente.codiceFiscale
    },
    intestatarioRettif: function () {
      const nome = this.esitoVerificaPraticaAuth.attributi.datiAnagraficiRettifica.nome
      const intest = (nome !== null && nome !== '') ? nome + ' ' : ''
      return intest + this.esitoVerificaPraticaAuth.attributi.datiAnagraficiRettifica.cognomeDenominazione
    },
    descrizioneVeicolo: function () {
      return this.esitoVerificaPraticaAuth.versamenti[0].veicolo.tipoVeicolo.descrizione
    },
    targa: function () {
      return this.esitoVerificaPraticaAuth.versamenti[0].veicolo.targa
    },
    rifEmail: function () {
      if (emailAttiva) return this.esitoVerificaPraticaAuth.email ? this.esitoVerificaPraticaAuth.email.toLowerCase() : this.esitoVerificaPraticaAuth.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.esitoVerificaPraticaAuth.telefono
      return null
    }
  }
}
</script>
