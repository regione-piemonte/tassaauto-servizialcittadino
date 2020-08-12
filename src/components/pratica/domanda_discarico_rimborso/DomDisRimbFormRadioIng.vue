<template>
  <div class="row mt-2">
    <div class="col-12">
      <strong class="fix-align">
        N° ingiunzione
      </strong>
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
              <strong>Attenzione</strong>: Dato <strong>obbligatorio</strong>
              Il numero dell'ingiunzione è a pagina 1, in alto, e segue l'oggetto (INGIUNZIONE DI PAGAMENTO N°...).
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <v-select
        id="numIngiunzione"
        class="col-md-6 col-xl-4"
        :items="elencoIngiunzione"
        v-model="datiDomanda.numeroIngiunzione"
        :error-messages="numIngiunzioneErrors"
        :error-count="1">
        <template v-slot:first>
          <option :value="null" disabled>seleziona n° dell'ingiunzione</option>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'DomDisRimbFormRadioIng',
  props: {
    elencoIngiunzione: { required: true },
    pNumIngiunzione: { required: true }
  },
  data () {
    return {
      datiDomanda: {
        numeroIngiunzione: this.pNumIngiunzione
      }
    }
  },
  computed: {
    numIngiunzioneErrors () {
      const errors = []
      if (!this.$v.datiDomanda.numeroIngiunzione.$dirty) return errors
      !this.$v.datiDomanda.numeroIngiunzione.required && errors.push('Selezionare un numero di ingiunzione.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    datiDomanda: {
      numeroIngiunzione: {
        required
      }
    }
  }
}
</script>
