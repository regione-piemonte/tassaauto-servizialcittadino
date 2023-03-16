<template>
  <v-row class="mb-3">
    <!--Memobollo card-->
    <v-col
      lg="4" md="6" cols="12" 
      class="d-flex pa-2" 
      v-if="cardAttiva('memo_bollo')">
      <v-card class="bg-ico bg-ico-memobollo">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon memobollo"
            :ripple="false"
            text
            :to="{ name: 'cerca_veicolo_memo' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_01.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text class="card-text" v-html="descrizioneMemo"></v-card-text>
      </v-card>
    </v-col>
    <!--Fine Memobollo card-->
    <!--Pagobollo card-->
    <v-col
      cols="12"
      md="6"
      lg="4"
      class="d-flex pa-2"
      v-if="cardAttiva('pago_bollo') || cardAttiva('pago_rate')"
    >
      <v-card class="bg-ico bg-ico-pagamenti_online">
        <div v-if="cardAttiva('pago_bollo') && cardAttiva('pago_rate')">
          <v-card-title class="homeLinkBtn">
            <v-btn
              text
              class="homeIcon pagamenti_online"
              :ripple="false"
              :to="{ name: 'scelta_tipo_pagamento' }"
            >
              <h4>{{ $t("menu.homePageIndex.voce_02.main_title") }}</h4>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="card-text">
              {{ $t("menu.homePageIndex.voce_02.subtitle") }}
            </p>
            <p class="d-sr-only">
              Puoi utilizzare
              {{ $t("menu.homePageIndex.voce_02.main_title") }} per pagare:
            </p>
            <ul class="textual important-list">
              <li>
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'inizia_pagamento' }"
                  class="font-weight-bold"
                >
                  {{ $t("menu.homePageIndex.voce_02.list_service.item_01") }}
                  <span class="d-sr-only">.</span>
                </v-btn>
              </li>
              <li>
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'inizia_pagamento_rate' }"
                  class="font-weight-bold"
                >
                  {{ $t("menu.homePageIndex.voce_02.list_service.item_02") }}
                  <span class="d-sr-only">.</span>
                </v-btn>
              </li>
            </ul>
          </v-card-text>
        </div>
        <div v-if="cardAttiva('pago_bollo') && !cardAttiva('pago_rate')">
          <v-card-title class="homeLinkBtn">
            <v-btn
              class="homeIcon pagamenti_online"
              :ripple="false"
              text
              :to="{ name: 'inizia_pagamento' }"
            >
              <h4>{{ $t("menu.homePageIndex.voce_02.main_title") }}</h4>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="card-text">
              {{ $t("menu.homePageIndex.voce_02.subtitle") }}
            </p>
            <div class="px-6">
              <ul class="important-list">
                <li>
                  <v-btn
                    :ripple="false"
                    text
                    :to="{ name: 'inizia_pagamento' }"
                    class="font-weight-bold"
                    >{{
                      $t("menu.homePageIndex.voce_02.list_service.item_01")
                    }}</v-btn
                  >
                </li>
              </ul>
            </div>
          </v-card-text>
        </div>
        <div v-if="!cardAttiva('pago_bollo') && cardAttiva('pago_rate')">
          <v-btn
            class="homeIcon pagamenti_online"
            :ripple="false"
            text
            :to="{ name: 'inizia_pagamento_rate' }"
          >
            <v-card-title class="homeLinkBtn">
              <h4>{{ $t("menu.homePageIndex.voce_02.main_title") }}</h4>
            </v-card-title>
          </v-btn>
          <v-card-text>
            <p class="card-text">
              {{ $t("menu.homePageIndex.voce_02.subtitle") }}
            </p>
            <div class="px-6">
              <ul class="important-list">
                <li>
                  <v-btn
                    :ripple="false"
                    text
                    :to="{ name: 'inizia_pagamento_rate' }"
                    class="font-weight-bold"
                    >{{
                      $t("menu.homePageIndex.voce_02.list_service.item_02")
                    }}</v-btn
                  >
                </li>
              </ul>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-col>
    <!--Fine Pagobollo card-->
    <!--Scarica ricevuta card-->
    <v-col
      cols="12"
      md="6"
      lg="4"
      class="d-flex pa-2"
      v-if="cardAttiva('ricevuta_bollo')"
    >
      <v-card class="bg-ico bg-ico-ricevutabollo">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon scarica_ricevuta_pagamento"
            :ripple="false"
            text
            :to="{ name: 'cerca_pagamento' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_03.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_03.subtitle") }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <!--Fine Scarica ricevuta card-->
    <!--Calcolabollo card-->
    <v-col
      cols="12"
      md="6"
      lg="4"
      class="d-flex pa-2"
      v-if="cardAttiva('calcolo_bollo')"
    >
      <v-card class="bg-ico bg-ico-calcolabollo">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon calcola_bollo"
            :ripple="false"
            text
            :to="{ name: 'calcolo_importo' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_04.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_04.subtitle") }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <!--Fine Calcolabollo card-->
    <!--Osservazione card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="
        cardAttiva('osservazione_avviso_scadenza') ||
        cardAttiva('osservazione_avviso_accertamento')
      "
    >
      <v-card class="bg-ico bg-ico-osservazioneavvisi">
        <div
          v-if="
            cardAttiva('osservazione_avviso_scadenza') &&
            cardAttiva('osservazione_avviso_accertamento')
          "
        >
          <v-card-title class="homeLinkBtn">
            <v-btn
              class="homeIcon osservazioni"
              :ripple="false"
              text
              :to="{ name: 'scelta_tipo_osservazione' }"
            >
              <h4>{{ $t("menu.homePageIndex.voce_05.main_title") }}</h4>
            </v-btn>
          </v-card-title>
          <v-card-text>
            {{ $t("menu.homePageIndex.voce_05.subtitle") }}
            <p class="d-sr-only">Puoi utilizzare questo servizio per:</p>
            <ul class="textual important-list">
              <li>
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'cerca_avviso_scadenza' }"
                  class="font-weight-bold"
                  >{{
                    $t("menu.homePageIndex.voce_05.list_service.item_01")
                  }}</v-btn
                >
              </li>
              <li>
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'cerca_avviso_accertamento' }"
                  class="font-weight-bold"
                  >{{
                    $t("menu.homePageIndex.voce_05.list_service.item_02")
                  }}</v-btn
                >
              </li>
            </ul>
          </v-card-text>
        </div>
        <div
          v-if="
            cardAttiva('osservazione_avviso_scadenza') &&
            !cardAttiva('osservazione_avviso_accertamento')
          "
        >
          <v-card-title class="homeLinkBtn">
            <v-btn
              class="homeIcon osservazioni"
              :ripple="false"
              :to="{ name: 'cerca_avviso_scadenza' }"
            >
              <h4>
                {{
                  $t("menu.homePageIndex.voce_05.list_service.main_title_01")
                }}
              </h4>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="card-text mt-5">
              {{ $t("menu.homePageIndex.voce_05.list_service.subtitle_01") }}
            </p>
          </v-card-text>
        </div>
        <div
          v-if="
            !cardAttiva('osservazione_avviso_scadenza') &&
            cardAttiva('osservazione_avviso_accertamento')
          "
        >
          <v-card-title class="homeLinkBtn">
            <v-btn
              class="homeIcon osservazioni"
              :ripple="false"
              text
              :to="{ name: 'cerca_avviso_accertamento' }"
            >
              <h4>
                {{
                  $t("menu.homePageIndex.voce_05.list_service.main_title_02")
                }}
              </h4>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="card-text mt-5">
              {{ $t("menu.homePageIndex.voce_05.list_service.subtitle_02") }}
            </p>
          </v-card-text>
        </div>
      </v-card>
    </v-col>
    <!--Fine Osservazione card-->
    <!--Verifica Pratica card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('verifica_pratica')"
    >
      <v-card class="bg-ico bg-ico-verificapratica">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon consulta_pratica"
            :ripple="false"
            text
            :to="{ name: 'cerca_pratica' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_06.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="d-sr-only">
            Puoi utilizzare questo servizio per consultare lo stato delle
            seguenti richieste:
          </p>
          <ul class="textual pl-0">
            <li>
              <p
                class="font-weight-bold"
                v-if="cardAttiva('osservazione_avviso_scadenza')"
              >
                {{ $t("menu.homePageIndex.voce_06.list_service.item_01") }}
              </p>
            </li>
            <li>
              <p
                class="font-weight-bold"
                v-if="cardAttiva('osservazione_avviso_accertamento')"
              >
                {{ $t("menu.homePageIndex.voce_06.list_service.item_02") }}
              </p>
            </li>
            <li>
              <p class="font-weight-bold" v-if="cardAttiva('rateizzazione')">
                {{ $t("menu.homePageIndex.voce_06.list_service.item_03") }}
              </p>
            </li>
            <li>
              <p
                class="font-weight-bold"
                v-if="cardAttiva('domanda_discarico_rimborso')"
              >
                {{ $t("menu.homePageIndex.voce_06.list_service.item_04") }}
              </p>
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-col>
    <!--Fine Verifica Pratica card-->
    <!--Rateizzazione card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('rateizzazione')"
    >
      <v-card
        class="bg-ico bg-ico-rateizzazione"
        :class="
          !logged && cardAutenticata('rateizzazione') ? 'disabled-card' : ''
        "
      >
        <v-card-title class="homeLinkBtn">
          <v-btn
            v-if="regione === 'piemonte'"
            class="homeIcon chiedi_rateizzazione"
            :ripple="false"
            text
            :to="
              logged && cardAutenticata('rateizzazione')
                ? { name: 'richiesta_rateizzazione' }
                : { name: 'home' }
            "
          >
            <h4>{{ $t("menu.homePageIndex.voce_07.main_title") }}</h4>
          </v-btn>
          <v-btn
            v-if="regione === 'vda'"
            class="homeIcon chiedi_rateizzazione"
            :ripple="false"
            text
            :to="{ name: 'richiesta_rateizzazione' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_07.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_07.subtitle") }}
          </p>
        </v-card-text>
        <v-row
          align-content="center"
          justify="end"
          class="auth-serviceHome"
          v-if="!logged && cardAutenticata('rateizzazione')"
        >
          <v-col cols="auto">Accedi per usufruire del servizio</v-col>
          <v-col cols="auto" class="pl-0">
            <v-img
              width="14px"
              :src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
              :lazy-src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!--Fine Rateizzazione card-->
    <!--Domanda discarico card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('domanda_discarico_rimborso')"
    >
      <v-card class="bg-ico bg-ico-discarico">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon domanda_discarico_rimborso"
            :ripple="false"
            text
            :to="{ name: 'richiesta_domanda_discarico_rimborso' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_08.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_08.subtitle") }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <!--Fine Domanda discarico card-->
    <!--Info bollo card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('info_bollo')">
      <v-card class="bg-ico bg-ico-infobollo">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon infobollo"
            :ripple="false"
            text
            :to="{ name: 'verifica_attivazione_info' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_09.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_09.subtitle") }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <!--Fine Info bollo card-->
    <!--Stampa avviso card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="
        cardAttiva('stampa_avviso_accertamento') ||
        cardAttiva('stampa_avviso_scadenza')
      "
    >
      <v-card class="bg-ico bg-ico-stampa-avviso">
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon stampa_avviso_pagamento"
            :ripple="false"
            text
            :to="{ name: 'scelta_tipo_stampa' }"
          >
            <h4>{{ $t("menu.homePageIndex.voce_10.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_10.subtitle") }}
          </p>
          <p class="d-sr-only">
            Puoi utilizzare questo servizio per stampare i seguenti avvisi:
          </p>
          <ul class="textual important-list">
            <li>
              <span v-if="cardAttiva('stampa_avviso_scadenza')">
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'cerca_stampa_avv_scadenza' }"
                  class="font-weight-bold btn--large-resp"
                  >{{
                    $t("menu.homePageIndex.voce_10.list_service.item_01")
                  }}</v-btn
                >
              </span>
            </li>
            <li>
              <span v-if="cardAttiva('stampa_avviso_accertamento')">
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'cerca_stampa_avv_accertamento' }"
                  class="font-weight-bold"
                  >{{
                    $t("menu.homePageIndex.voce_10.list_service.item_02")
                  }}</v-btn
                >
              </span>
            </li>
            <li>
              <span v-if="cardAttiva('stampa_piano_rateizzazione')">
                <v-btn
                  :ripple="false"
                  text
                  :to="{ name: 'cerca_stampa_piano_rateizzazione' }"
                  class="font-weight-bold"
                  >{{
                    $t("menu.homePageIndex.voce_10.list_service.item_03")
                  }}</v-btn
                >
              </span>
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-col>
    <!--Fine Stampa avviso card-->
    <!--Esenzione disabili card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('esenzioni_disabili')"
    >
      <v-card
        class="bg-ico domanda_esenzioni_disabilita_auth"
        :class="
          !logged && cardAutenticata('esenzioni_disabili')
            ? 'disabled-card'
            : ''
        "
      >
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon domanda_esenzioni_disabilita_auth"
            :ripple="false"
            text
            :disabled="
              !logged && cardAutenticata('esenzioni_disabili') ? true : false
            "
            :to="
              logged && cardAutenticata('esenzioni_disabili')
                ? { name: 'inserimento_domanda_esenzione' }
                : { name: 'home' }
            "
          >
            <h4>{{ $t("menu.homePageIndex.voce_13.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_13.subtitle") }}
          </p>
        </v-card-text>
        <v-row
          align-content="center"
          justify="end"
          class="auth-serviceHome"
          v-if="!logged && cardAutenticata('esenzioni_disabili')"
        >
          <v-col cols="auto">Accedi per usufruire del servizio</v-col>
          <v-col cols="auto" class="pl-0">
            <v-img
              width="14px"
              :src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
              :lazy-src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!--Fine esenzione disabili card-->
    <!--Consulta pratica auth card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('consulta_pratica_auth')"
    >
      <v-card
        class="bg-ico consulta_pratica_auth"
        :class="
          !logged && cardAutenticata('consulta_pratica_auth')
            ? 'disabled-card'
            : ''
        "
      >
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon consulta_pratica_auth"
            :ripple="false"
            text
            :to="
              logged && cardAutenticata('consulta_pratica_auth')
                ? { name: 'verifica_pratica_auth' }
                : { name: 'home' }
            "
            :disabled="
              !logged && cardAutenticata('consulta_pratica_auth') ? true : false
            "
          >
            <h4>{{ $t("menu.homePageIndex.voce_14.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <ul class="textual pl-0">
            <li>
              <p
                class="font-weight-bold"
                v-if="cardAttiva('esenzioni_disabili')"
              >
                {{ $t("menu.homePageIndex.voce_14.list_service.item_01") }}
              </p>
              <p
                class="font-weight-bold"
                v-if="cardAttiva('restituzione_tassa')"
              >
                {{ $t("menu.homePageIndex.voce_14.list_service.item_02") }}
              </p>
            </li>
          </ul>
          <p class="d-sr-only"></p>
        </v-card-text>
        <v-row
          align-content="center"
          justify="end"
          class="auth-serviceHome"
          v-if="!logged && cardAutenticata('consulta_pratica_auth')"
        >
          <v-col cols="auto">Accedi per usufruire del servizio</v-col>
          <v-col cols="auto" class="pl-0">
            <v-img
              width="14px"
              :src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
              :lazy-src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!--Fine Consulta pratica auth card-->
    <!--Restituzione tassa card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('restituzione_tassa')"
    >
      <v-card
        class="bg-ico restituzione_tassa"
        :class="
          !logged && cardAutenticata('restituzione_tassa')
            ? 'disabled-card'
            : ''
        "
      >
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon restituzione_tassa"
            :ripple="false"
            text
            :disabled="
              !logged && cardAutenticata('restituzione_tassa') ? true : false
            "
            :to="
              logged && cardAutenticata('restituzione_tassa')
                ? { name: 'inserimento_domanda_restituzione' }
                : { name: 'home' }
            "
          >
            <h4>{{ $t("menu.homePageIndex.voce_15.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_15.subtitle") }}
          </p>
        </v-card-text>
        <v-row
          align-content="center"
          justify="end"
          class="auth-serviceHome"
          v-if="!logged && cardAutenticata('restituzione_tassa')"
        >
          <v-col cols="auto">Accedi per usufruire del servizio</v-col>
          <v-col cols="auto" class="pl-0">
            <v-img
              width="14px"
              :src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
              :lazy-src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!--Fine Restituzione tassa card-->
    <!--Visure card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('visure')">
      <v-card
        class="bg-ico visure"
        :class="!logged && cardAutenticata('visure') ? 'disabled-card' : ''"
      >
        <v-card-title class="homeLinkBtn">
          <v-btn
            class="homeIcon visure"
            :ripple="false"
            text
            :disabled="!logged && cardAutenticata('visure') ? true : false"
            :to="
              logged && cardAutenticata('visure')
                ? { name: 'elenco_veicoli_visure' }
                : { name: 'home' }
            "
          >
            <h4>{{ $t("menu.homePageIndex.voce_16.main_title") }}</h4>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="card-text">
            {{ $t("menu.homePageIndex.voce_16.subtitle") }}
          </p>
        </v-card-text>
        <v-row
          align-content="center"
          justify="end"
          class="auth-serviceHome"
          v-if="!logged && cardAutenticata('visure')"
        >
          <v-col cols="auto">Accedi per usufruire del servizio</v-col>
          <v-col cols="auto" class="pl-0">
            <v-img
              width="14px"
              :src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
              :lazy-src="
                require(`@/assets/images/icone/servizi_accesso_auth_black.svg`)
              "
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!--Fine Visure card-->
    <!--Contatti aiuto card-->
    <v-col cols="12" md="6" lg="4"
      class="pa-2"
      v-if="cardAttiva('contatti_aiuto')"
    >
      <v-card align="center" justify="center" class="bg-ico bg-ico-aiuto">
        <v-img
          class="mb-2"
          width="64"
          :src="require('@/assets/images/icone/home/aiuto.svg')"
          alt
          fluid
        />

        <v-card-title class="homeLinkBtn">
          <v-btn
            class="special-card"
            :ripple="false"
            text
            :to="{ name: 'contatti_aiuto' }"
            rel="help"
          >
            <h4>Hai bisogno di aiuto?</h4>
          </v-btn>
        </v-card-title>
        <v-card-text
          >Ti serve assistenza alle procedure o devi richiedere delle
          informazioni? visualizza la pagina dedicata.</v-card-text
        >
      </v-card>
    </v-col>
    <!--Fine Contatti aiuto card-->
  </v-row>
</template>

<script>
import { emailAttiva, smsAttivo, servizioAttivo, REGIONE_ABILITATA, servizioAuth } from '@/common/config'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      descrizioneMemo: '',
      servizio: 'home',
      regione: REGIONE_ABILITATA
    }
  },
  computed: {
    ...mapGetters([
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
    cardAttiva (nome) {
      return servizioAttivo(nome)
    },
    cardAutenticata (nome) {
      return servizioAuth(nome)
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
