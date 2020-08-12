function devApiUrl () {
  return '"https://<TO_DEFINE>/stawapp/rest/"' // Attenzione: doppi apici interni
}

function devRecaptchaSiteKey () {
  return '"<TO_DEFINE>"' // Attenzione: doppi apici interni
}

function devAreaRiservata () {
  return '"<TO_DEFINE>"'
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: devApiUrl(),
  AUTH_AREA_URL: devAreaRiservata(),
  CUSTOMER_SATISFACTION_URL: '"<TO_DEFINE>"',
  RECAPTCHA_SITE_KEY: devRecaptchaSiteKey()
}
