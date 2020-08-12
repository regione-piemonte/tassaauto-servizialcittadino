function preprodApiUrl () {
  return '"https://<TO_DEFINE>/stawapp/rest/"' // Attenzione: doppi apici interni
}

function preprodRecaptchaSiteKey () {
  return '"<TO_DEFINE>"' // Attenzione: doppi apici interni
}

function preprodAreaRiservata () {
  return '"<TO_DEFINE>"'
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: preprodApiUrl(),
  AUTH_AREA_URL: preprodAreaRiservata(),
  CUSTOMER_SATISFACTION_URL: '"<TO_DEFINE>"',
  RECAPTCHA_SITE_KEY: preprodRecaptchaSiteKey()
}
