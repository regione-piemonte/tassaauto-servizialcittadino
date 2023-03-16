<template>
  <v-alert class="mt-9" show aria-live="off" type="info" border="left" :icon="false">
    <v-row class="pl-6 pl-md-12">
      <v-col cols="12" md="1">
        <v-img width="40" :src="require(`@/assets/images/icone/alert/info.svg`)"
          :lazy-src="require(`@/assets/images/icone/alert/info.svg`)" />
      </v-col>
      <v-col cols="12" md="10" class="bodyAlertDark">
        <h4 class="alert-heading">Stato pagamento legenda:</h4>
        <v-list>
          <v-list-item>
            <p>
              PROSSIMA SCADENZA: la scadenza è prossima al pagamento, ma non ancora pagabile; la visura è antecedente
              alla data prevista per il pagamento; da non considerare se il veicolo sarà esente alla data prevista per
              il pagamento.
            </p>
          </v-list-item>
          <v-list-item>
            <p>IN SCADENZA: la scadenza può essere pagata; la visura avviene nel mese di pagamento.</p>
          </v-list-item>
          <v-list-item>
            <p>REGOLARE: la scadenza risulta regolarmente pagata.</p>
          </v-list-item>
          <v-list-item>
            <p>IRREGOLARE: il pagamento è omesso o non sufficiente o è stato effettuato in modo errato (nel caso di veicoli storici l'indicazione è valida solo se il veicolo sta circolando).</p>
          </v-list-item>
          <v-list-item>
            <p>ACCERTAMENTO: il pagamento è omesso o non sufficiente o ritardato (alla tassa vengono aggiunte sanzioni ed interessi di mora).</p>
          </v-list-item>
          <v-list-item>
            <p>RATEIZZATO: la scadenza risulta rateizzata.</p>
          </v-list-item>
          <v-list-item>
            <p>INGIUNZIONE o ISCRIZIONE A RUOLO: per la scadenza è stata emessa una ingiunzione fiscale a seguito del mancato pagamento dell'avviso di accertamento.</p>
          </v-list-item>
          <v-list-item>
            <p>INGIUNZIONE o ISCRIZIONE A RUOLO PAGATO: per la scadenza è stata emessa una ingiunzione fiscale a seguito del mancato pagamento dell'avviso di accertamento. L'ingiunzione risulta pagata.</p>
          </v-list-item>
          <v-list-item>
            <p>PAGAMENTO NON DOVUTO: per la scadenza è presente un'esenzione e nulla è dovuto.</p>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: 'AlertInfoLegenda'
}
</script>
