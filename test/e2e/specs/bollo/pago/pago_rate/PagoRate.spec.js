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
      .setValue('input[id=numeroRiferimento]', '50043226')
      .setValue('input[id="anno"]', '2017')
      .setValue('input[id=codicefiscale]', 'VNPRMC73R22Z129L')
      .click('button[type=submit]')
      .waitForElementVisible('#dati-anagrafici-intestatario > h2', 2000)
      .useXpath()
      .assert.containsText('//*[@id="denominazione"]', 'MADS PEDERSEN')
      .assert.containsText('//*[@id="codFiscale"]', 'CF: VNPRMC73R22Z129L')
      .useCss()
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(2) > div > dl.text-center.col-6.col-sm-3.offset-sm-2 > dd > strong', '50043226')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(2) > div > dl.text-center.col-6.col-sm-2 > dd > strong', '2017')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(3)', 'Totale importo da pagare: 225,15 €')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(4)', 'Numero di rate ancora da pagare: 5')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div.cardTotale.space-section > div > p', 'Aggiungere una rata')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div:nth-child(1) > div > div.col-md-3.col-sm-6.align-self-center > div > div > div > div.v-input__slot > label > strong') // click rata 1
      .pause(2000)
      .moveToElement('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div.cardTotale.space-section > div > p', 2, 2)
      .saveScreenshot('test/e2e/reports/tot_rate.jpg')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div.cardTotale.space-section > div > p', 'Totale importo 45,03 €')
      .pause(2000)
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div.action-button-wide.row > div.col-md-6.text-md-right > a > span')
      .waitForElementVisible('#dati-anagrafici-intestatario > h2', 2000)
      .useXpath()
      .assert.containsText('//*[@id="denominazione"]', 'MADS PEDERSEN')
      .assert.containsText('//*[@id="codFiscale"]', 'CF: VNPRMC73R22Z129L')
      .useCss()
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(2) > div > dl.text-center.col-6.col-sm-3.offset-sm-2 > dd > strong', '50043226')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(2) > div > dl.text-center.col-6.col-sm-2 > dd > strong', '2017')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(3)', 'Totale importo da pagare: 225,15 €')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(2) > p:nth-child(4)', 'Numero di rate ancora da pagare: 5')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div.noAccordion > div > div > div.col-md-5.col-sm-6.align-self-center.text-center > div > dl > dd', '28/10/2017')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div.noAccordion > div > div > div.col-md-4.col-sm-6.align-self-center > div > dl > dd', '45,03 €')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 'Totale importo 45,03 €')
      .click('#vaiAlPagamentoBtn > span')
      .assert.containsText('#riferimentiPraticaPago > div:nth-child(4) > div > div > div > div.v-text-field__details > div > div > div', 'L\'indirizzo e-mail è obbligatorio.')
      .setValue('input[id=email]', 'remco.evenepoel@wolfpack.com')
      .click('#riferimentiPraticaPago > div.inner-cont-2box.info-left.row > div > div > div > div.position-relative.d-inline-block > div > div > div.v-input__slot > label')
      .click('#vaiAlPagamentoBtn > span')
      .useXpath()
      .waitForElementVisible('//*[@id="main-content"]/div/div[1]/div[2]/div[1]/div/div/div[2]/div/div/strong', 1000)
      .assert.containsText('//*[@id="main-content"]/div/div[1]/div[2]/div[1]/div/div/div[2]/div/div/strong', 'Il pagamento viene effettuato sulla piattaforma pagoPA.')
      .useCss()
      .click('#backButton > span > span')
      .waitForElementVisible('#backButton > span > span', 1000) // btn Indietro
      .click('#backButton > span > span')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div:nth-child(3) > div.noAccordion > div:nth-child(2) > div > div.col-md-3.col-sm-6.align-self-center > div > div > div > div.v-input__slot > label > strong') // click rata 2
      .pause(1000)
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div.action-button-wide.row > div.col-md-6.text-md-right > a') // btn Avanti
      .waitForElementVisible('#dati-anagrafici-intestatario > h2', 1000)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div.cardTotale.space-section > div > p', 'Totale importo 45,03 €')
      .click('#vaiAlPagamentoBtn > span')
      .useXpath()
      .waitForElementVisible('//*[@id="main-content"]/div/div[1]/div[2]/div[1]/div/div/div[2]/div/div/strong', 1000)
      .assert.containsText('//*[@id="main-content"]/div/div[1]/div[2]/div[1]/div/div/div[2]/div/div/strong', 'Il pagamento viene effettuato sulla piattaforma pagoPA.')
      .useCss()
      // TODO rimozione rate
      .click('button[id=creaTransazionePagoPaBtn]')
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div > div > div.row.justify-content-md-center > div > div > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > h4', 1000)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div.row.justify-content-md-center > div > div > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > h4', 'Paga le rate')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div.row.justify-content-md-center > div > div > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > p > strong', 'remco.evenepoel@wolfpack.com')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div.row.justify-content-md-center > div > div > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > p > a', 'Scarica la ricevuta di un pagamento')
      .end()
  }
}
