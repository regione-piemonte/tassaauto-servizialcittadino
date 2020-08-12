<template>
  <v-app-bar
    :color="colorHeaderSwitch()"
    dark
    height="90px"
    :class="(this.$route.name !== 'home') ? 'titolo-servizio-appbar' : 'titolo-servizio-appbar home-appbar'"
    tag="div">
    <div :class="(this.$route.name !== 'home') ? 'title-service-appbar' : 'title-home-appbar'">
      <h1 v-bind:class="(regione != 'piemonte') ? '' : iconClass" tabindex="-1">{{titolo}}</h1>
    </div>
  </v-app-bar>
</template>

<script>
import { REGIONE_ABILITATA } from '@/common/config'
export default {
  name: 'TitoloServizio',
  props: {
    servizio: { type: String, required: true }
  },
  data () {
    return {
      nomeIconaObj: {
        calcolo_bollo: {
          nomeServizio: this.$i18n.t('bollo.calcolo.titolo_servizio'),
          icona: 'ico-titolo ico-calcolatrice'
        },
        domanda_discarico_rimborso: {
          nomeServizio: 'Fai una domanda di discarico o rimborso di cartelle esattoriali e ingiunzioni',
          icona: 'ico-titolo ico-discarico'
        },
        info_bollo: {
          nomeServizio: this.$i18n.t('bollo.info.titolo_servizio'),
          icona: 'ico-titolo ico-info'
        },
        memo_bollo: {
          nomeServizio: this.$i18n.t('bollo.memo.titolo_servizio'),
          icona: 'ico-titolo ico-memo'
        },
        scelta_tipo_osservazione: {
          nomeServizio: 'Fai una osservazione',
          icona: 'ico-titolo ico-chat'
        },
        osservazione_avviso_accertamento: {
          nomeServizio: 'Osservazione su avviso di accertamento',
          icona: 'ico-titolo ico-chat'
        },
        osservazione_avviso_scadenza: {
          nomeServizio: 'Osservazione su avviso di scadenza',
          icona: 'ico-titolo ico-chat'
        },
        scelta_tipo_pagamento: {
          nomeServizio: 'Pagamenti Online',
          icona: 'ico-titolo ico-pagamento'
        },
        pago_bollo: {
          nomeServizio: this.$i18n.t('bollo.pago.bollo.titolo_servizio'),
          icona: 'ico-titolo ico-pagamento'
        },
        pago_rate: {
          nomeServizio: 'Paga le rate di un piano di rateizzazione',
          icona: 'ico-titolo ico-pagamento'
        },
        richiesta_rateizzazione: {
          nomeServizio: this.$i18n.t('pratica.rateizzazione.titolo_servizio'),
          icona: 'ico-titolo ico-rate'
        },
        ricevuta_bollo: {
          nomeServizio: this.$i18n.t('bollo.ricevuta.titolo_servizio'),
          icona: 'ico-titolo ico-download'
        },
        scelta_tipo_stampa: {
          nomeServizio: 'Stampa avviso di pagamento',
          icona: 'ico-titolo ico-stampa-avviso'
        },
        stampa_avviso_accertamento: {
          nomeServizio: 'Stampa avviso di pagamento - accertamento',
          icona: 'ico-titolo ico-stampa-avviso'
        },
        stampa_avviso_scadenza: {
          nomeServizio: 'Stampa avviso di pagamento - scadenza',
          icona: 'ico-titolo ico-stampa-avviso'
        },
        verifica_pratica: {
          nomeServizio: this.$i18n.t('pratica.verifica.titolo_servizio'),
          icona: 'ico-titolo ico-verifica'
        },
        home: {
          nomeServizio: 'I servizi per il tuo veicolo'
        },
        not_found: {
          nomeServizio: 'Pagina non trovata'
        },
        contatti_aiuto: {
          nomeServizio: 'Hai bisogno di aiuto?',
          icona: 'ico-titolo ico-aiuto'
        },
        video_tutorial: {
          nomeServizio: 'Video tutorial',
          icona: 'ico-titolo ico-aiuto'
        }
      },
      regione: REGIONE_ABILITATA
    }
  },
  computed: {
    titolo: function () {
      if (!(this.servizio in this.nomeIconaObj)) return
      return this.nomeIconaObj[this.servizio].nomeServizio
    },
    iconClass: function () {
      if (!(this.servizio in this.nomeIconaObj)) return
      return this.nomeIconaObj[this.servizio].icona
    }
  },
  methods: {
    colorHeaderSwitch () {
      return '#178CD6'
    }
  }
}
</script>
