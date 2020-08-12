<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <p>
          Compila i campi sottostanti e procedi con il download dell'avviso di accertamento.<br>
          La stampa dell'avviso di accertamento può essere richiesta nel caso in cui il contribuente abbia smarrito l'avviso.<br>
          Il servizio riproduce l'<strong>avviso di accertamento</strong> con allegato il <strong>bollettino pagoPa</strong>.
        </p>
        <p>
          La stampa può essere richiesta specificando il <strong>codice avviso di pagamento / IUV</strong> oppure specificando i <strong>dati del veicolo</strong>.
        </p>
      </div>
    </div>
    <v-card class="card-view-page">
      <div class="app-row inner-cont-alert">
        <div class="text-intro col-xxl-8 offset-xxl-2"
        id="boxErrDiv">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="tab-content-hp">
        <div class="app-row inner-cont-bollo">
          <div class="pagobollo-hp col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              :src="require('@/assets/images/ritagli/servizi/stampa_avviso.svg')"
              alt=""
              fluid
              width="178"/>
          </div>
          <v-tabs
            fixed-tabs
            show-arrows="mobile"
            v-model="tabIndex"
            centered>
            <v-tab active>
              {{ $t('pratica.stampa.accertamento.tab_1') }}
            </v-tab>
            <v-tab>
              {{ $t('pratica.stampa.accertamento.tab_2') }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabIndex" class="noauthService">
            <v-tab-item>
              <strong class="mb-3 d-block">
                Cerca un avviso di accertamento da stampare
              </strong>
              <CercaIuv
                :pStampaAccertamento="true"
                v-bind:boxErr.sync="detailError"
                v-on:controlspinner="overlay = $event.running"
                v-on:updateboxerr="updateDetailError($event)"
              />
            </v-tab-item>
            <v-tab-item>
              <strong class="mb-3 d-block">
                Cerca un avviso di accertamento da stampare
              </strong>
              <CercaDatiVeicolo
                :pStampaAccertamento="true"
                v-bind:boxErr.sync="detailError"
                v-on:controlspinner="overlay = $event.running"
                v-on:updateboxerr="updateDetailError($event)"
              />
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import BoxErrore from '@/components/BoxErrore'
import CercaDatiVeicolo from '@/components/pratica/stampa/CercaDatiVeicolo'
import CercaIuv from '@/components/pratica/stampa/CercaIuv'
import Spinner from '@/components/layout/Spinner'

export default {
  components: { BoxErrore, CercaDatiVeicolo, CercaIuv, Spinner },
  data () {
    return {
      detailError: { message: '', title: '' },
      overlay: false,
      tabIndex: 0
    }
  },
  methods: {
    updateDetailError (detErr) {
      this.detailError = detErr
    }
  }
}
</script>
