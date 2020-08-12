<template>
  <v-dialog ref="modaleFasce"
    v-model="modaleFasce"
    title="Tabella di riepilogo fasce"
    max-width="600px">
    <v-card>
      <v-card-title class="justify-end">
        <v-btn text @click="modaleFasce = false">
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
            <th scope="col">
              Numero Rate
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
            <td>
              {{ fascia.numeroRate }}
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ModaleFasceRateizzazione',
  data () {
    return {
      modaleFasce: false
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
