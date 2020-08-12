<template>
  <div class="space-section" id="dati-anagrafici-rapplegale">
    <h2>
      Dati anagrafici del rappresentante legale
    </h2>
    <v-list class="text-uppercase">
      <v-list-item-group>
        <v-list-item id="denominazione">
          {{ denominazione }}
        </v-list-item>
        <v-list-item id="codiceFiscaleRL">
        CF: {{ codiceFiscale }}
        </v-list-item>
        <v-list-item id="sessoRL">
        Sesso: {{ sesso }}
        </v-list-item>
        <v-list-item id="dataDiNascitaRL">
        Data di nascita: {{ new Date(dataDiNascita) | dateFormat('DD/MM/YYYY') }}
        </v-list-item>
        <v-list-item v-if="provinciaDiNascita !== null && provinciaDiNascita !== ''"
        id="comuneDiNascitaRL">
        Comune di nascita o Stato Estero: {{ comuneDiNascita }} ({{ provinciaDiNascita }})
        </v-list-item>
        <v-list-item v-else id="statoDiNascitaRL">
        Stato Estero: {{ comuneDiNascita }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiAnagRapprLegale',
  props: {
    denominazione: { type: String, required: true },
    codiceFiscale: { type: String, required: true },
    sesso: { type: String, required: true },
    dataDiNascita: { type: String, required: true },
    comuneDiNascita: { type: String },
    provinciaDiNascita: { type: String }
  }
}
</script>
