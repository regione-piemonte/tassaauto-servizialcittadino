<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2 justify-content-center">
            <Wizard :servizio="'restituzione_tassa'" :stepAttivo="2" />
          </div>
        </div>
        <div
          class="col-lg-8 offset-lg-2"
          v-if="restituzioniTassaResponse == null"
        >{{ $t('general.labels.pagina_scaduta') }}</div>
        <div class="row inner-cont-bollo" v-else>
          <div class="col-lg-8 offset-lg-2">
            <DomandaEsitoBox :numeroProtocollo="restituzioniTassaResponse.numeroProtocollo" />
            <DatiAnagraficiIntestatario
              :denominazione="restituzioniTassaResponse.contribuente.nome + ' ' + restituzioniTassaResponse.contribuente.cognome"
              :codiceFiscale="restituzioniTassaResponse.contribuente.codiceFiscale"
              :provinciaNascita="restituzioniTassaResponse.contribuente.provinciaNascita"
              :comuneNascita="restituzioniTassaResponse.contribuente.comuneNascita"
              :email="restituzioniTassaResponse.contribuente.mail"
              :sesso="restituzioniTassaResponse.contribuente.sesso"
              :personaFisica="restituzioniTassaResponse.contribuente.personaFisica"
              tipoDatiAnagrafici="contribuente"
            />
            <DatiIndirizzoIntestatario
              :indirizzo="restituzioniTassaResponse.contribuente.indirizzo"
              :comune="restituzioniTassaResponse.contribuente.descComune"
              :provincia="restituzioniTassaResponse.contribuente.provincia"
              :cap="restituzioniTassaResponse.contribuente.cap"
              tipoDatiAnagrafici="contribuente"
            />
            <OggettoDomandaRichiestaRestituzione :attributi="restituzioniTassaResponse.oggettoDomanda" />
            <DatiVeicoloVersamentiRestituzione
              :veicolo="restituzioniTassaResponse.versamenti[0].veicolo"
              :riepilogo = false
            />
            <ModalitaRestituzione :attributi="restituzioniTassaResponse.modalitaRestituzione" />
            <Allegati
              :codiceFiscale="restituzioniTassaResponse.contribuente.codiceFiscale"
              :numeroProtocollo="restituzioniTassaResponse.numeroProtocollo"
              :listaAllegati="restituzioniTassaResponse.allegati"
              :pLocal="false"
            />
            <DichiarazioneSostitutiva ref="dichiarazioneSostitutiva" :isChecked="true" :text="'DICH_SOST_NOT'" />
            <Riferimenti :pEmail="rifEmail" :pTelefono="rifTelefono" />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnStampaPagina :label="'Stampa riepilogo'" />
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
import DatiVeicoloVersamentiRestituzione from '@/components/pratica/restituzione_tassa/DatiVeicoloVersamentiRestituzione'
import OggettoDomandaRichiestaRestituzione from '@/components/pratica/restituzione_tassa/OggettoDomandaRichiestaRestituzione'
import ModalitaRestituzione from '@/components/pratica/restituzione_tassa/ModalitaRestituzione'
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import Riferimenti from '@/components/pratica/Riferimenti'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnStampaPagina,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    DomandaEsitoBox,
    Wizard,
    Spinner,
    DatiVeicoloVersamentiRestituzione,
    OggettoDomandaRichiestaRestituzione,
    ModalitaRestituzione,
    Riferimenti
  },
  computed: {
    ...mapGetters([
      'restituzioniTassaResponse'
    ]),
    rifEmail: function () {
      if (emailAttiva) return this.restituzioniTassaResponse.email ? this.restituzioniTassaResponse.email.toLowerCase() : this.restituzioniTassaResponse.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.restituzioniTassaResponse.telefono
      return null
    }
  }
}
</script>

<style>
</style>
