<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <p>
          Compila i campi sottostanti e procedi con il download dell'avviso di scadenza.<br>
          La stampa della sintesi dell'avviso di scadenza può essere richiesta nel caso in cui il contribuente riceva l'avviso tramite SMS, e-mail o nel caso in cui abbia smarrito l'avviso stesso.<br>
          Il servizio riproduce la <strong>sintesi cartacea dell'avviso di scadenza</strong> con allegato il <strong>bollettino pagoPa</strong>.
        </p>
        <p>
          La stampa può essere richiesta specificando il <strong>codice avviso di pagamento / IUV</strong> oppure specificando i <strong>dati del veicolo</strong>.
        </p>
      </div>
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
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
          <v-tab :title="$t('pratica.stampa.scadenza.tab_1')" active>
            {{ $t('pratica.stampa.scadenza.tab_1') }}
          </v-tab>
          <v-tab :title="$t('pratica.stampa.scadenza.tab_2')">
            {{ $t('pratica.stampa.scadenza.tab_2') }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabIndex" class="noauthService">
          <v-tab-item>
            <strong class="mb-3 d-block">
              Cerca un avviso di scadenza da stampare
            </strong>
            <CercaIuv
              :pStampaAccertamento="false"
              v-bind:boxErr.sync="detailError"
              v-on:controlspinner="overlay = $event.running"
              v-on:updateboxerr="updateDetailError($event)"
            />
          </v-tab-item>
          <v-tab-item>
            <strong class="mb-3 d-block">
              Cerca un avviso di scadenza da stampare
            </strong>
            <CercaDatiVeicolo
              :pStampaAccertamento="false"
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
import Spinner from '@/components/layout/Spinner'
import CercaDatiVeicolo from '@/components/pratica/stampa/CercaDatiVeicolo'
import CercaIuv from '@/components/pratica/stampa/CercaIuv'

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
