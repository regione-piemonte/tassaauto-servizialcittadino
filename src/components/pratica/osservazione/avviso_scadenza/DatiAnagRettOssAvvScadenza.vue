
<template>
  <div class="space-section">
    <h2>Dati anagrafici rettificati</h2>
    <v-list
      id="datiAnagRett"
      class="text-uppercase"
      flat>
      <v-list-item-group
        :no-action="true">
        <v-list-item
          id="denominazioneRett"
          :inactive="true"
          :ripple="false">
          {{ denominazione }}
        </v-list-item>
        <v-list-item
          id="codiceFiscaleRett"
          :inactive="true"
          :ripple="false">
          CF: {{ codiceFiscale }}
        </v-list-item>
        <v-list-item
          id="indirizzoRett"
          :inactive="true"
          :ripple="false">
          {{ indirizzo }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiAnagRettOssAvvScadenza',
  props: {
    denominazione: { type: String, required: true },
    codiceFiscale: { type: String, required: true },
    indirizzo: { type: String, required: true }
  }
}
</script>
