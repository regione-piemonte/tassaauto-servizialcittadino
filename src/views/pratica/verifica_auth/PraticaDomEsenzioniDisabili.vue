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
                  N° di protocollo
                  {{ esitoVerificaPraticaAuth.numeroProtocollo }}
                </div>
                <strong>Tipo di pratica</strong>: richiesta di esenzione.<br />
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
                :dataNascita="esitoVerificaPraticaAuth.contribuente.dataNascita"
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
              <OggettoDomandaDisabili
                :attributi="esitoVerificaPraticaAuth.oggettoDomanda"
              />
              <DichiarazioneDisabili
                :attributi="esitoVerificaPraticaAuth.dichiarazione"
              />
              <VeicoloEsentare
                :veicolo="
                  esitoVerificaPraticaAuth.oggettoDomanda
                    .primaRichiestaEsenzione !== null
                    ? esitoVerificaPraticaAuth.oggettoDomanda
                        .primaRichiestaEsenzione.veicolo
                    : esitoVerificaPraticaAuth.oggettoDomanda
                        .trasferimentoEsenzione.veicolo
                "
              />
              <DichiarazioneSostitutiva
                ref="dichiarazioneSostitutiva"
                :isChecked="true"
                :text="'DICH_SOST_CERT'"
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
                :numeroIdentificativo="
                  esitoVerificaPraticaAuth.numeroProtocollo
                "
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
import DatiVeicolo from '@/components/DatiVeicolo'
import BtnHome from '@/components/layout/btn/BtnHome'
import DichiarazioneDisabili from '@/components/pratica/esenzioni_disabili/DichiarazioneDisabili'
import OggettoDomandaDisabili from '@/components/pratica/esenzioni_disabili/OggettoDomandaDisabili'
import VeicoloEsentare from '@/components/pratica/esenzioni_disabili/VeicoloEsentare'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Allegati from '@/components/pratica/Allegati'
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import DatiAvvisoAccertamento from '@/components/pratica/osservazione/avviso_accertamento/DatiAvvisoAccertamento'
import BtnBack from '@/components/layout/btn/BtnBack'
import { PRATICA_ESENZIONI_DISABILI_MODIFICA } from '@/store/actions.type'
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
    DichiarazioneDisabili,
    OggettoDomandaDisabili,
    RiferimentiPraticaModifica,
    VeicoloEsentare,
    DichiarazioneSostitutiva
  },
  data () {
    return {
      actionMod: PRATICA_ESENZIONI_DISABILI_MODIFICA
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
      if (this.esitoVerificaPraticaAuth.oggettoDomanda.primaRichiestaEsenzione !== null) return this.esitoVerificaPraticaAuth.oggettoDomanda.primaRichiestaEsenzione.veicolo.tipoVeicolo.descrizione
      return this.esitoVerificaPraticaAuth.oggettoDomanda.trasferimentoEsenzione.veicolo.tipoVeicolo.descrizione
    },
    targa: function () {
      if (this.esitoVerificaPraticaAuth.oggettoDomanda.primaRichiestaEsenzione !== null) return this.esitoVerificaPraticaAuth.oggettoDomanda.primaRichiestaEsenzione.veicolo.targa
      return this.esitoVerificaPraticaAuth.oggettoDomanda.trasferimentoEsenzione.veicolo.targa
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
