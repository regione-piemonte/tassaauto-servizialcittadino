<template>
  <div class="space-section">
    <h2>
      Esito
    </h2>
     <v-alert
      class="w-100 success-alert"
      type="success"
      border="left"
      :icon="false"
      show
      aria-relevant="all">
      <v-row class="pl-6 pl-md-12">
        <v-col cols="12" md="1">
          <v-img
            width="40"
            :src="require(`@/assets/images/icone/alert/success.svg`)"
            :lazy-src="require(`@/assets/images/icone/alert/success.svg`)"/>
        </v-col>
        <v-col cols="12" md="10" class="bodyAlertDark">
          <div v-html="esito"></div>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
import { emailAttiva, smsAttivo } from '@/common/config'
export default {
  name: 'DomandaEsitoBox',
  props: {
    numeroProtocollo: { type: String, required: true }
  },
  computed: {
    esito: function () {
      if (emailAttiva() && smsAttivo()) {
        return this.$i18n.t('pratica.page_text.step_esito', { numeroProtocollo: this.numeroProtocollo })
      }
      if (emailAttiva()) {
        return this.$i18n.t('pratica.page_text.step_esito_email', { numeroProtocollo: this.numeroProtocollo })
      }
      if (smsAttivo()) {
        return this.$i18n.t('pratica.page_text.step_esito_sms', { numeroProtocollo: this.numeroProtocollo })
      }
    }
  }
}
</script>
