<template>
  <div class="tab-transparent areaPersonale--page">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-tabs
          :value="tabs"
          centered
          class="areapersonale--tab"
          show-arrows
        >
          <v-tab @click="vai(0)">
            <v-icon class="mr-2">mdi-view-dashboard</v-icon>
            {{ $t("menu.area_personale.bacheca") }}
          </v-tab>
          <v-tab @click="vai(1)">
            <v-icon class="mr-2">mdi-hammer-screwdriver</v-icon>
            {{ $t("menu.area_personale.servizi") }}
          </v-tab>
          <v-tab @click="vai(2)">
            <v-icon class="mr-2">mdi-bell</v-icon>
            {{ $t("menu.area_personale.notifiche") }}
          </v-tab>
        </v-tabs>
        <v-tabs-items :value="tabs" class="mt-12 px-4 pb-4">
          <v-tab-item>
            <v-card class="mb-12 mydata--card pa-3 pa-md-12">
              <h3 class="mb-6 mt-5 mt-md-0">
                {{ $t("menu.area_personale.i_miei_veicoli") }}
              </h3>
              <v-card-text>
                <ElencoVeicoli v-on:controlspinner="overlay = $event.running" />
              </v-card-text>
            </v-card>
            <v-card class="mb-12 mydata--card pa-3 pa-md-12">
              <h3 class="mb-6 mt-5 mt-md-0">{{ $t("menu.area_personale.i_miei_dati") }}</h3>
              <DatiContribuente />
            </v-card>
            <v-card class="mb-12 mydata--card pa-3 pa-md-12">
              <h3 class="mb-6 mt-5 mt-md-0">{{ $t("menu.area_personale.servizi_preferiti") }}</h3>
              <p v-html="$t('menu.area_personale.servizi_preferiti_sub')">
              </p>
              <CardList :prefs="true" />
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <CardList :prefs="false" />
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <Notifiche />
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <spinner :pOverlay="overlay" />
  </div>
</template>
<script>
import DatiContribuente from '@/components/homepage/DatiContribuente'
import Notifiche from '@/components/homepage/Notifiche'
import ElencoVeicoli from '@/components/veicoli/ElencoVeicoli'
import Spinner from '@/components/layout/Spinner'
import CardList from '@/components/homepage/CardList'
import store from '@/store'
import { NOTIFICHE_LISTA_NON_LETTE, NOTIFICHE_LISTA_LETTE, TAB_AREA_PERSONALE } from '@/store/actions.type'
import { mapGetters } from 'vuex'
export default {
  name: 'AreaPersonale',
  components: {
    CardList,
    ElencoVeicoli,
    Notifiche,
    DatiContribuente,
    Spinner
  },
  data () {
    return {
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'tabAreaPersonale'
    ]),
    tabs () {
      return this.tabAreaPersonale ? this.tabAreaPersonale : 0
    }
  },
  methods: {
    async vai (tab) {
      this.overlay = true
      await store
        .dispatch(TAB_AREA_PERSONALE, tab)
        .then(() => {
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          console.log(error, ' errore')
        })
    }
  },
  async created () {
    this.overlay = true
    await store
      .dispatch(NOTIFICHE_LISTA_NON_LETTE, this.$store.getters.userIdentity.cf)
      .then(() => {
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
    this.overlay = true
    await store.dispatch(NOTIFICHE_LISTA_LETTE, this.$store.getters.userIdentity.cf)
      .then(() => {
        this.overlay = false
      })
      .catch((error) => {
        console.log(error, ' errore')
        this.overlay = false
      })
  }
}
</script>
