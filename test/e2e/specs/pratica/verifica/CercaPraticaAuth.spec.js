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
      .waitForElementVisible('#btnLogin', 500)
      .click('#btnLogin')
      .waitForElementVisible('#userIsLogged', 500)
      .click('#userIsLogged')
      .click('#main-menu > div > button')
      .waitForElementVisible('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.consulta_pratica_auth > div', 500)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.consulta_pratica_auth > div')
      .waitForElementVisible('#main-content', 500)
      // pagina inserimento esenzione disabili
      .click('button[type=submit]') // darà errore e compileremo il form
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div.form-verifica-pratica.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(1) > div > div.v-text-field__details > div > div > div', 'Il numero di protocollo è obbligatorio.')
      .setValue('input[id=numero]', '00000205/2015') // esenzione disabili
      .click('button[type=submit]')
      // pagina riepilogo esenzione disabili
      .waitForElementVisible('#main-content', 500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.v-sheet.theme--dark.v-toolbar.v-app-bar.titolo-servizio-appbar > div > div > h1', 'Consulta una pratica')
      .assert.containsText('#oggetto-domanda-disabili > div > h6', 'A - Prima richiesta di esenzione')
      .assert.containsText('#dichiarazioneDisabili > div:nth-child(3) > h6', 'A - Il proprietario coincide con il disabile')
      .assert.containsText('#dichiarazioneDisabili > div:nth-child(3) > div > div', 'AA - è stato riconosciuto persona disabile grave ai sensi dell\' art. 3, comma 3, della legge 104/92 per ridotte o impedite capacità motorie (allegare verbale 104/92)')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div > div > div:nth-child(5) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div > div > div:nth-child(5) > div.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(2) > dd', 'CY591WN')
      .click('#modificaBtnRiferimenti') // modifica campi
      .setValue('#telefono', '3333333334')
      .setValue('#email', 'paoloberrettacsi2@gmail.com')
      .click('#confermaBtnModRiferimenti')
      .click('#homeBtn')
      .click('#main-menu > div > button')
      .waitForElementVisible('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.consulta_pratica_auth > div', 500)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.consulta_pratica_auth > div')
      .waitForElementVisible('#main-content', 500)
      // pagina inserimento restituzione
      .click('button[type=submit]') // darà errore e compileremo il form
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div.form-verifica-pratica.col-lg-4.col-md-6.offset-lg-1 > form > div:nth-child(1) > div > div.v-text-field__details > div > div > div', 'Il numero di protocollo è obbligatorio.')
      .setValue('input[id=numero]', '00002910/2017') // esenzione disabili
      .click('button[type=submit]')
      // pagina riepilogo restituzione
      .waitForElementVisible('#main-content', 500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.v-sheet.theme--dark.v-toolbar.v-app-bar.titolo-servizio-appbar > div > div > h1', 'Consulta una pratica')
      .assert.containsText('#oggettoDomandaRestituzione > div > h6', 'A - Doppio pagamento')
      .assert.containsText('#oggettoDomandaRestituzione > div > div > strong > div', 'veicolo di mia proprietà appartenente alla Regione Piemonte')
      .click('#modificaBtnRiferimenti') // modifica campi
      .setValue('#telefono', '3333333334')
      .setValue('#email', 'paoloberrettacsi2@gmail.com')
      .click('#confermaBtnModRiferimenti')
      .click('#homeBtn')
      .click('#main-menu > div > button')
      .waitForElementVisible('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.consulta_pratica_auth > div', 500)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(13) > div.v-list-item__content.menuIcon.consulta_pratica_auth > div')
      .end()
  }
}
