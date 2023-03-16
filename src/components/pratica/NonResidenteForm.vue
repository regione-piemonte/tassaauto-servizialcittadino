<template>
  <div class="space-section">
    <h2>Dati anagrafici contribuente</h2>
    <v-form>
      <!--inizio dati anagrafici -->
      <!--cognome -->
      <p>{{ userIdentity.nome }} {{ userIdentity.cognome }}</p>
      <p>CF: {{ userIdentity.cf }}</p>
      <v-alert
        class="mt-5"
        show
        aria-live="off"
        type="info"
        border="left"
        :icon="false"
      >
        <v-row class="pl-6 pl-md-12">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
            />
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p>
              Attenzione: i tuoi dati non sono presenti nell'<strong>anagrafe regionale</strong><br />
              L'inserimento dei propri dati è <strong>obbligatorio</strong> per procedere
              con l'inserimento della domanda di restituzione
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <v-radio-group
        :error-messages="sessoErrors"
        label="Sesso*"
        id="sesso"
        row
        v-model="nonResidenteForm.sesso"
      >
        <v-radio label="Femmina" value="F"></v-radio>
        <v-radio label="Maschio" value="M"></v-radio>
      </v-radio-group>
      <!--date picker -->
      <!--data nascita -->
      <v-text-field
        :error-count="1"
        type="date"
        :error-messages="dataDiNascitaErrors"
        id="dataDiNascita"
        label="Data di Nascita*"
        :readonly="false"
        v-model="nonResidenteForm.dataDiNascita"
      ></v-text-field>
      <!--fine date picker -->
      <v-alert
        :icon="false"
        aria-live="off"
        border="left"
        class="mt-5"
        show
        type="info"
      >
        <v-row class="pl-6 pl-md-12">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
            />
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p>
              Selezionare la Provincia di nascita <b>oppure</b> lo Stato estero
              di Nascita
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <!--switch nazione -->
      <v-switch
        :ripple="false"
        id="cittadinoEsteroSwitch"
        label="Cittadino di Stato Estero"
        v-model="nonResidenteForm.statoEsteroCheck"
      >
      </v-switch>
      <!--nazione -->
      <v-select
        :error-count="1"
        :error-messages="nazioneAnagraficaErrors"
        :items="nazioniAnagrafica"
        id="nazioni"
        label="Seleziona nazione*"
        v-if="nonResidenteForm.statoEsteroCheck"
        v-model="nonResidenteForm.nazioneAnagrafica"
      ></v-select>
      <!--provincia -->
      <v-select
        :disabled="nonResidenteForm.statoEsteroCheck ? true : false"
        :error-count="1"
        :error-messages="provinciaAnagraficaErrors"
        :items="provinceAnagrafica"
        @change="elencoComuniAnagrafica($event)"
        id="province"
        label="Seleziona provincia*"
        v-model="nonResidenteForm.provinciaAnagrafica"
      ></v-select>
      <!--comune -->
      <v-select
        :disabled="!nonResidenteForm.provinciaAnagrafica"
        :error-count="1"
        :error-messages="comuneAnagraficaErrors"
        :items="comuniAnagrafica"
        id="comuni"
        label="Seleziona comune*"
        v-model="nonResidenteForm.comuneAnagrafica"
      ></v-select>
      <!--fine dati anagrafici -->
      <!--inizio dati residenza -->
      <h2>Indirizzo contribuente</h2>
      <!--provincia residenza -->
      <v-select
        :error-count="1"
        :error-messages="provinciaErrors"
        :items="provinceAnagrafica"
        @change="elencoComuniResidenza($event)"
        id="provinceRes"
        label="Seleziona provincia di residenza*"
        v-model="nonResidenteForm.provinciaResidenza"
      ></v-select>
      <!--comune residenza -->
      <v-select
        :disabled="!nonResidenteForm.provinciaResidenza"
        :error-count="1"
        :error-messages="comuneErrors"
        :items="comuniResidenza"
        id="comuniRes"
        label="Seleziona comune di residenza*"
        v-model="nonResidenteForm.comuneResidenza"
      ></v-select>
      <!--cap residenza -->
      <v-text-field
        :error-count="1"
        :error-messages="capErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="cap"
        label="CAP di residenza*"
        type="number"
        v-model="nonResidenteForm.capResidenza"
      ></v-text-field>
      <!--indirizzo residenza -->
      <v-text-field
        :error-count="1"
        :error-messages="indirizzoErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="indirizzo"
        label="Indirizzo di residenza*"
        type="text"
        v-model="nonResidenteForm.indirizzoResidenza"
      ></v-text-field>
      <!--civico residenza -->
      <v-text-field
        :error-count="1"
        :error-messages="civicoErrors"
        autocomplete="off"
        clear-icon="mdi-close-circle"
        clearable
        id="civico"
        label="Civico di residenza*"
        type="text"
        v-model="nonResidenteForm.civicoResidenza"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { COMMON_NAZIONI_ANAGRAFICA, COMMON_PROVINCE_ANAGRAFICA, COMMON_COMUNI_ANAGRAFICA, COMMON_COMUNI_RESIDENZA } from '@/store/actions.type'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  name: 'nonResidenteBox',
  data () {
    return {
      nonResidenteForm: {
        nome: null,
        cognome: null,
        codiceFiscale: null,
        sesso: null,
        dataDiNascita: '',
        provinciaResidenza: null,
        comuneResidenza: null,
        capResidenza: null,
        indirizzoResidenza: null,
        civicoResidenza: null,
        nazioneAnagrafica: null,
        provinciaAnagrafica: null,
        comuneAnagrafica: null,
        statoEsteroCheck: false
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    nonResidenteForm: {
      sesso: {
        required
      },
      dataDiNascita: {
        required,
        adult: function () {
          return this.isAdult()
        }
      },
      civicoResidenza: {
        required
      },
      capResidenza: {
        required
      },
      indirizzoResidenza: {
        required
      },
      comuneResidenza: {
        required
      },
      provinciaResidenza: {
        required
      },
      comuneAnagrafica: {
        required: requiredIf(function () {
          return !this.nonResidenteForm.statoEsteroCheck
        })
      },
      provinciaAnagrafica: {
        required: requiredIf(function () {
          return !this.nonResidenteForm.statoEsteroCheck
        })
      },
      nazioneAnagrafica: {
        required: requiredIf(function () {
          return this.nonResidenteForm.statoEsteroCheck
        })
      }
    }

  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'nazioniAnagrafica',
      'provinceAnagrafica',
      'comuniAnagrafica',
      'comuniResidenza'
    ]),
    sessoErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.sesso.$dirty) return errors
      !this.$v.nonResidenteForm.sesso.required && errors.push('Il campo sesso è obbligatorio.')
      return errors
    },
    civicoErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.civicoResidenza.$dirty) return errors
      !this.$v.nonResidenteForm.civicoResidenza.required && errors.push('Il numero civico è obbligatorio.')
      return errors
    },
    capErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.capResidenza.$dirty) return errors
      !this.$v.nonResidenteForm.capResidenza.required && errors.push('Il CAP è obbligatorio.')
      return errors
    },
    indirizzoErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.indirizzoResidenza.$dirty) return errors
      !this.$v.nonResidenteForm.indirizzoResidenza.required && errors.push('L\'indirizzo è obbligatorio.')
      return errors
    },
    comuneErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.comuneResidenza.$dirty) return errors
      !this.$v.nonResidenteForm.comuneResidenza.required && errors.push('Il comune è obbligatorio.')
      return errors
    },
    provinciaErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.provinciaResidenza.$dirty) return errors
      !this.$v.nonResidenteForm.provinciaResidenza.required && errors.push('La provincia è obbligatoria.')
      return errors
    },
    comuneAnagraficaErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.comuneAnagrafica.$dirty) return errors
      !this.$v.nonResidenteForm.comuneAnagrafica.required && errors.push('Il comune è obbligatorio.')
      return errors
    },
    provinciaAnagraficaErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.provinciaAnagrafica.$dirty) return errors
      !this.$v.nonResidenteForm.provinciaAnagrafica.required && errors.push('La provincia è obbligatoria.')
      return errors
    },
    nazioneAnagraficaErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.nazioneAnagrafica.$dirty) return errors
      !this.$v.nonResidenteForm.nazioneAnagrafica.required && errors.push('La nazione è obbligatoria.')
      return errors
    },
    dataDiNascitaErrors () {
      const errors = []
      if (!this.$v.nonResidenteForm.dataDiNascita.$dirty) return errors
      !this.$v.nonResidenteForm.dataDiNascita.required && errors.push('La data di nascita è obbligatoria.')
      !this.$v.nonResidenteForm.dataDiNascita.adult && errors.push('Devi essere maggiorenne per chiedere una rateizzazione.')
      return errors
    }
  },
  methods: {
    async elencoComuniResidenza (event) {
      this.nonResidenteForm.comuniResidenza = event
      return await store.dispatch(COMMON_COMUNI_RESIDENZA, event.codice)
    },
    async elencoComuniAnagrafica (event) {
      this.nonResidenteForm.comuneAnagrafica = event
      return await store.dispatch(COMMON_COMUNI_ANAGRAFICA, event.codice)
    },
    isAdult () {
      const dataNascita = new Date(this.nonResidenteForm.dataDiNascita.toString())
      dataNascita.setFullYear(dataNascita.getFullYear() + 18)
      if (isNaN(dataNascita.getTime())) return false
      return (dataNascita <= new Date())
    },

    datiNonResValidi () {
      this.$v.nonResidenteForm.$touch()
      return !(this.$v.nonResidenteForm.$invalid)
    },

    datiNonResidente () {
      const nonRes = {
        codiceFiscaleR: this.nonResidenteForm.codiceFiscale,
        sesso: this.nonResidenteForm.sesso,
        nome: this.nonResidenteForm.nome,
        cognome: this.nonResidenteForm.cognome,
        dataDiNascita: this.nonResidenteForm.dataDiNascita
      }
      if (this.nonResidenteForm.statoEsteroCheck) {
        nonRes.comune = this.nonResidenteForm.stato
        nonRes.provincia = ''
      } else {
        nonRes.comune = this.nonResidenteForm.comune
        nonRes.provincia = this.nonResidenteForm.provincia
      }
      return nonRes
    }
  },
  async created () {
    await store.dispatch(COMMON_NAZIONI_ANAGRAFICA)
    await store.dispatch(COMMON_PROVINCE_ANAGRAFICA)
    this.nonResidenteForm.codiceFiscale = this.userIdentity.cf
    this.nonResidenteForm.cognome = this.userIdentity.cognome
    this.nonResidenteForm.nome = this.userIdentity.nome
  }
}

</script>
