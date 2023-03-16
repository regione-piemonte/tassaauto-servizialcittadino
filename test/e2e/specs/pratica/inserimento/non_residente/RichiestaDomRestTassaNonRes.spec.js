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
      .waitForElementVisible('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.restituzione_tassa > div', 1000)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.restituzione_tassa > div')
      // prima compilazione form
      .pause(500)
      .waitForElementVisible('#sesso > div:nth-child(2) > div > div')
      .click('#sesso > div:nth-child(2) > div > div')
      .pause(500)
      .click('#dataDiNascita')
      .setValue('input[id=dataDiNascita]', '01/10/1999')//input date cambiato per accessibilità
      .pause(500)
      .setValue('#province', 'AGRIGENTO')
      .setValue('#comuni', 'AG')
      .setValue('#provinceRes', 'AGRIGENTO')
      .setValue('#comuniRes', 'AG')
      .setValue('#cap', '12000')
      .setValue('#indirizzo', 'via iconsulenti')
      .setValue('#civico', '1')
      .pause(500)
      .click('#oggDomRestituzioneForm > div > div > div > div:nth-child(1) > div > div')
      .click('#datiVeicoloVersamentiRestituzioneRadio > div:nth-child(1) > div > div > div.v-radio.theme--light > div > div')
      .setValue('#versamentoErrato', 'CY591WN')
      .pause(500)
      .click('#main-content > div > div:nth-child(1) > div.container > div:nth-child(1) > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div:nth-child(4) > div > div.noAccordion > div:nth-child(1) > div > div.col-md-1.align-self-center > div > div > div.v-input__slot > div > div')
      .waitForElementVisible('#modalitaRestituzioneRadio > div:nth-child(2) > div > div:nth-child(1) > div.v-radio.theme--light > div > div', 500)
      .click('#modalitaRestituzioneRadio > div:nth-child(2) > div > div:nth-child(1) > div.v-radio.theme--light > div > div')
      .click('#radioCompensazione > div:nth-child(1) > div > div')
      .pause(500)
      .click('#btnInvioInserimentoRestituzione')
      // pagina riepilogo
      .assert.containsText('#oggettoDomandaRestituzione > div > h6', 'A - Doppio pagamento')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(2) > dd', 'CM520VG')
      .assert.containsText('#oggettoDomandaRestituzione > div > div > strong > div', 'di mia proprietà')
      .setValue('#email', 'paoloberrettacsi@gmail.com')
      .setValue('#telefono', '3333333333')
      .click('#informativa-privacy > div > div > div > div > div > div > div.v-input__slot > label')
      .click('#btnInvioDomandaRestituzione')
      .waitForElementVisible('#main-content', 500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div:nth-child(2) > div > div:nth-child(8) > p:nth-child(2)', 'paoloberrettacsi@gmail.com')
      .pause(500)
      .end()
  }
}
