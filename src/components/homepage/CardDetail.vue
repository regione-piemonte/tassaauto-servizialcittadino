<template>
  <div class="d-flex w-100 h-100">
    <v-card class="bg-ico card-home-page" v-if="configCard(codice)"
      :class="
        !logged && authTags(tags[0])
        ? 'disabled-card'
        : ''
    ">
      <v-card-title class="homeLinkBtn">
        <v-btn
          class="homeIcon"
          :title="'vai al servizio ' + $t(configCard(codice).main_title)"
          :class="codice"
          :ripple="false"
          text
          :to="{ name: configCard(codice).links.main_service }"
        >
          <h4 v-html="$t(configCard(codice).main_title)"></h4>
        </v-btn>
      </v-card-title>
      <v-card-text
        v-if="configCard(codice).subtitle"
        class="card-text"
        v-html="$t(configCard(codice).subtitle)"
      ></v-card-text>
      <template v-if="configCard(codice).links.sub_service">
        <ul class="textual pa-0 mt-2">
          <p class="d-sr-only">elenco servizi in {{$t(configCard(codice).main_title)}}</p>
          <li
            v-for="(n, index) of Max_Items_Number" :key="index"
            class="pa-0"
          >
            <v-btn
              :ripple="false"
              text
              :title="'vai al servizio ' + $t(configCard(codice).list_service['item_0' + n])"
              v-if="configCard(codice).links.sub_service['link' + n] && voceAttiva(tags, n - 1)"
              :disabled="!logged && servizioTag(tags[index])"
              :to="{ name: configCard(codice).links.sub_service['link' + n] }"
              class="font-weight-bold pa-0"
              ><span
                v-html="$t(configCard(codice).list_service['item_0' + n])"
              ></span>

              <template v-if="!logged && servizioTag(tags[index])">
                <v-col cols="auto"></v-col>
                <v-col cols="auto" class="pl-0">
                  <v-img
                    width="14px"
                    :src="
                      require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
                    "
                    :lazy-src="
                      require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
                    "
                  />
                </v-col>
              </template>
            </v-btn>
          </li>
        </ul>
      </template>
      <template v-else-if="!configCard(codice).links.sub_service && configCard(codice).list_service">
        <p class="d-sr-only">elenco servizi in {{$t(configCard(codice).main_title)}}</p>
        <ul class="textual pa-0 mt-8">
          <li v-for="(n, index) of Max_Items_Number" :key="index">
            <v-row>
              <v-col cols="auto" class="py-0 mb-3">
                <p v-if="voceAttiva(tags, n - 1)" v-html="$t(configCard(codice).list_service['item_0' + n])" :class="(!logged && servizioTag(tags[index])) ? '' : 'font-weight-bold'"></p>
              </v-col>
              <v-col cols="auto" v-if="!logged && servizioTag(tags[index])" class="py-0">
                <v-img
                    width="14px"
                    :src="
                      require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
                    "
                    :lazy-src="
                      require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
                    "
                  />
              </v-col>
            </v-row>
          </li>
        </ul>
      </template>
      <v-row align-content="center" justify="end" class="auth-serviceHome">
        <template v-if="logged">
          <v-col cols="auto" class="pl-0">
            <v-btn icon text :ripple="false">
              <v-icon
                color="yellow"
                v-if="servizioPreferito(codice)"
                @click="eliminaPreferito(codice)"
                :aria-label="$t(configCard(codice).main_title) + ' aggiunto all\'elenco dei servizi preferiti'"
              >
                <template>mdi-star</template>
              </v-icon>
              <v-icon
                color="grey"
                v-else @click="aggiungiPreferito(codice)"
                :aria-label="$t(configCard(codice).main_title) + ' non è presente nell\'elenco dei servizi preferiti'">
                <template>mdi-star-outline</template>
              </v-icon>
            </v-btn>
          </v-col>
        </template>
        <template v-else-if="!logged && cardAutenticata(tags)">
          <v-col cols="auto">Accedi per usufruire del servizio</v-col>
          <v-col cols="auto" class="pl-0">
            <v-img
              width="14px"
              :src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
              :lazy-src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
            />
          </v-col>
        </template>
      </v-row>
    </v-card>
    <v-card align="center" justify="center" class="bg-ico bg-ico-aiuto" v-else-if="codice === 'AIUTO'">
      <v-img
        class="mb-2"
        width="64"
        :src="require('@/assets/images/icone/home/aiuto.svg')"
        alt
        fluid
      />

      <v-card-title class="homeLinkBtn">
        <v-btn
          aria-label="vai alla pagina di contatti di Tassa Auto"
          title="pagina contatti di Tassa Auto"
          class="special-card"
          :ripple="false"
          text
          :to="{ name: 'contatti_aiuto' }"
          rel="help"
        >
          <h4>Hai bisogno di aiuto?</h4>
        </v-btn>
      </v-card-title>
      <v-card-text
        >Ti serve assistenza alle procedure o devi richiedere delle
        informazioni? visualizza la pagina dedicata.</v-card-text
      >
    </v-card>
  </div>

</template>

<script>
import store from '@/store'
import { COMMON_SERVIZI_PREFERITI, COMMON_MODIFICA_SERVIZI_PREFERITI, COMMON_ELIMINA_SERVIZI_PREFERITI } from '@/store/actions.type'
import { descrizioniLinkServizio, servizioAuth, servizioAttivo } from '@/common/config'
import { mapGetters } from 'vuex'
export default {
  name: 'CardDetail',
  props: {
    codice: String,
    id: Number,
    tags: Array
  },
  data () {
    return {
      Max_Items_Number: 7
    }
  },
  computed: {
    ...mapGetters([
      'commonElencoServiziPreferiti',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    voceAttiva (list, index) {
      return servizioAttivo(list[index])
    },
    cardAutenticata (array) {
      const listBoolean = []
      for (const item of array) {
        if (servizioAuth(item) === true) {
          listBoolean.push('autenticato')
        } else {
          listBoolean.push('nonAutenticato')
        }
      }
      return listBoolean.includes('autenticato')
    },
    servizioTag (item) {
      let isLocked = null
      if (servizioAuth(item) === true) {
        isLocked = true
      } else {
        isLocked = false
      }
      return isLocked
    },
    configCard (nome) {
      return descrizioniLinkServizio(nome)
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
    authTags (tag) {
      switch (tag) {
        case 'rateizzazione':
          return true
        case 'esenzioni_disabili':
          return true
        case 'restituzione_tassa':
          return true
        case 'visure':
          return true
        default:
          return false
      }
    },
    async aggiungiPreferito (codice) {
      this.$emit('controlspinner', { running: true })
      await store
        .dispatch(COMMON_MODIFICA_SERVIZI_PREFERITI, { cf: this.$store.getters.userIdentity.cf, codice: codice })
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          console.log(error, ' errore')
        })
      await store
        .dispatch(COMMON_SERVIZI_PREFERITI, this.$store.getters.userIdentity.cf)
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          console.log(error, ' errore')
        })
    },
    async eliminaPreferito (codice) {
      await store
        .dispatch(COMMON_ELIMINA_SERVIZI_PREFERITI, { cf: this.$store.getters.userIdentity.cf, codice: codice })
        .then(() => {
        })
        .catch((error) => {
          console.log(error)
        })
      await store
        .dispatch(COMMON_SERVIZI_PREFERITI, this.$store.getters.userIdentity.cf)
        .then(() => {
        })
        .catch((error) => {
          console.log(error, ' errore')
        })
    }
  }
}
</script>
