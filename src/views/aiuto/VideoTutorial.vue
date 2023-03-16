<template>
  <div>
    <pagina-servizio
      :servizio="servizio"
    />
    <div class="container">
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div
            class="row inner-cont-bollo"
            v-if="regione === 'piemonte'"><!-- per Regione Piemonte alcuni video comprendono più servizi -->
            <div class="col-lg-5 offset-lg-1">
              <div
                class="video-cont"
                id="memobollo_video"
                v-if="tutorialVideo('memo_bollo')">
                <h2 class="titleVideoService">
                  <span class="d-sr-only">Video tutorial del servizio </span>Memobollo
                </h2>
                <div class="mb-10">
                  <video
                    class="w-100"
                    type="video"
                    controls>
                  <source :src="videoTutorialUrl + nomeVideo('memo_bollo')">
                  </video>
                </div>
              </div>
              <div
                class="video-cont"
                id="pagalerate_video"
                v-if="tutorialVideo('pago_rate')">
                <h2 class="titleVideoService">
                  <span class="d-sr-only">Video tutorial del servizio </span>Paga le rate
                  <div class="subtitle">
                    Per questo tutorial è possibile attivare i sottotitoli
                  </div>
                </h2>
                <div class="mb-10">
                  <video
                    class="w-100"
                    type="video"
                    controls
                    preload="metadata"
                    frameborder="0"
                    allowfullscreen="1"
                    crossorigin="anonymous">
                    <source
                      :src="videoTutorialUrl + nomeVideo('pago_rate') + '.mp4'"
                      type="video/mp4"
                    >
                    <track
                      label="Italiano"
                      kind="subtitles"
                      srclang="it"
                      :src="videoTutorialUrl + nomeVideo('pago_rate') + '.vtt'"
                    >
                  </video>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <div
                class="video-cont"
                id="pagailbollo_video"
                v-if="tutorialVideo('pago_bollo')">
                <h2 class="titleVideoService">
                  <span class="d-sr-only">Video tutorial del servizio </span>Paga il bollo
                  <div class="subtitle">
                    Per questo tutorial è possibile attivare i sottotitoli
                  </div>
                </h2>
                <div class="mb-10">
                  <video
                    class="w-100"
                    type="video"
                    controls
                    preload="metadata"
                    frameborder="0"
                    allowfullscreen="1"
                    crossorigin="anonymous">
                    <source
                      :src="videoTutorialUrl + nomeVideo('pago_bollo') + '.mp4'"
                      type="video/mp4"
                    >
                    <track
                      label="Italiano"
                      kind="subtitles"
                      srclang="it"
                      :src="videoTutorialUrl + nomeVideo('pago_bollo') + '.vtt'"
                    >
                  </video>
                </div>
              </div>
              <div
                class="video-cont"
                id="osservazioni_scadenza_video"
                v-if="tutorialVideo('osservazione_avviso_scadenza')">
                <h2 class="titleVideoService">
                  <span class="d-sr-only">Video tutorial del servizio </span>Osservazioni su avviso di scadenza
                </h2>
                <div class="mb-10">
                  <video
                    class="w-100"
                    type="video"
                    controls>
                  <source :src="videoTutorialUrl + nomeVideo('osservazione_avviso_scadenza')">
                  </video>
                </div>
              </div>
            </div>
            <div class="col-lg-5 offset-lg-1">
              <div
                class="video-cont"
                id="osservazioni_accertamento_video"
                v-if="tutorialVideo('osservazione_avviso_accertamento')">
                <h2 class="titleVideoService">
                  <span class="d-sr-only">Video tutorial del servizio </span>Osservazioni su avviso di accertamento
                </h2>
                <div class="mb-10">
                  <video
                    class="w-100"
                    type="video"
                    controls>
                  <source :src="videoTutorialUrl + nomeVideo('osservazione_avviso_accertamento')">
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
  </div>
</template>

<script>
import { REGIONE_ABILITATA, VIDEO_TUTORIAL_URL, videoServizio } from '@/common/config'
import BtnBack from '@/components/layout/btn/BtnBack'
import PaginaServizio from '@/components/layout/PaginaServizio'

export default {
  components: { BtnBack, PaginaServizio },
  data () {
    return {
      regione: REGIONE_ABILITATA,
      servizio: 'video_tutorial',
      videoTutorialUrl: VIDEO_TUTORIAL_URL
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
