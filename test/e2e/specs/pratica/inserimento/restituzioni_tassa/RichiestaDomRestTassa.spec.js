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
      .click('#oggDomRestituzioneForm > div > div > div > div:nth-child(1) > div > div')
      .click('#datiVeicoloVersamentiRestituzioneRadio > div:nth-child(1) > div > div > div.v-radio.theme--light > div > div')
      .setValue('#versamentoErrato', 'CY591WN')
      .waitForElementVisible('#modalitaRestituzioneRadio > div:nth-child(2) > div > div:nth-child(1) > div.v-radio.theme--light > div > div', 1000)
      .click('#modalitaRestituzioneRadio > div:nth-child(2) > div > div:nth-child(1) > div.v-radio.theme--light > div > div')
      .click('#radioCompensazione > div:nth-child(1) > div > div')
      .click("#informativa-flag > div > div > div > div > div > div > div.v-input__slot > label")
      .pause(1000)
      .click('#main-content > div > div:nth-child(1) > div.container > div:nth-child(1) > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div:nth-child(4) > div > div.noAccordion > div:nth-child(1) > div > div.col-md-1.align-self-center')
      document.querySelector("")
      .pause(200000)
      .click('#btnInvioInserimentoRestituzione')
      .pause(1000)
      // pagina riepilogo
      .assert.containsText('#oggettoDomandaRestituzione > div > h6', 'A - Doppio pagamento')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(2) > dd', 'CM520VG')
      .assert.containsText('#oggettoDomandaRestituzione > div > div > strong > div', 'di mia proprietà')
      .click('#backButton')
      // pagina torna indietro seconda compliazione form inserimento
      .pause(500)
      .click('#oggDomRestituzioneForm > div > div > div > div:nth-child(2) > label > strong > div')
      .click('#oggDomRestituzioneForm > div > div > div > div:nth-child(3) > div > div > div.v-input__slot > div > div:nth-child(2) > label > strong > div')
      .setValue('#targaErrataInput', 'DD222KV')
      .click('#datiVeicoloVersamentiRestituzioneRadio > div:nth-child(2) > div > div:nth-child(1) > div > label > strong > div')
      .setValue('#veicoloNonPresente', 'A')
      .setValue('#targa', 'DD222KV')
      .click('#inserisciVeicolo')
      .pause(500)
      // si apre il form dell'inserimento versamento
      .click('#datiVeicoloVersamentiRestituzioneRadio > div:nth-child(2) > div:nth-child(2) > button')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(4) > div.v-input.v-input--is-readonly.theme--light.v-text-field.v-text-field--is-booted > div.v-input__control > div.v-input__slot > div')
      .pause(500)
      .click('#app > div.v-menu__content.theme--light.menuable__content__active > div > div.v-picker__body.theme--light > div > div.v-date-picker-table.v-date-picker-table--month.theme--light > table > tbody > tr:nth-child(1) > td:nth-child(1) > button > div') // scadenza
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(5) > div.v-input.v-input--is-readonly.theme--light.v-text-field.v-text-field--is-booted > div.v-input__control > div.v-input__slot > div')
      .pause(500)
      .click('#app > div.v-menu__content.theme--light.menuable__content__active > div > div.v-picker__body.theme--light > div > div.v-date-picker-table.v-date-picker-table--date.theme--light > table > tbody > tr:nth-child(3) > td:nth-child(1)') // data pagamento
      .setValue('#mesiValidità', '12') // mesi
      .setValue('#importo', '12') // importo
      .click('#inserisciVersamento')
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div:nth-child(4) > div > div.noAccordion > div > div > div.col-md-1.align-self-center > div > div > div.v-input__slot > div', 500)
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div:nth-child(3) > div > form > div:nth-child(2) > div:nth-child(4) > div > div.noAccordion > div > div > div.col-md-1.align-self-center > div > div > div.v-input__slot > div') // select versamento
      .click('#btnInvioInserimentoRestituzione')
      // pagina riepilogo ricompilata
      .waitForElementVisible('#main-content', 500)
      .assert.containsText('#oggettoDomandaRestituzione > div > h6', 'B - Pagamento eccessivo')
      .assert.containsText('#oggettoDomandaRestituzione > div > div > strong > div', 'B2 - Targa errata')
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
