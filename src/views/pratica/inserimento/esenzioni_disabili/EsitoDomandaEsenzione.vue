<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
    <v-card class="card-view-page">
      <div class="row inner-cont-bollo">
        <div class="col-lg-8 offset-lg-2 justify-content-center">
          <Wizard :servizio="'esenzioni_disabili'" :stepAttivo="2" />
        </div>
      </div>
      <div class="col-lg-8 offset-lg-2"
        v-if="esenzioniDisabiliResponse == null">
        {{ $t('general.labels.pagina_scaduta') }}
      </div>
      <div class="row inner-cont-bollo" v-else>
        <div class="col-lg-8 offset-lg-2">
          <DomandaEsitoBox
            :numeroProtocollo="esenzioniDisabiliResponse.numeroProtocollo"
          />
          <DatiAnagraficiIntestatario
            :denominazione="esenzioniDisabiliResponse.contribuente.nome + ' ' + esenzioniDisabiliResponse.contribuente.cognome"
            :codiceFiscale="esenzioniDisabiliResponse.contribuente.codiceFiscale"
            :provinciaNascita="esenzioniDisabiliResponse.contribuente.provinciaNascita"
            :comuneNascita="esenzioniDisabiliResponse.contribuente.comuneNascita"
            :email="esenzioniDisabiliResponse.contribuente.mail"
            :sesso="esenzioniDisabiliResponse.contribuente.sesso"
            :personaFisica="esenzioniDisabiliResponse.contribuente.personaFisica"
            tipoDatiAnagrafici="contribuente"
          />
          <DatiIndirizzoIntestatario
            :indirizzo="esenzioniDisabiliResponse.contribuente.indirizzo"
            :comune="esenzioniDisabiliResponse.contribuente.descComune"
            :provincia="esenzioniDisabiliResponse.contribuente.provincia"
            :cap="esenzioniDisabiliResponse.contribuente.cap"
            tipoDatiAnagrafici="contribuente"
          />
          <OggettoDomandaDisabili :attributi="esenzioniDisabiliResponse.oggettoDomanda" />
          <DichiarazioneDisabili :attributi="esenzioniDisabiliResponse.dichiarazione" />
          <VeicoloEsentare :veicolo="(esenzioniDisabiliResponse.oggettoDomanda.primaRichiestaEsenzione) ? esenzioniDisabiliResponse.oggettoDomanda.primaRichiestaEsenzione.veicolo : esenzioniDisabiliResponse.oggettoDomanda.trasferimentoEsenzione.veicolo" />
          <Allegati
            :codiceFiscale="esenzioniDisabiliResponse.contribuente.codiceFiscale"
            :numeroProtocollo="esenzioniDisabiliResponse.numeroProtocollo"
            :listaAllegati="esenzioniDisabiliResponse.allegati"
            :pLocal="false"
          />
          <DichiarazioneSostitutiva ref="dichiarazioneSostitutiva" :isChecked="true" :text="'DICH_SOST_CERT'" />
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
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import DichiarazioneDisabili from '@/components/pratica/esenzioni_disabili/DichiarazioneDisabili'
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import Riferimenti from '@/components/pratica/Riferimenti'
import OggettoDomandaDisabili from '@/components/pratica/esenzioni_disabili/OggettoDomandaDisabili'
import VeicoloEsentare from '@/components/pratica/esenzioni_disabili/VeicoloEsentare'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import DichiarazioneSostitutiva from '@/components/pratica/DichiarazioneSostitutiva'
export default {
  components: {
    Allegati,
    BtnHome,
    BtnStampaPagina,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    DichiarazioneSostitutiva,
    DomandaEsitoBox,
    Wizard,
    Spinner,
    DichiarazioneDisabili,
    OggettoDomandaDisabili,
    Riferimenti,
    VeicoloEsentare
  },
  computed: {
    ...mapGetters([
      'esenzioniDisabiliResponse'
    ]),
    rifEmail: function () {
      if (emailAttiva) return this.esenzioniDisabiliResponse.email ? this.esenzioniDisabiliResponse.email.toLowerCase() : this.esenzioniDisabiliResponse.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.esenzioniDisabiliResponse.telefono
      return null
    }
  }
}
</script>

<style>
</style>
