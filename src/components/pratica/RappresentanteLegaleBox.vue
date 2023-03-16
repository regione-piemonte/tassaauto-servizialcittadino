<template>
  <div class="space-section">
    <h2>
      Compilare i dati del rappresentante legale e successivamente inserire la
      P.IVA della società rappresentata
    </h2>
    <p>Tutti i campi sono obbligatori</p>
    <v-form>
      <v-text-field
        :error-count="3"
        :error-messages="cfRLErrors"
        :maxLength="
          $v.rappresentanteLegale.codiceFiscaleRL.$params.maxLength.max
        "
        autocomplete="off"
        class="uppercase-input"
        clear-icon="mdi-close-circle"
        clearable
        id="codiceFiscaleRL"
        label="Codice fiscale"
        type="text"
        v-model="rappresentanteLegale.codiceFiscaleRL"
        @focusout="toTrim()"
      ></v-text-field>
      <v-radio-group
        :error-messages="sessoRLErrors"
        label="Sesso"
        name="rappLegSesso"
        row
        v-model="rappresentanteLegale.sesso"
      >
        <v-radio label="Femmina" value="F"></v-radio>
        <v-radio label="Maschio" value="M"></v-radio>
      </v-radio-group>
      <v-text-field
        :error-count="1"
        :error-messages="nomeRLErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="nome"
        label="Nome"
        type="text"
        v-model="rappresentanteLegale.nome"
      ></v-text-field>
      <v-text-field
        :error-messages="cognomeRLErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="cognome"
        label="Cognome"
        type="text"
        v-model="rappresentanteLegale.cognome"
        :error-count="1"
      ></v-text-field>
      <!--date picker -->
      <v-text-field
          :error-count="1"
          :error-messages="dataDiNascitaRLErrors"
          id="dataDiNascita"
          label="Data di Nascita"
          aria-label="data di nascita"
          :readonly="false"
          v-model="rappresentanteLegale.dataDiNascita"
          @input="dataDiNascitaPicker = false"
          type="date"
        ></v-text-field>
      <!--fine date picker -->
      <v-text-field
        :disabled="rappresentanteLegale.statoEsteroCheck ? true : false"
        :error-count="1"
        :error-messages="comuneRLErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="comune"
        label="Comune di Nascita"
        type="text"
        v-model="rappresentanteLegale.comune"
      ></v-text-field>
      <v-text-field
        :disabled="rappresentanteLegale.statoEsteroCheck ? true : false"
        :error-count="1"
        :error-messages="provinciaRLErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="provincia"
        label="Provincia di Nascita"
        type="text"
        v-model="rappresentanteLegale.provincia"
      ></v-text-field>
      <v-switch
        :ripple="false"
        id="cittadinoEsteroSwitch"
        label="Cittadino di Stato Estero"
        v-model="rappresentanteLegale.statoEsteroCheck"
      >
      </v-switch>
      <v-text-field
        :error-count="1"
        :error-messages="statoRLErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="stato"
        label="Stato di Nascita"
        type="text"
        v-if="rappresentanteLegale.statoEsteroCheck"
        v-model="rappresentanteLegale.stato"
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
      !this.$v.rappresentanteLegale.sesso.required && errors.push('Il campo sesso è obbligatorio.')
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
      !this.$v.rappresentanteLegale.stato.required && errors.push('Lo stato di Nascita è obbligatorio.')
      return errors
    },
    dataDiNascitaRLErrors () {
      const errors = []
      if (!this.$v.rappresentanteLegale.dataDiNascita.$dirty) return errors
      !this.$v.rappresentanteLegale.dataDiNascita.required && errors.push('La data di Nascita è obbligatoria.')
      !this.$v.rappresentanteLegale.dataDiNascita.adult && errors.push('Devi essere maggiorenne per chiedere una rateizzazione.')
      return errors
    },
    computedDateFormatted () {
      return this.formatDate(this.rappresentanteLegale.dataDiNascita)
    }
  },
  methods: {
    toTrim () {
      this.rappresentanteLegale.codiceFiscaleRL = this.rappresentanteLegale.codiceFiscaleRL.replace(/\s/g, '').toUpperCase()
    },
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
