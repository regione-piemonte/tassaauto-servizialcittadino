<template>
  <div>
    <div class="space-section" id="oggettoDomandaRestituzione">
      <h2>Modalità restituzione</h2>
      <!-- ACCREDITO CC -->
      <div v-if="modRes === 'accreditoCc'">
        <h6 v-html="$t('pratica.restituzione_tassa.modalita_restituzione.chiedo_restituzione_cc')"></h6>
        <p>{{ attributi.accreditoCc.iban }}</p>
      </div>
      <!-- COMPENSAZIONE-->
      <div v-if="modRes === 'compensazione'">
        <h6
          v-html="$t('pratica.restituzione_tassa.modalita_restituzione.chiedo_restituzione_compensazione')"
        ></h6>
        <div v-if="modResRadio === 'miaProprieta'">
          <strong class="fix-align">
            <div v-html="$t('pratica.restituzione_tassa.modalita_restituzione.mia_proprieta')"></div>
          </strong>
        </div>
        <div v-if="modResRadio === 'altroSoggetto'">
          <strong class="fix-align">
            <div v-html="$t('pratica.restituzione_tassa.modalita_restituzione.altro_soggetto')"></div>
          </strong>
          <p class="text-uppercase">{{ attributi.compensazione.codiceFiscale }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RestituzioneService from '@/common/restituzioni.service'

export default {
  name: 'ModalitaRestituzione',
  props: {
    attributi: { type: Object, required: true }
  },
  data () {
    return {
      modRes: '',
      modResRadio: ''
    }
  },
  async created () {
    const attr = this.attributi
    this.modRes = await RestituzioneService.modalitaRestituzione(attr)
    this.modResRadio =
      (this.modRes === 'compensazione')
        ? await RestituzioneService.compensazioneRestituzione(attr.compensazione)
        : ''
  }
}
</script>
