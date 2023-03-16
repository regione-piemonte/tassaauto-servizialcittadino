function preprodUrls (selected) {
  const protectedLocation = '/authapi'
  let preprodUrl = ''
  let beAppContext = ''
  if (process.env.REGION === 'piemonte') {
    preprodUrl = 'https://coll-bollo-sistemapiemonte.portali.csi.it'
    beAppContext = '/stawapp/rest/'
  } else if (process.env.REGION === 'vda') {
    preprodUrl = 'https://prep-tassa-auto.regione.vda.it'
    beAppContext = '/barwapp/rest/'
  }

  switch (selected) {
    case 'PUBLIC-API':
      preprodUrl += beAppContext
      break
    case 'AUTH-API':
      preprodUrl += protectedLocation + beAppContext
      break
    case 'AUTH-AREA':
      preprodUrl += protectedLocation
      break
  }
  return '"' + preprodUrl + '"' // Attenzione: doppi apici interni
}

function preprodRecaptchaSiteKey () {
  let preprodSiteKey = ''
  if (process.env.REGION === 'piemonte') {
    preprodSiteKey = '6Lfd4tkUAAAAAJ2DI42Z-9C2xlO80ZNcSd4zafWy'
  } else if (process.env.REGION === 'vda') {
    preprodSiteKey = '6Ldi3u8UAAAAAA6DrpBTVWCZ47m0JhilMxaIatnt'
  }
  return '"' + preprodSiteKey + '"' // Attenzione: doppi apici interni
}

function piemonteTuUrl () {
  let urlPTU = ''
  if (process.env.REGION === 'piemonte') {
    urlPTU = '"https://tst-www-piemontetu.portali.csi.it/"'
  } else if (process.env.REGION === 'vda') {
    urlPTU = '"#"'
  }
  return urlPTU
}

function piemonteTuUrlLogged () {
  let urlPTU = ''
  if (process.env.REGION === 'piemonte') {
    urlPTU = '"https://tst-www-piemontetu.portali.csi.it/api/auth/login?redirect=true "'
  } else if (process.env.REGION === 'vda') {
    urlPTU = '"#"'
  }
  return urlPTU
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: preprodUrls('PUBLIC-API'),
  AUTH_API_URL: preprodUrls('AUTH-API'),
  AUTH_AREA_URL: preprodUrls('AUTH-AREA'),
  CUSTOMER_SATISFACTION_URL: '"https://tst-webform-csi.portali.csi.it/"',
  // GOOGLE_ANALYTICS_ID_MISURAZIONE: (process.env.REGION === 'piemonte') ? '"G-TG92PFB214"' : '""', // TODO cambiare
  PIEMONTE_TU_URL: piemonteTuUrl(),
  PIEMONTE_TU_URL_LOGGED: piemonteTuUrlLogged(),
  RECAPTCHA_SITE_KEY: preprodRecaptchaSiteKey()
}
