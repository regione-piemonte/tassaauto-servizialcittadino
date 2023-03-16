<template>
  <div class="background-light-grey" id="page-notifiche">
    <NotificaCard
      :array="mostraAltreNonLette"
      :read="false"
      v-if="notificheListaNonLette"
      :cf="userIdentity.cf"
    />
    <v-btn
      v-if="mostraAltreNonLette < notificheListaNonLette"
      @click="listLength += 5"
      color="primary"
      title="sono presenti ulteriori notifiche"
      class="mt-12">
      Visualizza altri messaggi
      </v-btn>
    <NotificaCard
      :array="mostraAltreLette"
      :read="true"
      v-if="notificheListaLette"
      :cf="userIdentity.cf"
      v-on:controlspinner="overlay = $event.running"
    />
    <v-btn
      v-if="mostraAltreLette < notificheListaLette"
      @click="listLength += 5"
      color="primary"
      title="sono presenti ulteriori notifiche"
      class="mt-12">
      Visualizza altri messaggi
    </v-btn>
    <div class="text-center">
      <v-bottom-sheet v-model="sheet" inset>
        <v-sheet class="text-center" height="100px">
          <div class="sheet">
            <span class="float-left">{{
              $t("menu.area_personale.messaggi.no_altri")
            }}</span>
            <v-btn
              class="float-right"
              color="primary"
              @click="sheet = !sheet"
              >{{ $t("menu.area_personale.messaggi.chiudi") }}</v-btn
            >
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import Spinner from '@/components/layout/Spinner'
import NotificaCard from '@/components/homepage/NotificaCard'
import { mapGetters } from 'vuex'
export default {
  name: 'Notifiche',
  components: {
    Spinner,
    NotificaCard
  },
  data () {
    return {
      overlay: false,
      sheet: false,
      listLength: 5
    }
  },

  computed: {
    ...mapGetters([
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost',
      'notificheListaNonLette',
      'notificheListaLette'
    ]),
    total_messages_unread () {
      return this.notificheListaNonLette.length
    },
    total_messages_read () {
      return this.notificheListaLette.length
    },
    mostraAltreNonLette () {
      return this.notificheListaNonLette.slice(0, this.listLength)
    },
    mostraAltreLette () {
      return this.notificheListaLette.slice(0, this.listLength)
    }
  },

  methods: {
    getMore () {
      if (this.listLength >= this.notificheListaLette.length) {
        this.sheet = true
        setTimeout(() => {
          this.sheet = false
        }, 2000)
      } else {
        this.listLength += 3
      }
    }
  }
}
</script>
