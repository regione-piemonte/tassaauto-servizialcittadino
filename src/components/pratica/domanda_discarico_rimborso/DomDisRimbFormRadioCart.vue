<template>
  <div class="row">
    <div class="col-12">
      <strong class="fix-align">N° cartella</strong>
      <v-alert
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
              <strong>Attenzione</strong>: Dato <strong>obbligatorio</strong><br/>
              Il numero della cartella è nella pagina 1, in alto, prima dell'intestazione.
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        id="numeroCartellaEsattoriale"
        type="text"
        v-model="datiDomanda.numeroCartellaEsattoriale"
        :error-messages="numeroCartellaEsattorialeErrors"
        autocomplete="off"
        :error-count="1"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'DomDisRimbFormRadioCart',
  props: {
    pNumCartellaEsattoriale: { required: true }
  },
  data () {
    return {
      datiDomanda: {
        numeroCartellaEsattoriale: this.pNumCartellaEsattoriale
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    datiDomanda: {
      numeroCartellaEsattoriale: {
        required
      }
    }
  },
  computed: {
    numeroCartellaEsattorialeErrors () {
      const errors = []
      if (!this.$v.datiDomanda.numeroCartellaEsattoriale.$dirty) return errors
      !this.$v.datiDomanda.numeroCartellaEsattoriale.required && errors.push('Specificare il numero della cartella.')
      return errors
    }
  }
}
</script>
