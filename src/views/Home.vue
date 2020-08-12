<template>
  <div class="home-page">
    <titolo-servizio
      :servizio="servizio"
    />
    <div class="container" id="homePage-gridCard">
      <div class="row">
        <div class="col-md-12">
          <div class="row mb-3">
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('memo_bollo')">
              <v-card
                class="bg-ico bg-ico-memobollo">
                <v-card-title class="homeLinkBtn">
                <v-btn
                class="homeIcon memobollo"
                :ripple="false"
                text :to="{ name: 'cerca_veicolo_memo'}">
                  <h4>
                    {{ $t('menu.homePageIndex.voce_01.main_title') }}
                  </h4>
                </v-btn>
                </v-card-title>
                <v-card-text
                    class="card-text"
                    v-html="descrizioneMemo">
                </v-card-text>
              </v-card>
            </div>

            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('pago_bollo') || cardAttiva('pago_rate')">
              <v-card
                class="bg-ico bg-ico-pagamenti_online">
                  <div v-if="cardAttiva('pago_bollo') && cardAttiva('pago_rate')">
                    <v-card-title class="homeLinkBtn">
                      <v-btn
                      text
                      class="homeIcon pagamenti_online" :ripple="false"
                      :to="{ name: 'scelta_tipo_pagamento'}">
                      <h4>
                        {{ $t('menu.homePageIndex.voce_02.main_title') }}
                      </h4>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                    <p class="card-text">
                      {{ $t('menu.homePageIndex.voce_02.subtitle') }}
                    </p>
                    <p class="sr-only">
                      Puoi utilizzare {{ $t('menu.homePageIndex.voce_02.main_title') }} per pagare:
                    </p>
                    <ul class="textual important-list">
                      <li>
                        <v-btn :ripple="false"
                        text :to="{ name: 'inizia_pagamento'}" class="font-weight-bold">
                          {{ $t('menu.homePageIndex.voce_02.list_service.item_01') }}<span class="sr-only">.</span>
                        </v-btn>
                      </li>
                      <li>
                        <v-btn :ripple="false"
                        text :to="{ name: 'inizia_pagamento_rate'}" class="font-weight-bold">
                          {{ $t('menu.homePageIndex.voce_02.list_service.item_02') }}<span class="sr-only">.</span>
                        </v-btn>
                      </li>
                    </ul>
                    </v-card-text>
                  </div>
                  <div v-if="cardAttiva('pago_bollo') && !cardAttiva('pago_rate')">
                    <v-card-title class="homeLinkBtn">
                      <v-btn
                      class="homeIcon pagamenti_online" :ripple="false"
                      text :to="{ name: 'inizia_pagamento'}">
                        <h4>
                          {{ $t('menu.homePageIndex.voce_02.main_title') }}
                        </h4>
                      </v-btn>
                    </v-card-title>
                  <v-card-text>
                    <p class="card-text">
                      {{ $t('menu.homePageIndex.voce_02.subtitle') }}
                    </p>
                    <div class="px-6">
                      <ul class="important-list">
                        <li>
                          <v-btn
                           :ripple="false"
                          text :to="{ name: 'inizia_pagamento'}" class="font-weight-bold">
                            {{ $t('menu.homePageIndex.voce_02.list_service.item_01') }}
                          </v-btn>
                        </li>
                      </ul>
                    </div>
                    </v-card-text>
                  </div>
                  <div v-if="!cardAttiva('pago_bollo') && cardAttiva('pago_rate')">
                  <v-btn class="homeIcon pagamenti_online" :ripple="false" text :to="{ name: 'inizia_pagamento_rate'}">
                    <v-card-title class="homeLinkBtn">
                    <h4>
                      {{ $t('menu.homePageIndex.voce_02.main_title') }}
                    </h4>
                    </v-card-title>
                  </v-btn>
                  <v-card-text>
                    <p class="card-text">
                      {{ $t('menu.homePageIndex.voce_02.subtitle') }}
                    </p>
                    <div class="px-6">
                      <ul class="important-list">
                        <li>
                          <v-btn :ripple="false" text :to="{ name: 'inizia_pagamento_rate'}" class="font-weight-bold">
                            {{ $t('menu.homePageIndex.voce_02.list_service.item_02') }}
                          </v-btn>
                        </li>
                      </ul>
                    </div>
                  </v-card-text>
                  </div>
              </v-card>
            </div>

            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('ricevuta_bollo')">
              <v-card
                class="bg-ico bg-ico-ricevutabollo">
                <v-card-title class="homeLinkBtn">
                  <v-btn class="homeIcon scarica_ricevuta_pagamento" :ripple="false" text :to="{ name: 'cerca_pagamento'}">
                    <h4>
                      {{ $t('menu.homePageIndex.voce_03.main_title') }}
                    </h4>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <p class="card-text">
                    {{ $t('menu.homePageIndex.voce_03.subtitle') }}
                  </p>
                </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('calcolo_bollo')">
              <v-card
                class="bg-ico bg-ico-calcolabollo">
                <v-card-title class="homeLinkBtn">
                  <v-btn
                    class="homeIcon calcola_bollo" :ripple="false"
                    text :to="{ name: 'calcolo_importo'}">
                    <h4>
                      {{ $t('menu.homePageIndex.voce_04.main_title') }}
                    </h4>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <p class="card-text">
                    {{ $t('menu.homePageIndex.voce_04.subtitle') }}
                  </p>
                </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('osservazione_avviso_scadenza') || cardAttiva('osservazione_avviso_accertamento')">
              <v-card
                class="bg-ico bg-ico-osservazioneavvisi">
                  <div
                    v-if="cardAttiva('osservazione_avviso_scadenza') && cardAttiva('osservazione_avviso_accertamento')">
                    <v-card-title class="homeLinkBtn">
                      <v-btn
                      class="homeIcon osservazioni" :ripple="false"
                      text :to="{ name: 'scelta_tipo_osservazione'}">
                        <h4>
                          {{ $t('menu.homePageIndex.voce_05.main_title') }}
                        </h4>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      {{ $t('menu.homePageIndex.voce_05.subtitle') }}
                      <p class="sr-only">
                        Puoi utilizzare questo servizio per:
                      </p>
                      <ul class="textual important-list">
                        <li>
                          <v-btn :ripple="false"
                          text :to="{ name: 'cerca_avviso_scadenza'}"
                          class="font-weight-bold">
                            {{ $t('menu.homePageIndex.voce_05.list_service.item_01') }}
                          </v-btn>
                        </li>
                        <li>
                          <v-btn :ripple="false"
                          text :to="{ name: 'cerca_avviso_accertamento'}"
                          class="font-weight-bold">
                            {{ $t('menu.homePageIndex.voce_05.list_service.item_02') }}
                          </v-btn>
                        </li>
                      </ul>
                    </v-card-text>
                  </div>
                  <div v-if="cardAttiva('osservazione_avviso_scadenza') && !cardAttiva('osservazione_avviso_accertamento')">
                    <v-card-title>
                      <v-btn
                      class="homeIcon osservazioni"
                      :ripple="false" :to="{ name: 'cerca_avviso_scadenza'}">
                        <h4>
                          {{ $t('menu.homePageIndex.voce_05.list_service.main_title_01') }}
                        </h4>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <p class="card-text mt-5">
                        {{ $t('menu.homePageIndex.voce_05.list_service.subtitle_01') }}
                      </p>
                    </v-card-text>
                  </div>
                  <div v-if="!cardAttiva('osservazione_avviso_scadenza') && cardAttiva('osservazione_avviso_accertamento')">
                    <v-card-title>
                      <v-btn class="homeIcon osservazioni" :ripple="false" text :to="{ name: 'cerca_avviso_accertamento'}">
                        <h4>
                          {{ $t('menu.homePageIndex.voce_05.list_service.main_title_02') }}
                        </h4>

                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <p class="card-text mt-5">
                        {{ $t('menu.homePageIndex.voce_05.list_service.subtitle_02') }}
                      </p>
                    </v-card-text>
                  </div>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('verifica_pratica')">
              <v-card
                class="bg-ico bg-ico-verificapratica">
                  <v-card-title class="homeLinkBtn">
                    <v-btn class="homeIcon consulta_pratica" :ripple="false" text :to="{ name: 'cerca_pratica'}">
                      <h4>
                        {{ $t('menu.homePageIndex.voce_06.main_title') }}
                      </h4>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <p class="sr-only">
                      Puoi utilizzare questo servizio per consultare lo stato delle seguenti richieste:
                    </p>
                    <ul class="textual">
                      <li>
                        <p class="font-weight-bold" v-if="cardAttiva('osservazione_avviso_scadenza')">
                          {{ $t('menu.homePageIndex.voce_06.list_service.item_01') }}
                        </p>
                      </li>
                      <li>
                        <p class="font-weight-bold" v-if="cardAttiva('osservazione_avviso_accertamento')">
                          {{ $t('menu.homePageIndex.voce_06.list_service.item_02') }}
                        </p>
                      </li>
                      <li>
                        <p class="font-weight-bold" v-if="cardAttiva('rateizzazione')">
                          {{ $t('menu.homePageIndex.voce_06.list_service.item_03') }}
                        </p>
                      </li>
                      <li>
                        <p class="font-weight-bold" v-if="cardAttiva('rateizzazione')">
                          {{ $t('menu.homePageIndex.voce_06.list_service.item_04') }}
                        </p>
                      </li>
                    </ul>
                  </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('rateizzazione')">
              <v-card
                class="bg-ico bg-ico-rateizzazione">
                <v-card-title class="homeLinkBtn">
                  <v-btn
                  class="homeIcon chiedi_rateizzazione" :ripple="false" text :to="{ name: 'richiesta_rateizzazione'}">
                    <h4>
                      {{ $t('menu.homePageIndex.voce_07.main_title') }}
                    </h4>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <p class="card-text">
                    {{ $t('menu.homePageIndex.voce_07.subtitle') }}
                  </p>
                </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('domanda_discarico_rimborso')">
              <v-card
                class="bg-ico bg-ico-discarico">
                  <v-card-title class="homeLinkBtn">
                    <v-btn
                      class="homeIcon domanda_discarico_rimborso" :ripple="false"
                      text :to="{ name: 'richiesta_domanda_discarico_rimborso'}">
                      <h4>
                        {{ $t('menu.homePageIndex.voce_08.main_title') }}
                      </h4>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <p class="card-text">
                      {{ $t('menu.homePageIndex.voce_08.subtitle') }}
                    </p>
                  </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('info_bollo')">
              <v-card
                class="bg-ico bg-ico-infobollo">
                  <v-card-title class="homeLinkBtn">
                    <v-btn
                    class="homeIcon infobollo" :ripple="false"
                    text :to="{ name: 'verifica_attivazione_info'}">
                    <h4>
                      {{ $t('menu.homePageIndex.voce_09.main_title') }}
                    </h4>
                  </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <p class="card-text">
                      {{ $t('menu.homePageIndex.voce_09.subtitle') }}
                    </p>
                  </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('stampa_avviso_accertamento') || cardAttiva('stampa_avviso_scadenza')">
              <v-card
                class="bg-ico bg-ico-stampa-avviso">
                <v-card-title class="homeLinkBtn">
                  <v-btn
                    class="homeIcon stampa_avviso_pagamento" :ripple="false"
                    text :to="{ name: 'scelta_tipo_stampa'}">
                    <h4>
                      {{ $t('menu.homePageIndex.voce_10.main_title') }}
                    </h4>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                   <p class="card-text">
                      {{ $t('menu.homePageIndex.voce_10.subtitle') }}
                    </p>
                  <p class="sr-only">
                    Puoi utilizzare questo servizio per stampare i seguenti avvisi:
                  </p>
                  <ul class="textual important-list">
                    <li>
                      <span
                        v-if="cardAttiva('stampa_avviso_scadenza')">
                        <v-btn :ripple="false" text :to="{ name: 'cerca_stampa_avv_scadenza' }" class="font-weight-bold">
                          {{ $t('menu.homePageIndex.voce_10.list_service.item_01') }}
                        </v-btn>
                      </span>
                    </li>
                    <li>
                      <span
                        v-if="cardAttiva('stampa_avviso_accertamento')">
                        <v-btn :ripple="false" text :to="{ name: 'cerca_stampa_avv_accertamento' }" class="font-weight-bold">
                          {{ $t('menu.homePageIndex.voce_10.list_service.item_02') }}
                        </v-btn>
                      </span>
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('contatti_aiuto')">
              <v-card
                align="center" justify="center"
                class="bg-ico bg-ico-aiuto">
                <v-img
                  class="mb-2"
                  width="64"
                  :src="require('@/assets/images/icone/home/aiuto.svg')"
                  alt=""
                  fluid/>

                  <v-card-title class="homeLinkBtn">
                    <v-btn
                    class="special-card"
                    :ripple="false"
                    text :to="{ name: 'contatti_aiuto'}"
                    rel="help">
                    <h4>
                      Hai bisogno di aiuto?
                    </h4>
                  </v-btn>
                  </v-card-title>
                  <v-card-text>
                    Ti serve assistenza alle procedure o devi richiedere delle informazioni? visualizza la pagina dedicata.
                  </v-card-text>
              </v-card>
            </div>
            <div
              class="col-md-6 col-xl-4 d-flex p-1"
              v-if="cardAttiva('area_riservata')">
              <v-card
                align="center" justify="center"
                class="bg-ico bg-ico-area-riservata">
                <v-img
                  class="mb-2"
                  width="64"
                  :src="require('@/assets/images/icone/home/servizi_autenticato.svg')"
                  alt=""
                  fluid/>
                <v-card-title class="homeLinkBtn">
                  <v-btn
                    class="special-card"
                    :ripple="false"
                    text
                    :href="areaRiservata"
                    target="_blank"
                    rel="noopener"
                    title="Vai all'area riservata (link esterno)">
                    <h4>Area riservata</h4>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <p class="card-text">
                    Questi servizi sono accessibili solo agli utenti registrati.<br/> I servizi sono: richiesta di esenzione per disabilità; richiesta di restituzione; visure.
                  </p>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emailAttiva, smsAttivo, servizioAttivo, AUTH_AREA_URL } from '@/common/config'

import TitoloServizio from '@/components/layout/TitoloServizio'
export default {
  components: { TitoloServizio },
  data () {
    return {
      descrizioneMemo: '',
      servizio: 'home',
      areaRiservata: AUTH_AREA_URL
    }
  },
  methods: {
    cardAttiva (nome) {
      return servizioAttivo(nome)
    }
  },
  async created () {
    if (emailAttiva() && smsAttivo()) this.descrizioneMemo = this.$i18n.t('menu.homePageIndex.voce_01.subtitle')
    else {
      if (emailAttiva()) this.descrizioneMemo = this.$i18n.t('menu.homePageIndex.voce_01.subtitle_email')
      if (smsAttivo()) this.descrizioneMemo = this.$i18n.t('menu.homePageIndex.voce_01.subtitle_sms')
    }
  }
}
</script>
