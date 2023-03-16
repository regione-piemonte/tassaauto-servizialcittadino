// SERVIZI_ABILITATI VDA
// 1 tranche: calcolo_bollo, memo_bollo
// 2 tranche: osservazione_avviso_accertamento, rateizzazione, verifica_pratica

const ConfParameters = {
  ALT_LOGO_REGIONE: '',
  ALT_LOGO_SISTEMA: 'Regione Autonoma Valle d’Aosta Région Autonome Vallée d’Aoste',
  MAIN_COLOR: '#be0004',
  APP_TITLE: 'Tassa Auto VALLE D’AOSTA',
  HEAD_TITLE: 'Tassa Auto VALLE D’AOSTA',
  SERVICE_DESCRIPTION: '© Regione Autonoma Valle d’Aosta <br/> P. Iva 00368440079 - CF 80002270074',
  USE_NOTE_URL: '',
  PRIVACY_URL: 'https://www.regione.vda.it/informazioni_utili/privacy_i.asp',
  COOKIE_URL: 'https://www.regione.vda.it/informazioni_utili/cookies_i.aspx',
  CANALE_EMAIL: true,
  CANALE_SMS: false,
  CONTATTI_AIUTO_CHATBOT_DESC: '',
  CONTATTI_AIUTO_CHATBOT_FACEBOOK: null,
  CONTATTI_AIUTO_CHATBOT_MESSENGER: null,
  CONTATTI_AIUTO_EMAIL: null,
  CONTATTI_AIUTO_FAQ: null,
  CONTATTI_AIUTO_TELEFONO: null,
  CONTATTI_AIUTO_TELEFONO_DESC: '',
  CONTATTI_AIUTO_TELEFONO_DESC_2: '',
  CONTATTI_AIUTO_VIDEO: false,
  VIDEO_TUTORIAL_URL: '',
  SERVIZI_ABILITATI: {
    calcolo_bollo: true,
    contatti_aiuto: false,
    consulta_pratica_rateizzazione: true,
    domanda_discarico_rimborso: false,
    info_bollo: false,
    memo_bollo: true,
    osservazione_avviso_scadenza: false,
    osservazione_avviso_accertamento: true,
    pago_bollo: false,
    pago_rate: false,
    rateizzazione: true,
    ricevuta_bollo: false,
    stampa_avviso_accertamento: false,
    stampa_avviso_scadenza: false,
    stampa_piano_rateizzazione: false,
    verifica_pratica: true,
    esenzioni_disabili: false,
    consulta_pratica_auth: false,
    restituzione_tassa: false,
    visure: false
  },
  SERVIZI_AUTENTICATI: {
    calcolo_bollo: false,
    contatti_aiuto: false,
    consulta_pratica_rateizzazione: false,
    domanda_discarico_rimborso: false,
    info_bollo: false,
    memo_bollo: false,
    osservazione_avviso_scadenza: false,
    osservazione_avviso_accertamento: false,
    pago_bollo: false,
    pago_rate: false,
    rateizzazione: false,
    ricevuta_bollo: false,
    stampa_avviso_accertamento: false,
    stampa_avviso_scadenza: false,
    verifica_pratica: false,
    esenzioni_disabili: false,
    consulta_pratica_auth: false,
    restituzione_tassa: false,
    visure: false
  },
  DESCRIZIONI_LINK_SERVIZI: {
    MEMOBOLLO: {
      main_title: 'menu.homePageIndex.voce_01.main_title',
      subtitle: 'menu.homePageIndex.voce_01.subtitle',
      links: {
        main_service: 'cerca_veicolo_memo'
      }
    },
    PAGAONLINE: {
      main_title: 'menu.homePageIndex.voce_02.main_title',
      subtitle: 'menu.homePageIndex.voce_02.subtitle',
      links: {
        main_service: 'scelta_tipo_pagamento',
        link1: 'inizia_pagamento',
        link2: 'inizia_pagamento_rate'
      },
      list_service: {
        item_01: 'menu.homePageIndex.voce_02.list_service.item_01',
        item_02: 'menu.homePageIndex.voce_02.list_service.item_02'
      }
    },
    SCARICARIC: {
      main_title: 'menu.homePageIndex.voce_03.main_title',
      subtitle: 'menu.homePageIndex.voce_03.subtitle',
      links: {
        main_service: 'cerca_pagamento'
      }
    },
    CALCOLOBOL: {
      main_title: 'menu.homePageIndex.voce_04.main_title',
      subtitle: 'menu.homePageIndex.voce_04.subtitle',
      links: {
        main_service: 'calcolo_importo'
      }
    },
    INSOSSERVA: {
      main_title: 'menu.homePageIndex.voce_05.main_title',
      subtitle: 'menu.homePageIndex.voce_05.subtitle',
      links: {
        main_service: 'scelta_tipo_osservazione',
        link1: 'cerca_avviso_scadenza',
        link2: 'cerca_avviso_accertamento'
      },
      list_service: {
        item_01: 'menu.homePageIndex.voce_05.list_service.item_01',
        item_02: 'menu.homePageIndex.voce_05.list_service.item_02'
      }
    },
    CONSULTAPR: {
      main_title: 'menu.homePageIndex.voce_06.main_title',
      subtitle: 'menu.homePageIndex.voce_06.subtitle',
      links: {
        main_service: 'cerca_pratica',
        link1: 'cerca_pratica',
        link2: 'cerca_pratica',
        link3: 'cerca_pratica',
        link4: 'cerca_pratica',
        link5: 'cerca_pratica',
        link6: 'cerca_pratica'
      },
      list_service: {
        item_01: 'menu.homePageIndex.voce_06.list_service.item_01',
        item_02: 'menu.homePageIndex.voce_06.list_service.item_02',
        item_03: 'menu.homePageIndex.voce_06.list_service.item_03',
        item_04: 'menu.homePageIndex.voce_06.list_service.item_04',
        item_05: 'menu.homePageIndex.voce_06.list_service.item_05',
        item_06: 'menu.homePageIndex.voce_06.list_service.item_06'
      }
    },
    INSRATEIZZ: {
      main_title: 'menu.homePageIndex.voce_07.main_title',
      subtitle: 'menu.homePageIndex.voce_07.subtitle',
      links: {
        main_service: 'richiesta_rateizzazione'
      }
    },
    INSDISCRIM: {
      main_title: 'menu.homePageIndex.voce_08.main_title',
      subtitle: 'menu.homePageIndex.voce_08.subtitle',
      links: {
        main_service: 'richiesta_domanda_discarico_rimborso'
      }
    },
    INFOBOLLO: {
      main_title: 'menu.homePageIndex.voce_09.main_title',
      subtitle: 'menu.homePageIndex.voce_09.subtitle',
      links: {
        main_service: 'verifica_attivazione_info'
      }
    },
    STAMPAAVVI: {
      main_title: 'menu.homePageIndex.voce_10.main_title',
      subtitle: 'menu.homePageIndex.voce_10.subtitle',
      links: {
        main_service: 'scelta_tipo_stampa',
        link1: 'cerca_stampa_avv_scadenza',
        link2: 'cerca_stampa_avv_accertamento',
        link3: 'cerca_stampa_piano_rateizzazione'
      },
      list_service: {
        item_01: 'menu.homePageIndex.voce_10.list_service.item_01',
        item_02: 'menu.homePageIndex.voce_10.list_service.item_02',
        item_03: 'menu.homePageIndex.voce_10.list_service.item_03'
      }
    },
    INSESENZ: {
      main_title: 'menu.homePageIndex.voce_13.main_title',
      subtitle: 'menu.homePageIndex.voce_13.subtitle',
      links: {
        main_service: 'inserimento_domanda_esenzione'
      }
    },
    INDREST: {
      main_title: 'menu.homePageIndex.voce_15.main_title',
      subtitle: 'menu.homePageIndex.voce_15.subtitle',
      links: {
        main_service: 'inserimento_domanda_restituzione'
      }
    },
    VISURE: {
      main_title: 'menu.homePageIndex.voce_16.main_title',
      subtitle: 'menu.homePageIndex.voce_16.subtitle',
      links: {
        main_service: 'elenco_veicoli_visure'
      }
    }
  },
  VIDEO_SERVIZI: {
    calcolo_bollo: '',
    contatti_aiuto: '',
    domanda_discarico_rimborso: '',
    info_bollo: '',
    memo_bollo: '',
    osservazione_avviso_scadenza: '',
    osservazione_avviso_accertamento: '',
    pago_bollo: '',
    pago_rate: '',
    rateizzazione: '',
    ricevuta_bollo: '',
    stampa_avviso_accertamento: '',
    stampa_avviso_scadenza: '',
    verifica_pratica: '',
    visure: false
  }
}
module.exports = ConfParameters
