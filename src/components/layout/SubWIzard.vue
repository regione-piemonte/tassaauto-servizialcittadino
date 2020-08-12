<template>
  <div>
    <ul :class="ulClass">
      <li v-for="(item, index) in wizardSteps"
        :key="index"
        :class="(index == stepAttivo) ? 'active' : ''"
        class="col">
        <span class="sr-only">sottostep {{ index+1 }} di {{ wizardSteps.length }}</span>
        <span tabindex="0">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SubWizard',
  props: {
    servizio: { type: String, required: true },
    stepAttivo: { type: Number, required: true }
  },
  data () {
    return {
      ulClass: 'sp-Subwizard'
    }
  },
  computed: {
    wizardSteps: function () {
      if (this.servizio === 'richiesta_rappresentante_legale') {
        this.ulClass = 'sp-wizard sp-Subwizard'
        return ['Sezione 1.1', 'Sezione 1.2']
      }
    }
  }
}
</script>
