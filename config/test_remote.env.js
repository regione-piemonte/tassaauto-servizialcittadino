function testApiUrl () {
  return '"https://<TO_DEFINE>/stawapp/rest/"' // Attenzione: doppi apici interni
}

function testRecaptchaSiteKey () {
  return '"<TO_DEFINE>"' // Attenzione: doppi apici interni
}

function testAreaRiservata () {
  return '"<TO_DEFINE>"'
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: testApiUrl(),
  AUTH_AREA_URL: testAreaRiservata(),
  CUSTOMER_SATISFACTION_URL: '"<TO_DEFINE>"',
  RECAPTCHA_SITE_KEY: testRecaptchaSiteKey()
}
