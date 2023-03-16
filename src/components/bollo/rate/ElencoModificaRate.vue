<template>
  <div class="space-section">
    <h2>
      Elenco rate da pagare
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
          <p>
            Puoi selezionare una o più rate a partire da quella con scadenza più vicina.
          </p>
        </v-col>
      </v-row>
    </v-alert>
    <div class="noAccordion" role="tablist">
        <v-card
          class="px-5"
          v-for="(item, index) in pRespPagoRate.rate"
          :key="index">
            <v-row>
              <div class="col-md-3 col-sm-6 align-self-center">
                <div class="mb-4 mb-sm-0">
                  <v-checkbox
                    v-model="selected"
                    @change="calcolaImportoTotale()"
                    :id="'rata'+item.numeroRata"
                    :value="item.numeroRata">
                    <template v-slot:label>
                      <strong>RATA</strong> <v-avatar color="primary" class="white--text ml-3">{{ item.numeroRata }}</v-avatar>
                    </template>
                  </v-checkbox>
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
      <div class="cardTotale space-section">
        <div class="boxTotale">
          <p class="costoTotale h1"
            v-if="pImportoTotale > 0">
            Totale importo {{ pImportoTotale | formatCurrency }}
          </p>
          <p class="costoTotale h1" v-else>
            Aggiungere una rata
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BOLLO_PAGO_RATE_CARRELLO } from '@/store/actions.type'
import store from '@/store'

export default {
  name: 'ElencoModificaRate',
  props: {
    pRespPagoRate: { type: Object, required: true },
    pRateSelezionate: { type: Array, required: true },
    pImportoTotale: { type: Number, required: true }
  },
  data () {
    return {
      selected: []
    }
  },
  methods: {
    calcolaImportoTotale () {
      const calcolaPagamRate = []
      for (let i = 0; i < this.selected.length; i++) {
        const item = this.pRespPagoRate.rate.find(
          p => (p.numeroRata === this.selected[i]))
        if (item !== undefined) calcolaPagamRate.push(item)
      }

      const inputParams = {
        cf: this.pRespPagoRate.intestatario.codiceFiscale,
        numeroRiferimento: this.pRespPagoRate.pianoRateizzazione.numeroRiferimento,
        anno: this.pRespPagoRate.pianoRateizzazione.anno,
        rate: calcolaPagamRate
      }
      this.$emit('controlspinner', { running: true })
      store
        .dispatch(BOLLO_PAGO_RATE_CARRELLO, inputParams)
        .then(() => {
          this.$emit('controlspinner', { running: false })
          this.$emit('updatecalcolo', true)
        })
        .catch((error) => {
          console.log({ error })
          this.$emit('controlspinner', { running: false })
          this.$emit('updatecalcolo', false)
        })
    }
  },
  async created () {
    for (let i = 0; i < this.pRateSelezionate.length; i++) {
      this.selected.push(this.pRateSelezionate[i].numeroRata)
    }
  }
}
</script>
