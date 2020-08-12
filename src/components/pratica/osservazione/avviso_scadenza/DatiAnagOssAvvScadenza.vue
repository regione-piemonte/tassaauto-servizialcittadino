<template>
  <div class="space-section">
    <h2>
      Dati anagrafici intestatario avviso
    </h2>
    <div v-if="editMode" aria-live="polite" aria-atomic="false">
      <v-form
        @submit.prevent="confermaModifica">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Codice fiscale"
        id="codiceFiscale"
        type="text"
        v-model="ossAvvScadDatiAnagRett.codiceFiscale"
        :maxlength="$v.ossAvvScadDatiAnagRett.codiceFiscale.$params.maxLength.max"
        :error-messages="cfErrors"
        autocomplete="off"
        :error-count="3"
        ></v-text-field>
        <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Cognome / Denominazione"
        id="cognomeDenominazione"
        type="text"
        v-model="ossAvvScadDatiAnagRett.cognomeDenominazione"
        :error-messages="cognomeDenominazioneErrors"
        autocomplete="off"
        :error-count="1"
        ></v-text-field>
        <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Nome"
        id="nome"
        type="text"
        v-model="ossAvvScadDatiAnagRett.nome"
        :error-messages="nomeErrors"
        autocomplete="off"
        :error-count="1"
        v-if="!personaGiuridica"
        ></v-text-field>
        <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Indirizzo"
        id="indirizzo"
        type="text"
        v-model="ossAvvScadDatiAnagRett.indirizzo"
        :error-messages="indirizzoErrors"
        autocomplete="off"
        :error-count="1"
        ></v-text-field>
        <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Comune"
        id="domicilioFiscale"
        type="text"
        v-model="ossAvvScadDatiAnagRett.domicilioFiscale"
        :error-messages="domicilioFiscaleErrors"
        autocomplete="off"
        :error-count="1"
        ></v-text-field>
        <div class="action-button-wide">
           <div class="col-md-6">
            <v-btn type="button" @click="annullaModifica">Annulla rettifica</v-btn>
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn type="submit" color="primary">Salva</v-btn>
          </div>
        </div>
      </v-form>
    </div>
    <div v-else aria-live="polite" aria-atomic="false">
      <v-alert color="success" show v-if="successMsg !== ''">
        <p>
          {{ successMsg }}
        </p>
      </v-alert>
      <v-alert
      v-if="successMsg === ''"
      show
      aria-live="off"
      type="info"
      border="left"
      :icon="false">
        <v-row class="pl-6 pl-md-12">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"/>
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p>
              Puoi chiedere la variazione / rettifica dei dati anagrafici e di residenza, se quelli qui riportati sono incompleti o errati.
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <v-list
        class="text-uppercase"
        flat>
        <v-list-item-group
          :no-action="true">
          <v-list-item
            id=""
            :inactive="true"
            :ripple="false">
            <span v-if="!personaGiuridica">{{ nome }}&nbsp;</span>{{ cognome }}
          </v-list-item>
          <v-list-item
            id=""
            :inactive="true"
            :ripple="false">
            {{ indirizzo }} {{ domicilioFiscale }}
          </v-list-item>
          <v-list-item
            id=""
            :inactive="true"
            :ripple="false">
            CF: {{ codiceFiscale }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-btn
        type="button"
        class="btn-secondary"
        @click="modifica">
        Segnala variazione dati anagrafici
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COD_FISCALE_MAX_LENGTH } from '@/common/config'
import BoxSuccesso from '@/components/BoxSuccesso'
import { OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { alphaNum, maxLength, required, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'DatiAnagOssAvvScadenza',
  components: { BoxSuccesso },
  data () {
    return {
      editMode: false,
      successMsg: ''
    }
  },
  computed: {
    ...mapGetters([
      'avvisoScadenza',
      'ossAvvScadDatiAnagRett'
    ]),
    nome: function () {
      return (this.ossAvvScadDatiAnagRett.nome !== '') ? this.ossAvvScadDatiAnagRett.nome : this.avvisoScadenza.intestatario.nome
    },
    cognome: function () {
      if (this.ossAvvScadDatiAnagRett.cognomeDenominazione !== '') return this.ossAvvScadDatiAnagRett.cognomeDenominazione
      if (this.avvisoScadenza.intestatario.denominazione !== null && this.avvisoScadenza.intestatario.denominazione !== '') return this.avvisoScadenza.intestatario.denominazione
      return this.avvisoScadenza.intestatario.cognome
    },
    personaGiuridica: function () {
      return (this.avvisoScadenza.intestatario.denominazione !== null && this.avvisoScadenza.intestatario.denominazione !== '')
    },
    indirizzo: function () {
      return (this.ossAvvScadDatiAnagRett.indirizzo !== '') ? this.ossAvvScadDatiAnagRett.indirizzo : this.avvisoScadenza.intestatario.indirizzo
    },
    domicilioFiscale: function () {
      return (this.ossAvvScadDatiAnagRett.domicilioFiscale !== '') ? this.ossAvvScadDatiAnagRett.domicilioFiscale : this.avvisoScadenza.intestatario.indirizzoCompleto
    },
    codiceFiscale: function () {
      return (this.ossAvvScadDatiAnagRett.codiceFiscale !== '') ? this.ossAvvScadDatiAnagRett.codiceFiscale : this.avvisoScadenza.intestatario.codiceFiscale
    },
    cfErrors () {
      const errors = []
      if (!this.$v.ossAvvScadDatiAnagRett.codiceFiscale.$dirty) return errors
      !this.$v.ossAvvScadDatiAnagRett.codiceFiscale.required && errors.push('Il Codice fiscale è obbligatorio.')
      !this.$v.ossAvvScadDatiAnagRett.codiceFiscale.maxLength && errors.push('Il Codice fiscale deve avere una lunghezza massima di ' + this.$v.ossAvvScadDatiAnagRett.codiceFiscale.$params.maxLength.max + ' caratteri.')
      !this.$v.ossAvvScadDatiAnagRett.codiceFiscale.alphaNum && errors.push('Il Codice fiscale deve contenere solo lettere e numeri.')
      return errors
    },
    cognomeDenominazioneErrors () {
      const errors = []
      if (!this.$v.ossAvvScadDatiAnagRett.cognomeDenominazione.$dirty) return errors
      !this.$v.ossAvvScadDatiAnagRett.cognomeDenominazione.required && errors.push('Il Codice fiscale è obbligatorio.')
      return errors
    },
    nomeErrors () {
      const errors = []
      if (!this.$v.ossAvvScadDatiAnagRett.nome.$dirty) return errors
      !this.$v.ossAvvScadDatiAnagRett.nome.required && errors.push('Il Nome è obbligatorio.')
      return errors
    },
    indirizzoErrors () {
      const errors = []
      if (!this.$v.ossAvvScadDatiAnagRett.indirizzo.$dirty) return errors
      !this.$v.ossAvvScadDatiAnagRett.indirizzo.required && errors.push('L\'indirizzo è obbligatorio.')
      return errors
    },
    domicilioFiscaleErrors () {
      const errors = []
      if (!this.$v.ossAvvScadDatiAnagRett.domicilioFiscale.$dirty) return errors
      !this.$v.ossAvvScadDatiAnagRett.domicilioFiscale.required && errors.push('Il Comune è obbligatorio.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    ossAvvScadDatiAnagRett: {
      codiceFiscale: {
        required,
        alphaNum,
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH)
      },
      nome: { required: requiredIf(function () { return !this.personaGiuridica }) },
      cognomeDenominazione: { required },
      indirizzo: { required },
      domicilioFiscale: { required }
    }
  },
  methods: {
    annullaModifica () {
      this.ossAvvScadDatiAnagRett.value = false
      this.ossAvvScadDatiAnagRett.codiceFiscale = ''
      this.ossAvvScadDatiAnagRett.cognomeDenominazione = ''
      if (!this.personaGiuridica) this.ossAvvScadDatiAnagRett.nome = ''
      this.ossAvvScadDatiAnagRett.domicilioFiscale = ''
      this.ossAvvScadDatiAnagRett.indirizzo = ''

      store.dispatch(OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI, this.ossAvvScadDatiAnagRett)
      this.editMode = false
      this.successMsg = ''
    },
    modifica () {
      this.editMode = true
    },
    confermaModifica () {
      this.$v.ossAvvScadDatiAnagRett.$touch()
      if (this.$v.ossAvvScadDatiAnagRett.$invalid) return

      this.ossAvvScadDatiAnagRett.value = true
      store.dispatch(OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI, this.ossAvvScadDatiAnagRett)
      this.editMode = false
      this.successMsg = 'La variazione / rettifica dei dati anagrafici e di residenza è stata completata con successo.'
    }
  }
}
</script>
