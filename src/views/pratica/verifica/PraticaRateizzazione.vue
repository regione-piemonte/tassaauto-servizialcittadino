<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="col-12 col-lg-8 offset-lg-2">
        <div class="risultati-ricerca">
          <h2>
            Risultato della ricerca
          </h2>
          <div class="box-grigio mb-10" id="box-protocollo">
            <div class="h2" id="numeroProtocollo">
              N° di protocollo {{ esitoVerificaPratica.numeroProtocollo }}
            </div>
            <strong>Tipo di pratica</strong> richiesta di rateizzazione su avvisi di accertamento.<br>
          </div>
          <div>
            <div class="space-section" id="verificaPraticaRate">
              <h2>
                Rate
              </h2>
              <strong id="totaleImportoRate">
                Totale {{ esitoVerificaPratica.totaleDaRateizzare | formatCurrency }}
              </strong>
              <v-list class="text-uppercase" flat>
                <v-list-item-group :no-action="true">
                  <v-list-item
                    id="ConsultaDiffNRate"
                    :inactive="true"
                    :ripple="false">
                    Numero di rate {{ esitoVerificaPratica.numeroRate.numeroRate }}
                  </v-list-item>
                  <v-list-item
                    id="ConsultaDiffEconomiche"
                    :inactive="true"
                    :ripple="false"
                    v-if="esitoVerificaPratica.diffEconomiche && !noFasce">
                  Numero rate previste {{ nRatePreviste }}
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
            <div
              v-if="esitoVerificaPratica.diffEconomiche" class="space-section">
              <h2>
                Variazione rate
              </h2>
              Ho dichiarato di trovarmi in situazione di disagio economico e ho chiesto un numero maggiore di rate.<br>
              Numero di rate richieste: {{ esitoVerificaPratica.numeroRate.numeroRate }}
            </div>
            <DatiAnagraficiIntestatario
              :denominazione="soggettoRateizz"
              :codiceFiscale="esitoVerificaPratica.soggetto.codiceFiscale"
              :tipoDatiAnagrafici="'del contribuente'"
            />
            <DatiAnagraficiIntestatario
              v-if="!esitoVerificaPratica.soggetto.personaFisica"
              :denominazione="esitoVerificaPratica.soggetto.nome + ' ' + esitoVerificaPratica.soggetto.cognome"
              :codiceFiscale="esitoVerificaPratica.soggetto.codiceFiscaleLegale"
              :tipoDatiAnagrafici="'del rappresentante legale'"
            />
            <Allegati
              :codiceFiscale="esitoVerificaPratica.soggetto.codiceFiscale"
              :numeroProtocollo="esitoVerificaPratica.numeroProtocollo"
              :listaAllegati="esitoVerificaPratica.allegati"
              :pLocal="false"
            />
            <RiferimentiPraticaModifica
              :actionModifica="this.actionMod"
              :codiceFiscale="esitoVerificaPratica.soggetto.codiceFiscale"
              :idComunicazione="esitoVerificaPratica.idComunicazione"
              :protocollo="esitoVerificaPratica.numeroProtocollo"
              :propEmail="rifEmail"
              :propTelefono="rifTelefono"
            />
          </div>
          <div class="action-button-wide">
            <div class="col-lg-6">
              <BtnBack
              :backUrl="'cerca_pratica'"
              :backType="'back'"/>
              <BtnHome :cssClass="'btn-secondary'" />
            </div>
            <div class="col-lg-6 text-md-right">
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
import { emailAttiva, smsAttivo } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import BtnHome from '@/components/layout/btn/BtnHome'
import BtnStampaPagina from '@/components/layout/btn/BtnStampaPagina'
import Allegati from '@/components/pratica/Allegati'
import BtnBack from '@/components/layout/btn/BtnBack'
import RiferimentiPraticaModifica from '@/components/pratica/RiferimentiPraticaModifica'
import store from '@/store'
import { mapGetters } from 'vuex'
import { RATEIZZAZIONE_CONTROLLO_FASCE, PRATICA_RATEIZZAZIONE_MODIFICA } from '@/store/actions.type'

export default {
  components: {
    Allegati,
    BtnHome,
    BtnBack,
    BtnStampaPagina,
    DatiAnagraficiIntestatario,
    RiferimentiPraticaModifica
  },
  data () {
    return {
      actionMod: PRATICA_RATEIZZAZIONE_MODIFICA,
      nRatePreviste: null,
      noFasce: false
    }
  },
  computed: {
    ...mapGetters([
      'esitoVerificaPratica'
    ]),
    rifEmail: function () {
      if (emailAttiva) return this.esitoVerificaPratica.email
      return null
    },
    rifTelefono: function () {
      if (smsAttivo) return this.esitoVerificaPratica.telefono
      return null
    },
    soggettoRateizz: function () {
      if (!this.esitoVerificaPratica.soggetto.personaFisica) return this.esitoVerificaPratica.soggetto.denominazione
      return this.esitoVerificaPratica.soggetto.nome + ' ' + this.esitoVerificaPratica.soggetto.cognome
    }
  },
  async created () {
    if (this.esitoVerificaPratica.diffEconomiche != null && this.esitoVerificaPratica.diffEconomiche) {
      if (!NavigatorService.checkInternetConnection()) return
      store
        .dispatch(RATEIZZAZIONE_CONTROLLO_FASCE)
        .then(({ data }) => {
          const fascia = data.find(
            p => (p.importoDa <= this.esitoVerificaPratica.totaleDaRateizzare && (p.importoA >= this.esitoVerificaPratica.totaleDaRateizzare || p.importoA === null)))
          this.nRatePreviste = fascia.numeroRate
        })
        .catch((error) => {
          console.log('error', { error })
          this.noFasce = true
        })
    }
  }
}
</script>
