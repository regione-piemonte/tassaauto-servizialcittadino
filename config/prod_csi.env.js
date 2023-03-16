function prodUrls (selected) {
  const protectedLocation = '/authapi'
  let prodUrl = ''
  let beAppContext = ''
  if (process.env.REGION === 'piemonte') {
    prodUrl = 'https://tassa-auto.sistemapiemonte.it'
    beAppContext = '/stawapp/rest/'
  } else if (process.env.REGION === 'vda') {
    prodUrl = 'https://tassa-auto.regione.vda.it'
    beAppContext = '/barwapp/rest/'
  }

  switch (selected) {
    case 'PUBLIC-API':
      prodUrl += beAppContext
      break
    case 'AUTH-API':
      prodUrl += protectedLocation + beAppContext
      break
    case 'AUTH-AREA':
      prodUrl += protectedLocation
      break
  }
  return '"' + prodUrl + '"' // Attenzione: doppi apici interni
}

function prodRecaptchaSiteKey () {
  let prdSiteKey = ''
  if (process.env.REGION === 'piemonte') {
    prdSiteKey = '6LfrDsYUAAAAALye1h2QHqJF_ik3haxaUEHm6nYU'
  } else if (process.env.REGION === 'vda') {
    prdSiteKey = '6Let3u8UAAAAANkJv5b1AmRQ2ntWHmScwcV6K289'
  }
  return '"' + prdSiteKey + '"' // Attenzione: doppi apici interni
}

function piemonteTuUrl () {
  let urlPTU = ''
  if (process.env.REGION === 'piemonte') {
    urlPTU = '"https://www.piemontetu.it/"'
  } else if (process.env.REGION === 'vda') {
    urlPTU = '"#"'
  }
  return urlPTU
}

function piemonteTuUrlLogged () {
  let urlPTU = ''
  if (process.env.REGION === 'piemonte') {
    urlPTU = '"https://www.piemontetu.it/api/auth/login?redirect=true "'
  } else if (process.env.REGION === 'vda') {
    urlPTU = '"#"'
  }
  return urlPTU
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: prodUrls('PUBLIC-API'),
  AUTH_API_URL: prodUrls('AUTH-API'),
  AUTH_AREA_URL: prodUrls('AUTH-AREA'),
  CUSTOMER_SATISFACTION_URL: '"https://webform.portali.csi.it/"',
  // GOOGLE_ANALYTICS_ID_MISURAZIONE: (process.env.REGION === 'piemonte') ? '"G-0JKKWLRM4K"' : '""',
  PIEMONTE_TU_URL: piemonteTuUrl(),
  PIEMONTE_TU_URL_LOGGED: piemonteTuUrlLogged(),
  RECAPTCHA_SITE_KEY: prodRecaptchaSiteKey()
}
