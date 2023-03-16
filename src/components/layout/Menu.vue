<template>
  <div>
    <div v-if="regione === 'piemonte'" class="title-main-menu">
      <h2 class="my-0 border-none">Tassa Auto Piemonte</h2>
    </div>
    <v-list nav dense class="main-menu-left-offcanvas" aria-label="Menù principale di Tassa Auto Piemonte">
      <v-list-item-group active-class="primary--text text--accent-4" role="none">
        <v-list-item
        v-for="(item, n) in items" :key="n" link @click.prevent="(item.auth && !logged) ? '' : vaiA(item.action)"
        :aria-label="(item.auth && !logged) ? item.title + ' Accesso al servizio previa autenticazione' : item.title"
        :title="(item.auth && !logged) ? item.title + ' Accesso al servizio previa autenticazione' : item.title"
        :id="item.id"
        role="button"
        >
          <v-list-item-content
            :class="(item.auth && !logged) ? 'cursor-pointer-off ' + item.icon : '' + item.icon"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon
          v-if="item.auth"
          class="align-center" :class="(item.auth && !logged) ? 'cursor-pointer-off' : ''">
            <v-img
              v-if="!logged"
              position="center"
              max-height="15px"
              max-width="12px"
              alt="Accedi per usufruire del servizio"
              :src="require(`@/assets/images/icone/servizi_accesso_auth.svg`)"
              :lazy-src="require(`@/assets/images/icone/servizi_accesso_auth.svg`)"
            />
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div v-if="regione === 'piemonte'" class="footer-main-menu">
      <div class="row">
        <div class="offset-9 col-3 pa-0">
          <a :href="(logged) ? piemonteTuUrlLogged : piemonteTuUrl" target="_blank" class="link-piemonte-tu">SCOPRI</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { servizioAttivo, REGIONE_ABILITATA, PIEMONTE_TU_URL, PIEMONTE_TU_URL_LOGGED, servizioAuth } from '@/common/config'
import RoutingService from '@/common/routing.service'
export default {
  name: 'Menu',
  data () {
    return {
      items: [],
      drawer: false,
      regione: REGIONE_ABILITATA,
      piemonteTuUrl: PIEMONTE_TU_URL,
      piemonteTuUrlLogged: PIEMONTE_TU_URL_LOGGED
    }
  },
  computed: {
    ...mapGetters(['isUserLogged', 'isUserLoggedLocalhost']),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    vaiA (pagina) {
      (this.$route.name === pagina) ? this.$router.go() : this.$router.push({ name: pagina })
    },
    voceAttiva (nome) {
      return servizioAttivo(nome)
    },
    cardAutenticata (nome) {
      if (!this.isUserLogged) return servizioAuth(nome)
    }
  },

  async mounted () {
    this.items.push({ id: 'home-button', title: this.$i18n.t('menu.titoli.voce_00'), icon: 'menuIcon home', action: 'home' })
    if (servizioAttivo('memo_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_01'), icon: 'menuIcon memobollo', action: 'cerca_veicolo_memo', auth: this.cardAutenticata('memo_bollo') })
    }
    if (servizioAttivo('pago_bollo') || servizioAttivo('pago_rate')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_02'), icon: 'menuIcon pagamenti_online', action: RoutingService.nomeRouteInizioPag(), auth: this.cardAutenticata('pago_bollo') || this.cardAutenticata('pago_rate') })
    }
    if (servizioAttivo('ricevuta_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_03'), icon: 'menuIcon scarica_ricevuta_pagamento', action: 'cerca_pagamento', auth: this.cardAutenticata('ricevuta_bollo') })
    }
    if (servizioAttivo('calcolo_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_04'), icon: 'menuIcon calcola_bollo', action: 'calcolo_importo', auth: this.cardAutenticata('calcolo_bollo') })
    }
    if (servizioAttivo('osservazione_avviso_scadenza') || servizioAttivo('osservazione_avviso_accertamento')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_05'), icon: 'menuIcon osservazioni', action: RoutingService.nomeRouteInizioOss(), auth: this.cardAutenticata('osservazione_avviso_scadenza') || this.cardAutenticata('osservazione_avviso_accertamento') })
    }
    if (servizioAttivo('verifica_pratica')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_06'), icon: 'menuIcon consulta_pratica', action: 'cerca_pratica', auth: this.cardAutenticata('verifica_pratica') })
    }
    if (servizioAttivo('rateizzazione')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_07'), icon: 'menuIcon chiedi_rateizzazione', action: 'richiesta_rateizzazione', auth: this.cardAutenticata('rateizzazione') })
    }
    if (servizioAttivo('domanda_discarico_rimborso')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_08'), icon: 'menuIcon domanda_discarico_rimborso', action: 'richiesta_domanda_discarico_rimborso', auth: this.cardAutenticata('domanda_discarico_rimborso') })
    }
    if (servizioAttivo('info_bollo')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_09'), icon: 'menuIcon infobollo', action: 'verifica_attivazione_info', auth: this.cardAutenticata('info_bollo') })
    }
    if (servizioAttivo('stampa_avviso_accertamento') || servizioAttivo('stampa_avviso_scadenza')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_10'), icon: 'menuIcon stampa_avviso_pagamento', action: RoutingService.nomeRouteInizioStampa(), auth: this.cardAutenticata('stampa_avviso_accertamento') || this.cardAutenticata('stampa_avviso_scadenza') })
    }
    if (servizioAttivo('esenzioni_disabili')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_13'), icon: 'menuIcon domanda_esenzioni_disabilita_auth', action: 'inserimento_domanda_esenzione', auth: this.cardAutenticata('esenzioni_disabili') })
    }
    // consulta pratica auth
    // if (servizioAttivo('consulta_pratica_auth')) {
    //   this.items.push({ title: this.$i18n.t('menu.titoli.voce_14'), icon: 'menuIcon consulta_pratica_auth', action: 'verifica_pratica_auth', auth: this.cardAutenticata('consulta_pratica_auth') })
    // }
    if (servizioAttivo('restituzione_tassa')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_15'), icon: 'menuIcon restituzione_tassa', action: 'inserimento_domanda_restituzione', auth: this.cardAutenticata('restituzione_tassa') })
    }
    // if (servizioAttivo('visure')) {
    //   this.items.push({ title: this.$i18n.t('menu.titoli.voce_16'), icon: 'menuIcon visure', action: 'elenco_veicoli_visure', auth: this.cardAutenticata('visure') })
    // }
    if (servizioAttivo('contatti_aiuto')) {
      this.items.push({ title: this.$i18n.t('menu.titoli.voce_11'), icon: 'menuIcon aiuto', action: 'contatti_aiuto', auth: this.cardAutenticata('contatti_aiuto') })
    }
  }
}
</script>
