<template>
  <div>
    <div class="pt-12" v-if="array">
      <div class="center-text mb-12">
        <h3 v-if="read">
          {{ $t("menu.area_personale.messaggi.letti") }}
        </h3>
        <h3 v-else>
          {{ $t("menu.area_personale.messaggi.da_leggere") }}
        </h3>
      </div>
      <h3 v-if="array.length == 0" class="text-center">
        {{ $t("menu.area_personale.messaggi.nessuno") }}
      </h3>
      <v-row>
        <v-col
          cols="12"
          v-for="(notifica, i) in array"
          :key="i"
          class="mx-auto notify-card"
        >
          <v-card :ripple="false" :id="notifica.id">
            <v-container>
              <v-row align="end">
                <v-col cols="12" class="pa-0">
                  <h3 class="title-vuetify mb-5">{{ notifica.titolo }}</h3>
                  <span class="tag-class"
                    >{{ notifica.tag.split(",")[0] }}
                  </span>
                  <p class="subtitle-date-vuetify mt-5">
                    Inviato:
                    {{ new Date(notifica.data) | dateFormat("DD/MM/YYYY") }}
                  </p>
                  <div v-if="notifica.contenuto.length > 200">
                    <p
                      class="body-notifica"
                      v-if="!readMore[notifica.id]"
                      v-html="
                        notifica.contenuto.substring(0, messageLength) + '..'
                      "
                    ></p>
                    <p
                      class="body-notifica"
                      v-else
                      v-html="notifica.contenuto"
                    ></p>
                    <v-btn
                      color="primary"
                      text
                      @click="showMore(notifica.id, notifica.contenuto.length)"
                      v-if="!readMore[notifica.id]"
                      :ripple="false"
                      class="px-0 read-moreLessBtn"
                      aria-label="espandi il messaggio"
                    >
                      {{ $t("menu.area_personale.messaggi.leggi_piu") }}
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      class="px-0 read-moreLessBtn"
                      @click="showLess(notifica.id)"
                      v-if="readMore[notifica.id]"
                      :ripple="false"
                      aria-label="riduci il messaggio"
                    >
                      {{ $t("menu.area_personale.messaggi.leggi_meno") }}
                    </v-btn>
                  </div>
                  <div v-else>
                    <p
                      class="body-notifica"
                      v-html="notifica.contenuto"
                    ></p>
                  </div>
                </v-col>
                <v-col cols="12" class="text-right pa-0 align-center">
                  <v-btn
                    v-if="!read"
                    color="primary"
                    class="mr-4 btn-read-msg d-none d-sm-inline"
                    :aria-label="'pulsante per segnare come già letto il messaggio ' + ( i + 1 )"
                    @click="readNotification(notifica.id)"
                    title="segna il messaggio come letto">
                    SEGNA COME LETTO
                  </v-btn>
                  <v-btn
                    v-if="!read"
                    icon
                    color="primary"
                    class="mr-4 btn-read-msg-icon d-inline d-sm-none"
                    :aria-label="'pulsante per segnare come già letto il messaggio ' + ( i + 1 )"
                    @click="readNotification(notifica.id)"
                    title="segna il messaggio come letto"
                    >
                    <span class="d-sr-only">Segna come letto</span>
                    <v-icon>mdi-comment-check</v-icon>
                  </v-btn>
                  <v-btn
                    color="primary"
                    :href="notifica.call_to_action"
                    target="_blank"
                    class="mr-4"
                    v-if="notifica.call_to_action"
                  >
                    {{ $t("menu.area_personale.messaggi.vai") }}
                  </v-btn>
                  <v-btn
                    text
                    icon
                    color="#484848"
                    @click="openDeleteConfirmationDialog(notifica.id)"
                    :aria-label="'elimina il messaggio ' + ( i + 1 )"
                  >
                    <v-icon class="icon-size-profilo btn-bin-delete"
                      >mdi-delete</v-icon
                    >
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog :value="openpopupDelete" max-width="500">
        <v-card>
          <v-card-title class="headline">{{
            $t("menu.area_personale.messaggi.desideri")
          }}</v-card-title>
          <v-card-text>{{
            $t("menu.area_personale.messaggi.scegli")
          }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="openpopupDelete = false"
              aria-label="annulla l'azione"
              depressed
              >{{ $t("menu.area_personale.messaggi.annulla") }}</v-btn
            >
            <v-btn
              color="primary"
              outlined
              depressed
              aria-label="conferma di cancellare il messaggio"
              @click="deleteMessage()"
              >{{ $t("menu.area_personale.messaggi.conferma") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { NOTIFICHE_LISTA_LETTE, NOTIFICHE_LISTA_NON_LETTE, MODIFICA_NOTIFICA, ELIMINA_NOTIFICA } from '@/store/actions.type'
export default {
  name: 'NotificaCard',
  props: {
    array: Array,
    read: Boolean,
    cf: String
  },
  data () {
    return {
      lengthText: 200,
      readMore: {},
      message_id_to_delete: null,
      openpopupDelete: false
    }
  },
  computed: {
    messageLength () {
      return this.lengthText
    }
  },
  methods: {
    showMore (id, length) {
      this.lengthText = length
      this.$set(this.readMore, id, true)
    },
    showLess (id) {
      this.lengthText = 200
      this.$set(this.readMore, id, false)
    },
    openDeleteConfirmationDialog (id) {
      this.openpopupDelete = true
      this.message_id_to_delete = id
    },
    async readNotification (id) {
      this.$emit('controlspinner', { running: true })
      await this.$store
        .dispatch(MODIFICA_NOTIFICA, { id: id, cf: this.cf })
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          console.log(error)
          this.$emit('controlspinner', { running: false })
        })
    },
    async deleteMessage () {
      this.openpopupDelete = false
      this.$emit('controlspinner', { running: true })
      await this.$store
        .dispatch(ELIMINA_NOTIFICA, { cf: this.cf, id: this.message_id_to_delete, read: this.read })
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          console.log(error)
          this.$emit('controlspinner', { running: false })
        })
      this.message_id_to_delete = false
      await this.$store
        .dispatch(NOTIFICHE_LISTA_NON_LETTE, this.$store.getters.userIdentity.cf)
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          console.log(error, ' errore')
          this.$emit('controlspinner', { running: false })
        })
      this.$emit('controlspinner', { running: true })
      await this.$store.dispatch(NOTIFICHE_LISTA_LETTE, this.$store.getters.userIdentity.cf)
        .then(() => {
          this.$emit('controlspinner', { running: false })
        })
        .catch((error) => {
          console.log(error, ' errore')
          this.$emit('controlspinner', { running: false })
        })
    }
  }
}
</script>
