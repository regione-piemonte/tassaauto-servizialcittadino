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
      .url(devServer + '/#/bollo/memo')
      .waitForElementVisible('#app', 500)
      .setValue('input[id=codiceFiscale]', 'AAAAAAAA')
      .waitForElementVisible('#verificaMemo > div:nth-child(1) > div > div.v-input__slot > div.v-input__append-inner > div > button', 1000)
      .click('#verificaMemo > div:nth-child(1) > div > div.v-input__slot > div.v-input__append-inner > div > button')
      .setValue('input[id=codiceFiscale]', 'PRDCRL76D18L219G')
      .setValue('input[id=targa]', 'EH372PV')
      .setValue('input[id="tipoVeicolo"]', 'A')
      .click('button[type=submit]')
      .assert.containsText('#boxAttivaEmail > h4', 'Attiva Memobollo via email')
      .assert.containsText('#boxAttivaSms > h4', 'Attiva Memobollo via SMS')
      .setValue('#email', 'prova@emailprova.it222')
      .setValue('#cell', '333333333')
      .click('#boxAttivaSms > div > form > div.confirm-send.mt-5 > button')
      .waitForElementVisible('#nuovaAttivazioneCell > div:nth-child(4)', 500)
      .waitForElementVisible('#nuovaAttivazioneEmaill > div.confirm-send.col-md-4.offset-md-1.pt-6 > button', 500)
      .click('#nuovaAttivazioneEmaill > div.confirm-send.col-md-4.offset-md-1.pt-6 > button')
      .click('#nuovaAttivazioneEmaill > div.inline-check-submit > div > div > div > div > div.v-input__slot > label')
      .click('#nuovaAttivazioneEmaill > div.confirm-send.col-md-4.offset-md-1.pt-6 > button')
      .waitForElementVisible('#main-content', 500)
      .url(devServer + '/#/')
      .waitForElementVisible('#main-menu > div > button', 500)
      .click('#main-menu > div > button')
      .waitForElementVisible('#main-content', 500)
      .click('#main-menu-list > div.v-navigation-drawer__content > div > div.v-list.main-menu-left-offcanvas.v-sheet.theme--light.v-list--dense.v-list--nav > div > div:nth-child(2) > div > div')
      .setValue('input[id=codiceFiscale]', 'SBCCST76M66F335L')
      .setValue('input[id=targa]', 'CR152AX')
      .setValue('input[id="tipoVeicolo"]', 'A')
      .click('button[type=submit]')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-2box > div.col-lg-4.offset-lg-2.col-md-6.first-col.d-flex > div.d-flex.w-100 > div > div > div > div > div.v-list.v-sheet.theme--light.v-list--flat > div > div > strong', 'daniel.scaletta@consulenti.csi.it')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-2box > div.col-lg-4.col-md-6.second-col.d-flex > div.d-flex.w-100 > div > div > div > div > div.v-list.v-sheet.theme--light.v-list--flat > div > div > strong', '33333333')
      .waitForElementVisible('#revocaEmailBtn')
      .click('#revocaEmailBtn')
      .waitForElementVisible('#confermaRevocaEmail', 500)
      .click('#confermaRevocaEmail')
      .click('#revocaSmsBtn')
      .waitForElementVisible('#main-content', 500)
      .click('#confermaRevocaSms')
      .end()
  }
}
