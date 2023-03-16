<template>
  <v-text-field
    :error-count="4"
    :error-messages="targaErrors"
    :maxLength="$v.targaForm.targa.$params.maxLength.max"
    @change.native="resetErroriServer()"
    autocomplete="off"
    class="uppercase-input"
    clear-icon="mdi-close-circle"
    clearable
    id="targa"
    label="Targa"
    type="text"
    v-model="targaForm.targa"
    @focusout="toTrim()"
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
    toTrim () {
      this.targaForm.targa = this.targaForm.targa.replace(/\s/g, '').toUpperCase()
    },
    getValore () {
      return this.targaForm.targa
    },
    resetErroriServer () {
      this.$emit('targachanged')
    }
  }
}
</script>
