<template>
  <div class="space-section">
    <h2>
      Pagamento
    </h2>
    <v-alert
      color="info"
      border="left">
      <template v-slot:prepend>
        <v-icon x-large>mdi-information</v-icon>
      </template>
      <p v-html="this.$i18n.t('bollo.pago.pagamento')"></p>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'PagamentoPagoPa'
}
</script>
