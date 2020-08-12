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
      .url(devServer + '/#/bollo/calcolo')
      .waitForElementVisible('#app', 1000)
      .setValue('input[id=targa]', 'EH372PV')
      .setValue('input[id="tipoVeicolo"]', 'A')
      .click('button[type=submit]')
      .waitForElementVisible('#boxGrigio > div > div:nth-child(1) > dl > dd > span', 1000)
      .assert.containsText('#boxGrigio > div > div:nth-child(1) > dl > dd > span', '191,10 €')
      .assert.containsText('#boxGrigio > div > div:nth-child(2) > dl > dd', 'Pot Kw 70 E5')
      .assert.containsText('#boxGrigio > div > div:nth-child(3) > dl > dd', 'GENNAIO 2019')
      .assert.containsText('#boxGrigio > div > div:nth-child(4) > dl > dd', '31/01/2019')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.app-container > div > div > div.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(1) > dd', 'AUTOVEICOLO')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.app-container > div > div > div.dl-inline-header.text-center.bg-ico.bg-ico-A > dl:nth-child(2) > dd', 'EH372PV')
      .end()
  }
}