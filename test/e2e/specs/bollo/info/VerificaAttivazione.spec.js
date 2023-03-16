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
      .url(devServer + '/#/bollo/info/')
      .waitForElementVisible('#app', 1000)
      .setValue('input[id=email]', 'mario.rossi')
      .click('#verifInfobolloEmailBtn')
      .pause(200)
      .assert.containsText('#verificaEmail > div > div > div.v-text-field__details > div > div > div', 'Digitare un indirizzo e-mail corretto.')
      .click('#verificaEmail > div > div > div.v-input__slot > div.v-input__append-inner > div > button')
      .setValue('input[id=email]', 'mario.rossi@dominiopostaxyz.com')
      .click('button[id=verifInfobolloEmailBtn]')
      .waitForElementVisible('#boxAttiva > div.col-12 > div > div > div > div.rfs-24', 1000)
      .assert.containsText('#boxAttiva > div.col-12 > div > div > div > div.rfs-24', 'mario.rossi@dominiopostaxyz.com')
      .click('button[type=submit]')
      .assert.containsText('#richiedi > div > div.error--text', 'Il consenso all\'informativa sulla privacy è obbligatorio.')
      .click('#richiedi > div.tooltip-field.col-md-7.py-md-0.pr-lg-0 > div > div > div > div.v-input__slot > label')
      .click('button[type=submit]')
      .waitForElementVisible('#app', 1000)
      .waitForElementVisible('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div > div.row.justify-content-center > div > div > div.v-alert__content > div > div.col-md-10.col-12 > h4', 1000)
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div > div.row.justify-content-center > div > div > div.v-alert__content > div > div.col-md-10.col-12 > h4', 'Attivazione Infobollo via e-mail')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.row.inner-cont-bollo > div > div > div.row.justify-content-center > div > div > div.v-alert__content > div > div.col-md-10.col-12 > p', 'Per confermare l\'attivazione di Infobollo controlla la tua email e clicca sul link entro 24 ore!')
      .waitForElementVisible('#homeBtn > span', 500)
      .click('#homeBtn > span')
      .waitForElementVisible('#homePage-gridCard > div > div:nth-child(9) > div > div.v-card__title.homeLinkBtn > a', 500)
      .click('#homePage-gridCard > div > div:nth-child(9) > div > div.v-card__title.homeLinkBtn > a')
      .waitForElementVisible('#app', 500)
      .setValue('input[id=cell]', 'abcd')
      .click('#verifInfobolloSmsBtn')
      .waitForElementVisible('#verificaSms > div > div > div.v-text-field__details > div > div > div', 1000)
      .assert.containsText('#verificaSms > div > div > div.v-text-field__details > div > div > div:nth-child(1)', 'Il numero di telefono mobile deve essere composto da soli numeri.')
      .waitForElementVisible('#verificaSms > div > div > div.v-text-field__details > div > div > div:nth-child(2)', 1000)
      .assert.containsText('#verificaSms > div > div > div.v-text-field__details > div > div > div:nth-child(2)', 'Il numero di telefono mobile deve essere composto da almeno 9 numeri.')
      .click('#verificaSms > div > div > div.v-input__slot > div.v-input__append-inner > div > button')
      .setValue('input[id=cell]', '7891234567')
      .click('button[id=verifInfobolloSmsBtn]')
      .waitForElementVisible('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.rfs-30', 1000)
      .assert.containsText('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.rfs-30', '7891234567')
      .click('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.alert-form-fields > div > form > div.confirm-send.col-md-4.offset-md-1 > button')
      .assert.containsText('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.alert-form-fields > div > form > div > div.error--text', 'Il consenso all\'informativa sulla privacy è obbligatorio.')
      .waitForElementVisible('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.alert-form-fields > div > form > div > div.position-relative.d-inline-block > div > div > div.v-input__slot > label', 1000)
      .click('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.alert-form-fields > div > form > div.tooltip-field.col-md-7.py-md-0.pr-lg-0 > div.position-relative.d-inline-block > div > div > div.v-input__slot > label')
      .click('#boxAttiva > div.v-alert.alert-form.pa-0.v-sheet.theme--light > div > div > div.alert-form-fields > div > form > div.confirm-send.col-md-4.offset-md-1 > button')
      .assert.containsText('#main-content > div > div:nth-child(1) > div.container > div.col-lg-10.mx-lg-auto > div > div.wrap-view.col-lg-8.offset-lg-2 > div.row.justify-content-center > div > div > div > h4', 'Conferma numero di telefono mobile')
      .end()
  }
}
