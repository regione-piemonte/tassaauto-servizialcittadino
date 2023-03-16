<template>
  <v-dialog ref="modaleFasce"
    v-model="modaleFasce"
    title="Tabella di riepilogo fasce"
    max-width="600px">
    <v-card>
      <v-card-title class="justify-end">
        <v-btn text @click="modaleFasce = false" depressed>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <table class="mb-0">
        <thead>
          <tr>
            <th scope="col">
              # Fascia
            </th>
            <th scope="col">
              Importo Da
            </th>
            <th scope="col">
              Importo A
            </th>
            <th scope="col" v-if="regione === 'piemonte'">
              Numero Rate
            </th>
            <th scope="col" v-if="regione === 'vda'">
              Min n° Rate
            </th>
            <th scope="col" v-if="regione === 'vda'">
              Max n° Rate
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fascia, index) in fasceCarrelloRateizzazione" :key="index">
            <td scope="row">
              {{ fascia.numeroFascia }}
            </td>
            <td>
              {{ fascia.importoDa }}
            </td>
            <td>
              {{ fascia.importoA }}
            </td>
            <td v-if="regione === 'piemonte'">
              {{ fascia.numeroRate }}
            </td>
            <td v-if="regione === 'vda'">
              {{ fascia.minNumeroRate }}
            </td>
            <td v-if="regione === 'vda'">
              {{ fascia.maxNumeroRate }}
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { REGIONE_ABILITATA } from '@/common/config'

export default {
  name: 'ModaleFasceRateizzazione',
  data () {
    return {
      modaleFasce: false,
      regione: REGIONE_ABILITATA
    }
  },
  computed: {
    ...mapGetters([
      'fasceCarrelloRateizzazione'
    ])
  },
  methods: {
    mostraModaleFasce () {
      this.modaleFasce = true
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  }
}
</script>
