const { merge } = require('webpack-merge')
var devEnv = require('./dev_localhost.env')

function tstAreaRiservata () {
  return '"<TO_DEFINE>"'
}

// json-server deve essere in ascolto sulla porta 3004
module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL: '"http://localhost:3004/"',
  AUTH_AREA_URL: tstAreaRiservata(),
  CUSTOMER_SATISFACTION_URL: '"<TO_DEFINE>"',
  // cfr. https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  RECAPTCHA_SITE_KEY: '"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"'
})
