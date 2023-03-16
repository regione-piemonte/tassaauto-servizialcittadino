<template>
  <div class="space-section">
    <h2>
      Pagamento
    </h2>
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
            <p v-html="this.$i18n.t('bollo.pago.pagamento')"></p>
          </v-col>
        </v-row>
      </v-alert>
  </div>
</template>

<script>
export default {
  name: 'PagamentoPagoPa'
}
</script>
