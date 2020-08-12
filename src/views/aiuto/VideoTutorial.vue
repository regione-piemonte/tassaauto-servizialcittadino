<template>
  <div>
    <pagina-servizio
      :servizio="servizio"
    />
    <div class="app-container">
      <v-card class="card-view-page">
      <div
        class="app-row inner-cont-bollo"
        v-if="regione === 'piemonte'"><!-- per Regione Piemonte alcuni video comprendono più servizi -->
        <div class="col-lg-5 offset-lg-1">
          <div
            class="video-cont"
            id="memobollo_video"
            v-if="tutorialVideo('memo_bollo')">
            <h2 class="titleVideoService">
              <span class="sr-only">Video tutorial del servizio </span>Memobollo
            </h2>
            <div class="mb-10">
              <video
                class="w-100"
                type="video"
                controls>
              <source :src="videoPath + '/' + nomeVideo('memo_bollo')">
              </video>
            </div>
          </div>
          <div
            class="video-cont"
            id="osservazioni_scadenza_video"
            v-if="tutorialVideo('osservazione_avviso_scadenza')">
            <h2 class="titleVideoService">
              <span class="sr-only">Video tutorial del servizio </span>Osservazioni su avviso di scadenza
            </h2>
            <div class="mb-10">
              <video
                class="w-100"
                type="video"
                controls>
               <source :src="videoPath + '/' + nomeVideo('osservazione_avviso_scadenza')">
              </video>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div
            class="video-cont"
            id="osservazioni_accertamento_video"
            v-if="tutorialVideo('osservazione_avviso_accertamento')">
            <h2 class="titleVideoService">
              <span class="sr-only">Video tutorial del servizio </span>Osservazioni su avviso di accertamento
            </h2>
            <div class="mb-10">
              <video
                class="w-100"
                type="video"
                controls>
               <source :src="videoPath + '/' + nomeVideo('osservazione_avviso_accertamento')">
              </video>
            </div>
          </div>
          <div
            class="video-cont"
            id="pagamentiOnline_video"
            v-if="tutorialVideo('pago_bollo') || tutorialVideo('pago_rate')">
            <h2 class="titleVideoService">
              <span class="sr-only">Video tutorial del servizio </span>Pagamenti online
            </h2>
            <div class="mb-10">
              <video
                class="w-100"
                type="video"
                controls>
               <source :src="videoPath + '/' + nomeVideo('pago_bollo')">
              </video>
            </div>
          </div>
        </div>
      </div>
      <!-- TODO per le altre regioni, se non ci sono video cumulativi (che comprendono più servizi),
      eseguire un ciclo for sui video presenti in modo che la pagina sia confezionata in modo dinamico
      e non statico come per Regione Piemonte -->
      </v-card>
    </div>
  </div>
</template>

<script>
import { REGIONE_ABILITATA, VIDEO_VH_PATH, videoServizio } from '@/common/config'
import BtnBack from '@/components/layout/btn/BtnBack'
import PaginaServizio from '@/components/layout/PaginaServizio'

export default {
  components: { BtnBack, PaginaServizio },
  data () {
    return {
      regione: REGIONE_ABILITATA,
      servizio: 'video_tutorial',
      videoPath: VIDEO_VH_PATH
    }
  },
  methods: {
    historyBack: function () {
      this.$router.back() // metodo per tornare indietro nella cronologia di una pagina dalla pagina di aiuto
    },
    nomeVideo (servizio) {
      return videoServizio(servizio)
    },
    tutorialVideo (servizio) {
      return this.nomeVideo(servizio) !== ''
    }
  }
}
</script>
