const { merge } = require('webpack-merge')
var devEnv = require('./dev.env')

// json-server deve essere in ascolto sulla porta 3004
module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL: '"http://localhost:3004/"',
  AUTH_API_URL: '"http://localhost:3004/"',
  AUTH_AREA_URL: '"http://localhost:3004/"',
  CUSTOMER_SATISFACTION_URL: '"https://tst-webform-csi.portali.csi.it/"',
  // cfr. https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  RECAPTCHA_SITE_KEY: '"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"'
})
