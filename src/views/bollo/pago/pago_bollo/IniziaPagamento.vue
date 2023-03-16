<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <div class="row">
          <div class="col-lg-8">
            <p>
              Con questo servizio puoi pagare la scadenza dell'anno in corso o degli anni precedenti, se non li hai pagati
              e se non ti sono ancora stati accertati; se accertati solo per anni di pagamento fino al 2019 compreso (per accertamenti con anno di pagamento successivo, vedere le istruzioni sul relativo avviso).
            </p>
            <p>
              Il calcolo è fatto in tempo reale; se stai pagando in ritardo il bollo è già calcolato con sanzioni e interessi dovuti.
            </p>
            <p>
              Puoi usare la <strong>carta di credito</strong> o pagare con altri strumenti messi a disposizione dai prestatori di servizi di pagamento tramite pagoPA.
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
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'pago_bollo'" :stepAttivo="0" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2"
            id="boxErrDiv"
            tabindex="-1">
            <box-errore
              :error="detailError"
            />
          </div>
          <div class="text-intro col-lg-8 offset-lg-2"
          id="boxWarnDiv"
          tabindex="-1">
            <box-warning
              :warning="detailWarning"
            />
          </div>
        </div>
        <div class="tab-content-hp tab-card-space">
          <div class="row inner-cont-bollo">
            <div class="pagobollo-hp col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
                <v-img
                  class="imgHomeServizio"
                  width="178"
                  :src="require('@/assets/images/ritagli/servizi/pagamenti_online.svg')"
                  fluid
                />
              <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
                <p class="d-sr-only" v-if="tabIndexService === 0">
                  Puoi accedere al servizio di PagoBollo tramite codice di avviso di pagamento oppure specificando targa/telaio.
                </p>
                <p v-if="tabIndexService === 0">
                  Il <strong>codice di avviso di pagamento</strong> si recupera:
                </p>
                <ul v-if="tabIndexService === 0">
                  <li>
                    dal
                    <v-dialog v-model="dialog" width="600px" class="dialog-popup">
                      <template v-slot:activator="{ on }">
                        <a href="javascript:null" role="button" name="modalpdfAvvisoScadenza" v-on="on">PDF dell'avviso di scadenza</a>
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
                        <span class="d-sr-only">PDF dell'avviso di scadenza.</span>
                  </li>
                  <li>
                    <!-- TODO modal avviso accertamento -->
                    dal PDF dell'avviso di accertamento<span class="d-sr-only">.</span>
                  </li>
                  <li>
                    dalla mail di avviso di scadenza elettronico<span class="d-sr-only">.</span>
                  </li>
                </ul>
                <router-link
                  :to="{ name: 'video_tutorial', hash:'#pagailbollo_video'}"
                  v-if="videoTutorial()">
                  <strong><span class="d-sr-only">Vai al </span>Video tutorial di paga il bollo</strong>
                </router-link>
                <div class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
                  <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-pagamenti-on-line" target="_blank"><strong>Maggiori informazioni</strong></a>
                </div>
              </div>
            </div>
            <v-tabs
            centered
            fixed-tabs
            show-arrows="mobile"
            v-model="tabIndexService"
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
            <v-tabs-items v-model="tabIndexService" class="noauthService">
              <v-tab-item @click="resetDetailError()">
                <h2 class="d-sr-only">
                  {{ $t('bollo.pago.bollo.labels.tab_iuv') }}
                </h2>
                <p>
                  {{ $t('bollo.pago.bollo.service_description') }}
                </p>
                <form-pagamento-iuv
                  ref="formIuv"
                  v-bind:boxErr.sync="detailError"
                  v-on:controlspinner="overlay = $event.running"
                  v-on:updateboxerr="updateDetailError($event)"
                  v-on:updateboxwarn="updateDetailWarning($event)"
                />
              </v-tab-item>
              <v-tab-item @click="resetDetailError()">
                <h2 class="d-sr-only">
                  {{ $t('bollo.pago.bollo.labels.tab_targa_telaio') }}
                </h2>
                <p>
                  {{ $t('bollo.pago.bollo.service_description') }}
                </p>
                <div v-if="!logged">
                  <form-pagamento-targa
                    ref="formTarga"
                    v-bind:boxErr.sync="detailError"
                    v-on:controlspinner="overlay = $event.running"
                    v-on:updateboxerr="updateDetailError($event)"
                    v-on:updateboxwarn="updateDetailWarning($event)"
                  />
                </div>
                <div v-else>
                  <v-tabs
                    @change="resetDetailError()"
                    v-model="tabIndexLogged"
                    aria-live="polite"
                    aria-atomic="false"
                    id="tab--btn"
                    class="mt-12">
                    <v-tab class="tab-tuoveicolo">
                      IL TUO VEICOLO
                    </v-tab>
                    <v-tab class="tab-altriVeicolo">
                      IL VEICOLO DI TERZI
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tabIndexLogged" class="authServiceTab px-1 mt-4">
                    <v-tab-item>
                      <FormPagamentoTargaAuth
                        ref="formTargaAuth"
                        v-bind:boxErr.sync="detailError"
                        v-on:controlspinner="overlay = $event.running"
                        v-on:updateboxerr="updateDetailError($event)"
                        v-on:updateboxwarn="updateDetailWarning($event)"
                        :targaScelta = targaScelta
                        :pagamentoScelto = pagamentoScelto
                      />
                    </v-tab-item>
                    <v-tab-item>
                      <form-pagamento-targa
                        ref="formTarga"
                        v-bind:boxErr.sync="detailError"
                        v-on:controlspinner="overlay = $event.running"
                        v-on:updateboxerr="updateDetailError($event)"
                        v-on:updateboxwarn="updateDetailWarning($event)"
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </div>
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
import { mapGetters } from 'vuex'
import { REGIONE_ABILITATA, REGIONE_PARAMS, videoServizio } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import BoxWarning from '@/components/BoxWarning'
import FormPagamentoIuv from '@/components/bollo/pago/FormPagamentoIuv'
import FormPagamentoTarga from '@/components/bollo/pago/FormPagamentoTarga'
import FormPagamentoTargaAuth from '@/components/bollo/pago/FormPagamentoTargaAuth'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import { BOLLO_PAGO_LIMITE_CARRELLO } from '@/store/actions.type'
import store from '@/store'

export default {
  components: { BoxErrore, BoxWarning, FormPagamentoIuv, FormPagamentoTarga, FormPagamentoTargaAuth, Spinner, Wizard },
  data () {
    return {
      dialog: false,
      detailError: { message: '', title: '' },
      detailWarning: { message: '', title: '' },
      limiteCarrello: 0,
      overlay: false,
      regione: REGIONE_ABILITATA,
      tabIndexLogged: 0,
      tabIndexService: 0
    }
  },
  props: ['targaScelta', 'pagamentoScelto'],
  computed: {
    ...mapGetters([
      'carrelloPagoBollo',
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    updateDetailError (detErr) {
      this.detailError = detErr
      if (this.detailError.title !== '' && this.detailError.message !== '') {
        document.getElementById('boxErrDiv').focus()
      }
    },
    updateDetailWarning (detWarn) {
      this.detailWarning = detWarn
      if (this.detailWarning.title !== '' && this.detailWarning.message !== '') {
        document.getElementById('boxWarnDiv').focus()
      }
    },
    videoTutorial () {
      return (REGIONE_PARAMS.CONTATTI_AIUTO_VIDEO && videoServizio('pago_bollo') !== '')
    },
    closeDialog () {
      this.dialog = false
      return this.dialog
    },
    resetDetailError () {
      this.detailError = { message: '', title: '' }
      this.detailWarning = { message: '', title: '' }
      if (this.$refs.formTarga) this.$refs.formTarga.resetErroriServer()
      if (this.$refs.formIuv) this.$refs.formIuv.resetErroriServer()
    },
    tabIndexServiceProp () {
      this.tabIndexService = 1
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
    if (this.targaScelta && this.logged) this.tabIndexServiceProp()
    if (this.pagamentoScelto && this.logged) this.tabIndexServiceProp()
  }
}
</script>
