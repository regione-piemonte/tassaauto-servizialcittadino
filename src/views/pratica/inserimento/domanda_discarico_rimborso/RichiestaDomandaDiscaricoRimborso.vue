<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div
        class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2"
        v-html="this.$i18n.t('pratica.domanda_discarico_rimborso.richiesta.intro.par')"
      />
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <Wizard
          :servizio="'domanda_discarico_rimborso'"
          :stepAttivo="0"
        />
      </div>
    </div>
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
          width="178"
          :src="require('@/assets/images/ritagli/servizi/domanda_discarico_rimborso.svg')"
          alt=""
          fluid/>
        </div>
        <v-tabs
        class="tabServizi"
        aria-live="polite"
        aria-aromic="false"
        v-model="tabs"
        centered
        fixed-tabs
        show-arrows="mobile">
          <v-tab
            active
            @click="detailError={ message: '', title: '' }">
            {{ $t('pratica.domanda_discarico_rimborso.richiesta.labels.tab_1') }}
          </v-tab>
          <v-tab
            @click="detailError={ message: '', title: '' }">
            {{ $t('pratica.domanda_discarico_rimborso.richiesta.labels.tab_2') }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs" class="noauthService">
          <v-tab-item>
            <DisRimbIntestatarioVeicolo
              v-bind:boxErr.sync="detailError"
              v-on:controlspinner="overlay = $event.running"
              v-on:updateboxerr="updateDetailError($event)"
            />
          </v-tab-item>
          <v-tab-item>
            <DisRimbRappresentanteLegale
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
import Wizard from '@/components/layout/Wizard'
import DisRimbRappresentanteLegale from '@/components/pratica/domanda_discarico_rimborso/DisRimbRappresentanteLegale'
import DisRimbIntestatarioVeicolo from '@/components/pratica/domanda_discarico_rimborso/DisRimbIntestatarioVeicolo'

export default {
  components: {
    BoxErrore,
    DisRimbRappresentanteLegale,
    DisRimbIntestatarioVeicolo,
    Spinner,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      overlay: false,
      tabs: null
    }
  },
  methods: {
    updateDetailError (detErr) {
      this.detailError = detErr
    }
  }
}
</script>
