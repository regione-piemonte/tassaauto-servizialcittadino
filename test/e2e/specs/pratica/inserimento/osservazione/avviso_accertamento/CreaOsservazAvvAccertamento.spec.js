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
      .click('#homePage-gridCard > div > div:nth-child(5) > div > div > div.v-card__text > ul > li:nth-child(2) > a > span') // click card Avvisi di accertamento
      .waitForElementVisible('#main-content', 500)
      .click('button[type=submit]')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(1) > div > div.v-text-field__details > div > div > div:nth-child(1)', 'Il numero di protocollo dell\'avviso è obbligatorio.')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div.form-cerca-avviso-hp.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(2) > div > div.v-text-field__details > div > div > div', 'Il Codice fiscale / P.IVA è obbligatorio.')
      .setValue('input[id=numeroProtocollo]', '00516010dc528aw') // jira STASP-520
      .setValue('input[id=codiceFiscale]', 'zhoyho65t17z210y')
      .pause(100)
      .click('button[type=submit]')
      .useXpath()
      .waitForElementVisible('//*[@id="denominazione"]', 500)
      .assert.containsText('//*[@id="denominazione"]', 'PINO ROSSI')
      .click('//*[@id="formRadio-pagato"]/div[1]/div/div/div/label/strong') // opt: i pagamenti sono corretti
      .useCss()
      .waitForElementVisible('#numeroQuietanza', 200)
      .setValue('input[id=numeroQuietanza]', '0000000000')
      .setValue('input[id=ufficioAccettante]', 'A01010')
      .moveToElement('#numeroQuietanza', 2, 2)
      .saveScreenshot('test/e2e/reports/oss_avv_acc.jpg')
      .waitForElementVisible('#notePratica', 200)
      .click('#notePratica')
      .setValue('textarea[id=notePratica]', 'Testo testo testo testo testo testo testo testoTesto')
      .click('#dataPagamento')
      .setValue('input[id=dataPagamento]', '01/10/1999')//input date cambiato per accessibilità
      .pause(500)
      .click('button[type=submit]')
      .waitForElementVisible('#main-content', 500)
      .setValue('input[id=email]', 'email@email.it')
      .click('#informativa-privacy > div > div > div > div > div > div > div.v-input__slot > label')
      .click('#submitForm')
      .waitForElementVisible('#main-content', 1000)
      .pause(500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > div > p:nth-child(2) > strong', 'N° di protocollo 120412/2019')
      .assert.containsText('#dati-avviso-accertamento > div > dl > dd', '00516010DC528AW')
      .waitForElementVisible('#dati-avviso-accertamento > p:nth-child(6)')
      .assert.containsText('#dati-avviso-accertamento > p:nth-child(6)', 'Violazione accertata: Versamento Mancante')
      .waitForElementVisible('#esentatoImpianto > div > div', 1000)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(6) > div > p', 'Testo testo testo testo testo testo testo testo testo testo testo testo testo testo testo')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(7) > div:nth-child(3) > ul > li > a', 'GME-CDU-08-V02- Inserisci Oss Acc Senza autenticazione.docx')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(8) > p:nth-child(2)', 'email@email.it')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(8) > p:nth-child(3)', '333333333')
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div.action-button-wide.row', 1000)
      .end()
  }
}
