<template>
  <div class="space-section" id="oggettoDomanda">
    <h2>
      Oggetto della domanda
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
          chiedo il discarico amministrativo {{ tipoDiscaricoAmministrativo() }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false"
          v-if="oggettoDomanda === 'rimborsoGiaPagato'">
          Chiedo il rimborso, avendo già provveduto al pagamento
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
