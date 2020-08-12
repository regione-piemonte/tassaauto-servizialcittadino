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
      .url(devServer + '/#/bollo/ricevuta')
      .waitForElementVisible('#main-content', 1000)
      .setValue('#iuv', 'RF02181970003T00200000002')
      .click('button[type=submit]')
      .waitForElementVisible('#dati-anagrafici-intestatario > h2', 1000)
      .assert.containsText('#dati-anagrafici-intestatario > h2', 'Dati anagrafici intestatario pagamento')
      .assert.containsText('#dati-anagrafici-intestatario > div > div:nth-child(1)', 'SABIA COLUCCI CARMINE ANGELO')
      .assert.containsText('#dati-anagrafici-intestatario > div > div:nth-child(2)', 'SBCCMN35A30A519Z')
      .assert.containsText('#dati-veicolo > h2', 'Dati del veicolo')
      .assert.containsText('#dati-veicolo > div > div:nth-child(1)', 'AUTOVEICOLO')
      .assert.containsText('#dati-veicolo > div > div:nth-child(2)', 'Targa: AT434CY')
      .assert.containsText('#dati-veicolo > div > div:nth-child(3)', 'Scadenza: 12/2018')
      .assert.containsText('#dati-veicolo > div > div:nth-child(4)', 'Validità: 12 mesi')
      .assert.containsText('#dati-veicolo > div > div:nth-child(5)', 'Importo: 107,63 €')
      .assert.containsText('#composizione-importo > h2', 'Composizione importo')
      .assert.containsText('#composizione-importo > table > tr:nth-child(1) > th', 'Tassa')
      .assert.containsText('#composizione-importo > table > tr:nth-child(1) > td', '103,60 €')
      .assert.containsText('#composizione-importo > table > tr:nth-child(2) > th', 'Sanzioni')
      .assert.containsText('#composizione-importo > table > tr:nth-child(2) > td', '3,89 €')
      .assert.containsText('#composizione-importo > table > tr:nth-child(3) > th', 'Interessi')
      .assert.containsText('#composizione-importo > table > tr:nth-child(3) > td', '0,14 €')
      .assert.containsText('#composizione-importo > table > tr:nth-child(4) > th > strong', 'Totale')
      .assert.containsText('#composizione-importo > table > tr:nth-child(4) > td > strong', '107,63 €')
      .click('#backButton')
      .waitForElementVisible('#main-content', 500)
      .setValue('input[id=iuv]', 'RF02181970003T00200000001')
      .click('button[type=submit]')
      .waitForElementVisible('#cercaPagamento > div > div > div.v-text-field__details > div.v-messages.theme--light.error--text > div > div', 2000)
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.inner-cont-alert > div > div > p', 'Codice di avviso di pagamento non trovato')
      .assert.containsText('#boxErrDiv > div > div > div.v-alert__content > h4', 'Attenzione, la ricerca non ha prodotto risultati.')
      .assert.containsText('#cercaPagamento > div > div > div.v-text-field__details > div.v-messages.theme--light.error--text > div > div', 'Codice di avviso di pagamento non trovato')
      .click('#cercaPagamento > div > div > div.v-input__slot > div.v-input__append-inner > div > button')
      .setValue('input[id=iuv]', 'RF88193380003T00200000007')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div.ricevuta-hp-form.col-xxl-4.col-md-6.offset-xxl-1 > form > button')
      .waitForElementVisible('#main-content', 1000)
      .assert.containsText('#denominazione', 'GOLA PAOLO')
      .assert.containsText('#codFiscale', 'CF: GLOPLA75E21L219X')
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.inner-cont-bollo > div > div.action-area > div > div:nth-child(2) > div > dl.text-center.col-6.col-sm-3.offset-sm-2 > dd > strong', '50043679')
      .assert.containsText('#main-content > div > div > div.app-container > div.app-row.inner-cont-bollo > div > div.action-area > div > div:nth-child(4) > table > tr:nth-child(2) > td', 'TST000000000079071')
      .click('#backButton')
      .waitForElementVisible('#main-content', 1000)
      .setValue('input[id=iuv]', 'RF43193390003T00200000003')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div.ricevuta-hp-form.col-xxl-4.col-md-6.offset-xxl-1 > form > button')
      .waitForElementVisible('#main-content', 1000)
      .end()
  }
}