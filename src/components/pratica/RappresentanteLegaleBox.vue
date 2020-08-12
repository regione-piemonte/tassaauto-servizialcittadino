<template>
  <div class="space-section">
    <h2>
      Persona fisica (o legale rappresentante di soggetto diverso da persona fisica)
    </h2>
    <p>
      Tutti i campi sono obbligatori
    </p>
    <v-form>
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Codice fiscale"
        id="codiceFiscaleRL"
        type="text"
        v-model="rappresentanteLegale.codiceFiscaleRL"
        :maxLength="$v.rappresentanteLegale.codiceFiscaleRL.$params.maxLength.max"
        :error-messages="cfRLErrors"
        autocomplete="off"
        :error-count="3"
      ></v-text-field>
      <v-radio-group
        label="Sesso"
        v-model="rappresentanteLegale.sesso"
        :error-messages="sessoRLErrors"
        row
        name="rappLegSesso">
        <v-radio label="Femmina" value="F"></v-radio>
        <v-radio label="Maschio" value="M"></v-radio>
      </v-radio-group>
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Nome"
        id="nome"
        type="text"
        v-model="rappresentanteLegale.nome"
        :error-messages="nomeRLErrors"
        autocomplete="off"
        :error-count="1"
      ></v-text-field>
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Cognome"
        id="cognome"
        type="text"
        v-model="rappresentanteLegale.cognome"
        :error-messages="cognomeRLErrors"
        autocomplete="off"
        :error-count="1"
      ></v-text-field>
      <!--date picker -->
      <v-menu
        v-model="dataDiNascitaPicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="computedDateFormatted"
            id="dataDiNascita"
            label="Data di Nascita"
            append-icon="event"
            readonly
            v-on="on"
            :error-messages="dataDiNascitaRLErrors"
            :error-count="1"
          ></v-text-field>
        </template>
        <v-date-picker v-model="rappresentanteLegale.dataDiNascita" @input="dataDiNascitaPicker = false" locale="it-IT"></v-date-picker>
      </v-menu>
      <!--fine date picker -->
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Comune"
        id="comune"
        type="text"
        v-model="rappresentanteLegale.comune"
        :error-messages="comuneRLErrors"
        autocomplete="off"
        :error-count="1"
        :disabled="rappresentanteLegale.statoEsteroCheck ? true : false"
      ></v-text-field>
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Provincia"
        id="provincia"
        type="text"
        v-model="rappresentanteLegale.provincia"
        :error-messages="provinciaRLErrors"
        autocomplete="off"
        :error-count="1"
        :disabled="rappresentanteLegale.statoEsteroCheck ? true : false"
      ></v-text-field>
      <v-switch
        id="cittadinoEsteroSwitch"
        v-model="rappresentanteLegale.statoEsteroCheck"
        label="Cittadino di Stato Estero">
      </v-switch>
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Stato di nascita"
        id="stato"
        type="text"
        v-model="rappresentanteLegale.stato"
        :error-messages="statoRLErrors"
        autocomplete="off"
        :error-count="1"
        v-if="rappresentanteLegale.statoEsteroCheck"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script>
import { COD_FISCALE_MIN_LENGTH, COD_FISCALE_MAX_LENGTH } from '@/common/config'
import { required, requiredIf, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  name: 'RappresentanteLegaleBox',
  data () {
    return {
      rappresentanteLegale: {
        codiceFiscaleRL: null,
        sesso: null,
        cognome: null,
        nome: null,
        dataDiNascita: '',
        stato: null,
        comune: null,
        provincia: null,
        statoEsteroCheck: false
      },
      date: null,
      dataDiNascitaPicker: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    rappresentanteLegale: {
      codiceFiscaleRL: {
        required,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        alphaNum
      },
      sesso: {
        required
      },
      nome: {
        required
      },
      dataDiNascita: {
        required,
        adult: function () {
          return this.isAdult()
        }
      },
      cognome: { required },
      stato: {
        required: requiredIf(function () {
          return this.rappresentanteLegale.statoEsteroCheck
        })
      },
      comune: {
        required: requiredIf(function () {
          return !this.rappresentanteLegale.statoEsteroCheck
        })
      },
      provincia: {
        required: requiredIf(function () {
          return !this.rappresentanteLegale.statoEsteroCheck
        })
      }
    }
  },
  computed: {
    cfRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.codiceFiscaleRL.$dirty) return errors
      !this.$v.rappresentanteLegale.codiceFiscaleRL.required && errors.push('Il codice fiscale è obbligatorio.')
      !this.$v.rappresentanteLegale.codiceFiscaleRL.minLength && errors.push('Il codice fiscale deve avere una lunghezza minima di ' + this.$v.rappresentanteLegale.codiceFiscaleRL.$params.minLength.min + ' caratteri.')
      !this.$v.rappresentanteLegale.codiceFiscaleRL.alphaNum && errors.push('Il codice fiscale deve contenere solo lettere e numeri.')
      return errors
    },
    sessoRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.sesso.$dirty) return errors
      !this.$v.rappresentanteLegale.sesso.required && errors.push('Il sesso è obbligatorio.')
      return errors
    },
    nomeRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.nome.$dirty) return errors
      !this.$v.rappresentanteLegale.nome.required && errors.push('Il nome è obbligatorio.')
      return errors
    },
    cognomeRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.cognome.$dirty) return errors
      !this.$v.rappresentanteLegale.cognome.required && errors.push('Il cognome è obbligatorio.')
      return errors
    },
    comuneRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.comune.$dirty) return errors
      !this.$v.rappresentanteLegale.comune.required && errors.push('Il comune è obbligatorio.')
      return errors
    },
    provinciaRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.provincia.$dirty) return errors
      !this.$v.rappresentanteLegale.provincia.required && errors.push('La provincia è obbligatorio.')
      return errors
    },
    statoRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.stato.$dirty) return errors
      !this.$v.rappresentanteLegale.stato.required && errors.push('Lo stato di nascita è obbligatorio.')
      return errors
    },
    dataDiNascitaRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.dataDiNascita.$dirty) return errors
      !this.$v.rappresentanteLegale.dataDiNascita.required && errors.push('La data di nascita è obbligatoria.')
      !this.$v.rappresentanteLegale.dataDiNascita.adult && errors.push('Devi essere maggiorenne per chiedere una rateizzazione.')
      return errors
    },
    computedDateFormatted () {
      return this.formatDate(this.rappresentanteLegale.dataDiNascita)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    isAdult () {
      const dataNascita = new Date(this.rappresentanteLegale.dataDiNascita.toString())
      dataNascita.setFullYear(dataNascita.getFullYear() + 18)
      if (isNaN(dataNascita.getTime())) return false
      return (dataNascita <= new Date())
    },

    datiRapprLegaleValidi () {
      this.$v.rappresentanteLegale.$touch()
      return !(this.$v.rappresentanteLegale.$invalid)
    },

    datiRappresentanteLegale () {
      const rapprLegale = {
        codiceFiscaleR: this.rappresentanteLegale.codiceFiscaleRL,
        sesso: this.rappresentanteLegale.sesso,
        nome: this.rappresentanteLegale.nome,
        cognome: this.rappresentanteLegale.cognome,
        dataDiNascita: this.rappresentanteLegale.dataDiNascita
      }
      if (this.rappresentanteLegale.statoEsteroCheck) {
        rapprLegale.comune = this.rappresentanteLegale.stato
        rapprLegale.provincia = ''
      } else {
        rapprLegale.comune = this.rappresentanteLegale.comune
        rapprLegale.provincia = this.rappresentanteLegale.provincia
      }
      return rapprLegale
    }
  }
}
</script>
