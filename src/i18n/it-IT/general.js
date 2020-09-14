export default {
  api: {
    errors: {
      download_file: 'Problemi occorsi nello scaricamento del file.',
      fields_missed: 'Campi obbligatori mancanti',
      no_results: 'Attenzione, la ricerca non ha prodotto risultati.',
      param_not_found: 'Non trovato',
      cf_not_found: 'Il codice fiscale non corrisponde al soggetto dell\'avviso accertamento',
      params_invalid: 'Parametri inseriti non validi.',
      search_params_invalid: 'Parametri di ricerca non validi.',
      service_unavailable: 'Servizio al momento non disponibile.',
      targa_not_found: 'Targa non presente',
      targa_invalid: 'Formato errato della targa',
      subject_not_found: 'Soggetto non trovato'
    }
  },
  box_titles: {
    allegati: 'Allegati',
    riferimenti: 'Riferimenti'
  },
  buttons: {
    attiva_revoca: 'Attiva / Revoca',
    attiva: 'Attiva',
    back: 'Indietro',
    download_pdf: 'Scarica ricevuta PDF',
    home: 'Home',
    search: 'Cerca',
    revoca: 'Revoca',
    undo: 'Annulla',
    nuovo_veicolo: 'Nuova ricerca veicolo',
    back_mod: 'Modifica / Indietro',
    avanti: 'Avanti',
    invia: 'Invia richiesta',
    calcola: 'Calcola',
    accetta: 'Accetta',
    continua: 'Continua',
    pagamento: 'Vai al pagamento',
    foto: 'Scatta una foto'
  },
  error: 'Errore',
  labels: {
    email: 'Indirizzo e-mail',
    cell: 'Numero di telefono mobile',
    pagina_scaduta: 'Pagina scaduta.',
    error: {
      privacy: "Il consenso all'informativa sulla privacy è obbligatorio."
    }
  },
  messages: {
    zero_allegati: 'Nessun file allegato',
    limite_allegati: 'Non puoi allegare altri documenti.'
  },
  services: {
    scatta_foto: {
      par_1: 'Puoi inserire fino a {numMaxAllegati} documenti allegati a completamento della tua osservazione. Formati ammessi: {tipiAllegato}',
      par_2: 'La funzionalità "Scatta una foto" potrebbe non essere disponibile su tutti i dispositivi'
    }
  },
  privacy: 'Informativa sulla privacy',
  validations: {
    codiceFiscale: {
      alfanumerico: 'Il codice fiscale / P.IVA deve contenere solo lettere e numeri.',
      lunghezza: 'Il codice fiscale / P.IVA deve avere una lunghezza minima di {num} caratteri.',
      obbligatorio: 'Il codice fiscale / P.IVA è obbligatorio.'
    },
    targa: {
      alfanumerico: 'La targa deve contenere solo lettere e numeri.',
      obbligatorio: 'La targa è obbligatoria.'
    }
  },
  warning: 'Attenzione'
}
