<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'richiesta_rateizzazione'" :stepAttivo="3"
            />
          </div>
          <div class="col-lg-8 offset-lg-2"
            v-if="rateizzazioneCreata == null">
            {{ $t('general.labels.pagina_scaduta') }}
          </div>
          <div v-else
            class="col-lg-8 offset-lg-2">
            <DomandaEsitoBox
              :numeroProtocollo="rateizzazioneCreata.numeroProtocollo"
            />
            <div class="space-section">
              <h2>
                Rate
              </h2>
              <div class="row">
                <div class="col-12 col-sm-6">
                  Totale {{ rateizzazioneCreata.totaleDaRateizzare | formatCurrency }}
                </div>
                <div class="col-12 col-sm-6">
                  Numero rate <span v-if="regione === 'piemonte'">{{ rateizzazioneCreata.numeroRate.numeroRate }}</span> <span v-if="regione === 'vda'">{{rateizzazioneCreata.numeroRateScelte}}</span>
                </div>
              </div>
            </div>
            <div class="space-section"
              v-if="rateizzazioneCreata.diffEconomiche">
              <h2>
                Variazione rate
              </h2>
              <p>
                Dichiaro di trovarmi in situazione di disagio economico e chiedo di poter ottenere un numero maggiore di rate.
              </p>
              <p>
                Numero rate richiesto: {{ rateizzazioneCreata.numeroRate.numeroRate }}
              </p>
            </div>
            <DatiAnagraficiIntestatario
              :denominazione="soggettoRateizz"
              :codiceFiscale="rateizzazioneCreata.soggetto.codiceFiscale"
              :tipoDatiAnagrafici="'del contribuente'"
            />
            <DatiAnagRapprLegale
              v-if="!rateizzazioneCreata.soggetto.personaFisica"
              :denominazione="rateizzazioneCreata.soggetto.nome + ' ' + rateizzazioneCreata.soggetto.cognome"
              :codiceFiscale="rateizzazioneCreata.soggetto.codiceFiscaleLegale"
              :sesso="rateizzazioneCreata.soggetto.sesso"
              :dataDiNascita="rateizzazioneCreata.soggetto.dataDiNascita"
              :comuneDiNascita="rateizzazioneCreata.soggetto.comuneDiNascita"
              :provinciaDiNascita="rateizzazioneCreata.soggetto.provinciaDiNascita"
            />
            <Allegati
              :codiceFiscale="rateizzazioneCreata.soggetto.codiceFiscale"
              :numeroProtocollo="rateizzazioneCreata.numeroProtocollo"
              :listaAllegati="rateizzazioneCreata.allegati"
              :pLocal="false"
            />
            <Riferimenti
              :pEmail="rifEmail"
              :pTelefono="rifTelefono"
            />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnHome
                  :cssClass="'btn-secondary'"
                />
              </div>
              <div class="col-md-6 text-md-right">
                <BtnStampaPagina
                  :label="'Stampa esito'"
                />
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>

  </div>
</template>

<script>
import { emailAttiva, smsAttivo, REGIONE_ABILITATA } from '@/common/config'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Wizard from '@/components/layout/Wizard'
import DomandaEsitoBox from '@/components/pratica/DomandaEsitoBox'
import Allegati from '@/components/pratica/Allegati'
import Riferimenti from '@/components/pratica/Riferimenti'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'

export default {
  data () {
    return {
      regione: REGIONE_ABILITATA
    }
  },
  props: {
    rateizzazioneCreata: { type: Object, required: true }
  },
  components: {
    Allegati,
    DomandaEsitoBox,
    BtnHome,
    BtnStampaPagina,
    DatiAnagraficiIntestatario,
    DatiAnagRapprLegale,
    Riferimenti,
    Wizard
  },
  computed: {
    rifEmail: function () {
      if (emailAttiva) return this.rateizzazioneCreata.email ? this.rateizzazioneCreata.email.toLowerCase() : this.rateizzazioneCreata.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.rateizzazioneCreata.telefono
      return null
    },
    soggettoRateizz: function () {
      if (!this.rateizzazioneCreata.soggetto.personaFisica) return this.rateizzazioneCreata.soggetto.denominazione
      return this.rateizzazioneCreata.soggetto.nome + ' ' + this.rateizzazioneCreata.soggetto.cognome
    }
  }
}
</script>
