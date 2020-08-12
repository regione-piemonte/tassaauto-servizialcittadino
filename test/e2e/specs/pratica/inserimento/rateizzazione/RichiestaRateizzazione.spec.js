module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/#/pratica/inserimento/rateizzazione')
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('#btnIntVeicAvanti', 1000)
      .click('#btnIntVeicAvanti')
      .assert.containsText('#codFiscaleGroup > div > div', 'Il codice fiscale è obbligatorio.')
      .assert.containsText('#nProtocolloGroup > div > div', 'Il numero di protocollo è obbligatorio.')
      .setValue('#codiceFiscaleIntestatarioVeicolo', 'NBBBBR69C68A182C')
      .setValue('#numeroProtocollo', '00615010CB871JE')
      .click('#btnIntVeicAvanti')
      .waitForElementVisible('#dati-anagrafici-intestatario > h2', 1000)
      .assert.containsText('#dati-anagrafici-intestatario > h2', 'Dati anagrafici del contribuente')
      .assert.containsText('#denominazione', 'BARBARA NEBBIA')
      .assert.containsText('#codFiscale', 'CF: NBBBBR69C68A182C')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div > div > div.col-9.col-md-5.col-lg-6.boxInfo.align-self-center > strong', '165,72 €')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > strong', '00615010CB871JE')
      .waitForElementVisible('#formModRata > div.space-section > div > div > label', 500)
      .click('#formModRata > div.space-section > div > div > label')
      .waitForElementVisible('#numeroRate')
      .setValue('#numeroRate', '40')
      .waitForElementVisible('#formModRata > div.error', 1000)
      .assert.containsText('#formModRata > div.error', 'Il numero di rate deve essere inferiore o uguale al numero massimo di rate consentite (30).')
      .clearValue('#numeroRate')
      .setValue('#numeroRate', '1')
      .waitForElementVisible('#formModRata > div.error', 500)
      .assert.containsText('#formModRata > div.error', 'Il numero di rate deve essere superiore al numero di rate calcolato dalla procedura (5).')
      .clearValue('#numeroRate')
      .setValue('#numeroRate', '30')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div > button')
      .waitForElementVisible('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > h2', 1000)
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div.col-12.col-md-6.h4 > strong', 'Totale: 165,72 €')
      .assert.containsText('#main-content > div > div > div.app-container > div:nth-child(3) > div > div:nth-child(1) > div > div.col-12.col-md-6.align-self-center > div > strong', 'Numero rate: 30')
      .assert.containsText('#denominazione', 'BARBARA NEBBIA')
      .assert.containsText('#codFiscale', 'CF: NBBBBR69C68A182C')
      .waitForElementVisible('#btnInvioRichiesta', 1000)
      .click('#btnInvioRichiesta')
      .assert.containsText('#emailGroup > div > div', 'Devi specificare almeno uno fra e-mail e numero di telefono cellulare.')
      .assert.containsText('#telefonoGroup > div > div', 'Devi specificare almeno uno fra e-mail e numero di telefono cellulare.')
      .assert.containsText('#riferimentiPratica > div.inner-cont-2box.info-left.app-row > div > div > div > div.error', 'Il consenso all\'informativa sulla privacy è obbligatorio.')
      .setValue('#email', 'carlo.peraudo@consulenti.csi.it')
      .setValue('#telefono', '3332040510')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > form > div > div.inner-cont-2box.info-left.app-row > div > div > div > div > div')
      .click('#main-content > div > div > div.app-container > div:nth-child(3) > div > div.action-button-wide > div > button')
      .waitForElementVisible('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(1) > div > p:nth-child(1) > strong', 1000)
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(1) > div > p:nth-child(1) > strong', 'La domanda è stata registrata correttamente.')
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(1) > div > p:nth-child(2) > strong', 'N° di protocollo 00003723/2019')
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(1) > div > p:nth-child(3)', 'Conserva il numero per gli aggiornamenti sullo stato della pratica (controlla che sia arrivato via e-mail/SMS).')
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1)', 'Totale 165,72 €')
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2)', 'Numero rate 5')
      .assert.containsText('#denominazione', 'BARBARA NEBBIA')
      .assert.containsText('#codFiscale', 'CF: NBBBBR69C68A182C')
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(5) > p:nth-child(2)', 'carlo.peraudo@consulenti.csi.it')
      .assert.containsText('#main-content > div > div > div.app-container > div > div:nth-child(2) > div:nth-child(5) > p:nth-child(3)', '3332040510')
      .end()
  }
}