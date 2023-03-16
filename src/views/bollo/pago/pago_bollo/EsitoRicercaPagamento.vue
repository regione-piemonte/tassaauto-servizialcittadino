<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'pago_bollo'" :stepAttivo="1" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div
            class="col-lg-8 offset-lg-2"
            id="boxEsitoRicerca">
            <div class="space-section">
              <h2>
                Calcolo importo
              </h2>
              <div class="dl-inline-header data-up row">
                <dl class="text-center col-6 col-sm-4 offset-sm-2">
                  <dt>
                    importo
                  </dt>
                  <dd>
                    <strong>{{ pagamentoBollo.risultato.totale | formatCurrency }}</strong>
                  </dd>
                </dl>
                <dl class="text-center col-6 col-sm-4">
                  <dt>
                    scadenza
                  </dt>
                  <dd>
                    <strong>{{ pagamentoBollo.risultato.scadenza }}</strong>
                  </dd>
                </dl>
              </div>
            </div>
            <ComposizioneImporto
              :interesse="pagamentoBollo.risultato.interesse"
              :sanzione="pagamentoBollo.risultato.sanzione"
              :tassa="pagamentoBollo.risultato.tassa"
              :totale="pagamentoBollo.risultato.totale"
            />
            <DatiAnagraficiIntestatario
              :denominazione="pagamentoBollo.proprietario.denominazione"
              :codiceFiscale="pagamentoBollo.risultato.codiceFiscale"
              :tipoDatiAnagrafici="'proprietario'"
            />
            <DatiVeicolo
              :descrizione="pagamentoBollo.risultato.tipoVeicolo.descrizione"
              :targa="pagamentoBollo.risultato.targa"
              :scadenza="pagamentoBollo.risultato.scadenza"
              :validita="pagamentoBollo.risultato.validita"
              :tassa="pagamentoBollo.risultato.tassa"
            />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="'inizia_pagamento'"
                  :backType="'back'"/>
              </div>
              <div class="col-md-6 text-md-right">
                <v-btn
                  depressed
                  class="btn-secondary"
                  :to="{ name: 'inizia_pagamento' }">
                  Aggiungi pagamento
                </v-btn>
                <v-btn
                  depressed
                  color="primary"
                  :to="{ name: 'carrello_pagamenti' }">
                  Riepilogo
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BoxErrore from '@/components/BoxErrore'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import BtnBack from '@/components/layout/btn/BtnBack'
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiVeicolo from '@/components/DatiVeicolo'
import Wizard from '@/components/layout/Wizard'

export default {
  components: {
    BoxErrore,
    BtnBack,
    ComposizioneImporto,
    DatiAnagraficiIntestatario,
    DatiVeicolo,
    Wizard
  },
  data () {
    return {
      detailError: { message: '', title: '' }
    }
  },
  computed: {
    ...mapGetters([
      'pagamentoBollo'
    ])
  }
}
</script>
