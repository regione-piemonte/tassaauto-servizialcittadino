<template>
  <v-text-field
    :error-count="4"
    :error-messages="cfErrors"
    :id="'codiceFiscale' + servizioCF"
    :maxLength="$v.cfForm.codiceFiscale.$params.maxLength.max"
    @change.native="resetErroriServer()"
    autocomplete="off"
    class="uppercase-input"
    clear-icon="mdi-close-circle"
    clearable
    :label="
      servizioCF === 'RappresentanteLegale' ||
      servizioCF === 'IntestatarioIngiunzioneRL'
        ? 'Codice fiscale / P.IVA'
        : 'Codice Fiscale'
    "
    type="text"
    v-model="cfForm.codiceFiscale"
  ></v-text-field>
</template>

<script>
import { COD_FISCALE_MIN_LENGTH, COD_FISCALE_MAX_LENGTH } from '@/common/config'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'CodiceFiscale',
  props: {
    pServerErr: { type: String, required: false },
    servizioCF: { type: String, required: false }
  },
  data () {
    return {
      cfForm: {
        codiceFiscale: ''
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    cfForm: {
      codiceFiscale: {
        required,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH),
        alphaNum,
        serverValidOk: function () {
          return (this.pServerErr === '')
        }
      }
    }
  },
  computed: {
    cfErrors () {
      const errors = []
      if (!this.$v.cfForm.codiceFiscale.$dirty) return errors
      !this.$v.cfForm.codiceFiscale.required && errors.push('Il codice fiscale è obbligatorio.')
      !this.$v.cfForm.codiceFiscale.minLength && errors.push('Il codice fiscale deve avere una lunghezza minima di ' + this.$v.cfForm.codiceFiscale.$params.minLength.min + ' caratteri.')
      !this.$v.cfForm.codiceFiscale.alphaNum && errors.push('Il codice fiscale deve contenere solo lettere e numeri.')
      !this.$v.cfForm.codiceFiscale.serverValidOk && errors.push(this.pServerErr)
      return errors
    }
  },
  methods: {
    getValore () {
      return this.cfForm.codiceFiscale
    },
    resetErroriServer () {
      this.$emit('cfchanged')
    }
  }
}
</script>
