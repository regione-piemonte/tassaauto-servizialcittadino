<template>
  <div>
    <div class="space-section" id="oggettoDomandaRestituzione">
      <h2>Oggetto della domanda</h2>
      <!-- A -->
      <div v-if="oggDomResR === 'doppioPagamento'">
        <h6 v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_a')"></h6>
      </div>
      <!-- B -->
      <div v-if="oggDomResR === 'pagamentoEccessivo'">
        <h6 v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_b')"></h6>
        <div v-if="pagamentoEccessivoRadio === 'erroreMateriale'">
          <strong class="fix-align">
            <div v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_b1')"></div>
          </strong>
        </div>
        <div v-if="pagamentoEccessivoRadio === 'targaErrata'">
          <strong class="fix-align">
            <div v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_b2')"></div>
          </strong>
          <p>{{ attributi.pagamentoEccessivo.targa }}</p>
        </div>
      </div>
      <!-- C -->
      <div v-if="oggDomResR === 'pagamentoNonDovuto'">
        <h6 v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_c')"></h6>
        <p>{{ attributi.pagamentoNonDovuto.motivo }}</p>
      </div>
      <!-- D -->
      <div v-if="oggDomResR === 'perditaDiPossesso'">
        <h6 v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_d')"></h6>
        <div v-if="perditaDiPossessoRadio === 'restituzionePeriodo'">
          <strong class="fix-align">
            <div v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_d1')"></div>
          </strong>
        </div>
        <div v-if="perditaDiPossessoRadio === 'restituzioneDifferenza'">
          <strong class="fix-align">
            <div v-html="$t('pratica.restituzione_tassa.ogg_dom_restituzione.select_d2')"></div>
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RestituzioneService from '@/common/restituzioni.service'

export default {
  name: 'OggettoDomandaRestituzione',
  props: {
    attributi: { type: Object, required: true }
  },
  data () {
    return {
      oggDomResR: '',
      pagamentoEccessivoRadio: '',
      perditaDiPossessoRadio: ''
    }
  },
  async created () {
    const attr = this.attributi
    this.oggDomResR = await RestituzioneService.oggettoDomandaRestituzione(attr)
    this.pagamentoEccessivoRadio =
      (this.oggDomResR === 'pagamentoEccessivo')
        ? await RestituzioneService.pagamentoEccessivoRestituzione(attr.pagamentoEccessivo)
        : ''
    this.perditaDiPossessoRadio =
      (this.oggDomResR === 'perditaDiPossesso')
        ? await RestituzioneService.perditaDiPossessoRestituzione(attr.perditaDiPossesso)
        : ''
  }
}
</script>
