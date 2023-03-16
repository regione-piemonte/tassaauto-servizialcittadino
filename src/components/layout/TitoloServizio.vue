<template>
<div>
  <v-app-bar
    :color="colorHeaderSwitch()"
    dark
    height="90px"
    :class="(this.$route.name !== 'home' || servizio ==='area_personale' ) ? 'titolo-servizio-appbar' : 'titolo-servizio-appbar home-appbar'"
    tag="div">
    <div :class="(this.$route.name !== 'home' || servizio ==='area_personale') ? 'title-service-appbar' : 'title-home-appbar'">
      <h1 v-bind:class="(regione != 'piemonte') ? '' : iconClass" tabindex="-1">{{titolo}}</h1>
    </div>
  </v-app-bar>
  </div>
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
          nomeServizio: 'Fai una domanda di discarico di cartelle esattoriali e ingiunzioni',
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
          nomeServizio: this.$i18n.t('pratica.osservazione.scelta_tipo_osservazione.titolo_servizio'),
          icona: 'ico-titolo ico-chat'
        },
        osservazione_avviso_accertamento: {
          nomeServizio: this.$i18n.t('pratica.osservazione.avviso_accertamento.titolo_servizio'),
          icona: 'ico-titolo ico-chat'
        },
        osservazione_avviso_scadenza: {
          nomeServizio: this.$i18n.t('pratica.osservazione.avviso_scadenza.titolo_servizio'),
          icona: 'ico-titolo ico-chat'
        },
        osservazione_avviso_bonario: {
          nomeServizio: this.$i18n.t('pratica.osservazione.avviso_bonario.titolo_servizio'),
          icona: 'ico-titolo ico-chat'
        },
        scelta_tipo_pagamento: {
          nomeServizio: this.$i18n.t('bollo.pago.scelta_tipo_pagamento.titolo_servizio'),
          icona: 'ico-titolo ico-pagamento'
        },
        pago_bollo: {
          nomeServizio: this.$i18n.t('bollo.pago.bollo.titolo_servizio'),
          icona: 'ico-titolo ico-pagamento'
        },
        pago_rate: {
          nomeServizio: this.$i18n.t('bollo.pago.rate.titolo_servizio'),
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
          nomeServizio: 'Stampa avviso di pagamento e piano di rateizzazione',
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
        stampa_piano_rateizzazione: {
          nomeServizio: 'Stampa piano di rateizzazione',
          icona: 'ico-titolo ico-stampa-avviso'
        },
        verifica_pratica: {
          nomeServizio: this.$i18n.t('pratica.verifica.titolo_servizio'),
          icona: 'ico-titolo ico-verifica'
        },
        esenzioni_disabili: {
          nomeServizio: this.$i18n.t('pratica.esenzioni_disabili.titolo_servizio')
        },
        restituzione_tassa: {
          nomeServizio: this.$i18n.t('pratica.restituzione_tassa.titolo_servizio')
        },
        consulta_pratica_auth: {
          nomeServizio: this.$i18n.t('pratica.consulta_pratica_auth.titolo_servizio'),
          icona: 'ico-titolo ico-verifica'
        },
        visure: {
          nomeServizio: 'Area personale'
        },
        home: {
          nomeServizio: 'I servizi per il tuo veicolo'
        },
        area_personale: {
          nomeServizio: 'Area personale'
        },
        not_found: {
          nomeServizio: 'Pagina non trovata'
        },
        not_auth_service: {
          nomeServizio: 'Accesso negato ai servizi'
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
      switch (this.regione) {
        case 'piemonte':
          return '#007ACD'
        case 'vda':
          return '#be0004'
      }
    }
  }
}
</script>
