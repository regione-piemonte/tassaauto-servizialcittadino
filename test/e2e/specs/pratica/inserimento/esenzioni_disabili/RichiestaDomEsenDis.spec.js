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
      .click('#userIsLogged')
      .click('#main-menu > div > button')
      .waitForElementVisible('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(12) > div.v-list-item__content.menuIcon.domanda_esenzioni_disabilita_auth', 500)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(12) > div.v-list-item__content.menuIcon.domanda_esenzioni_disabilita_auth')
      .click('#disabiliOggettoDomandaForm > div:nth-child(1) > div > div.col-12 > div > label > strong > div')
      .setValue('#selezionaVeicoloPR', 'CY591WN')
      .click('#disabiliDichiarazioneForm > div > div > div > div > label > strong > div')
      .click('#disabiliDichiarazioneForm > div > div > div > div:nth-child(2) > div > div > div.v-input__slot > div > div:nth-child(1) > label > strong > div')
      .waitForElementVisible("#informativa-flag > div > div > div > div > div")
      .click('#informativa-flag > div > div > div > div > div')
      .click('#btnInvioInserimentoEsenzione')
      // pagina di riepilogo compilata
      .waitForElementVisible('#main-content', 500)
      .pause(600)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(3) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(3) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(2) > dd', 'CY591WN')
      .setValue('#email', 'paoloberrettaweb@gmail.com')
      .setValue('#telefono', '3333333333')
      .waitForElementVisible('#informativa-privacy > div > div > div > div > div > div > div.v-input__slot > label', 500)
      .click('#informativa-privacy > div > div > div > div > div > div > div.v-input__slot > label')
      .pause(500)
      .click('#btnInvioDomandaEsenzione')
      .waitForElementVisible('#main-content', 500)
      .pause(500)
      .end()
  }
}
