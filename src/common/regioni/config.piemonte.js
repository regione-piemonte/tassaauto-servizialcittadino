const ConfParameters = {
  ALT_LOGO_REGIONE: 'Regione Piemonte',
  ALT_LOGO_SISTEMA: 'Sistema Piemonte',
  MAIN_COLOR: '#006cb4',
  APP_TITLE: 'Tassa Auto Piemonte',
  HEAD_TITLE: 'Tassa Auto Piemonte',
  SERVICE_DESCRIPTION: 'Un servizio a cura della Regione Piemonte <br/> P. Iva 02843860012 - CF 80087670016',
  USE_NOTE_URL: 'https://form.agid.gov.it/view/d242d3ee-9f78-40e2-9c04-bfe2479ac896',
  PRIVACY_URL: 'https://www.piemontetu.it/privacy',
  COOKIE_URL: 'https://www.piemontetu.it/cookie',
  BOLLOAUTOVISURE_URL: 'https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-quando-pagare',
  CANALE_EMAIL: true,
  CANALE_SMS: true,
  CONTATTI_AIUTO_CHATBOT_DESC: 'Il chatbot sperimentale del servizio Tassa Auto di Regione Piemonte può rispondere a domande generali su tassa di circolazione, tassa di proprietà, restituzioni, esenzioni per tipo di alimentazione e storicità del veicolo',
  CONTATTI_AIUTO_CHATBOT_FACEBOOK: 'https://www.facebook.com/regione.piemonte.bolloauto',
  CONTATTI_AIUTO_CHATBOT_MESSENGER: 'https://www.messenger.com/t/regione.piemonte.bolloauto',
  CONTATTI_AIUTO_EMAIL: 'comunicazionibollo@regione.piemonte.it',
  CONTATTI_AIUTO_FAQ: 'https://www.regione.piemonte.it/web/faq?tema=323',
  CONTATTI_AIUTO_TELEFONO: '800 333 444 (numero verde da telefono fisso)',
  CONTATTI_AIUTO_TELEFONO_NUMERO: '800333444',
  CONTATTI_AIUTO_TELEFONO_ESTERO: '011 08 24 222 (da cellulare ed estero)',
  CONTATTI_AIUTO_TELEFONO_ESTERO_NUMERO: '011 08 24 222',
  CONTATTI_AIUTO_TELEFONO_DESC: 'Scegliere "Tassa automobilistica" (tasto 2)',
  CONTATTI_AIUTO_TELEFONO_DESC_2: 'Scegliere "Tassa automobilistica" (tasto 2) <br>011 08 24 222 (da cellulare ed estero)',
  CONTATTI_AIUTO_MAIL: 'Attenzione: la casella di posta non deve essere utilizzata per richiedere assistenza alle procedure',
  CONTATTI_AIUTO_VIDEO: true,
  VIDEO_TUTORIAL_URL: 'https://streamfms.csi.it/vod/1/5/3/Tutorial_Bollo_Auto/',
  SERVIZI_ABILITATI: {
    calcolo_bollo: true,
    contatti_aiuto: true,
    consulta_pratica_rateizzazione: true,
    domanda_discarico_rimborso: true,
    info_bollo: true,
    memo_bollo: true,
    osservazione_avviso_scadenza: true,
    osservazione_avviso_accertamento: true,
    osservazione_avviso_bonario: true,
    pago_bollo: true,
    pago_rate: true,
    rateizzazione: true,
    ricevuta_bollo: true,
    stampa_avviso_accertamento: true,
    stampa_avviso_scadenza: true,
    stampa_piano_rateizzazione: true,
    verifica_pratica: true,
    esenzioni_disabili: true,
    consulta_pratica_auth: true,
    restituzione_tassa: true,
    visure: true
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
    osservazione_avviso_bonario: false,
    pago_bollo: false,
    pago_rate: false,
    rateizzazione: true,
    ricevuta_bollo: false,
    stampa_avviso_accertamento: false,
    stampa_avviso_scadenza: false,
    verifica_pratica: false,
    esenzioni_disabili: true,
    consulta_pratica_auth: true,
    restituzione_tassa: true,
    visure: true
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
        sub_service: {
          link1: 'inizia_pagamento',
          link2: 'inizia_pagamento_rate'
        }
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
        sub_service: {
          link1: 'cerca_avviso_scadenza',
          link2: 'cerca_avviso_bonario',
          link3: 'cerca_avviso_accertamento'
        }
      },
      list_service: {
        item_01: 'menu.homePageIndex.voce_05.list_service.item_01',
        item_02: 'menu.homePageIndex.voce_05.list_service.item_02',
        item_03: 'menu.homePageIndex.voce_05.list_service.item_03'
      }
    },
    CONSULTAPR: {
      main_title: 'menu.homePageIndex.voce_06.main_title',
      links: {
        main_service: 'cerca_pratica'
      },
      list_service: {
        item_01: 'menu.homePageIndex.voce_06.list_service.item_01',
        item_02: 'menu.homePageIndex.voce_06.list_service.item_02',
        item_03: 'menu.homePageIndex.voce_06.list_service.item_03',
        item_04: 'menu.homePageIndex.voce_06.list_service.item_04',
        item_05: 'menu.homePageIndex.voce_06.list_service.item_05',
        item_06: 'menu.homePageIndex.voce_06.list_service.item_06',
        item_07: 'menu.homePageIndex.voce_06.list_service.item_07'
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
        sub_service: {
          link1: 'cerca_stampa_avv_scadenza',
          link2: 'cerca_stampa_avv_accertamento',
          link3: 'cerca_stampa_piano_rateizzazione'
        }
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
    memo_bollo: 'Tutorial_Bollo_Auto_Memobollo.mp4',
    osservazione_avviso_scadenza: 'Tutorial_Bollo_Auto_Avviso_Scadenza.mp4',
    osservazione_avviso_accertamento: 'Tutorial_Bollo_Auto_Avviso_Accertamento.mp4',
    pago_bollo: 'Tutorial_Bollo_Auto_Pagamento_Bollo',
    pago_rate: 'Tutorial_Bollo_Auto_Pagamento_Rate',
    rateizzazione: '',
    ricevuta_bollo: '',
    stampa_avviso_accertamento: '',
    stampa_avviso_scadenza: '',
    verifica_pratica: '',
    visure: ''
  }
}
module.exports = ConfParameters
