<template>
  <footer id="footer">
    <div class="upper-footer"
      v-if="altLogoRegione !== ''">
      <div class="lay-conth">
        <v-row justify="space-between">
          <v-col cols="12" md="auto">
              <v-img
                class="img-Regione"
                :src="require(`@/assets/images/loghi/${regione}/regione_footer.png`)"
                :lazy-src="require(`@/assets/images/loghi/${regione}/regione_footer.png`)"
                :alt="altLogoRegione"
              />
          </v-col>
          <v-col cols="12" md="auto">
            <v-row>
              <v-col md="auto">
                <v-img
                  position="right"
                  max-width="259px"
                  :src="require(`@/assets/images/loghi/${regione}/Iniziativa.png`)"
                  alt="Iniziativa unione europea"
                />
              </v-col>
              <v-col md="auto">
                <v-img
                  max-width="259px"
                  :src="require(`@/assets/images/loghi/${regione}/Piemonte.png`)"
                  alt="Piemonte"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="ps-footer">
      <div class="lay-conth">
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
          <v-col md="auto">
            <v-img
              :src="require(`@/assets/images/loghi/${regione}/piemonteTu_logo.svg`)"
              :lazy-src="require(`@/assets/images/loghi/${regione}/piemonteTu_logo.svg`)"
              :alt="altLogoSistema"
              width="265"
            />
          </v-col>
          <v-col md="auto">
              <v-img
                width="211"
                :src="require('@/assets/images/loghi/logo_CSI_negativo.png')"
                alt="CSI Piemonte"
              />
          </v-col>
        </v-row>
        <v-row justify="space-between" class="info-footer">
          <v-col md="auto" cols="12">
            <ul class="list-inline">
              <li class="list-inline-item">
                <v-btn
                  text
                  depressed
                  :ripple="false"
                  class="b-menu-footer-link-item"
                  :href="useNoteUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  v-if="useNoteUrl !== ''">
                  Accessibilità
                </v-btn>
              </li>
              <li class="list-inline-item">
                <v-btn
                  text
                  depressed
                  :ripple="false"
                  class="b-menu-footer-link-item"
                  :href="privacyUrl"
                  rel="noopener noreferrer"
                  target="_blank">
                  Privacy
                </v-btn>
              </li>
              <li class="list-inline-item">
                <v-btn
                  depressed
                  :ripple="false"
                  text
                  class="b-menu-footer-link-item"
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
import { version } from '../../../package.json'
import { REGIONE_ABILITATA, REGIONE_PARAMS, servizioAttivo } from '@/common/config'

export default {
  name: 'Footer',
  data () {
    return {
      altLogoRegione: REGIONE_PARAMS.ALT_LOGO_REGIONE,
      altLogoSistema: REGIONE_PARAMS.ALT_LOGO_SISTEMA,
      cookieUrl: REGIONE_PARAMS.COOKIE_URL,
      privacyUrl: REGIONE_PARAMS.PRIVACY_URL,
      regione: REGIONE_ABILITATA,
      serviceDescription: REGIONE_PARAMS.SERVICE_DESCRIPTION,
      useNoteUrl: REGIONE_PARAMS.USE_NOTE_URL
    }
  },
  computed: {
    linkAiuto: function () {
      return (this.$route.name !== 'home' && this.$route.name !== 'contatti_aiuto' && servizioAttivo('contatti_aiuto')) // nella Home Page è presente la card di aiuto
    },
    versionePwa: function () {
      return version
    }
  }
}
</script>
