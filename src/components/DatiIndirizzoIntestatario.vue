<template>
  <div class="space-section">
    <h2>
      Indirizzo intestatario {{ tipoDatiAnagrafici }}
    </h2>
    <v-list class="text-uppercase">
      <v-list-item-group>
        <v-list-item id="datiIndirizzoIntestatario">
          {{ indirizzo }} | {{ comune }} ({{ provincia }}) | {{ cap }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiIndirizzoIntestatario',
  props: {
    indirizzo: { type: String, required: true },
    cap: { type: String, required: true },
    comune: { type: String },
    provincia: { type: String, required: false },
    tipoDatiAnagrafici: { type: String, required: true }
  },
  data () {
    return {
    }
  }
}
</script>
