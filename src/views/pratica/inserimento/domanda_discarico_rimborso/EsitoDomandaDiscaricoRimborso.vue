<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'domanda_discarico_rimborso'" :stepAttivo="3" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div
            class=" col-lg-8 offset-lg-2"
            v-if="responseDomandaDiscaricoRimborso == null">
            {{ $t('general.labels.pagina_scaduta') }}
          </div>
          <div
            class=" col-lg-8 offset-lg-2"
            v-else>
            <DomandaEsitoBox
              :numeroProtocollo="responseDomandaDiscaricoRimborso.numeroProtocollo"
            />
            <DatiAnagraficiIntestatario
              :denominazione="intestDomDisRim"
              :codiceFiscale="cfDomDisRim"
              :dataNascita="responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.dataNascita"
              :comuneNascita="responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.comuneNascita"
              :personaFisica="(responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.denominazione === null) ? true : false"
              :provinciaNascita="responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.provinciaNascita"
              :sesso="responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.sesso"
              :tipoDatiAnagrafici="'intestatario ingiunzione / cartella'"
            />
            <div v-if="responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante !== null && responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.nome !== undefined">
                <DatiAnagRapprLegale
                  :denominazione="responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.nome + ' ' + responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.cognome"
                  :codiceFiscale="responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.codiceFiscale"
                  :sesso="responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.sesso"
                  :dataDiNascita="responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.dataNascita"
                  :comuneDiNascita="luogoNascitaRL"
                  :provinciaDiNascita="responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.provinciaNascita"/>
            </div>
            <titolo-esecutivo
              :tipoTitolo="(responseDomandaDiscaricoRimborso.ingiunzioneFiscale !== null) ? 'ingiunzione' : 'cartella'"
              :numeroEsecutivo="(responseDomandaDiscaricoRimborso.ingiunzioneFiscale !== null) ? responseDomandaDiscaricoRimborso.ingiunzioneFiscale.numeroIngiunzione : responseDomandaDiscaricoRimborso.cartellaEsattoriale.numeroCartellaEsattoriale"
              :dataNotifica="responseDomandaDiscaricoRimborso.dataNotifica"
              :importoTotale="responseDomandaDiscaricoRimborso.importoTotaleRiscossione"
            />
            <oggetto-domanda
              :oggetto="responseDomandaDiscaricoRimborso.oggettoDomanda"
            />
            <motivo-domanda
              :motivo="responseDomandaDiscaricoRimborso.motivo"
            />
            <Allegati
              :codiceFiscale="responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.codiceFiscale"
              :numeroProtocollo="responseDomandaDiscaricoRimborso.numeroProtocollo"
              :listaAllegati="responseDomandaDiscaricoRimborso.allegati"
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
import { mapGetters } from 'vuex'
import { emailAttiva, smsAttivo } from '@/common/config'
import Allegati from '@/components/pratica/Allegati'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'
import Riferimenti from '@/components/pratica/Riferimenti'
import MotivoDomanda from '@/components/pratica/domanda_discarico_rimborso/MotivoDomanda'
import OggettoDomanda from '@/components/pratica/domanda_discarico_rimborso/OggettoDomanda'
import TitoloEsecutivo from '@/components/pratica/domanda_discarico_rimborso/TitoloEsecutivo'
import Wizard from '@/components/layout/Wizard'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnStampaPagina,
    DatiAnagraficiIntestatario,
    DatiAnagRapprLegale,
    DomandaEsitoBox,
    MotivoDomanda,
    OggettoDomanda,
    Riferimenti,
    TitoloEsecutivo,
    Wizard
  },
  computed: {
    ...mapGetters([
      'responseDomandaDiscaricoRimborso'
    ]),
    intestDomDisRim: function () {
      const denominazione = this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.denominazione
      if (denominazione !== null && denominazione !== '') return denominazione
      return this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.nome + ' ' + this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.cognome
    },
    cfDomDisRim: function () {
      if (this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.denominazione !== null) return this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.piva
      return this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario.codiceFiscale
    },
    soggettoDomDisRimLeg: function () {
      if (this.responseDomandaDiscaricoRimborso.dataAnagraficiIntestatario === null) return null
      return this.responseDomandaDiscaricoRimborso.nome + ' ' + this.responseDomandaDiscaricoRimborso.cognome
    },
    luogoNascitaRL: function () {
      const provincia = this.responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.provinciaNascita
      if (provincia !== '' && provincia !== null) return this.responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.descComune
      return this.responseDomandaDiscaricoRimborso.dataAnagraficiRappresentante.statoNascita
    },
    rifEmail: function () {
      if (emailAttiva) return this.responseDomandaDiscaricoRimborso.email ? this.responseDomandaDiscaricoRimborso.email.toLowerCase() : this.responseDomandaDiscaricoRimborso.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.responseDomandaDiscaricoRimborso.telefono
      return null
    }
  }
}
</script>
