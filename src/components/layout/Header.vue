<template>
  <div class="sp-header">
    <v-app-bar
      :color="color"
      dark
      height="50px"
      id="main-menu"
      fixed
      scroll-target="#main-content"
      hide-on-scroll
    >
      <v-app-bar-nav-icon
      @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title v-if="regione === 'piemonte'">
        <v-btn
        text
        :to="{ name: 'home', path: '/' }"
        aria-label="Vai alla homepage di Tassa Auto">
        <v-img
          width="212"
          :src="require(`@/assets/images/loghi/${regione}/logo.png`)"
          :lazy-src="require(`@/assets/images/loghi/${regione}/logo.png`)"
        />
        </v-btn>
      </v-toolbar-title>
      <v-toolbar-title v-else>
        <v-btn
        text
        :to="{ name: 'home', path: '/' }"
        aria-label="Vai alla homepage di Tassa Auto">
        Tassa auto Valle d'Aosta
        </v-btn>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      id="main-menu-list"
    >
    <Menu />
    </v-navigation-drawer>
  </div>
</template>

<script>
import Menu from '@/components/layout/Menu'
import { REGIONE_PARAMS, REGIONE_ABILITATA } from '@/common/config'

export default {
  name: 'Header',
  components: { Menu },
  data () {
    return {
      appTitle: REGIONE_PARAMS.APP_TITLE,
      drawer: false,
      regione: REGIONE_ABILITATA,
      color: REGIONE_PARAMS.MAIN_COLOR
    }
  }
}
</script>
