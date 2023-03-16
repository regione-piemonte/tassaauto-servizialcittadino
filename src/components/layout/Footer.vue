<template>
  <footer id="footer">
    <div class="upper-footer"
      v-if="altLogoRegione !== ''">
      <div class="lay-conth container text-center text-md-left">
        <v-row justify="space-between" align="center">
          <v-col cols="12" md="auto">
            <a href="https://www.regione.piemonte.it/web/" target="_blank" rel="noopener noreferrer" class="d-block">
              <img
                class="img-Regione"
                :src="require(`@/assets/images/loghi/${regione}/regione_footer.png`)"
                :alt="altLogoRegione"
              />
            </a>
          </v-col>
          <v-col cols="12" md="auto">
            <v-container class="text-center text-md-left">
              <v-row>
                <v-col md="auto">
                  <v-img
                    class="iniziativaEUImg"
                    position="right"
                    max-width="259px"
                    :src="require(`@/assets/images/loghi/${regione}/Iniziativa.png`)"
                    alt="Iniziativa unione europea"
                  />
                </v-col>
                <v-col cols="12" md="auto">
                  <img
                    class="piemonteImg"
                    max-width="259px"
                    :src="require(`@/assets/images/loghi/${regione}/Piemonte.png`)"
                    alt="Piemonte"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="ps-footer">
      <div class="lay-conth container text-center text-md-left">
        <v-row class="aiuto-footer" v-if="linkAiuto">
          <v-col>
            <h3 class="title-help-footer">Hai bisogno di aiuto</h3>
            <v-btn text
              depressed
              :ripple="false"
              class="b-footer-help rfs-14"
              :to="{ name: 'contatti_aiuto' }">
              Consulta la pagina di aiuto
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="space-between" class="loghi-footer">
          <v-col cols="12" sm="auto">
            <a :href="(logged) ? piemonteTuUrlLogged : piemonteTuUrl" target="_blank" rel="noopener noreferrer" class="d-block">
              <img v-if="regione === 'piemonte'"
                class="mx-auto"
                :src="require(`@/assets/images/loghi/${regione}/piemonteTu_logo.svg`)"
                width="240px"
                height="82.45px"
                alt="scopri i servizi di piemonte tu"
                min-height="auto"
              />
            </a>
            <v-img v-if="regione === 'vda'"
              class="mx-auto"
              :src="require(`@/assets/images/loghi/${regione}/sistema_footer.png`)"
              :alt="altLogoSistema"
              width="240px"
              min-height="auto"/>
          </v-col>
          <v-col cols="12" sm="auto" v-if="regione === 'piemonte'">
            <a href="https://www.csipiemonte.it/web/it" target="_blank" rel="noopener noreferrer" class="d-block">
              <img
                class="mx-auto"
                width="211px"
                :src="require('@/assets/images/loghi/logo_CSI_negativo.png')"
                alt="CSI Piemonte"
              />
            </a>
          </v-col>
        </v-row>
        <v-row justify="space-between" class="info-footer">
          <v-col md="auto" cols="12">
            <ul class="list-inline">
              <li
                class="list-inline-item"
                v-if="useNoteUrl !== ''">
                <v-btn
                  class="b-footer-help"
                  text
                  depressed
                  :ripple="false"
                  :href="useNoteUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  Dichiarazione di accessibilità
                </v-btn>
              </li>
              <li class="list-inline-item">
                <v-btn
                  class="b-footer-help"
                  text
                  depressed
                  :ripple="false"
                  :href="privacyUrl"
                  rel="noopener noreferrer"
                  target="_blank">
                  Privacy
                </v-btn>
              </li>
              <li class="list-inline-item">
                <v-btn
                  class="b-footer-help"
                  depressed
                  :ripple="false"
                  text
                  :href="cookieUrl"
                  rel="noopener noreferrer"
                  target="_blank">
                  Cookie policy
                </v-btn>
              </li>
            </ul>
          </v-col>
          <v-col md="auto">
            <p class="footer-author"
              v-html="serviceDescription"
            />
            <p class="footer-author">
              Versione software: {{ versionePwa }}
            </p>
          </v-col>
        </v-row>
      </div>
    </div>
  </footer>
</template>

<script>
import pkg from '../../../package.json'
import { mapGetters } from 'vuex'
import { REGIONE_ABILITATA, REGIONE_PARAMS, servizioAttivo, PIEMONTE_TU_URL, PIEMONTE_TU_URL_LOGGED } from '@/common/config'

export default {
  name: 'Footer',
  data () {
    return {
      altLogoRegione: REGIONE_PARAMS.ALT_LOGO_REGIONE,
      altLogoSistema: REGIONE_PARAMS.ALT_LOGO_SISTEMA,
      cookieUrl: REGIONE_PARAMS.COOKIE_URL,
      privacyUrl: REGIONE_PARAMS.PRIVACY_URL,
      piemonteTuUrl: PIEMONTE_TU_URL,
      piemonteTuUrlLogged: PIEMONTE_TU_URL_LOGGED,
      regione: REGIONE_ABILITATA,
      serviceDescription: REGIONE_PARAMS.SERVICE_DESCRIPTION,
      useNoteUrl: REGIONE_PARAMS.USE_NOTE_URL
    }
  },
  computed: {
    ...mapGetters(['isUserLogged', 'isUserLoggedLocalhost']),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    linkAiuto: function () {
      return (this.$route.name !== 'home' && this.$route.name !== 'contatti_aiuto' && servizioAttivo('contatti_aiuto')) // nella Home Page è presente la card di aiuto
    },
    versionePwa: function () {
      return pkg.version
    }
  }
}
</script>
