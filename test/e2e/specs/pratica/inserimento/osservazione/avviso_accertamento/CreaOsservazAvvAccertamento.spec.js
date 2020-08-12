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
      .url(devServer + '/#/pratica/inserimento/osservazione/avviso_accertamento')
      .waitForElementVisible('#main-content', 1000)
      .click('button[type=submit]')
      .assert.containsText('#numeroGroup > div > div', 'Il numero di protocollo dell\'avviso è obbligatorio.')
      .assert.containsText('#codFiscPartIvaGroup > div > div', 'Il Codice fiscale / P.IVA è obbligatorio.')
      .setValue('input[id=numeroProtocollo]', '00516010DC528AW')
      .setValue('input[id=codiceFiscale]', 'ZHOYHO65T17Z210Y')
      .click('button[type=submit]')
      .waitForElementVisible('#main-content', 1000)
      .assert.containsText('#denominazione', 'PINO ROSSI')
      .click('#formRadio-pagato > div > div:nth-child(4) > div > div > div > label')
      .waitForElementVisible('#numeroQuietanza', 1000)
      .setValue('input[id=numeroQuietanza]', '0000000000')
      .setValue('input[id=dataPagamento]', '10/12/2019')
      .setValue('input[id=ufficioAccettante]', 'A01010')
      .waitForElementVisible('#notePratica', 1000)
      .click('#notePratica')
      .setValue('textarea[id=notePratica]', 'Testo testo testo testo testo testo testo testoTesto')
      .click('button[type=submit]')
      .waitForElementVisible('#main-content', 1000)
      .waitForElementVisible('#email', 1000)
      .setValue('input[id=email]', 'email@email.it')
      .click('#backButton')
      .waitForElementVisible('#backButton', 1000)
      .click('button[type=submit]')
      .assert.containsText('#denominazione', 'PINO ROSSI')
      .waitForElementVisible('#main-content', 1000)
      .waitForElementVisible('#email', 1000)
      .setValue('input[id=email]', 'email@email.it')
      .click('#privacy-label')
      .click('#submitForm')
      .waitForElementVisible('#main-content', 1000)
      .assert.containsText('#esitoDomanda > p:nth-child(2) > strong', 'N° di protocollo 120412/2019')
      .assert.containsText('#dati-avviso-accertamento > div > dl > dd', '00516010DC528AW')
      .waitForElementVisible('#esentatoImpianto > div > div', 1000)
      .assert.containsText('#esentatoImpianto > div > div', 'Ho installato l\'impianto GPL/metano collaudato in data (allegare copia della carta di circolazione con omologa) 24/01/2020')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(2) > div > div:nth-child(6) > div > p','Testo testo testo testo testo testo testo testo testo testo testo testo testo testo testo')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(2) > div > div:nth-child(7) > div:nth-child(3) > ul > li > a','GME-CDU-08-V02- Inserisci Oss Acc Senza autenticazione.docx')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(2) > div > div:nth-child(8) > p:nth-child(2)','email@email.it')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(2) > div > div:nth-child(8) > p:nth-child(3)','333333333')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(2) > div > div.action-button-wide > div:nth-child(1) > button', 1000)
      .end()
  }
}
