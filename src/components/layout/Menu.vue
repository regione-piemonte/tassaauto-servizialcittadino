<template>
  <div>
    <div
    v-if="regione === 'piemonte'"
    class="title-main-menu">
      <h2 class="mb-0 border-none">Tassa Auto Piemonte</h2>
    </div>
    <v-list
    nav
    dense
    class="main-menu-left-offcanvas">
    <v-list-item-group
      active-class="primary--text text--accent-4"
    >
    <v-list-item tabindex="-1"
      v-for="item in items"
      :key="item.title"
      link
      >

        <v-list-item-content
          :class="(regione != 'piemonte') ? '' : item.icon"
          @click="vaiA(item.action)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        class="menuIcon servizi_accesso_autenticato" tabindex="-1"
        :href="areaRiservata"
        link
        target="_blank"
        v-if="voceAttiva('area_riservata')"
      >
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.titoli.voce_12') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
  <div
  v-if="regione === 'piemonte'"
  class="footer-main-menu">
    <div class="app-row w-100">
      <div class="offset-9 col-3">
        <a href="#" target="_blank" class="link-piemonte-tu">SCOPRI</a>
      </div>
    </div>

  </div>
  </div>
</template>

<script>
import { servizioAttivo, AUTH_AREA_URL, REGIONE_ABILITATA } from '@/common/config'
import RoutingService from '@/common/routing.service'
export default {
  name: 'Menu',
  data () {
    return {
      areaRiservata: AUTH_AREA_URL,
      items: [],
      drawer: false,
      regione: REGIONE_ABILITATA
    }
  },
  methods: {
    vaiA (pagina) {
      (this.$route.name === pagina) ? this.$router.go() : this.$router.push({ name: pagina })
    },
    voceAttiva (nome) {
      return servizioAttivo(nome)
    }
  },

  async mounted () {
    this.items.push({ title: this.$i18n.t('menu.titoli.voce_00'), icon: 'menuIcon home', action: 'home' })
    if (servizioAttivo('memo_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_01'), icon: 'menuIcon memobollo', action: 'cerca_veicolo_memo' })
    }
    if (servizioAttivo('pago_bollo') || servizioAttivo('pago_rate')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_02'), icon: 'menuIcon pagamenti_online', action: RoutingService.nomeRouteInizioPag() })
    }
    if (servizioAttivo('ricevuta_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_03'), icon: 'menuIcon scarica_ricevuta_pagamento', action: 'cerca_pagamento' })
    }
    if (servizioAttivo('calcolo_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_04'), icon: 'menuIcon calcola_bollo', action: 'calcolo_importo' })
    }
    if (servizioAttivo('osservazione_avviso_scadenza') || servizioAttivo('osservazione_avviso_accertamento')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_05'), icon: 'menuIcon osservazioni', action: RoutingService.nomeRouteInizioOss() })
    }
    if (servizioAttivo('verifica_pratica')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_06'), icon: 'menuIcon consulta_pratica', action: 'cerca_pratica' })
    }
    if (servizioAttivo('rateizzazione')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_07'), icon: 'menuIcon chiedi_rateizzazione', action: 'richiesta_rateizzazione' })
    }
    if (servizioAttivo('domanda_discarico_rimborso')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_08'), icon: 'menuIcon domanda_discarico_rimborso', action: 'richiesta_domanda_discarico_rimborso' })
    }
    if (servizioAttivo('info_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_09'), icon: 'menuIcon infobollo', action: 'verifica_attivazione_info' })
    }
    if (servizioAttivo('stampa_avviso_accertamento') || servizioAttivo('stampa_avviso_scadenza')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_10'), icon: 'menuIcon stampa_avviso_pagamento', action: RoutingService.nomeRouteInizioStampa() })
    }
    if (servizioAttivo('contatti_aiuto')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_11'), icon: 'menuIcon aiuto', action: 'contatti_aiuto' })
    }
  }
}
</script>
