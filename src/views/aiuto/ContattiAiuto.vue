<template>
  <div>
    <pagina-servizio
      :servizio="servizio"
    />
    <v-container class="helpPage">
      <v-row>
        <v-col cols="12" class="mx-auto px-lg-16">
          <v-card class="pa-lg-16">
            <v-card-text>
              <v-row>
                <v-col cols="12" lg="3" xl="4" offset-lg="1">
                  <v-img
                    width="178"
                    :src="require('@/assets/images/ritagli/servizi/aiuto.svg')"
                    alt=""
                    fluid/>
                </v-col>
                <v-col cols="12" lg="8" xl="7">
                  <div
                    v-if="telefono !== null || video" class="firtBlockHelp iconPosition">
                    <h1 class="d-sr-only">Hai bisogno di aiuto?</h1>
                    <h2>
                      <span class="d-sr-only">Puoi rivolgerti ai seguenti contatti per avere </span>Assistenza alle procedure<span class="d-sr-only">:</span>
                    </h2>
                    <ul class="rfs-22">
                      <li
                        class="telephone"
                        v-if="telefono !== null">
                        <span class="d-sr-only">
                          Telefono:
                        </span>
                        <a :href="'tel:' + telefonoNumero" class="bold" aria-label="numero di telefono assistenza alle procedure" :title="telefono">
                          {{ telefono }}
                        </a>
                        <p class="rfs-16 listDesc">
                          {{ telefonoDesc }}
                        </p>
                      </li>
                       <li
                        class="telephone"
                        v-if="telefonoEstero !== null">
                        <span class="d-sr-only">Telefono:</span>
                        <a :href="'tel:' + telefonoEsteroNumero" class="bold" aria-label="numero di telefono assistenza da cellulare ed estero" :title="telefonoEstero">
                          {{ telefonoEstero }}
                        </a>
                      </li>
                      <li
                        class="video"
                        v-if="video">
                        <span class="d-sr-only">
                          Consulta i
                        </span>
                        <router-link
                          class="bold"
                          :to="{ name: 'video_tutorial'}"
                          aria-label="vai alla pagina video tutorial"
                          title="consulta i video tutorial di Tassa Auto"
                          >
                          Video tutorial
                        </router-link>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="email !== null || faq !== null || messenger !== null" class="iconPosition">
                    <h2>
                      <span class="d-sr-only">Puoi rivolgerti ai seguenti contatti per </span>Informazioni<span class="d-sr-only">:</span>
                    </h2>
                    <ul class="rfs-22">
                      <li
                        class="telephone"
                        v-if="telefono !== null">
                        <span class="d-sr-only">Telefono:</span>
                        <a :href="'tel:' + telefonoNumero" class="bold" aria-label="numero di telefono assistenza" :title="telefono">
                          {{ telefono }}
                        </a>
                        <p class="rfs-16 listDesc">{{ telefonoDesc }}</p>
                      </li>
                      <li
                        class="telephone"
                        v-if="telefonoEstero !== null">
                        <span class="d-sr-only">Telefono:</span>
                        <a :href="'tel:' + telefonoEsteroNumero" class="bold" aria-label="numero di telefono assistenza da cellulare ed estero" :title="telefonoEstero">
                          {{ telefonoEstero }}
                        </a>
                      </li>
                      <li class="mail"
                      v-if="email !== null">
                        <a :href="'mailto:' + email" class="bold" :title="email" aria-label="contattaci via e-mail">E-mail</a>
                        <p class="rfs-16 listDesc">{{ mailDesc }}</p>
                      </li>
                      <li class="faq"
                      v-if="faq !== null">
                        <a :href="faq" target="_blank" class="bold" aria-label="vai alla pagina per consultare le faq" title="faq Tassa Auto">FAQ</a>
                      </li>
                      <li class="messanger"
                      v-if="messenger !== null">
                        <a :href="messenger" class="bold" aria-label="Il link si apre in una nuova finestra" title="chatta con Tassa Auto su Messenger">Chat</a>
                        <p class="rfs-16 listDesc">
                          {{ chatbotDesc }}<br>
                          Puoi contattarlo tramite <strong><a :href="messenger" aria-label="Il link si apre in una nuova finestra" title="chatta con Tassa Auto su Messenger" target="_blank">Messenger</a></strong> oppure <strong><a :href="facebook" aria-label="Il link si apre in una nuova finestra" target="_blank" title="vai alla pagina facebook di tassa auto">Facebook</a></strong>, dopo esserti registrato su queste piattaforme.
                          <br>
                          <strong>N.B.: si prega di non allegare documentazione all'interno della chat; qualsiasi allegato non verrà preso in considerazione.</strong>
                        </p>
                      </li>
                    </ul>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <div class="action-button-wide row" id="action-buttons">
                <div class="col-12">
                  <v-btn
                    depressed
                    class="btn-secondary"
                    @click="historyBack()">Indietro</v-btn>
                </div>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { REGIONE_PARAMS } from '@/common/config'
import PaginaServizio from '@/components/layout/PaginaServizio'

export default {
  components: { PaginaServizio },
  data () {
    return {
      chatbotDesc: REGIONE_PARAMS.CONTATTI_AIUTO_CHATBOT_DESC,
      email: REGIONE_PARAMS.CONTATTI_AIUTO_EMAIL,
      facebook: REGIONE_PARAMS.CONTATTI_AIUTO_CHATBOT_FACEBOOK,
      faq: REGIONE_PARAMS.CONTATTI_AIUTO_FAQ,
      messenger: REGIONE_PARAMS.CONTATTI_AIUTO_CHATBOT_MESSENGER,
      telefono: REGIONE_PARAMS.CONTATTI_AIUTO_TELEFONO,
      telefonoNumero: REGIONE_PARAMS.CONTATTI_AIUTO_TELEFONO_NUMERO,
      telefonoEstero: REGIONE_PARAMS.CONTATTI_AIUTO_TELEFONO_ESTERO,
      telefonoEsteroNumero: REGIONE_PARAMS.CONTATTI_AIUTO_TELEFONO_ESTERO_NUMERO,
      telefonoDesc: REGIONE_PARAMS.CONTATTI_AIUTO_TELEFONO_DESC,
      telefonoDescTwo: REGIONE_PARAMS.CONTATTI_AIUTO_TELEFONO_DESC_2,
      mailDesc: REGIONE_PARAMS.CONTATTI_AIUTO_MAIL,
      video: REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO,
      servizio: 'contatti_aiuto'
    }
  },
  methods: {
    historyBack: function () {
      this.$router.back() // metodo per tornare indietro nella cronologia di una pagina dalla pagina di aiuto
    }
  }
}
</script>
