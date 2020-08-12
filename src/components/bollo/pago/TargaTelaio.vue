<template>
  <v-text-field
    clearable
    clear-icon="mdi-close-circle"
    label="Targa/Telaio"
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
import { TELAIO_MAX_LENGTH } from '@/common/config'
import { validationMixin } from 'vuelidate'
import { required, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'TargaTelaio',
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
        maxLength: maxLength(TELAIO_MAX_LENGTH),
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
      !this.$v.targaForm.targa.required && errors.push('La Targa/Telaio è obbligatoria/o.')
      !this.$v.targaForm.targa.maxLength && errors.push('La Targa/Telaio deve avere una lunghezza massima di ' + this.$v.targaForm.targa.$params.maxLength.max + ' caratteri.')
      !this.$v.targaForm.targa.alphaNum && errors.push('La Targa/Telaio deve contenere solo lettere e numeri.')
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
