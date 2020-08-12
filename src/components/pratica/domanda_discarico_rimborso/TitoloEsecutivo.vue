<template>
  <div class="space-section" id="titoloEsecutivo">
    <h2>
      Titolo esecutivo: {{ tipoTitolo }}
    </h2>
    <v-list
      class="text-uppercase"
      flat>
      <v-list-item-group
        :no-action="true">
        <v-list-item
          id="tipoTitolo"
          :inactive="true"
          :ripple="false">
          {{ tipoTitolo }}: n° {{ numeroEsecutivo }}
        </v-list-item>
         <v-list-item
          id="dataNotifica"
          :inactive="true"
          :ripple="false"
          v-if="dataNotifica !== null && dataNotifica !== '' && dataNotifica !== undefined">
          Data di notifica: {{ new Date(dataNotifica) | dateFormat('DD/MM/YYYY') }}
        </v-list-item>
         <v-list-item
          id="importoTotale"
          :inactive="true"
          :ripple="false"
          v-if="importoTotale !== null && importoTotale > 0">
          Importo totale riscossione: {{ importoTotale | formatCurrency }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'TitoloEsecutivo',
  props: {
    tipoTitolo: { type: String, required: true },
    numeroEsecutivo: { type: String, required: true },
    dataNotifica: { type: String, required: false },
    importoTotale: { type: Number, required: false }
  }
}
</script>
