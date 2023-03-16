<template>
  <div class="space-section" id="oggettoDomanda">
    <h2>
      {{ $t('pratica.domanda_discarico_rimborso.crea.oggettoDomanda') }}
    </h2>
    <v-list
      class="text-uppercase"
      flat>
      <v-list-item-group
        :no-action="true">
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false"
          v-if="oggettoDomanda === 'discaricoAmministrativo'">
          {{ $t('pratica.domanda_discarico_rimborso.crea.chiedo_discarico_amministrativo') }} {{ tipoDiscaricoAmministrativo() }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false"
          v-if="oggettoDomanda === 'rimborsoGiaPagato'">
          {{ $t('pratica.domanda_discarico_rimborso.crea.chiedo_rimborso') }}
          <p>
            IBAN: {{ oggetto.rimborsoGiaPagato.iban }}
          </p>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import DomDisRimService from '@/common/domanda_discarico_rimborso.service'

export default {
  name: 'OggettoDomanda',
  props: {
    oggetto: { type: Object, required: true }
  },
  data () {
    return {
      oggettoDomanda: null
    }
  },
  methods: {
    tipoDiscaricoAmministrativo () {
      if (this.oggetto.discaricoAmministrativo.totale) return 'totale'
      else return 'parziale'
    }
  },
  async created () {
    this.oggettoDomanda = await DomDisRimService.oggettoDomanda(this.oggetto)
  }
}
</script>
