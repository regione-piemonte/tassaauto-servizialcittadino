<template>
  <v-alert
  show
  v-if="this.msg.message !== '' && this.msg.title !== ''"
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
        <h4 class="alert-heading mb-5" v-if="msg.title">{{msg.title}}</h4>
        <div v-if="service === 'pago_bollo'">
          <p>
            Riferimento IUV: <strong>{{msg.message.iuv}}</strong>
          </p>
          <p v-if="msg.message.dataOperazione">
            Data operazione: <strong>{{new Date(msg.message.dataOperazione) | dateFormat('DD/MM/YYYY')}}</strong>
          </p>
          <p>
            Siamo in attesa di ricevere la ricevuta telematica contenente l'esito della transazione di pagamento.
          </p>
          <p>
            La comunicazione dell'esito e la Ricevuta telematica saranno inviati alla casella di posta che ci hai indicato: <strong>{{msg.message.email}}</strong>
          </p>
        </div>
        <p v-else v-html="msg.message" />
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: 'BoxNeutral',
  props: {
    msg: { type: Object, required: true },
    service: { type: String }
  }
}
</script>
