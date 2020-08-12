<template>
  <v-app>
    <vue-headful
      lang="it"
      :title="headTitle"
    />
    <div :class="(this.$route.name !== 'home') ? 'footer-fix' : 'footer-fix footer-fixHome'">
    <Header />
    <main id="main-content" aria-relevant="text">
      <csi-app-bootstrap>
        <router-view />
      </csi-app-bootstrap>
    </main>
  </div>
  <Footer />
  </v-app>
</template>

<script>
import Vue from 'vue'
import vueHeadful from 'vue-headful'
import { REGIONE_PARAMS } from '@/common/config'
import CsiAppBootstrap from '@/components/global/common/CsiAppBootstrap'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

Vue.component('vue-headful', vueHeadful)

export default {
  name: 'App',
  components: { CsiAppBootstrap, Header, Footer },
  data () {
    return {
      headTitle: REGIONE_PARAMS.HEAD_TITLE
    }
  }
}
</script>
