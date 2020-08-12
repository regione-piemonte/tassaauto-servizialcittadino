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
      .url(devServer + '/#/bollo/pago')
      .waitForElementVisible('#main-content', 200)
      .click('button[id=cercaIuvBtn]')
      .assert.containsText('#iuvGroup > div > div', 'Il codice di avviso di pagamento è obbligatorio.')
      .setValue('input[id=iuv]', '10 51')
      .assert.containsText('#iuvGroup > div > div', 'Il codice di avviso di pagamento deve contenere solo lettere e numeri.')
      .clearValue('input[id=iuv]')
      .setValue('input[id=iuv]', '201911150000002785277113')
      .click('button[id=cercaIuvBtn]')
      .waitForElementVisible('#boxEsitoRicerca > div:nth-child(1) > div > dl.text-center.col-6.col-sm-4.offset-sm-2 > dd > strong', 2000)
      .assert.containsText('#boxEsitoRicerca > div:nth-child(1) > div > dl.text-center.col-6.col-sm-4.offset-sm-2 > dd > strong', '438,77 €')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(1) > div > dl:nth-child(2) > dd > strong', '10/2015')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(2) > table > tr:nth-child(1) > td', '408,93 €')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(2) > table > tr:nth-child(2) > td', '24,54 €')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(2) > table > tr:nth-child(3) > td', '5,30 €')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(2) > table > tr:nth-child(4) > td > strong', '438,77 €')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(3) > div > div:nth-child(1)', 'EVENEPOEL REMCO')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(3) > div > div:nth-child(2)', 'CF: REXLNZ46A30C048F')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(4) > div > div:nth-child(1)', 'AUTOVEICOLO')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(4) > div > div:nth-child(2)', 'Targa: DV720BS')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(4) > div > div:nth-child(3)', 'Scadenza: 10/2015')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(4) > div > div:nth-child(4)', 'Validità: 12 mesi')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(4) > div > div:nth-child(5)', 'Importo: 408,93 €')
      .click('#boxEsitoRicerca > div > div > a.btn.btn-primary')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > h2', 2000)
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > h2', 'Dati veicoli e composizione importo')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div > div > header > div > div:nth-child(2) > div > strong:nth-child(1)', 'CF: REXLNZ46A30C048F')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div > div > header > div > div:nth-child(2) > div > strong:nth-child(3)', 'Targa: DV720BS')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 'Totale 438,77 €')
      .click('button[id=vaiAlPagamentoBtn]')
      .assert.containsText('#emailGroup > div > div', 'L\'indirizzo e-mail è obbligatorio.')
      .setValue('input[id=email]', 'remco.evenepoel@wolfpack.com')
      .click('#riferimentiPraticaPago > div.inner-cont-2box.info-left.app-row > div > div > div > div > div > label')
      .click('button[id=vaiAlPagamentoBtn]')
      .waitForElementVisible('#main-content > div > div > div:nth-child(2) > div > div > div > div > strong', 1000)
      .assert.containsText('#main-content > div > div > div:nth-child(2) > div > div > div > div > strong', 'Il pagamento viene effettuato sulla piattaforma pagoPA.')
      .click('#backButton')
      .waitForElementVisible('#aggiungiPagamentoBtn', 1000)
      .click('#aggiungiPagamentoBtn')
      .waitForElementVisible('#riepilogoCarrelloBtn', 1000)
      .useXpath()
      .click('//a[text()="Paga con targa/telaio"]')
      .useCss()
      .click('#calcolaBtn')
      .assert.containsText('#codiceFiscaleGroup > div > div', 'Il Codice fiscale è obbligatorio.')
      .assert.containsText('#targaGroup > div > div', 'La Targa/Telaio è obbligatoria/o.')
      .assert.containsText('#tipoVeicoloGroup > div > div', 'Specificare il tipo di veicolo.')
      .setValue('input[id=codiceFiscale]', 'REXLNZ46A30C048F')
      .setValue('input[id=targa]', 'DV720BS')
      .setValue('select[id="tipoVeicolo"]', 'A')
      .click('#calcolaBtn')
      .assert.containsText('div.footer-fix:nth-child(1) div.app-container div.app-row.inner-cont-alert:nth-child(3) div.text-intro.col-xxl-8.offset-xxl-2 div.alert.alert-danger > p:nth-child(2)', 'Pagamento già presente, per eliminarlo andare al riepilogo')
      .clearValue('input[id=codiceFiscale]')
      .clearValue('input[id=targa]')
      .setValue('input[id=codiceFiscale]', 'VRTWTO46A30C048F')
      .setValue('input[id=targa]', 'KV720AB')
      .click('#calcolaBtn')
      .waitForElementVisible('#boxEsitoRicerca > div:nth-child(1) > div > dl.text-center.col-6.col-sm-4.offset-sm-2 > dd > strong', 1000)
      .assert.containsText('#boxEsitoRicerca > div:nth-child(1) > div > dl.text-center.col-6.col-sm-4.offset-sm-2 > dd > strong', '438,77 €')
      .assert.containsText('#boxEsitoRicerca > div:nth-child(3) > div > div:nth-child(1)', 'WOUT VAN AERT')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div.col-md-6.text-right > a.btn.btn-primary') // btn Riepilogo
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 2000)
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > header > div > div:nth-child(1) > div > span', '2')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > header > div > div:nth-child(2) > div > strong:nth-child(1)', 'CF: VRTWTO46A30C048F')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > header > div > div:nth-child(2) > div > strong:nth-child(3)', 'Targa: KV720AB')
      .moveToElement('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 2, 2)
      .saveScreenshot('test/e2e/reports/carrello.jpg')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > header > div > div:nth-child(4) > button > i')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > button:nth-child(3)') // rimozione dal carrello
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 'Totale 438,77 €')
      .click('#aggiungiPagamentoBtn')
      .waitForElementVisible('#riepilogoCarrelloBtn', 1000)
      .useXpath()
      .click('//a[text()="Paga con targa/telaio"]')
      .useCss()
      .setValue('input[id=codiceFiscale]', 'REXLNZ46A30C048F')
      .setValue('input[id=targa]', 'DV720BS')
      .setValue('select[id="tipoVeicolo"]', 'A')
      .click('#scadenzaPregressaGroup__BV_label_')
      .moveToElement('#scadenzaPregressaGroup__BV_label_', 2, 2)
      .saveScreenshot('test/e2e/reports/scadenza_pregr.jpg')
      .waitForElementVisible('#meseScadenza', 1000)
      .click('select[id="meseScadenza"] option[value="12"]')
      .setValue('#annoScadenza', 2018)
      .setValue('#mesiValidita', 12)
      .click('#calcolaBtn')
      .assert.containsText('div.footer-fix:nth-child(1) div.app-container div.app-row.inner-cont-alert:nth-child(3) div.text-intro.col-xxl-8.offset-xxl-2 div.alert.alert-danger > p:nth-child(2)', 'Pagamento già presente, per eliminarlo andare al riepilogo')
      .clearValue('input[id=codiceFiscale]')
      .clearValue('input[id=targa]')
      .setValue('input[id=codiceFiscale]', 'VRTWTO46A30C048F')
      .setValue('input[id=targa]', 'KV720AB')
      .click('#calcolaBtn')
      .waitForElementVisible('#boxEsitoRicerca > div:nth-child(1) > div > dl.text-center.col-6.col-sm-4.offset-sm-2 > dd > strong', 1000)
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div.col-md-6.text-right > a.btn.btn-primary') // btn Riepilogo
      .click('button[id=vaiAlPagamentoBtn]')
      .waitForElementVisible('#main-content > div > div > div:nth-child(2) > div > div > div > div > strong', 1000)
      .assert.containsText('#main-content > div > div > div:nth-child(2) > div > div > div > div > strong', 'Il pagamento viene effettuato sulla piattaforma pagoPA.')
      .click('#transazionePagoPaBtn')
      .waitForElementVisible('#main-content', 200)
      .saveScreenshot('test/e2e/reports/transazionePagoPa.jpg')
      .waitForElementVisible('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > h4', 1000)
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > h4', 'Pago bollo online')
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > p > strong', 'remco.evenepoel@wolfpack.com')
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > p > a', 'Scarica la ricevuta di un pagamento')
      .end()
  }
}
