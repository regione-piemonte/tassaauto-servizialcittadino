# Project Title
**PWA: Servizi al cittadino**

# Project Description
È una web application realizzata in tecnica *responsive*, nativamente adattabile ai dispositivi sia mobili che desktop. Nello specifico si tratta di una *Single Page Application* che rappresenta il Front-End per i seguenti servizi:

- Memobollo;
- pagamenti online;
- ricevuta di un pagamento;
- calcola il bollo;
- osservazioni su avvisi di scadenza/accertamento;
- consulta una pratica;
- chiedi la rateizzazione;
- domanda di discarico o rimborso di cartella o ingiunzione di pagamento;
- Infobollo;
- stampa avviso di pagamento.

# Configurations
Nei file di configurazione:

- *config/dev_localhost.env.js* (per l'installazione in locale)
- *config/dev_remote.env.js* (per la generazione della distribuzione per l'ambiente di sviluppo remoto)
- *config/test_remote.env.js* (per la generazione della distribuzione per l'ambiente di test remoto)
- *config/stg.env.js* (per la generazione della distribuzione per l'ambiente di staging)
- *config/preprod.env.js* (per la generazione della distribuzione per l'ambiente di collaudo)
- *config/prod.env.js* (per la generazione della distribuzione per l'ambiente di produzione)
- *config/test.env.js* (per i test e2e)

predisporre i seguenti parametri:

- API_URL: da valorizzare con la URL che espone di servizi REST;
- AUTH_AREA_URL: da valorizzare con la URL dell'area riservata;
- CUSTOMER_SATISFACTION_URL: è la pagina per sondare la soddisfazione del cliente;
- RECAPTCHA_SITE_KEY: site key di Google Recaptcha.

# Prerequisites
I prerequisiti per la compilazione e l'installazione della componente sono i seguenti:

## Software
- [Apache 2.4](https://www.apache.org)
- [Node.js 12.18.2](https://nodejs.org)

# Installing
Per predisporre il progetto ed avviare il server in locale, mandare in esecuzione:

>#### installazione dipendenze
> ```npm install```
>
>#### per avviare il server locale su localhost:8080
>``` npm run dev```

## End to end tests
L'esecuzione automatica dei test funziona **solamente** con i seguenti prerequisiti:

 - Java(TM) SE Runtime Environment (build 1.8.0_211-b12) Java HotSpot(TM) 64-Bit Server
 - Google Chrome Versione 84.0.4147.89 (Build ufficiale) (a 64 bit)
 - chromedriver v. 84.0.1
 - nightwatch v. 1.3.7
 - nightwatch-html-reporter v. 2.0.6
 - selenium-server: v. 3.141.59
 - webpack: 4.44.1
 - dare OK all'accesso esecuzione Java nelle reti pubbliche e private
 - non avere un precedente processo di chrome (chromedriver.exe) in stato zombie e quindi non terminato (cfr. Gestione attività)

Prima di eseguire i test, avviare il *json-server* con:
>``` json-server --config test/e2e/json-server/json-server-config.json test/e2e/json-server/db-test.json```

In un'altra finestra di Node.js, mandare in esecuzione i test automatizzati con:
> ```npm run test```

## Coding style tests
Mandare in esecuzione il comando:
> ```npm run lint```

# Deployment
Per eseguire la build del codice JS ed ottenere la distribuzione (cartella *dist*) del software per l'ambiente di deployment, i comandi da utilizzare sono:
>#### build e dist per ambiente di sviluppo
> npm run build_dev
>
>#### build e dist per ambiente di test
> npm run build_test
>
>#### build e dist per ambiente di staging
> npm run build_stg
>
>#### build e dist per ambiente di collaudo
> npm run build_preprod
>
>#### build e dist per ambiente di staging
> npm run build_prod
>

Il contenuto della cartella *dist*, originato dal comando di build, deve essere portato sull'ambiente di deployment.

# Versioning
Per la gestione del codice sorgente viene utilizzata la metodologia [Semantic Versioning](https://semver.org/).

# Authors
Gli autori della componente **PWA: Servizi al cittadino** sono:

- [Ramona Banfi](mailto:ramona.banfi@consulenti.csi.it)
- [Riccardo Franco](mailto:riccardo.franco@csi.it)
- [Luca Alberto Goria](mailto:luca.goria@csi.it)
- [Carlo Peraudo](mailto:carlo.peraudo@consulenti.csi.it)
- [Roberta Porqueddu](mailto:roberta.porqueddu@csi.it)
- [Daniel Scaletta](mailto:daniel.scaletta@consulenti.csi.it)
- [Simone Zangirolami](mailto:simone.zangirolami@consulenti.csi.it)

# Copyrights
(C) Copyright 2020 Regione Piemonte

# License
Questo software è distribuito con licenza [EUPL-1.2-or-later](https://joinup.ec.europa.eu/collection/eupl/eupl-text-11-12)

Consulta il file [LICENSE.txt](LICENSE.txt) per i dettagli sulla licenza (versione inglese [LICENSE_EN.txt](LICENSE_EN.txt)).

In [Bom.csv](Bom.csv) è presente l'elenco delle librerie esterne utilizzate dalla PWA.
