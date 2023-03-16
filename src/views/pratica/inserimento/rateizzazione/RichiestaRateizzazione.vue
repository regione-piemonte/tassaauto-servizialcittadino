<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <p v-if="regione === 'piemonte'">
          Con questo servizio puoi ottenere la <strong>rateizzazione se:</strong>
          <ol>
            <li>
              hai <strong>ricevuto</strong> un avviso di accertamento <strong>del bollo auto con anno di pagamento fino al 2019 compreso;</strong>
            </li>
            <li>
              il totale da pagare, per ogni atto o gruppo di atti riferiti alla stessa annualità di tributo che si vuole rateizzare, è di <strong>almeno 250 euro</strong>;
            </li>
            <li>
              sei <strong>in regola con il pagamento</strong> degli importi compresi in piani di rateizzazione precedentemente accordati.
            </li>
          </ol>
        </p>
        <p v-if="regione === 'vda'">
          Puoi ottenere la <strong>rateizzazione se:</strong>
          <ol>
            <li>
              hai <strong>ricevuto</strong> un avviso di accertamento;
            </li>
            <li>
              il totale da pagare è di <strong>almeno 270 Euro</strong>;
            </li>
            <li>
              sei <strong>in regola con il pagamento</strong> degli importi compresi in piani di rateizzazione precedentemente accordati.
            </li>
          </ol>
        </p>
        <p v-if="regione === 'piemonte'">
          Il numero di rate varia in relazione all'importo totale della richiesta ma <strong>non può essere superiore a 30</strong>.
        </p>
        <p v-if="regione === 'piemonte'">
          <strong>In caso di particolare disagio economico</strong> (da autocertificare), può essere concesso un numero maggiore di rate rispetto a quelle previste ma sempre non oltre le 30 e l'importo di ciascuna rata non può essere inferiore a 30 euro.
        </p>
        <p v-if="regione === 'piemonte'">
          Devi presentare domanda <strong>una sola volta</strong> e attendere che la Regione ti spedisca a casa i bollettini postali con le istruzioni per il pagamento.
        </p>
        <p v-if="regione === 'piemonte'">
          <em><strong>(!)</strong> Se l’avviso di accertamento si riferisce ad  un bollo auto con <strong>anno di pagamento successivo al 2019,</strong> non puoi più rivolgere la domanda di rateizzazione utilizzando questo servizio, ma devi avvalerti <strong>esclusivamente</strong> di quello disponibile sul sito di <a title="Soris S.p.A." href="https://www.soris.torino.it/">Soris S.p.A.</a>  alla sezione "Richieste online", voce "Richiedere una rateizzazione per la Regione Piemonte".</em>
        </p>
        <p v-if="regione === 'vda'">
          La rateizzazione viene concessa anche quando il totale da pagare <strong>è inferiore a 270 Euro</strong>, ma <strong>pari o superiore a 150 Euro</strong>, se hai un I.S.E.E. in corso di validità non eccedente l'importo di € 15.000,00.
        </p>
        <p v-if="regione === 'vda'">
          Devi presentare domanda <strong>una sola volta</strong> e attendere che la Regione ti spedisca a casa i bollettini pagoPa.
        </p>
      </div>
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'richiesta_rateizzazione'" :stepAttivo="0" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxWarning :warning="detailWarn" />
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="tab-content-hp">
          <div class="row inner-cont-bollo">
            <v-col cols="12" md="6" lg="3" class="pagobollo-hp offset-xl-2 mt-8 my-sm-2" aria-hidden="true">
              <v-img
                class="imgHomeServizio"
                width="178"
                :src="require('@/assets/images/ritagli/servizi/chiedi_rateizzazione.svg')"
                alt=""
                fluid/>
              <div class="no-gutters-col mt-4">
                <v-dialog v-model="dialog" max-width="600" class="dialog-popup">
                  <template v-slot:activator="{ on }">
                    <a href="javascript:null" role="button" name="modalAvvisoAccertamento" v-on="on">Cos'è e dove si trova il numero di protocollo dell'avviso di accertamento?</a>
                  </template>
                  <v-card aria-hidden="true">
                    <v-card-title class="justify-end">
                      <v-icon @click="closeDialog()">mdi-close</v-icon>
                    </v-card-title>
                    <v-img
                    :src="require(`@/assets/images/ritagli/${regione}/modal-num_protocollo_avviso_accertamento.jpg`)"
                    alt="Dove è il numero di protocollo?" fluid/>
                  </v-card>
                </v-dialog>
              </div>
              <div  class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
                <p v-if="regione === 'piemonte'">
                   <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/tassa-automobilistica-rateizzazioni" target="_blank"><strong>Maggiori informazioni</strong></a>
                </p>
              </div>
            </v-col>
            <v-tabs
            class="tabServizi"
            id="tabServiziScelta"
            aria-live="polite"
            aria-atomic="false"
            centered
            fixed-tabs
            show-arrows="mobile"
            v-model="tabIndex">
              <v-tab
                id="intestatarioVeicolo"
                active
                @click="detailError={ message: '', title: '' }">
                {{ $t('pratica.rateizzazione.cerca.labels.tab_1') }}
              </v-tab>
              <v-tab
                id="rappresentanteLegale"
                @click="detailError={ message: '', title: '' }">
                {{ $t('pratica.rateizzazione.cerca.labels.tab_2') }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tabIndex" class="noauthService">
              <v-tab-item>
                <intestatario-veicolo
                  v-bind:boxErr.sync="detailError"
                  v-on:controlspinner="overlay = $event.running"
                  v-on:updateboxerr="updateDetailError($event)"
                  v-on:updateboxwarn="updateDetailWarn($event)"
                />
              </v-tab-item>
              <v-tab-item>
                <rappresentante-legale
                  v-bind:boxErr.sync="detailError"
                  v-on:controlspinner="overlay = $event.running"
                  v-on:updateboxerr="updateDetailError($event)"
                  v-on:updateboxwarn="updateDetailWarn($event)"
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
import { REGIONE_ABILITATA } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import BoxWarning from '@/components/BoxWarning'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import IntestatarioVeicolo from '@/components/pratica/rateizzazione/IntestatarioVeicolo'
import RappresentanteLegale from '@/components/pratica/rateizzazione/RappresentanteLegale'
import { RATEIZZAZIONE_CONTROLLO_FASCE } from '@/store/actions.type'
import store from '@/store'

export default {
  components: { BoxErrore, BoxWarning, IntestatarioVeicolo, RappresentanteLegale, Spinner, Wizard },
  data () {
    return {
      dialog: false,
      tabIndex: null,
      detailError: { message: '', title: '' },
      detailWarn: { message: '', title: '' },
      overlay: false,
      regione: REGIONE_ABILITATA
    }
  },
  methods: {
    updateDetailError (detErr) {
      this.detailError = detErr
    },
    updateDetailWarn (detWarn) {
      this.detailWarn = detWarn
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    this.overlay = true
    store
      .dispatch(RATEIZZAZIONE_CONTROLLO_FASCE)
      .then(() => { this.overlay = false })
      .catch((error) => {
        this.overlay = false
        let respKO = false
        if (error === null) respKO = true
        if (error.response.status === 500) respKO = true
        if (respKO) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          }
        }
      })
  }
}
</script>
