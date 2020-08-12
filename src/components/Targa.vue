<template>
  <v-text-field
    clearable
    clear-icon="mdi-close-circle"
    label="Targa"
    id="targa"
    type="text"
    v-model="targaForm.targa"
    @change.native="resetErroriServer()"
    :maxLength="$v.targaForm.targa.$params.maxLength.max"
    :error-messages="targaErrors"
    autocomplete="off"
    :error-count="4"
    ></v-text-field>
</template>

<script>
import { TARGA_MAX_LENGTH } from '@/common/config'
import { validationMixin } from 'vuelidate'
import { required, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'Targa',
  props: {
    pServerErr: { type: String, required: false }
  },
  data () {
    return {
      targaForm: {
        targa: ''
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    targaForm: {
      targa: {
        required,
        maxLength: maxLength(TARGA_MAX_LENGTH),
        alphaNum,
        serverValidOk: function () {
          return (this.pServerErr === '' || this.pServerErr === undefined)
        }
      }
    }
  },
  computed: {
    targaErrors () {
      const errors = []
      if (!this.$v.targaForm.targa.$dirty) return errors
      !this.$v.targaForm.targa.required && errors.push('La targa è obbligatoria.')
      !this.$v.targaForm.targa.maxLength && errors.push('La targa deve avere una lunghezza massima di ' + this.$v.targaForm.targa.$params.maxLength.max + ' caratteri.')
      !this.$v.targaForm.targa.alphaNum && errors.push('La targa deve contenere solo lettere e numeri.')
      !this.$v.targaForm.targa.serverValidOk && errors.push(this.pServerErr)
      return errors
    }
  },
  methods: {
    getValore () {
      return this.targaForm.targa
    },

    resetErroriServer () {
      this.$emit('targachanged')
    }
  }
}
</script>
