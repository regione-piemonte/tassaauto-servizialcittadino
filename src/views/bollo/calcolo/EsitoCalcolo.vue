<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="col-xxl-8 offset-xxl-2">
        <h2>
          Risultato della ricerca
        </h2>
        <div :class="'dl-inline-header text-center bg-ico bg-ico-'+ esitoCalcoloBollo.tipoVeicolo.codice" >
          <dl class="col-4 col-md-3 col-lg-3 col-xl-2">
            <dt>
              tipo
            </dt>
            <dd>
              {{ esitoCalcoloBollo.tipoVeicolo.descrizione }}
            </dd>
          </dl>
          <dl class="col-4 col-md-3 col-lg-3 col-xl-2">
            <dt>
              targa
            </dt>
            <dd>
              {{ esitoCalcoloBollo.targa }}
            </dd>
          </dl>
        </div>
        <div class="box-grigio" id="boxGrigio">
          <div class="box-inner">
            <div class="dl-inline-header">
              <dl class="text-left">
                <dt>
                  Costo del bollo
                </dt>
                <dd>
                  <span class="h3">{{ esitoCalcoloBollo.tassa  | formatCurrency  }}</span>
                </dd>
              </dl>
            </div>
            <div class="dl-inline-header">
              <dl class="text-left">
                <dt>
                  Potenza in Kw - Direttiva CE
                </dt>
                <dd>
                  {{ esitoCalcoloBollo.esplicativo }}
                </dd>
              </dl>
            </div>
            <div class="dl-inline-header">
              <dl class="text-left">
                <dt>
                  Scadenza
                </dt>
                <dd>
                  {{ esitoCalcoloBollo.scadenza }}
                </dd>
              </dl>
            </div>
            <div class="dl-inline-header">
              <dl class="text-left">
                <dt>
                  Da pagare entro il
                </dt>
                <dd>
                  {{ esitoCalcoloBollo.ultimoGiornoUtile }}
                </dd>
              </dl>
            </div>
            <p class="my-6">
              Hai dimenticato di pagare il bollo entro il <strong>{{esitoCalcoloBollo.ultimoGiornoUtile}}</strong>?<br>
              In questo caso l'importo sarà maggiorato da una sanzione proporzionata al ritardo.<br>
              Ad oggi l'importo dovuto sarebbe:
            </p>
            <strong class="h6 d-block">{{ esitoCalcoloBollo.totale  | formatCurrency }}</strong>
            <span class="sr-only">composto dai seguenti importi:</span>
            <ul class="my-2">
              <li class="py-0">
                {{ esitoCalcoloBollo.tassa | formatCurrency }} - tassa<span class="sr-only">.</span>
              </li>
              <li class="py-0">
                {{ esitoCalcoloBollo.sanzione | formatCurrency }} - sanzioni<span class="sr-only">.</span>
              </li>
              <li class="py-0">
                {{ esitoCalcoloBollo.interesse | formatCurrency }} - interessi<span class="sr-only">.</span>
              </li>
            </ul>
            <p>
              Nel caso tu abbia pagato entro i termini, ignora questo avviso.
            </p>
          </div>
        </div>
        <div class="action-button-wide">
          <div class="col-md-6">
            <BtnHome :cssClass="'btn-secondary'" />
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
              type="button"
              class="btn-secondary"
              :to="{ name: 'calcolo_importo' }">
              Nuova Ricerca
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BtnHome from '@/components/layout/btn/BtnHome'
export default {
  components: { BtnHome },
  computed: {
    ...mapGetters([
      'esitoCalcoloBollo'
    ])
  }
}
</script>
