function stgUrls (selected) {
  const protectedLocation = '/authapi'
  let stgUrl = ''
  let beAppContext = ''
  if (process.env.REGION === 'piemonte') {
    stgUrl = ''
    beAppContext = '/stawapp/rest/'
  } else if (process.env.REGION === 'vda') {
    stgUrl = 'https://demo-bollo-vda.portali.csi.it'
    beAppContext = '/barwapp/rest/'
  }

  switch (selected) {
    case 'PUBLIC-API':
      stgUrl += beAppContext
      break
    case 'AUTH-API':
      stgUrl += protectedLocation + beAppContext
      break
    case 'AUTH-AREA':
      stgUrl += protectedLocation
      break
  }
  return '"' + stgUrl + '"' // Attenzione: doppi apici interni
}

function stgRecaptchaSiteKey () {
  let stgSiteKey = ''
  if (process.env.REGION === 'vda') {
    stgSiteKey = '6LcuD8YUAAAAAOuIHYvFGtMyuOI_-kscwG7iBgJZ'
  }
  return '"' + stgSiteKey + '"' // Attenzione: doppi apici interni
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: stgUrls('PUBLIC-API'),
  AUTH_API_URL: stgUrls('AUTH-API'),
  AUTH_AREA_URL: stgUrls('AUTH-AREA'),
  CUSTOMER_SATISFACTION_URL: '"https://tst-webform-csi.portali.csi.it/"',
  // GOOGLE_ANALYTICS_ID_MISURAZIONE: (process.env.REGION === 'piemonte') ? '"G-TG92PFB214"' : '""', // TODO cambiare
  RECAPTCHA_SITE_KEY: stgRecaptchaSiteKey()
}
