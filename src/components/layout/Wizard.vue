<template>
  <div>
    <v-stepper
    class="sp-wizard"
    v-model="e1"
    altLabels>
    <v-stepper-header>
      <template v-for="(item, index) in wizardSteps">
      <v-stepper-step
        :key="`${index}-step`"
        :complete="e1 > index + 1" :step="index + 1">
       <em class="step">
          <span class="sr-only">step {{ index+1 }}</span><span class="sr-only"> di {{ wizardSteps.length }}</span>
          <span v-if="index == stepAttivo" class="sr-only">Step attivo</span>
        </em>
        <span>{{ item }}</span>
      </v-stepper-step>
      <v-divider
          v-if="index !== wizardSteps.length - 1"
          :key="index"></v-divider>
      </template>
    </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script>
export default {
  name: 'Wizard',
  props: {
    servizio: { type: String, required: true },
    stepAttivo: { type: Number, required: true }
  },
  data () {
    return {
      e1: this.stepAttivo + 1,
      ulClass: 'sp-wizard four-steps'
    }
  },
  computed: {
    wizardSteps: function () {
      switch (this.servizio) {
        case 'pago_bollo':
          this.ulClass = 'sp-wizard five-steps'
          return ['Cerca pagamento', 'Calcolo importo', 'Riepilogo', 'Pagamento', 'Esito']
        case 'richiesta_rateizzazione':
          return ['Dati contribuente', 'Rate', 'Riepilogo', 'Esito']
        case 'richiesta_rappresentante_legale':
          return ['Sezione 1.1', 'Sezione 1.2']
        case 'domanda_discarico_rimborso':
          return ['Dati contribuente', 'Domanda discarico rimborso', 'Riepilogo', 'Esito']
        default:
          return ['Intestatario avviso', 'Osservazione', 'Riepilogo', 'Esito']
      }
    }
  }
}
</script>
