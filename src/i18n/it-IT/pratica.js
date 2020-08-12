export default {
  verifica: {
    cerca_titolo: 'Consulta una pratica',
    errors: {
      input_params_not_found: 'N° di protocollo - Codice fiscale / P. IVA non trovati',
      pratica_not_found: 'Pratica non trovata.',
      tipologia_non_gestita: 'Pratica non della tipologia prevista'
    },
    titolo_servizio: 'Consulta una pratica',
    accertamento: {
      risultato: 'Risultato ricerca',
      dati_avviso: {
        scadenza: 'Scadenza:',
        tributo_dovuto: 'Tributo dovuto:',
        data_invio: 'Data dell\'invio:',
        violazione: 'Violazione accertata:',
        data_notifica: 'Data della notifica:'
      }
    }
  },
  osservazione: {
    avviso_accertamento: {
      motivazione: {
        pagamentiCorretti: 'I pagamenti sono corretti',
        targaErrata: 'La targa è errata',
        scadenzaErrata: 'Indicato una scadenza errata',
        veicoloRitargato: 'Il veicolo è stato ritargato',
        pagamentoAltraRegioneProvincia: 'Ho pagato a favore di un\'altra provincia',
        mai_posseduto: 'Non ero intestatario del veicolo',
        venduto: 'Ho venduto il veicolo in data',
        venduto_concessionario: 'Venduto ad un concessionario',
        radiato_demolizione: 'Il veicolo è stato radiato per demolizione in data',
        esportato: 'Il veicolo è stato radiato per esportazione in data',
        esentato_disabili: 'Ho un\'esenzione per persone disabili',
        non_disponibile: 'Sono stato privato della disponibilità del veicolo',
        non_disponibile_desc: 'La privazione del veicolo è riferita al furto o al sequestro disposto dall\'autorità giudiziaria o di polizia.',
        diritto_riduzione: 'Diritto riduzione',
        competeva_altro_soggetto: 'Il pagamento competeva ad altro soggetto',
        trasferito_regione: 'Mi sono trasferito in altra regione in data',
        esentato_impianto: 'Ho installato l\'impianto GPL/metano collaudato in data (allegare copia della carta di circolazione con omologa)',
        dati_veicolo_rettifica: 'Dati tecnici errati',
        motivo_generico: 'Altro motivo'
      }
    },
    avviso_scadenza: {
      motivazione: {
        venduto: 'Ho venduto il veicolo in data',
        venduto_concessionario: 'Venduto ad un concessionario',
        radiato_demolizione: 'Il veicolo è stato radiato per demolizione in data',
        esportato: 'Il veicolo è stato radiato per esportazione in data',
        esentato: 'Il veicolo è esente dal pagamento perché',
        esentato_disabili: 'Ho un\'esenzione per persone disabili',
        esentato_altro_motivo: 'Esenzione per altri motivi',
        non_disponibile: 'Sono stato privato della disponibilità del veicolo',
        non_disponibile_desc: 'La privazione del veicolo è riferita al furto o al sequestro disposto dall\'autorità giudiziaria o di polizia.',
        mai_posseduto: 'Non sono intestatario del veicolo',
        trasferito_regione: 'Mi sono trasferito in altra regione in data',
        esentato_impianto: 'Ho installato l\'impianto GPL/metano collaudato in data (allegare copia della carta di circolazione con omologa)',
        dati_veicolo_rettifica: 'Dati tecnici errati',
        motivo_generico: 'Altro motivo generico'
      }
    },
    dati_veicolo: {
      alimentazione: 'Alimentazione',
      assi: 'Assi',
      catEuro: 'Categoria Euro',
      emissCo2: 'Emissioni CO2',
      kw: 'Kw',
      numPosti: 'N° di posti',
      peso: 'Peso',
      portata: 'Portata',
      rim: 'Rimorchiabilità',
      sp: 'Sospensione Pneumatica',
      targa: 'Targa',
      tipo: 'Tipo veicolo'
    },
    esenzione: {
      disabili: {
        nota_protocollo: '<strong>Attenzione</strong>: i dati devono riferirsi ad un provvedimento della Regione Piemonte e non ad altra documentazione (verbali, certificati sanitari, etc,) non rilevante ai fini fiscali.'
      }
    },
    motivazione: {
      dati_veicolo_rettifica: 'I dati tecnici non corrispondono'
    }
  },
  rateizzazione: {
    titolo_servizio: 'Richiesta rateizzazione',
    cerca: {
      labels: {
        tab_1: 'Intestatario del veicolo',
        tab_2: 'Rappresentante legale'
      },
      text_modal: 'Cos\'è e dove si trova il numero di protocollo dell\'avviso di accertamento?',
      text_info: '<strong>Puoi inserire altri numeri di protocollo nella pagina successiva</strong>.'
    }
  },
  domanda_discarico_rimborso: {
    crea: {
      labels: {
        tab_1: '',
        tab_2: ''
      }
    },
    richiesta: {
      labels: {
        tab_1: 'Intestatario ingiunzione / cartella',
        tab_2: 'Rappresentante legale'
      },
      intro: {
        par: '<p>Il servizio permette di inviare una richiesta di: <ol><li>discarico, parziale o totale</li><li>restituzione</li></ol></p><p>di una <strong>cartella</strong> o di una <strong>ingiunzione</strong> inviata a seguito del mancato pagamento di un avviso di accertamento della tassa automobilistica.</p>'
      }
    }
  },
  stampa: {
    scadenza: {
      tab_1: 'Codice avviso pagamento / IUV',
      tab_2: 'Dati del veicolo'
    },
    accertamento: {
      tab_1: 'Codice avviso pagamento / IUV',
      tab_2: 'Dati del veicolo'
    }
  },
  page_text: {
    step_esito: '<p><strong>La domanda è stata registrata correttamente.</strong></p><p><strong>N° di protocollo {numeroProtocollo}</strong></p><p>Conserva il numero per gli aggiornamenti sullo stato della pratica (controlla che sia arrivato via e-mail/SMS).</p>',
    step_esito_email: '<p><strong>La domanda è stata registrata correttamente.</strong></p><p><strong>N° di protocollo {numeroProtocollo}</strong></p><p>Conserva il numero per gli aggiornamenti sullo stato della pratica (controlla che sia arrivato via e-mail).</p>',
    step_esito_sms: '<p><strong>La domanda è stata registrata correttamente.</strong></p><p><strong>N° di protocollo {numeroProtocollo}</strong></p><p>Conserva il numero per gli aggiornamenti sullo stato della pratica (controlla che sia arrivato tramite SMS).</p>'
  }
}
