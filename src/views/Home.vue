<template>
  <div class="home-page">
    <titolo-servizio :servizio="servizio" />
    <v-container id="homePage-gridCard">
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <ErrorHome />
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <Avviso />
        </v-col>
      </v-row> -->
      <template v-if="logged">
        <AreaPersonale />
      </template>
      <template v-else>
        <CardList />
      </template>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AreaPersonale from '@/components/homepage/AreaPersonale'
import CardList from '@/components/homepage/CardList'
import ErrorHome from '@/components/ErrorHome'
import TitoloServizio from '@/components/layout/TitoloServizio'
import Avviso from '@/components/Avviso'
export default {
  components: {
    AreaPersonale,
    CardList,
    ErrorHome,
    TitoloServizio,
    Avviso
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['isUserLogged', 'userIdentity', 'isUserLoggedLocalhost']),
    servizio () {
      return this.logged ? 'area_personale' : 'home'
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  }
}
</script>
