export default {
  calcolo: {
    errors: {
      veicolo_not_found: 'Veicolo non trovato, calcolo bollo non eseguito'
    },
    title: 'Calcolo sicuro',
    icona: 'test1',
    titolo_servizio: 'Calcola il bollo'
  },
  info: {
    buttons: { },
    labels: {
      email: 'Indirizzo e-mail',
      cell: 'Numero di telefono mobile'
    },
    titolo_servizio: 'Infobollo'
  },
  memo: {
    titolo_servizio: 'Memobollo'
  },
  pago: {
    scelta_tipo_pagamento: {
      titolo_servizio: 'Paga on line'
    },
    bollo: {
      labels: {
        tab_iuv: 'Paga con codice di avviso di pagamento',
        tab_targa_telaio: 'Paga con targa/telaio'
      },
      titolo_servizio: 'Paga il bollo',
      service_description: 'Compila i campi sottostanti e continua con il pagamento.'
    },
    rate: {
      titolo_servizio: 'Paga le rate',
      labels: {
        cerca_rate: {
          n_riferimento: 'Numero di Riferimento',
          anno: 'Anno',
          cod_fis_piva: 'Codice fiscale / P. IVA',
          cerca: 'Cerca rate'
        },
        title: {
          calcola_importo: {
            piano: 'Dati del piano di rateizzazione',
            elenco: 'Elenco delle rate ancora da pagare'
          }
        },
        pagoPA: 'Il pagamento viene effettuato sulla piattaforma pagoPA.'
      }
    },
    pagamento: 'Per il pagamento sarai indirizzato su <strong>pagoPA</strong>, la piattaforma digitale per i pagamenti a favore della pubblica amministrazione. Le forme di pagamento elettronico accettate e le commissioni possono variare a seconda delle scelte successive. Terminato il pagamento sarai <strong>reindirizzato qui</strong> per la conclusione della procedura.',
    title: 'Calcolo sicuro',
    icona: 'test2'
  },
  ricevuta: {
    cerca_titolo: 'Cerca un pagamento',
    home_servizio: {
      paragrafo_1: 'Se hai pagato il bollo o un accertamento, lo <strong>IUV (Identificativo Unico Versamento) / Codicde avviso pagamento</strong> è reperibile:',
      lista: {
        voce_1: 'nella <strong>mail</strong> inviata dal servizio <strong>Pagamenti online</strong>',
        voce_2: 'nell\'avviso di scadenza cartaceo',
        voce_3: 'nell\'<strong>avviso di accertamento</strong> cartaceo',
        voce_4: 'nella riproduzione degli avvisi di pagamento generati dal servizio <strong>Stampa avvisi di pagamento</strong>'
      },
      paragrafo_2: 'Se hai pagato le <strong>rate</strong> del bollo puoi trovare lo <strong>IUV / Codice avviso di pagamento</strong> nella <strong>mail</strong> inviata dal servizio Pagamenti online.'
    },
    errors: {
      iuv_not_found: 'Codice di avviso di pagamento non trovato',
      iuv_required: 'Il codice di avviso di pagamento è obbligatorio.',
      iuv_alphaNum: 'Il codice di avviso di pagamento deve contenere solo lettere e numeri.',
      anno_required: 'Campo obbligatorio.',
      tipoIuv_required: 'E\' obbligatorio selezionare almeno un tipo di pagamento.',
      iuvSelect_required: 'E\' obbligatorio selezionare almeno un codice di avviso di pagamento.'
    },
    service_description_1: 'Compila i campi sottostanti e procedi con il download della ricevuta di pagamento.',
    icona: 'test3',
    titolo_servizio: 'Scarica la ricevuta di un pagamento',
    scarica: {
      titoli: {
        titolo_1: 'Riferimento',
        titolo_2: 'Dati veicoli e composizione importo',
        titolo_3: 'Dati del pagamento'
      },
      accordion: {
        importo: 'Composizione importo',
        anagrafica: 'Dati anagrafici intestatario pagamento',
        veicolo: 'Dati veicolo'
      }
    }
  },
  avviso: {
    titolo_servizio: 'Osservazioni su avviso di scadenza',
    cerca: 'Cerca un avviso di scadenza',
    errors: {
      n_riferimento: {
        required: 'Il numero di riferimento dell\'avviso è obbligatorio.',
        alphaNum: 'Il numero di riferimento dell\'avviso deve contenere solo lettere e numeri.',
        max_length: 'Il numero di riferimento dell\'avviso deve essere composto da massimo'
      }
    }
  }
}
