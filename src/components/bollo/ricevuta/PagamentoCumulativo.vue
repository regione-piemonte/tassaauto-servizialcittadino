<template>
  <div>
    <div class="space-section">
      <h2>{{ $t('bollo.ricevuta.scarica.titoli.titolo_1') }}</h2>
      <p>Email: {{ ricevuta.riepilogo.email }}</p>
    </div>
    <h2>{{ $t('bollo.ricevuta.scarica.titoli.titolo_2') }}</h2>
    <div class="accordion">
      <v-expansion-panels :accordion="true">
        <v-expansion-panel
          v-for="(item, index) in ricevuta.listaRicevute" :key="index">
          <v-expansion-panel-header>
            <div class="row">
              <div class="col-md-3 col-sm-6 align-self-center">
                <div class="mb-4 mb-sm-0">VEICOLO <span class="numberBadge">{{index + 1}}</span></div>
              </div>
              <div class="col-md-4 col-sm-6 align-self-center">
                <div class="mb-7 mb-sm-0">
                  <strong>CF: {{item.datiCalcolo.codiceFiscale}}</strong><br/>
                  <strong>Targa: {{item.datiCalcolo.targa}}</strong><br/>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 align-self-center">
                <div class="data-up dl-inline-header d-flex">
                  <dl>
                    <dt>importo</dt>
                    <dd>{{ item.importo | formatCurrency }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content :id="'collapse-'+index" role="tabpanel">
            <div class="inner-card p-3">
              <p>Scadenza<br/><span>{{ item.datiCalcolo.scadenza }}</span></p>
              <ComposizioneImporto
                :interesse="item.datiCalcolo.interesse"
                :sanzione="item.datiCalcolo.sanzione"
                :tassa="item.datiCalcolo.tassa"
                :totale="item.datiCalcolo.totaleDovuto" />
              <div class="space-section">
                <h2>{{ $t('bollo.ricevuta.scarica.accordion.anagrafica') }}</h2>
                <v-list class="text-uppercase" flat>
                  <v-list-item-group :no-action="true" aria-label="anagrafica intestatario">
                    <v-list-item
                      id=""
                      :inactive="true"
                      :ripple="false"
                      v-if="item.datiCalcolo.proprietario !== null">
                      {{ item.datiCalcolo.proprietario.denominazione }}
                    </v-list-item>
                    <v-list-item
                      id=""
                      :inactive="true"
                      :ripple="false">
                      CF: {{ item.datiCalcolo.codiceFiscale }}
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
              <DatiVeicolo
                :descrizione="item.datiCalcolo.tipoVeicolo.descrizione"
                :targa="item.datiCalcolo.targa"
                :scadenza="item.datiCalcolo.scadenza"
                :validita="Number(item.datiCalcolo.validita)"
                :tassa="item.importo" />
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div class="cardTotale space-section">
      <div class="row">
        <div class="col-12 col-md-5 offset-md-5 boxTotale">
          <p class="costoTotale">TOTALE: {{ ricevuta.riepilogo.importo | formatCurrency }}</p>
        </div>
      </div>
    </div>
    <DatiPagamento :ricevutaPagam="ricevuta.riepilogo"/>
  </div>
</template>

<script>
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiVeicolo from '@/components/DatiVeicolo'
import DatiPagamento from '@/components/bollo/ricevuta/DatiPagamento'

export default {
  props: {
    ricevuta: { type: Object, required: true }
  },
  components: { ComposizioneImporto, DatiVeicolo, DatiPagamento }
}
</script>
