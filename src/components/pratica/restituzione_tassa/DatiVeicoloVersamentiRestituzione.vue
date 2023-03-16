<template>
  <div>
    <h2>Versamenti</h2>
    <div
      v-if="
        datiVeicoloVersamentiRestituzione.valueName === 'veicoloNonPresente' &&
        riepilogo === true
      "
      :class="
        'row align-center dl-inline-header text-center bg-ico bg-ico-' +
        veicolo.tipoVeicolo
      "
    >
      <dl class="col-12 col-md-3">
        <dt>tipo</dt>
        <dd>{{ descrizioneVeicolo }}</dd>
      </dl>
      <dl class="col-12 col-md-3">
        <dt>targa</dt>
        <dd>{{ veicolo.targa }}</dd>
      </dl>
    </div>
    <div
      v-else
      :class="
        'row align-center dl-inline-header text-center bg-ico bg-ico-' +
        veicolo.tipoVeicolo.codice
      "
    >
      <dl class="col-12 col-md-3">
        <dt>tipo</dt>
        <dd>{{ veicolo.tipoVeicolo.descrizione }}</dd>
      </dl>
      <dl class="col-12 col-md-3">
        <dt>targa</dt>
        <dd>{{ veicolo.targa }}</dd>
      </dl>
    </div>
    <div class="noAccordion" role="tablist">
      <v-card
        class="px-5"
        v-for="(item, index) in versamenti"
        :key="index"
      >
        <v-row>
          <div class="col-md-2 align-self-center">
            <div class="data-up dl-inline-header">
              <dl class="text-center w-100">
                <dt>Scadenza</dt>
                <dd>{{ new Date(item.scadenza) | dateFormat("MM/YYYY") }}</dd>
              </dl>
            </div>
          </div>
          <div class="col-md-2 align-self-center">
            <div class="data-up dl-inline-header">
              <dl class="text-center w-100">
                <dt>Validità</dt>
                <dd>{{ item.validita }}</dd>
              </dl>
            </div>
          </div>
          <div class="col-md-3 align-self-center">
            <div class="data-up dl-inline-header">
              <dl class="text-center w-100">
                <dt>Importo totale</dt>
                <dd>{{ item.importo | formatCurrency }}</dd>
              </dl>
            </div>
          </div>
          <div class="col-md-3 align-self-center">
            <div class="data-up dl-inline-header">
              <dl class="text-center w-100">
                <dt>Data pagamento</dt>
                <dd>
                  {{ new Date(item.dataPagamento) | dateFormat("DD/MM/YYYY") }}
                </dd>
              </dl>
            </div>
          </div>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import {
  VEICOLO_LISTA
} from '@/store/actions.type'
export default {
  name: 'DatiVeicoloVersamentiRestituzione',
  props: {
    veicolo: { type: Object, required: true },
    riepilogo: { type: Boolean },
    elencoVersamentiVerifica: null
  },
  data () {
    return {
      tipologieVeicoli: []
    }
  },
  computed: {
    ...mapGetters([
      'elencoVeicoliVersamenti',
      'datiVeicoloVersamentiRestituzione'
    ]),
    descrizioneVeicolo () {
      if (this.datiVeicoloVersamentiRestituzione.valueName === 'veicoloNonPresente') {
        for (const p of this.tipologieVeicoli) {
          if (p.value === this.veicolo.tipoVeicolo) {
            return p.text
          }
        }
      }
    },
    versamenti () {
      return this.elencoVersamentiVerifica ? this.elencoVersamentiVerifica : this.elencoVeicoliVersamenti
    }
  },
  async created () {
    await store.dispatch(VEICOLO_LISTA)
      .then((data) => {
        this.tipologieVeicoli = data
      })
  }
}
</script>
