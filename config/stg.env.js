function stgApiUrl () {
  return '"https://<TO_DEFINE>/stawapp/rest/"' // Attenzione: doppi apici interni
}

function stgRecaptchaSiteKey () {
  return '"<TO_DEFINE>"' // Attenzione: doppi apici interni
}

function stgAreaRiservata () {
  return '"<TO_DEFINE>"'
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: stgApiUrl(),
  AUTH_AREA_URL: stgAreaRiservata(),
  CUSTOMER_SATISFACTION_URL: '"<TO_DEFINE>"',
  RECAPTCHA_SITE_KEY: stgRecaptchaSiteKey()
}
