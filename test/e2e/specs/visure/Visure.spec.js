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
      .waitForElementVisible('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(15) > div.v-list-item__content.menuIcon.visure > div', 500)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(15) > div.v-list-item__content.menuIcon.visure > div')
      .pause(5000)
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div > div > div > div > button > span')
      .click('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div > div > div > div > button > span')
      .pause(35000)
      .assert.containsText('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > div.v-alert.mt-9.v-sheet.theme--dark.v-alert--border.v-alert--border-left.info > div > div.v-alert__content > div > div.bodyAlertDark.col-md-10.col-12 > h4', 'Stato pagamento legenda:')
      .assert.containsText('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > div.row.my-9.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl.col-sm-5 > dd', 'AUTOVEICOLO')
      .assert.containsText('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > div.row.my-9.row.dl-inline-header.text-center.bg-ico.bg-ico-A > dl.col-sm-3 > dd', 'CY591WN')
      .assert.containsText('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > p', 'Proprietario dal 23/09/2008')
      .assert.containsText('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > div:nth-child(4) > div.col-md-4.col-6 > span', 'IN SCADENZA')
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > div:nth-child(4) > div.col.col-auto > button')
      .click('#main-content > div > div:nth-child(1) > div:nth-child(2) > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div:nth-child(1) > div > div:nth-child(4) > div.col.col-auto > button')
      .pause(500)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div > div > div > div.form-cerca-veicolo.form-scelta-tipo.col-lg-4.col-md-6.offset-lg-1 > div.space-section > h2', 'Paga il bollo')
      .end()
  }
}
