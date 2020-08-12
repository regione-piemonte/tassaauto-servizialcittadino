<template>
  <div class="space-section" id="composizione-importo">
    <h2>{{ $t('bollo.ricevuta.scarica.accordion.importo') }}</h2>
    <table class="table table-row">
      <tr>
        <th scope="row">Tassa</th>
        <td>{{ tassa | formatCurrency }}</td>
      </tr>
      <tr>
        <th scope="row">Sanzioni</th>
        <td>{{ sanzione | formatCurrency }}</td>
      </tr>
      <tr>
        <th scope="row">Interessi</th>
        <td>{{ interesse | formatCurrency }}</td>
      </tr>
      <tr>
        <th scope="row"><strong>Totale</strong></th>
        <td><strong>{{ totale | formatCurrency }}</strong></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    interesse: { type: Number, required: true },
    sanzione: { type: Number, required: true },
    tassa: { type: Number, required: true },
    totale: { type: Number, required: true }
  },
  data () {
    return {
    }
  }
}
</script>
