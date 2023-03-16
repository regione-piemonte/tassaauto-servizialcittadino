<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'pago_bollo'" :stepAttivo="2" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <h2>{{ $t("bollo.ricevuta.scarica.titoli.titolo_2") }}</h2>
            <div role="tablist">
              <v-expansion-panels :accordion="true">
                <v-expansion-panel
                  v-for="(item, index) in carrelloPagoBollo"
                  :key="index"
                >
                  <v-expansion-panel-header v-if="!item.delete">
                    <v-row justify="center" align="center" class="py-3">
                      <v-col sm="6" md="3">
                        <div class="mb-4 mb-sm-0">
                          VEICOLO
                          <span class="numberBadge">{{ index + 1 }}</span>
                        </div>
                      </v-col>
                      <v-col sm="6" md="5">
                        <div class="mb-10 mb-sm-0">
                          <strong>
                            CF: {{ item.risultato.codiceFiscale }}
                          </strong>
                          <br />
                          <strong> Targa: {{ item.risultato.targa }} </strong>
                        </div>
                      </v-col>
                      <v-col sm="6" md="2">
                         <div class="mb-7 mb-sm-0">
                          <h6>
                            {{ item.risultato.totale | formatCurrency }}
                          </h6>
                          importo
                        </div>
                      </v-col>
                      <v-col sm="6" md="1">
                        <v-btn
                          text
                          depressed
                          @click="item.delete = true"
                          :ripple="false"
                        >
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-header
                    v-else
                    class="hide-icon-arrow color-pad"
                  >
                    <v-alert color="error" show>
                      <h5 class="h5 inline-block">
                        Attenzione, vuoi eliminare il pagamento selezionato?
                      </h5>
                      <br />
                      <div class="inline-block">
                        <v-btn
                          depressed
                          type="button"
                          @click="item.delete = false"
                        >
                          No
                        </v-btn>
                        <v-btn
                          depressed
                          type="button"
                          @click="eliminaDalCarrello(item)"
                        >
                          Si
                        </v-btn>
                      </div>
                    </v-alert>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content
                    :id="'collapse-' + index"
                    v-if="!item.delete"
                  >
                    <div class="inner-card pa-3">
                      <div class="space-section">
                        Scadenza
                        <br />
                        <span>
                          {{ item.risultato.scadenza }}
                        </span>
                      </div>
                      <ComposizioneImporto
                        :interesse="item.risultato.interesse"
                        :sanzione="item.risultato.sanzione"
                        :tassa="item.risultato.tassa"
                        :totale="item.risultato.totale"
                      />

                      <div class="space-section">
                        <h2>
                          {{
                            $t("bollo.ricevuta.scarica.accordion.anagrafica")
                          }}
                        </h2>
                        <v-list class="text-uppercase" flat>
                          <v-list-item-group :no-action="true" aria-label="dati anagrafica dell'intestatario del pagamento del bollo auto">
                            <v-list-item id="" :inactive="true" :ripple="false">
                              {{ item.proprietario.denominazione }}
                            </v-list-item>
                            <v-list-item id="" :inactive="true" :ripple="false">
                              CF: {{ item.risultato.codiceFiscale }}
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </div>

                      <DatiVeicolo
                        :descrizione="item.risultato.tipoVeicolo.descrizione"
                        :targa="item.risultato.targa"
                        :scadenza="item.risultato.scadenza"
                        :validita="item.risultato.validita"
                        :tassa="item.risultato.tassa"
                      />
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div class="cardTotale space-section">
              <div class="boxTotale">
                <p
                  class="costoTotale h1"
                  v-if="this.carrelloPagoBollo.length > 0"
                >
                  Totale {{ totaleCarrelloPagoBollo | formatCurrency }}
                </p>
                <p
                  class="costoTotale h1"
                  v-if="this.carrelloPagoBollo.length == 0"
                >
                  Nessun pagamento presente
                </p>
              </div>
            </div>
            <div
              class="action-button-wide row"
              v-if="
                this.carrelloPagoBollo.length < this.limiteCarrelloPagoBollo
              "
            >
              <div class="col-md-6">
                <v-btn
                  id="aggiungiPagamentoBtn"
                  depressed
                  color="primary"
                  :to="{ name: 'inizia_pagamento' }"
                >
                  Aggiungi pagamento
                </v-btn>
              </div>
            </div>
            <RiferimentiPago
              ref="rifPago"
              :pEmail="emailFormPagoBollo.email"
              :pPrivacy="emailFormPagoBollo.privacy"
              v-on:bloccapagamento="vaiPagamentoDisabled = true"
            />
            <PagamentoPagoPa />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="'esito_ricerca_pagamento'"
                  :backType="'back'"
                />
              </div>
              <div class="col-md-6 text-md-right">
                <v-btn
                  type="button"
                  depressed
                  id="vaiAlPagamentoBtn"
                  color="primary"
                  @click="avviaPagoPA()"
                  :disabled="
                    this.carrelloPagoBollo.length == 0 ||
                    this.carrelloPagoBollo.length >
                      this.limiteCarrelloPagoBollo ||
                    vaiPagamentoDisabled
                  "
                >
                  Vai al pagamento
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
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import DatiVeicolo from '@/components/DatiVeicolo'
import Wizard from '@/components/layout/Wizard'
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import BtnBack from '@/components/layout/btn/BtnBack'
import PagamentoPagoPa from '@/components/bollo/PagamentoPagoPa'
import RiferimentiPago from '@/components/bollo/RiferimentiPago'
import { BOLLO_PAGO_ELIMINA_DAL_CARRELLO, BOLLO_PAGO_SALVA_RIFERIMENTI } from '@/store/actions.type'
import store from '@/store'

export default {
  components: {
    BoxErrore,
    BtnBack,
    ComposizioneImporto,
    DatiVeicolo,
    PagamentoPagoPa,
    RiferimentiPago,
    Wizard
  },
  data () {
    return {
      confDivArray: [],
      vaiPagamentoDisabled: false
    }
  },
  computed: {
    ...mapGetters([
      'carrelloPagoBollo',
      'emailFormPagoBollo',
      'limiteCarrelloPagoBollo',
      'totaleCarrelloPagoBollo'
    ]),
    detailError: function () {
      if (this.carrelloPagoBollo.length <= this.limiteCarrelloPagoBollo) return { title: '', message: '' }
      return {
        title: this.$i18n.t('general.error'),
        message: 'È consentito un massimo di ' + this.limiteCarrello + ' pagamenti, eliminare i pagamenti in eccesso.'
      }
    }
  },
  methods: {
    avviaPagoPA () {
      this.$refs.rifPago.iniziaValidazione()
      this.$refs.rifPago.$v.rifForm.$touch()
      if (this.$refs.rifPago.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const rifObj = this.$refs.rifPago.getEmailPrivacy()
      store
        .dispatch(BOLLO_PAGO_SALVA_RIFERIMENTI, {
          email: rifObj.email.toLowerCase(),
          privacy: rifObj.privacy
        })
        .then(() => {
          this.$router.push({ name: 'avvio_pagopa' })
        })
        .catch((error) => {
          console.log('Errore', { error })
        })
    },

    eliminaDalCarrello (pagamento) {
      store
        .dispatch(BOLLO_PAGO_ELIMINA_DAL_CARRELLO, pagamento)
        .then(() => {
        })
        .catch((error) => {
          console.log('Fallita rimozione dal carrello', { error })
        })
    }
  }
}
</script>
