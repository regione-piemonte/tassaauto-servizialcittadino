<template>
  <div class="space-section" id="dati-anagrafici-rapplegale">
    <h2>
      Dati anagrafici del rappresentante legale
    </h2>
    <v-list class="text-uppercase" flat>
      <v-list-item-group :no-action="true" aria-label="dati anagrafici del rappresentante legale">
        <v-list-item id="denominazione" :inactive="true" :ripple="false">
          {{ denominazione }}
        </v-list-item>
        <v-list-item id="codiceFiscaleRL" :inactive="true" :ripple="false">
        CF: {{ codiceFiscale }}
        </v-list-item>
        <v-list-item id="sessoRL" :inactive="true" :ripple="false">
        Sesso: {{ sesso }}
        </v-list-item>
        <v-list-item id="dataDiNascitaRL" :inactive="true" :ripple="false">
        Data di Nascita: {{ new Date(dataDiNascita) | dateFormat('DD/MM/YYYY') }}
        </v-list-item>
        <v-list-item v-if="provinciaDiNascita !== null && provinciaDiNascita !== ''"
        id="comuneDiNascitaRL" :inactive="true" :ripple="false">
        Comune di Nascita o Stato Estero: {{ comuneDiNascita }} ({{ provinciaDiNascita }})
        </v-list-item>
        <v-list-item v-else id="statoDiNascitaRL" :inactive="true" :ripple="false">
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
