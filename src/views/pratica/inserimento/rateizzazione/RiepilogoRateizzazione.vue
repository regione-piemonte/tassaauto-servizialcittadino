<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <Wizard :servizio="'richiesta_rateizzazione'" :stepAttivo="2" />
      </div>
    </div>
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore :error="detailError" />
      </div>
    </div>
    <div class="app-row inner-cont-bollo">
      <div class="col-xxl-8 offset-xxl-2">
        <div class="space-section">
          <h2>Rate</h2>
          <div class="app-row">
            <div class="col-12 col-md-6 h4">
              <strong>Totale: {{totaleCarrelloRateizzazione | formatCurrency}}</strong>
            </div>
            <div class="col-12 col-md-6 align-self-center">
              <div v-if="!datiRateizzazione.checked">
                <strong>Numero rate: {{ carrelloRateizzazione.fascia.numeroRate }}</strong>
              </div>
              <div v-else>
                <strong>Numero rate: {{ datiRateizzazione.numeroRateUtente }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="space-section" v-if="datiRateizzazione.checked">
          <h2>
            Variazione rate
          </h2>
          <div>
            <v-alert color="warning" show >
              Attenzione! Hai richiesto una variazione delle rate per motivi di disagio economico (rate previste: {{ carrelloRateizzazione.fascia.numeroRate }}, rate richieste: {{ datiRateizzazione.numeroRateUtente }}).
            </v-alert>
          </div>
        </div>
        <DatiAnagraficiIntestatario
          :denominazione="soggettoRateizz"
          :codiceFiscale="datiContribuente.codiceFiscale"
          :tipoDatiAnagrafici="'del contribuente'"
        />
        <DatiAnagRapprLegale
          v-if="rappresentanteLegale !== null"
          :denominazione="rappresentanteLegale.nome + ' ' + rappresentanteLegale.cognome"
          :codiceFiscale="rappresentanteLegale.codiceFiscaleR"
          :sesso="rappresentanteLegale.sesso"
          :dataDiNascita="rappresentanteLegale.dataDiNascita"
          :comuneDiNascita="rappresentanteLegale.comune"
          :provinciaDiNascita="rappresentanteLegale.provincia"
        />
        <Allegati
          :codiceFiscale="''"
          :numeroProtocollo="''"
          :listaAllegati="allegati"
          :pLocal="true"
        />
        <RiferimentiPratica
          ref="rifPratica"
          v-on:bloccainvioosservazione="inviaRichRateizzDisabled = true"
        />
        <div class="action-button-wide">
          <div class="col-md-6">
            <BtnBack
              :backUrl="'numero_rate'"
              :backType="'backMod'"/>
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
              id="btnInvioRichiesta"
              type="button"
              color="primary"
              @click.prevent="inviaRateizzazione"
              :disabled="inviaRichRateizzDisabled">
              Invia richiesta
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { emailAttiva, smsAttivo } from '@/common/config'
import { RATEIZZAZIONE_CREA } from '@/store/actions.type'
import BoxErrore from '@/components/BoxErrore'
import NavigatorService from '@/common/navigator.service'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import Allegati from '@/components/pratica/Allegati'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'
import RiferimentiPratica from '@/components/pratica/RiferimentiPratica'
import BtnBack from '@/components/layout/btn/BtnBack'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  components: {
    Allegati,
    BoxErrore,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiAnagRapprLegale,
    RiferimentiPratica,
    Spinner,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      inviaRichRateizzDisabled: false,
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'accertamentiRateiz',
      'carrelloRateizzazione',
      'datiContribuente',
      'totaleCarrelloRateizzazione',
      'datiRateizzazione',
      'numeroRateDaPagare',
      'rappresentanteLegale',
      'allegati'
    ]),
    soggettoRateizz: function () {
      if (!this.datiContribuente.personaFisica) return this.datiContribuente.denominazione
      return this.datiContribuente.nome + ' ' + this.datiContribuente.cognome
    }
  },
  methods: {
    inviaRateizzazione () {
      this.$refs.rifPratica.iniziaValidazione()
      this.$refs.rifPratica.$v.rifForm.$touch()
      if (this.$refs.rifPratica.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      if (this.datiRateizzazione.checked) {
        this.carrelloRateizzazione.fascia.numeroRate = this.datiRateizzazione.numeroRateUtente
        this.carrelloRateizzazione.diffEconomiche = this.datiRateizzazione.checked
      }

      if (this.rappresentanteLegale !== null) {
        // logica concordata in data 24/05/2019 dovuta alla mancanza di campi specifici
        // per rappresentante legale. cfr issue https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/125
        this.datiContribuente.codiceFiscaleLegale = this.rappresentanteLegale.codiceFiscaleR
        this.datiContribuente.cognome = this.rappresentanteLegale.cognome
        this.datiContribuente.nome = this.rappresentanteLegale.nome
        this.datiContribuente.sesso = this.rappresentanteLegale.sesso
        this.datiContribuente.dataDiNascita = this.rappresentanteLegale.dataDiNascita
        this.datiContribuente.comuneDiNascita = this.rappresentanteLegale.comune
        this.datiContribuente.provinciaDiNascita = this.rappresentanteLegale.provincia
      }

      const dataCorrente = new Date()
      this.carrelloRateizzazione.dataCompilazione = dataCorrente.getFullYear() + '-' + (dataCorrente.getMonth() + 1) + '-' + dataCorrente.getDate()
      this.allegati.forEach(function (v) { delete v.upFile })
      this.accertamentiRateiz.forEach(function (v) { delete v.checked })

      const rifObj = this.$refs.rifPratica.getRiferimenti()
      if (emailAttiva()) this.carrelloRateizzazione.mail = rifObj.email
      if (smsAttivo()) this.carrelloRateizzazione.cell = rifObj.telefono

      this.carrelloRateizzazione.soggetto = this.datiContribuente
      this.carrelloRateizzazione.accertamenti = this.accertamentiRateiz
      this.carrelloRateizzazione.allegati = this.allegati

      this.overlay = true
      store
        .dispatch(RATEIZZAZIONE_CREA, this.carrelloRateizzazione)
        .then(({ data }) => {
          this.overlay = false
          this.$router.push({ name: 'esito_rateizzazione', params: { rateizzazioneCreata: data } })
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
            return
          }
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata.'
            }
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata, esiste una pratica in lavorazione.'
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata, parametri inseriti non validi.'
            }
          }
        })
    }
  }
}
</script>
