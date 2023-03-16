module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/')
      .waitForElementVisible('#main-content', 500)
      .waitForElementVisible('#btnLogin', 500)
      .click('#btnLogin')
      .waitForElementVisible('#userIsLogged', 500)
      .click('#homePage-gridCard > div.tab-transparent.areaPersonale--page > div.row.justify-center > div > div.v-tabs.areapersonale--tab.v-tabs--centered.theme--light > div > div.v-slide-group__wrapper > div > div:nth-child(3)')
      .click('#homePage-gridCard > div.tab-transparent.areaPersonale--page > div.row.justify-center > div > div.v-window.mt-12.px-4.pb-4.v-item-group.theme--light.v-tabs-items > div > div.v-window-item.v-window-item--active > div > div:nth-child(7) > div > div > div.v-card__title.homeLinkBtn > a > span > h4')
      .waitForElementVisible('#btnIntVeicAvanti', 500)
      .useXpath()
      .click('//*[@id="rappresentanteLegale"]')
      .useCss()
      .waitForElementVisible('#codiceFiscaleRL', 1000)
      .setValue('#codiceFiscaleRL', 'PRDCRL76D18L219G')
      .setValue('input[id=cognome]', 'van der Poel')
      .setValue('input[id=nome]', 'Mathieu')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.tab-content-hp > div > div.v-window.noauthService.v-item-group.theme--light.v-tabs-items > div > div.v-window-item.v-window-item--active > div > div:nth-child(1) > div.space-section > form > div.v-input.theme--light.v-input--selection-controls.v-input--radio-group.v-input--radio-group--row > div > div.v-input__slot > div > div:nth-child(3) > label')
      .click('input[id=dataDiNascita]')
      .setValue('input[id=dataDiNascita]', '01/10/1999')//input date cambiato per accessibilità
      .click('input[id=comune]')
      .setValue('input[id=comune]', 'Ala di Stura')
      .setValue('input[id=provincia]', 'TO')
      .click('#btnRappLegStep2')
      .pause(600)
      .setValue('input[id=codiceFiscaleRappresentanteLegale]', '00024770067')
      .setValue('input[id=numProt]', '00214010CJ477BY')
      .click('#btnRappLegCerca')
      .waitForElementVisible('#main-content', 500)
      .waitForElementVisible('#codFiscale', 1000)
      .assert.containsText('#denominazione', 'ALBERGO RISTORANTE VITTORIA DI GRAMATICA ROBERTO & C. - S.N.C.')
      .waitForElementVisible('#addProtocollo')
      .click('#addProtocollo')
      .waitForElementVisible('#numeroProtocollo')
      .setValue('#numeroProtocollo', '00214010CJ477BA')
      .waitForElementVisible('#elencoRate > div:nth-child(4) > div', 500)
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div.action-button-wide.row > div > button')
      .setValue('#email', 'daniel.scaletta@consulenti.csi.it')
      .setValue('#telefono', '3333333333')
      .click('#informativa-privacy > div > div > div > div.position-relative.d-inline-block > div')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > div.action-button-wide.row > div > button')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > div > p:nth-child(3)', 'Conserva il numero di protocollo della pratica (controlla che sia arrivato via e-mail/SMS).')
      .end()
  }
}
