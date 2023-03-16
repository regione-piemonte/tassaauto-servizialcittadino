<template>
  <div class="space-section" id="dati-anagrafici-intestatario">
    <h2>Dati anagrafici {{ tipoDatiAnagrafici }}</h2>
    <v-list class="text-uppercase" flat>
      <v-list-item-group :no-action="true" aria-label="Dati anagrafici intestatario">
        <v-list-item id="denominazione" :inactive="true" :ripple="false">
          {{ denominazione }}
        </v-list-item>
        <v-list-item id="codFiscale" :inactive="true" :ripple="false">
          CF: {{ codiceFiscale }}
        </v-list-item>
        <v-list-item
          v-if="
            tipoDatiAnagrafici === 'intestatario ingiunzione / cartella' &&
            personaFisica
          "
          id="datiAnagrafici"
          :inactive="true"
          :ripple="false"
        >
          Nato a: {{ comuneNascita }}
          <span v-if="provinciaNascita !== null" class="mr-1">({{ provinciaNascita }}) </span>
           il {{ dataNascita }}
        </v-list-item>
        <v-list-item
          v-if="auth=== true"
          id="datiAnagrafici"
          :inactive="true"
          :ripple="false"
        >
          Nato a: {{ comuneNascita }}
          <span v-if="provinciaNascita !== null" class="mr-1">({{ provinciaNascita }}) </span>
           il {{ new Date(dataNascita) | dateFormat('DD/MM/YYYY')}}
        </v-list-item>
        <v-list-item
          v-if="sesso != undefined && sesso != null"
          id="sesso"
          :inactive="true"
          :ripple="false"
        >
          Sesso: {{ sesso }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiAnagraficiIntestatario',
  props: {
    denominazione: { type: String, required: true },
    codiceFiscale: { type: String, required: true },
    email: { type: String, required: false },
    dataNascita: { type: String, required: false },
    personaFisica: { type: Boolean, required: false },
    provinciaNascita: { type: String, required: false },
    comuneNascita: { type: String, required: false },
    sesso: { type: String, required: false },
    tipoDatiAnagrafici: { type: String, required: true },
    auth: { type: Boolean, required: false }
  }
}
</script>
