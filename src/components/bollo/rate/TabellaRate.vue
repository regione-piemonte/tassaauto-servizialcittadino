<template>
  <div class="space-section">
    <h2>
      {{ titoloSezione }}
    </h2>
    <div>
      <div class="noAccordion" role="tablist">
        <v-card
          v-for="(item, index) in rate"
          :key="index"
          no-body>
          <v-row justify="center">
            <div class="col-md-3 col-sm-6 align-self-center text-center">
              <div class="mb-4 mb-sm-0 checkboxRecap">
                RATA <v-avatar color="primary white--text ml-3">{{ item.numeroRata }}</v-avatar>
              </div>
            </div>
            <div class="col-md-5 col-sm-6 align-self-center text-center">
              <div class="data-up dl-inline-header">
                <dl class="text-center w-100">
                  <dt>
                    scadenza
                  </dt>
                  <dd>
                    {{ item.scadenza }}
                  </dd>
                </dl>
              </div>
            </div>
            <div class="col-md-4 col-sm-6 align-self-center">
              <div class="data-up dl-inline-header">
                <dl class="text-center w-100">
                  <dt>
                    importo
                  </dt>
                  <dd>
                    {{ item.importo | formatCurrency }}
                  </dd>
                </dl>
              </div>
            </div>
          </v-row>
        </v-card>
      </div>
      <div class="cardTotale space-section">
        <div class="boxTotale">
          <p class="costoTotale h1">
            Totale importo {{ importoTotale | formatCurrency }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabellaRate',
  props: {
    rate: { type: Array, required: true },
    importoTotale: { type: Number, required: true },
    ratePagate: { type: Boolean, required: true }
  },
  computed: {
    titoloSezione: function () {
      if (this.ratePagate) return 'Totale importo rate pagate:'
      return 'Totale importo'
    }
  }
}
</script>
