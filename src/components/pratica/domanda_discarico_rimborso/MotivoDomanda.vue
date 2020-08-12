<template>
  <div class="space-section" id="motivoDomanda">
    <h2>
      Motivo
    </h2>
    <v-list class="text-uppercase" flat>
      <v-list-item-group :no-action="true">
        <v-list-item
        id="pagamentoEseguito"
        :inactive="true"
        :ripple="false"
        v-if="motivoDomanda === 'pagamentoEseguito'">
          Pagamento eseguito
        </v-list-item>
        <v-list-item
          id="mancanzaPresupposto"
          :inactive="true"
          :ripple="false"
          v-if="motivoDomanda === 'mancanzaPresupposto'">
          Mancanza del presupposto
        </v-list-item>
        <v-list-item
          id="altro"
          :inactive="true"
          :ripple="false"
          v-if="motivoDomanda === 'altro'">
          Altro
          <p>
            note: {{ motivo.altro.note }}
          </p>
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
