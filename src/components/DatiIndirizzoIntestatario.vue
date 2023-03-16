<template>
  <div class="space-section">
    <h2>
      Indirizzo intestatario {{ tipoDatiAnagrafici }}
    </h2>
    <v-list class="text-uppercase" flat>
      <v-list-item-group :no-action="true" aria-label="Dati indirizzo intestatario">
        <v-list-item id="datiIndirizzoIntestatario" :inactive="true" :ripple="false" class="d-none d-md-flex">
          {{ indirizzo }}<span v-if="provincia !== null && comune !== null">, {{ comune }} ({{ provincia }})</span>&nbsp;- {{ cap }}
        </v-list-item>
        <v-list-item id="datiIndirizzoIntestatario" :inactive="true" :ripple="false" class="d-flex d-md-none">
          <v-row>
            <v-col cols="12">
              {{ indirizzo }}
            </v-col>
            <v-col cols="12" v-if="provincia !== null && comune !== null">
              {{ comune }} ({{ provincia }})
            </v-col>
            <v-col cols="12">
              {{ cap }}
            </v-col>
          </v-row>
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
