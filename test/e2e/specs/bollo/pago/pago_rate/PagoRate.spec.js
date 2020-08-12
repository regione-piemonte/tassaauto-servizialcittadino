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
      .url(devServer + '/#/bollo/pagorate')
      .waitForElementVisible('#main-content', 200)
      .click('button[type=submit]')
      .assert.containsText('#numeroRiferimentoGroup > div > div', 'Il Numero di Riferimento è obbligatorio.')
      .setValue('input[id=numeroRiferimento]', '10 51')
      .assert.containsText('#numeroRiferimentoGroup > div > div', 'Il Numero di Riferimento deve contenere solo lettere e numeri.')
      .clearValue('input[id=numeroRiferimento]')
      .setValue('input[id=numeroRiferimento]', '50043226')
      .assert.containsText('#annoGroup > div > div', 'L\'Anno è obbligatorio.')
      .setValue('select[id="anno"]', '2017')
      .assert.containsText('#codicefiscaleGroup > div > div', 'Il Codice fiscale / P. IVA è obbligatorio.')
      .clearValue('input[id=codicefiscale]')
      .setValue('input[id=codicefiscale]', '10 51')
      .assert.containsText('#codicefiscaleGroup > div > div', 'Il Codice fiscale / P. IVA deve contenere solo lettere e numeri.')
      .clearValue('input[id=codicefiscale]')
      .setValue('input[id=codicefiscale]', 'VNPRMC73R22Z129L')
      .click('button[type=submit]')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1)', 2000)
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1)', 'MADS PEDERSEN')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(2)', 'CF: VNPRMC73R22Z129L')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div > dl:nth-child(1) > dd > strong', '50043226')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div > dl:nth-child(3) > dd > strong', '2017')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(3)', 'Totale importo da pagare: 225,15 €')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(4)', 'Numero di rate ancora da pagare: 5')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div.cardTotale.space-section > div > p', 'Aggiungere una rata')
      .click('#rateChkGroup > div:nth-child(1) > header > div > div.col-md-3.col-sm-6.align-self-center > div > div > label > span') // click rata 1
      .pause(2000)
      .moveToElement('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div.cardTotale.space-section > div > p', 2, 2)
      .saveScreenshot('test/e2e/reports/tot_rate.jpg')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div.cardTotale.space-section > div > p', 'Totale 45,03 €')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div.col-md-6.text-right > a')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1)', 2000)
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1)', 'MADS PEDERSEN')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(2)', 'CF: VNPRMC73R22Z129L')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div > dl:nth-child(1) > dd > strong', '50043226')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div > dl:nth-child(3) > dd > strong', '2017')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(3)', 'Totale importo da pagare: 225,15 €')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(4)', 'Numero di rate ancora da pagare: 5')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div > div.noAccordion > div > header > div > div.col-md-5.col-sm-6.align-self-center.text-center > div > dl > dd', '28/10/2017')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div > div.noAccordion > div > header > div > div.col-md-4.col-sm-6.align-self-center > div > dl > dd', '45,03 €')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 'Totale 45,03 €')
      .click('button[id=vaiAlPagamentoBtn]')
      .assert.containsText('#emailGroup > div > div', 'L\'indirizzo e-mail è obbligatorio.')
      .setValue('input[id=email]', 'remco.evenepoel@wolfpack.com')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > form > div > div.inner-cont-2box.app-row > div > div > div > div > div')
      .click('#vaiAlPagamentoBtn')
      .waitForElementVisible('#main-content > div > div > div:nth-child(2) > div > div.app-row.inner-cont-bollo > div > div > strong', 1000)
      .assert.containsText('#main-content > div > div > div:nth-child(2) > div > div.app-row.inner-cont-bollo > div > div > strong', 'Il pagamento viene effettuato sulla piattaforma pagoPA.')
      .click('#main-content > div > div > div:nth-child(2) > div > div.app-row.inner-cont-bollo > div > div > div > div > a')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div:nth-child(1) > a', 1000)
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div:nth-child(1) > a')
      .click('#rateChkGroup > div:nth-child(2) > header > div > div.col-md-3.col-sm-6.align-self-center > div > div > label > span') // click rata 2
      .pause(1000)
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div.col-md-6.text-right > a')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1)', 2000)
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 'Totale 45,03 €')
      .click('#vaiAlPagamentoBtn')
      .waitForElementVisible('#main-content > div > div > div:nth-child(2) > div > div.app-row.inner-cont-bollo > div > div > strong', 1000)
      .assert.containsText('#main-content > div > div > div:nth-child(2) > div > div.app-row.inner-cont-bollo > div > div > strong', 'Il pagamento viene effettuato sulla piattaforma pagoPA.')
      // TODO rimozione rate
      .click('button[id=creaTransazionePagoPaBtn]')
      .waitForElementVisible('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > h4', 1000)
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > h4', 'Paga le rate')
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > p > strong', 'remco.evenepoel@wolfpack.com')
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.justify-content-md-center > div > div > div > div.row > div > p > a', 'Scarica la ricevuta di un pagamento')
      .end()
  }
}
