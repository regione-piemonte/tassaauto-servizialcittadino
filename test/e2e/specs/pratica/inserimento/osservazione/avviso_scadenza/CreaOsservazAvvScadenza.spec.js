// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
// https://github.com/nightwatchjs/nightwatch-docs

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/')
      .waitForElementVisible('#main-content', 500)
      .waitForElementVisible('#homePage-gridCard > div > div:nth-child(5) > div > div > div.v-card__text > ul > li:nth-child(1) > a > span', 500)
      // click su card
      .click('#homePage-gridCard > div > div:nth-child(5) > div > div > div.v-card__text > ul > li:nth-child(1) > a > span')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > h2', 'Cerca un avviso di scadenza')
      .waitForElementVisible('#targa', 500)
      // click che fa scattare la validazione
      .click('button[type=submit]')
      // verifica errori pagina crea
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(1) > div > div.v-text-field__details > div > div > div', 'Il numero di riferimento dell\'avviso è obbligatorio.')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(2) > div > div.v-text-field__details > div > div > div', 'Il Codice fiscale / P. IVA è obbligatorio.')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > form > div.v-input.v-input--has-state.v-input--is-label-active.v-input--is-dirty.theme--light.v-text-field.v-text-field--is-booted.v-select.error--text > div > div.v-text-field__details > div > div > div', 'Specificare il tipo di veicolo.')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(4) > div > div.v-text-field__details > div > div > div', 'La targa è obbligatoria.')
      .setValue('input[id=numeroRiferimento]', '200912000372756')
      .setValue('input[id=codiceFiscale]', 'bnclgu59b12g325q') // jira STASP-520
      .setValue('input[id=targa]', 'za055gx')
      .setValue('#tipoVeicolo', 'A')
      .moveToElement('button[type=submit]', 2, 2)
      .saveScreenshot('test/e2e/reports/form_oss_avv_sca.jpg')
      .click('button[type=submit]')
      // pagina crea
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(1) > h2', 500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(1) > h2', 'Dati anagrafici intestatario avviso')
      .pause(500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(1) > div > div.v-list.text-uppercase.v-sheet.theme--light.v-list--flat > div > div:nth-child(1) > span', 'ANTONIETTA')
      .waitForElementVisible('#osservazioneScadenzaForm > div:nth-child(1) > div > div > div > label', 500)
      // .click('#osservazioneScadenzaForm > div:nth-child(1) > div > div > div > label')
      // .click('button[type=submit]')
      // .waitForElementVisible('#osservazioni-avv-scadenza > h2', 500)
      // .assert.containsText('#osservazioni-avv-scadenza > div > strong', 'Non sono intestatario del veicolo')
      // .click('#backButton > span')
      // .pause(500)
      // .click('#osservazioneScadenzaForm > div:nth-child(2) > div > div.col-7 > div.v-radio.theme--light > div > div')
      // .click('button[type=submit]')
      // // scatterà errore secondo input data
      // .pause(500)
      // .assert.containsText('#osservazioneScadenzaForm > div:nth-child(2) > div > div.col-7 > div.validation-cont > div.v-input.v-input--has-state.v-input--is-readonly.theme--light.v-text-field.v-text-field--is-booted.error--text > div > div.v-text-field__details > div > div > div', 'La data di vendita è obbligatoria.')
      // .waitForElementVisible('#backButton > span', 500)
      // .pause(500)
      // .click('#backButton > span')
      // .setValue('input[id=numeroRiferimento]', '200912000372756')
      // .setValue('input[id=codiceFiscale]', 'BNCLGU59B12G325Q')
      // .setValue('input[id=targa]', 'ZA055GX')
      // .setValue('#tipoVeicolo', 'A')
      // .click('button[type=submit]')
      // .waitForElementVisible('#osservazioneScadenzaForm > div:nth-child(2) > div > div.col-7 > div.v-radio.theme--light > label > strong', 500)
      // .pause(1000)
      // .click('#osservazioneScadenzaForm > div:nth-child(2) > div > div.col-7 > div.v-radio.theme--light > label > strong')
      // .click('#dataVendita')
      //.setValue('input[id=dataVendita]', '01/10/1999')//input date cambiato per accessibilità
      // .pause(100)
      // // data inserita come secondo input
      // .pause(500)
      // .click('button[type=submit]')
      // // pagina riepilogo
      // .click('#backButton > span')
      // // ci ripenso cambio di nuovo idea e torno indietro
      // .click('#osservazioneScadenzaForm > div:nth-child(3) > div > div > div.v-radio.theme--light > label > strong')
      // // errore ho dimenticato la data
      // .click('#backButton > span')
      // .setValue('input[id=numeroRiferimento]', '200912000372756')
      // .setValue('input[id=codiceFiscale]', 'BNCLGU59B12G325Q')
      // .setValue('input[id=targa]', 'ZA055GX')
      // .setValue('#tipoVeicolo', 'A')
      // .click('button[type=submit]')
      // .pause(100)
      // .click('#osservazioneScadenzaForm > div:nth-child(3) > div > div > div.v-radio.theme--light > label > strong')
      // .click('#dataEsportazione')
      // .pause(100)
      //.setValue('input[id=dataEsportazione]', '01/10/1999')//input date cambiato per accessibilità
      // .pause(100)
      // .click('button[type=submit]')
      // .pause(500)
      // .click('#backButton > span')
      // .click('#osservazioneScadenzaForm > div:nth-child(4) > div > div > div.v-radio.theme--light > label > div > strong')
      // .click('#nonDisponibileDal')
      // .pause(100)
      // .click('#app > div.v-menu__content.theme--light.menuable__content__active > div > div.v-picker__body.theme--light > div > div.v-date-picker-table.v-date-picker-table--date.theme--light > table > tbody > tr:nth-child(3) > td:nth-child(1) > button > div')
      // .click('#nonDisponibileAl')
      // .pause(100)
      // .click('#app > div.v-menu__content.theme--light.menuable__content__active > div > div.v-picker__body.theme--light > div > div.v-date-picker-table.v-date-picker-table--date.theme--light > table > tbody > tr:nth-child(3) > td:nth-child(1) > button > div')
      // // seleziono altro input veicolo esente perchè:
      // .click('#osservazioneScadenzaForm > div:nth-child(5) > div > div > div.v-radio.theme--light > label > strong')
      // // input disabili
      // .click('#tipoEsenzioneForm > div:nth-child(1) > label > strong')
      // .setValue('#numProtocolloDisabili', 'AK133')
      // .click('#dataProtocolloDisabili')
      // .pause(100)
      //.setValue('input[id=dataProtocolloDisabili]', '01/10/1999')//input date cambiato per accessibilità
      // // input gpl metano
      // .click('#tipoEsenzioneForm > div:nth-child(3) > label > strong')
      // .click('#dataInstallImp')
      // .pause(100)
      //.setValue('input[id=dataInstallImp]', '01/10/1999')//input date cambiato per accessibilità
      //  // input esenzione motivi
      // .click('#tipoEsenzioneForm > div:nth-child(5) > div > div')
      // .setValue('#esentatoAltroMotivoTesto', 'descrizione')
      // // trasferimento altra regione
      // .click('#osservazioneScadenzaForm > div:nth-child(6) > div > div > div.v-radio.theme--light > label > strong')
      // .click('#dataTrasfRegione')
      // .pause(100)
      //.setValue('input[id=dataTrasfRegione]', '01/10/1999')//input date cambiato per accessibilità
      // // data demolizione
      // .click('#osservazioneScadenzaForm > div:nth-child(7) > div > div > div.v-radio.theme--light > div > div')
      // .click('#dataDemolizione')
      // .pause(100)
      //.setValue('input[id=dataDemolizione]', '01/10/1999')//input date cambiato per accessibilità
      // dati tecnici non corrispondono
      .click('#osservazioneScadenzaForm > div:nth-child(8) > div > div > div > label > div > strong')
      .setValue('#tipoVeicolo', 'A')
      .setValue('#targa', 'AK13345')
      .setValue('#kw', '29')
      .setValue('#catEuro', 'E0')
      .setValue('#emissCo2', '10')
      .setValue('#alimentazione', 'G')
      .setValue('#peso', '789')
      .setValue('#assi', '8')
      .setValue('#portata', '500')
      .setValue('#numPosti', '7')
      .click('button[type=submit]')
      // pagina riepilogo
      .pause(500)
      // .assert.containsText('#datiVeicoloRettifica > strong', 'I dati tecnici non corrispondono')
      // .assert.containsText('#datiVeicoloRettifica > div > div > div:nth-child(1) > span', ' AUTOVEICOLO')
      // .assert.containsText('#datiVeicoloRettifica > div > div > div:nth-child(4) > span', ' EURO 0')
      // .assert.containsText('#datiVeicoloRettifica > div > div > div:nth-child(6) > span', ' GASOL')
      .click('button[type=submit]')
      .assert.containsText('#canaleEmail > div > div > div > div.v-text-field__details > div > div > div', 'Devi specificare almeno uno fra e-mail e numero di telefono cellulare.')
      .assert.containsText('#canaleSms > div > div > div > div.v-text-field__details > div > div > div', 'Devi specificare almeno uno fra e-mail e numero di telefono cellulare.')
      .setValue('#email', 'carlo.peraudo@consulenti.csi.it')
      .setValue('#telefono', '3332040510')
      .click('#informativa-privacy > div > div > div > div > div > div > div.v-input__slot > label')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div.action-button-wide.row > div.col-md-6.text-md-right > button')
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > div > p:nth-child(1) > strong', 500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > div > p:nth-child(1) > strong', 'La domanda è stata registrata correttamente.')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > div > p:nth-child(2) > strong', 'N° di protocollo 00000044/2020')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > div > p:nth-child(3)', 'Conserva il numero di protocollo della pratica (controlla che sia arrivato via e-mail/SMS).')
      .assert.containsText('#dati-avviso-scadenza > div > div', '201703000008026')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(7) > p:nth-child(2)', 'carlo.peraudo@consulenti.csi.it')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(7) > p:nth-child(3)', '3332040510')
      .end()
  }
}
