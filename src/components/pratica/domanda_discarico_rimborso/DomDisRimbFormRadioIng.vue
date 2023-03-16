<template>
  <div class="row mt-2">
    <div class="col-12">
      <strong class="fix-align"> N° ingiunzione </strong>
      <v-alert show aria-live="off" type="info" border="left" :icon="false">
        <v-row class="pl-12 pl-md-6">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
            />
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p>
              <strong>Attenzione</strong>: Dato <strong>obbligatorio</strong>
            </p>
            <p
              v-html="
                $t('pratica.domanda_discarico_rimborso.richiesta.intro.numIng')
              "
            />
          </v-col>
        </v-row>
      </v-alert>
      <div class="col-12 col-md-6">
        <v-select
          id="numIngiunzione"
          class="col-md-6 col-lg-4"
          :items="elencoIngiunzione"
          label="Seleziona il n° di ingiunzione"
          v-model="datiDomanda.numeroIngiunzione"
          :error-messages="numIngiunzioneErrors"
          :error-count="1"
        >
          <template v-slot:first>
            <option :value="null" disabled>
              seleziona n° dell'ingiunzione
            </option>
          </template>
        </v-select>
      </div>
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
