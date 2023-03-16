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
        class="main-burger-menu"
        @click.prevent="drawer = !drawer"
        aria-label="Menù principale di Tassa Auto"
        title="Apri il menù di Tassa Auto"
      >
      </v-app-bar-nav-icon>

      <v-toolbar-title v-if="regione === 'piemonte'">
        <v-btn
          depressed
          class="logo-header"
          text
          :to="{ name: 'home', path: '/' }"
          aria-label="Vai alla homepage di Tassa Auto"
          title="Vai alla homepage di Tassa Auto"
        >
          <v-img
            class="img-logo-header"
            :src="require(`@/assets/images/loghi/${regione}/logo.png`)"
            :lazy-src="require(`@/assets/images/loghi/${regione}/logo.png`)"
          />
        </v-btn>
      </v-toolbar-title>
      <v-toolbar-title v-else>
        <v-btn
          depressed
          class="logo-header"
          text
          :to="{ name: 'home', path: '/' }"
          aria-label="Vai alla homepage di Tassa Auto"
        >
          Tassa auto Valle d'Aosta
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="!logged && regione === 'piemonte'" class="btnLogin">
        <v-btn
          id="btnLogin"
          depressed
          outlined
          color="primary"
          class="btn-Login"
          @click="onLogin()"
          aria-label="Accedi all'area riservata di Tassa Auto Piemonte"
        >
          <v-icon>mdi-account-circle</v-icon>
          <span class="d-none d-sm-block text-loginBtn ml-1">Accedi</span>
        </v-btn>
      </div>
      <div v-else-if="regione === 'piemonte'" class="notifyIcon mr-3 mr-md-5">
        <v-row align="center">
          <v-col cols="6" sm="auto">
            <div class="notifyIcon">
              <v-btn
                icon
                @click.stop="right = !right"
                v-if="notificheListaNonLette"
                :aria-label="(notificheListaNonLette.length > 0) ? 'ci sono nuovi messaggi da leggere: ' + notificheListaNonLette.length : 'non ci sono nuovi messaggi da leggere'"
                :title="(notificheListaNonLette.length > 0) ? 'Ci sono nuovi messaggi da leggere: ' + notificheListaNonLette.length : 'Non ci sono nuovi messaggi da leggere'"
              >
                <v-badge color="#B60000" overlap right>
                  <template v-slot:badge>
                    {{ notificheListaNonLette.length }}
                  </template>
                  <v-icon class="blue-icon campanellina">mdi-bell</v-icon>
                </v-badge>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="6" sm="auto">
            <div class="userInfo">
              <v-menu
                offset-y
                offset-x
                class="menuUserLogin"
                :position-y="55"
                absolute
              >
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-btn
                      fab
                      class="btnPrimary loginBtnMenu ml-1"
                      x-small
                      depressed
                      id="userIsLogged"
                      :aria-label="'menù utente di ' + userIdentity.nome + ' ' + userIdentity.cognome"
                      title="Apri il menù utente"
                    >
                      {{ userIdentity.nome.substring(0, 1)
                      }}{{ userIdentity.cognome.substring(0, 1) }}
                    </v-btn>
                  </div>
                </template>
                <v-list class="logOutBtnCard">
                  <v-list-item-group>
                    <v-list-item @click.prevent="onLogout">
                      <v-btn
                        text
                        aria-label="esci dall'area autenticata di Tassa Auto"
                        class="btnLogout"
                        title="Esci dall'Area Autenticata di Tassa Auto"
                        block
                      >
                        <v-icon left>mdi-logout</v-icon> Esci
                      </v-btn>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed temporary id="main-menu-list">
      <Menu />
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="right"
      fixed
      right
      temporary
      id="menu-list-notify"
      @click="!right"
    >
      <div>
        <div class="title-main-menu">
          <h2 class="my-0 border-none">Notifiche</h2>
        </div>
        <v-list nav dense class="main-menu-left-offcanvas">
          <v-list-item-group aria-label="Elenco notifiche non lette">
            <v-list-item
              v-for="(item, index) in notificheListaNonLette"
              :key="index"
              :ripple="false"
              inactive
              :id="item.id"
              class="notify-list notify--notread single-notify"
            >
              <v-list-item-content>
                <h3>
                  {{ item.titolo }}
                </h3>
                <v-list-item-subtitle class="tagName">
                  {{ item.tag.split(",")[0] }}
                </v-list-item-subtitle>
                <div v-if="item.contenuto.length > 200">
                  <p
                    v-if="!readMore[item.id]"
                    v-html="item.contenuto.substring(0, messageLength) + '..'"
                    class="body-message"
                  ></p>
                  <p v-else v-html="item.contenuto" class="body-message"></p>
                  <v-btn
                    color="primary"
                    text
                    @click="showMore(item.id, item.contenuto.length)"
                    v-if="!readMore[item.id]"
                    :ripple="false"
                    class="px-0 read-moreLessBtn my-2"
                    aria-label="espandi il messaggio"
                  >
                    {{ $t("menu.area_personale.messaggi.leggi_piu") }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    class="px-0 read-moreLessBtn my-2"
                    aria-label="riduci il messaggio"
                    @click="showLess(item.id)"
                    v-if="readMore[item.id]"
                    :ripple="false"
                  >
                    {{ $t("menu.area_personale.messaggi.leggi_meno") }}
                  </v-btn>
                </div>
                <div v-else>
                  <p v-html="item.contenuto" class="body-message"></p>
                </div>
                <p class="subtitle-date-vuetify">
                  {{ new Date(item.data) | dateFormat("DD MMM YYYY hh:mm") }}
                </p>
                <div class="text-right">
                  <v-btn @click="seeAllAlert" small color="primary" :aria-label="'vai alla pagina della notifica' + item.titolo">
                    vai
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div class="text-center my-5">
          <v-btn @click="seeAllAlert" text color="primary" aria-label="vedi tutte le notifiche"> vedi tutte </v-btn>
        </div>
      </div>
    </v-navigation-drawer>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Spinner from '@/components/layout/Spinner'
import Menu from '@/components/layout/Menu'
import { REGIONE_PARAMS, REGIONE_ABILITATA } from '@/common/config'
import { login, logout } from '@/common/session'
import store from '@/store'
import { TAB_AREA_PERSONALE } from '@/store/actions.type'

export default {
  name: 'Header',
  components: { Menu, Spinner },
  data () {
    return {
      appTitle: REGIONE_PARAMS.APP_TITLE,
      drawer: false,
      right: false,
      regione: REGIONE_ABILITATA,
      color: REGIONE_PARAMS.MAIN_COLOR,
      overlay: false,
      lengthText: 200,
      readMore: {}
    }
  },
  computed: {
    ...mapGetters(['isUserLogged', 'userIdentity', 'isUserLoggedLocalhost', 'notificheListaNonLette']),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    messageLength () {
      return this.lengthText
    }
  },
  methods: {
    onLogin () {
      login()
    },
    onLogout () {
      logout()
    },
    showMore (id, length) {
      this.lengthText = length
      this.$set(this.readMore, id, true)
    },
    showLess (id) {
      this.lengthText = 200
      this.$set(this.readMore, id, false)
    },
    async seeAllAlert () {
      this.overlay = true
      await store
        .dispatch(TAB_AREA_PERSONALE, 2)
        .then(() => {
          this.overlay = false
          this.right = !this.right
          if (this.$router.currentRoute.name !== 'home') {
            this.$router.push({ name: 'home' })
          } else {
            window.scrollTo(0, 0)
          }
        })
        .catch((error) => {
          console.log(error + ' errore')
          if (
            error.name !== 'NavigationDuplicated' &&
            !error.message.includes(
              'Avoided redundant navigation to current location'
            )
          ) {
            console.log('stessa rotta')
          }
        })
    },
    keyDownHandler (event) {
      if (event.code === 'Escape') {
        this.drawer = false
        this.right = false
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyDownHandler)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDownHandler)
  }
}
</script>
