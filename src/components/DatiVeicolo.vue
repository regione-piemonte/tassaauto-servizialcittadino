<template>
  <div class="space-section" id="dati-veicolo">
    <h2>
      Dati del veicolo
    </h2>
    <v-list class="text-uppercase" flat>
      <v-list-item-group :no-action="true">
        <v-list-item :inactive="true" :ripple="false">
          {{ descrizione }}
        </v-list-item>
        <v-list-item
          :inactive="true"
          :ripple="false">
          Targa: {{ targa }}
        </v-list-item>
        <v-list-item
          :inactive="true"
          :ripple="false"
          v-if="scadenza != undefined && scadenza != null">
          Scadenza: {{ scadenza }}
        </v-list-item>
        <v-list-item
          :inactive="true"
          :ripple="false"
          v-if="validita != undefined && validita != null">
          Validità: {{ validita }} mesi
        </v-list-item>
        <v-list-item
          :inactive="true"
          :ripple="false"
          v-if="tassa != undefined && tassa != null">
          Importo: {{ tassa | formatCurrency }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiVeicolo',
  props: {
    descrizione: { type: String, required: true },
    targa: { type: String, required: true },
    scadenza: { type: String, required: false },
    validita: { type: Number, required: false },
    tassa: { type: Number, required: false }
  },
  data () {
    return {
    }
  }
}
</script>
