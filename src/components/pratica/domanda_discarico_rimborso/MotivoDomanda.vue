<template>
  <div class="space-section" id="motivoDomanda">
    <h2>
      {{ $t("pratica.domanda_discarico_rimborso.motivo.titolo") }}
    </h2>
    <v-list class="text-uppercase" flat>
      <v-list-item-group :no-action="true" aria-label="dati motivo domanda di discarico rimborso">
        <v-list-item
          id="pagamentoEseguito"
          :inactive="true"
          :ripple="false"
          v-if="motivoDomanda === 'pagamentoEseguito'"
        >
        {{ $t("pratica.domanda_discarico_rimborso.motivo.pagamentoEseguito") }}
        </v-list-item>
        <v-list-item
          id="mancanzaPresupposto"
          :inactive="true"
          :ripple="false"
          v-if="motivoDomanda === 'mancanzaPresupposto'"
        >
        {{ $t("pratica.domanda_discarico_rimborso.motivo.mancanzaPresupposto") }}
        </v-list-item>
        <v-list-item
          id="altro"
          :inactive="true"
          :ripple="false"
          v-if="motivoDomanda === 'altro'"
        >
          <v-row>
            <v-col cols="12">{{ $t("pratica.domanda_discarico_rimborso.motivo.altro") }}</v-col>
             <v-col cols="12" class="noteAltro">note: {{ motivo.altro.note }}</v-col>
          </v-row>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import DomDisRimService from '@/common/domanda_discarico_rimborso.service'

export default {
  name: 'MotivoDomanda',
  props: {
    motivo: { type: Object, required: true }
  },
  data () {
    return {
      motivoDomanda: null
    }
  },
  async created () {
    this.motivoDomanda = await DomDisRimService.motivoDomanda(this.motivo)
  }
}
</script>
