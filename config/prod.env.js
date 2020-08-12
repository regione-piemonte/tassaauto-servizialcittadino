function prodApiUrl () {
  return '"https://<TO_DEFINE>/stawapp/rest/"' // Attenzione: doppi apici interni
}

function prodRecaptchaSiteKey () {
  return '"<TO_DEFINE>"' // Attenzione: doppi apici interni
}

function prodAreaRiservata () {
  return '"<TO_DEFINE>"'
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: prodApiUrl(),
  AUTH_AREA_URL: prodAreaRiservata(),
  CUSTOMER_SATISFACTION_URL: '"<TO_DEFINE>"',
  RECAPTCHA_SITE_KEY: prodRecaptchaSiteKey()
}
