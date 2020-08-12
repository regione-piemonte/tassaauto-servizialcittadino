<template>
  <div class="app-container">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-xxl-8 offset-xxl-2">
        <div class="row">
          <div class="col-lg-8">
            <p>
              Con questo servizio puoi pagare la scadenza dell'anno in corso o i bolli degli anni precedenti, se non li hai pagati.
            </p>
            <p>
              Il calcolo è fatto in tempo reale; se stai pagando in ritardo il bollo è già calcolato con sanzioni e interessi dovuti.
            </p>
            <p>
              Puoi usare la <strong>carta di credito</strong> o pagare con <strong>bonifico online</strong> tramite pagoPA.
            </p>
          </div>
          <div class="col-lg-4 text-center">
            <v-img
            width="185px"
            :src="require('@/assets/images/loghi/piemonte/pagopa.png')" alt="Logo PagoPA" />
          </div>
        </div>
      </div>
    </div>
    <v-card class="card-view-page">
    <div class="app-row inner-cont-bollo">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <Wizard :servizio="'pago_bollo'" :stepAttivo="0" />
      </div>
    </div>
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2"
        id="boxErrDiv"
        tabindex="-1">
        <box-errore
          :error="detailError"
        />
      </div>
    </div>
    <div class="tab-content-hp tab-card-space">
      <div class="app-row inner-cont-bollo">
        <div class="pagobollo-hp col-xxl-4 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="require('@/assets/images/ritagli/servizi/pagamenti_online.svg')"
              fluid
            />
          <div class="text-inner">
            <p class="sr-only" v-if="tabIndex === 0">
              Puoi accedere al servizio di PagoBollo tramite codice di avviso di pagamento oppure specificando targa/telaio.
            </p>
            <p v-if="tabIndex === 0">
              Il <strong>codice di avviso di pagamento</strong> si recupera:
            </p>
            <ul v-if="tabIndex === 0">
              <li>
                dal
                <v-dialog v-model="dialog" width="600px">
                  <template v-slot:activator="{ on }">
                    <a role="button" name="modalpdfAvvisoScadenza" v-on="on">PDF dell'avviso di scadenza</a>
                  </template>
                  <v-card
                  aria-hidden="true">
                    <v-card-title class="justify-end">
                      <v-icon @click="closeDialog()">mdi-close</v-icon>
                    </v-card-title>
                    <v-img
                      width="871"
                      :src="require(`@/assets/images/ritagli/${regione}/modal-bollo_codice_avviso_pagamento.jpg`)"
                      alt="Dove è il codice avviso di pagamento?"
                      fluid
                    />
                  </v-card>
                </v-dialog>
                    <span class="sr-only">PDF dell'avviso di scadenza.</span>
              </li>
              <li>
                <!-- TODO modal avviso accertamento -->
                dal PDF dell'avviso di accertamento<span class="sr-only">.</span>
              </li>
              <li>
                dalla mail di avviso di scadenza elettronico<span class="sr-only">.</span>
              </li>
            </ul>
            <router-link
              :to="{ name: 'video_tutorial', hash:'#pagamentiOnline_video'}"
              v-if="videoTutorial()">
              <strong><span class="sr-only">Vai al </span>Video tutorial di pagamenti online</strong>
            </router-link>
          </div>
        </div>
        <v-tabs
        centered
        fixed-tabs
        show-arrows="mobile"
        v-model="tabIndex"
        aria-live="polite"
        aria-atomic="false">
          <v-tab
            active>
            {{$t('bollo.pago.bollo.labels.tab_iuv')}}
          </v-tab>
          <v-tab>
            {{$t('bollo.pago.bollo.labels.tab_targa_telaio')}}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabIndex" class="noauthService">
          <v-tab-item>
            <h2 class="sr-only">
              {{ $t('bollo.pago.bollo.labels.tab_iuv') }}
            </h2>
            <p>
              {{ $t('bollo.pago.bollo.service_description') }}
            </p>
            <form-pagamento-iuv
              v-bind:boxErr.sync="detailError"
              v-on:controlspinner="overlay = $event.running"
              v-on:updateboxerr="updateDetailError($event)"
            />
          </v-tab-item>
          <v-tab-item>
            <h2 class="sr-only">
              {{ $t('bollo.pago.bollo.labels.tab_targa_telaio') }}
            </h2>
            <p>
              {{ $t('bollo.pago.bollo.service_description') }}
            </p>
            <form-pagamento-targa
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
import { mapGetters } from 'vuex'
import { REGIONE_ABILITATA, REGIONE_PARAMS, videoServizio } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import FormPagamentoIuv from '@/components/bollo/pago/FormPagamentoIuv'
import FormPagamentoTarga from '@/components/bollo/pago/FormPagamentoTarga'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import { BOLLO_PAGO_LIMITE_CARRELLO } from '@/store/actions.type'
import store from '@/store'

export default {
  components: { BoxErrore, FormPagamentoIuv, FormPagamentoTarga, Spinner, Wizard },
  data () {
    return {
      dialog: false,
      detailError: { message: '', title: '' },
      limiteCarrello: 0,
      overlay: false,
      regione: REGIONE_ABILITATA,
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'carrelloPagoBollo'
    ])
  },
  methods: {
    updateDetailError (detErr) {
      this.detailError = detErr
      if (this.detailError.title !== '' && this.detailError.message !== '') {
        document.getElementById('boxErrDiv').focus()
      }
    },
    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('pago_bollo') !== '')
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    }
  },
  async created () {
    store
      .dispatch(BOLLO_PAGO_LIMITE_CARRELLO)
      .then(({ data }) => {
        this.limiteCarrello = data.valore
        if (this.carrelloPagoBollo.length > this.limiteCarrello) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'È consentito un massimo di ' + this.limiteCarrello + ' pagamenti, andare su Riepilogo.'
          }
        }
      })
  }
}
</script>
