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
            <strong>Tipo di pratica</strong>: osservazione su domanda discarico e rimborso.<br>
          </div>
          <DatiAnagraficiIntestatario
            :denominazione="intestatarioAvviso"
            :codiceFiscale="codiceFiscaleSoggetto"
            :dataNascita="esitoVerificaPratica.dataAnagraficiIntestatario.dataNascita"
            :comuneNascita="esitoVerificaPratica.dataAnagraficiIntestatario.comuneNascita"
            :provinciaNascita="esitoVerificaPratica.dataAnagraficiIntestatario.provinciaNascita"
            :personaFisica="(esitoVerificaPratica.dataAnagraficiIntestatario.denominazione === null) ? true : false"
            :sesso="esitoVerificaPratica.dataAnagraficiIntestatario.sesso"
            :tipoDatiAnagrafici="'intestatario ingiunzione / cartella'"
          />
          <div class="space-section"
            v-if="esitoVerificaPratica.dataAnagraficiRappresentante !== null">
            <DatiAnagRapprLegale
              :denominazione="esitoVerificaPratica.dataAnagraficiRappresentante.nome + ' ' + esitoVerificaPratica.dataAnagraficiRappresentante.cognome"
              :codiceFiscale="esitoVerificaPratica.dataAnagraficiRappresentante.codiceFiscale"
              :sesso="esitoVerificaPratica.dataAnagraficiRappresentante.sesso"
              :dataDiNascita="esitoVerificaPratica.dataAnagraficiRappresentante.dataNascita"
              :comuneDiNascita="luogoNascitaRL"
              :provinciaDiNascita="esitoVerificaPratica.dataAnagraficiRappresentante.provinciaNascita"/>
          </div>
          <TitoloEsecutivo
            :tipoTitolo="titoloEsecutivo"
            :numeroEsecutivo="(esitoVerificaPratica.ingiunzioneFiscale !== null) ? esitoVerificaPratica.ingiunzioneFiscale.numeroIngiunzione : esitoVerificaPratica.cartellaEsattoriale.numeroCartellaEsattoriale"
            :dataNotifica="esitoVerificaPratica.dataNotifica"
            :importoTotale="esitoVerificaPratica.importoTotaleRiscossione"
          />
          <oggetto-domanda
            :oggetto="esitoVerificaPratica.oggettoDomanda"
          />
          <motivo-domanda
            :motivo="esitoVerificaPratica.motivo"
          />
          <Allegati v-if="esitoVerificaPratica.allegati !== null"
            :codiceFiscale="esitoVerificaPratica.dataAnagraficiIntestatario.codiceFiscale"
            :numeroProtocollo="esitoVerificaPratica.numeroProtocollo"
            :listaAllegati="esitoVerificaPratica.allegati"
            :pLocal="false"
          />
          <RiferimentiPraticaModifica
            :actionModifica="actionMod"
            :codiceFiscale="codiceFiscaleSoggetto"
            :idComunicazione="esitoVerificaPratica.idComunicazione"
            :numeroIdentificativo="esitoVerificaPratica.numeroProtocollo"
            :statoOsservazione="esitoVerificaPratica.stato.descrizione"
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
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Allegati from '@/components/pratica/Allegati'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import MotivoDomanda from '@/components/pratica/domanda_discarico_rimborso/MotivoDomanda'
import OggettoDomanda from '@/components/pratica/domanda_discarico_rimborso/OggettoDomanda'
import TitoloEsecutivo from '@/components/pratica/domanda_discarico_rimborso/TitoloEsecutivo'
import BtnBack from '@/components/layout/btn/BtnBack'
import { PRATICA_DISC_RIMB_MODIFICA } from '@/store/actions.type'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnBack,
    BtnStampaPagina,
    DatiAnagraficiIntestatario,
    RiferimentiPraticaModifica,
    MotivoDomanda,
    DatiAnagRapprLegale,
    OggettoDomanda,
    TitoloEsecutivo
  },
  data () {
    return {
      actionMod: PRATICA_DISC_RIMB_MODIFICA
    }
  },
  computed: {
    ...mapGetters([
      'esitoVerificaPratica'
    ]),
    codiceFiscaleSoggetto: function () {
      if (this.esitoVerificaPratica.dataAnagraficiIntestatario.denominazione !== null) return this.esitoVerificaPratica.dataAnagraficiIntestatario.piva
      return this.esitoVerificaPratica.dataAnagraficiIntestatario.codiceFiscale
    },
    intestatarioAvviso: function () {
      if (this.esitoVerificaPratica.dataAnagraficiIntestatario.denominazione !== null) return this.esitoVerificaPratica.dataAnagraficiIntestatario.denominazione
      return this.esitoVerificaPratica.dataAnagraficiIntestatario.nome + ' ' + this.esitoVerificaPratica.dataAnagraficiIntestatario.cognome
    },
    soggettoDomDisRimLeg: function () {
      if (this.esitoVerificaPratica.dataAnagraficiRappresentante === null) return null
      return this.esitoVerificaPratica.dataAnagraficiRappresentante.nome + ' ' + this.esitoVerificaPratica.dataAnagraficiRappresentante.cognome
    },
    titoloEsecutivo: function () {
      if (this.esitoVerificaPratica.ingiunzioneFiscale !== null) return 'ingiunzione'
      if (this.esitoVerificaPratica.cartellaEsattoriale !== null) return 'cartella'
    },
    luogoNascitaRL: function () {
      const provincia = this.esitoVerificaPratica.dataAnagraficiRappresentante.provinciaNascita
      if (provincia !== '' && provincia !== null) return this.esitoVerificaPratica.dataAnagraficiRappresentante.comuneNascita
      return this.esitoVerificaPratica.dataAnagraficiRappresentante.statoNascita
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
