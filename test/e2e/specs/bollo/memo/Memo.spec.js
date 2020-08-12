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
      .waitForElementVisible('#app', 1000)
      .setValue('input[id=codiceFiscale]', 'AAAAAAAA')
      .waitForElementVisible('#verificaMemo > div:nth-child(1) > div > div.v-input__slot > div.v-input__append-inner > div > button', 1000)
      .click('#verificaMemo > div:nth-child(1) > div > div.v-input__slot > div.v-input__append-inner > div > button')
      .setValue('input[id=codiceFiscale]', 'SBCCST76M66F335L')
      .setValue('input[id=targa]', 'CR152AX')
      .setValue('input[id="tipoVeicolo"]', 'A')
      .click('button[type=submit]')
      .waitForElementVisible('#desc-veicolo > dl:nth-child(1) > dd', 1000)
      .assert.containsText('#desc-veicolo > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#desc-veicolo > dl:nth-child(2) > dd', 'CR152AX')
      .assert.containsText('#boxAttivaEmail > h4', 'Attiva Memobollo via email')
      .assert.containsText('#boxAttivaSms > h4', 'Attiva Memobollo via SMS')
      .setValue('#email', 'prova@emailprova.it222')
      .setValue('#cell', '333333')
      .click('#boxAttivaSms > div > form > div.confirm-send.mt-5 > button')
      .waitForElementVisible('#nuovaAttivazioneCell > div.error-label' , 500)
      .assert.containsText('#nuovaAttivazioneCell > div.error-label', 'Il consenso all\'informativa sulla privacy è obbligatorio.')
      .waitForElementVisible('#nuovaAttivazioneEmaill > div > div > div > div > div > button', 500)
      .click('#nuovaAttivazioneEmaill > div > div > div > div > div > button')
      .setValue('#email', 'daniel.scaletta@consulenti.csi.it')
      .click('#nuovaAttivazioneEmaill > div.confirm-send > button')
      .waitForElementVisible('#nuovaAttivazioneEmaill > div.error-label' , 500)
      .assert.containsText('#nuovaAttivazioneEmaill > div.error-label', 'Il consenso all\'informativa sulla privacy è obbligatorio.')
      .click('#nuovaAttivazioneEmaill > div.inline-check-submit > div > div > div > div > div.v-input__slot > label')
      .click('#nuovaAttivazioneEmaill > div.confirm-send > button')
      .waitForElementVisible('#main-content')
      .assert.containsText('#desc-veicolo > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#desc-veicolo > dl:nth-child(2) > dd', 'CR152AX')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.app-container > div.app-row.inner-cont-2box > div.col-xxl-4.offset-xxl-2.col-md-6.first-col.d-flex > div > div > div > div > div > div.list-group > div > strong', 'daniel.scaletta@consulenti.csi.it')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.app-container > div.app-row.inner-cont-2box > div.col-xxl-4.col-md-6.second-col.d-flex > div > div > div > div > div > div.list-group > div > strong', '33333333')
      .waitForElementVisible('#revocaEmailBtn')
      .click('#revocaEmailBtn')
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.app-container > div.app-row.inner-cont-2box > div.col-xxl-4.offset-xxl-2.col-md-6.first-col.d-flex > div > div > div > div > div > h4', 1000)
      .click('#confermaRevocaEmail')
      .end()
  }
}