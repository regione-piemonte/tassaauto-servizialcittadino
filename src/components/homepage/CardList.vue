<template>
  <v-row class="mt-6">
    <template v-for="service in services">
      <v-col
        cols="12"
        md="6"
        :lg="lg"
        xs="12"
        class="d-flex"
        :key="service.id"
        v-if="cardAttiva(service.tags) && serviceAuthList(service.displayAuth)"
      >
        <CardDetail
          v-bind="service"
          v-on:controlspinner="overlay = $event.running">
        </CardDetail>
      </v-col>
    </template>
    <spinner :pOverlay="overlay" />
  </v-row>
</template>
<script>
import CardDetail from '@/components/homepage/CardDetail'
import store from '@/store'
import { COMMON_SERVIZI_PREFERITI } from '@/store/actions.type'
import { ORDINE_SERVIZI, servizioAttivo } from '@/common/config'
import { mapGetters } from 'vuex'
import Spinner from '@/components/layout/Spinner'
export default {
  name: 'CardList',
  props: {
    prefs: Boolean
  },
  components: {
    CardDetail,
    Spinner
  },
  data () {
    return {
      servizi: ORDINE_SERVIZI,
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost',
      'commonElencoServiziPreferiti'
    ]),
    lg () {
      return this.prefs ? 6 : 4
    },
    services () {
      return this.prefs && this.commonElencoServiziPreferiti.length > 0 ? this.servizi.filter(x => this.servizioPreferito(x.codice)) : this.servizi
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    cardAttiva (array) {
      const listBoolean = []
      for (const item of array) {
        if (servizioAttivo(item) === true) {
          listBoolean.push('attivo')
        } else {
          listBoolean.push('nonAttivo')
        }
      }
      return listBoolean.includes('attivo')
    },
    servizioPreferito (codice) {
      if (this.commonElencoServiziPreferiti.length > 0) {
        let isPref = null
        for (const pref of this.commonElencoServiziPreferiti) {
          if (pref.codice === codice) {
            isPref = true
            break
          } else {
            isPref = false
          }
        }
        return isPref
      } else {
        return false
      }
    },
    serviceAuthList (codice) {
      if (this.logged) {
        return codice
      } else return true
    }
  },
  async created () {
    if (this.logged) {
      this.overlay = true
      await store
        .dispatch(COMMON_SERVIZI_PREFERITI, this.$store.getters.userIdentity.cf)
        .then(() => {
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          console.log(error, ' errore')
        })
    }
  }
}
</script>
