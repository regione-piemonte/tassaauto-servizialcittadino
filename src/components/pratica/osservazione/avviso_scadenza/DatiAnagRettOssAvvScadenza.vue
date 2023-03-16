
<template>
  <div class="space-section">
    <h2>Dati anagrafici rettificati</h2>
    <v-list
      id="datiAnagRett"
      class="text-uppercase"
      flat>
      <v-list-item-group
        :no-action="true"
        aria-label="dati anagrafici rettificati osservazioni scadenza">
        <v-list-item
          id="denominazioneRett"
          :inactive="true"
          :ripple="false"
          v-if="denominazione !== null && denominazione !== ''">
          {{ denominazione }}
        </v-list-item>
        <v-list-item
          id="codiceFiscaleRett"
          :inactive="true"
          :ripple="false"
          v-if="codiceFiscale !== null && codiceFiscale !== ''">
          CF: {{ codiceFiscale }}
        </v-list-item>
        <v-list-item
          id="indirizzoRett"
          :inactive="true"
          :ripple="false"
          v-if="indirizzo !== null && indirizzo !== ''">
          {{ indirizzo }}
        </v-list-item>
        <v-list-item
          id="indirizzoRett"
          :inactive="true"
          :ripple="false"
          v-if="comune !== null && comune !== ''">
          {{ comune }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiAnagRettOssAvvScadenza',
  props: {
    denominazione: { type: String },
    codiceFiscale: { type: String },
    indirizzo: { type: String },
    comune: { type: String }
  }
}
</script>
