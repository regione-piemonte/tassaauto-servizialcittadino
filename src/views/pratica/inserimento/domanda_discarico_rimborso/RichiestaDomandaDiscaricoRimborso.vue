<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div
        class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2"
        v-html="this.$i18n.t('pratica.domanda_discarico_rimborso.richiesta.intro.par')"
      />
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard
              :servizio="'domanda_discarico_rimborso'"
              :stepAttivo="0"
            />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="tab-content-hp">
          <div class="row inner-cont-bollo">
            <div class="pagobollo-hp col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
              <v-img
              class="imgHomeServizio"
              width="178"
              :src="require('@/assets/images/ritagli/servizi/domanda_discarico_rimborso.svg')"
              alt=""
              fluid/>
              <div  class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0" v-html="link"/>
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
    </div>

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
      tabs: null,
      link: '<a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/tassa-automobilistica-riscossione-coattiva" target="_blank"><strong>Maggiori informazioni</strong></a>'
    }
  },
  methods: {
    updateDetailError (detErr) {
      this.detailError = detErr
    }
  }
}
</script>
