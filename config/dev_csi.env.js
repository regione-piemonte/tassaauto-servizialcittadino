function devUrls (selected) {
  console.log('dev_csi region: ' + process.env.REGION)
  const protectedLocation = '/authapi'
  let devUrl = ''
  let beAppContext = ''
  if (process.env.REGION === 'piemonte') {
    devUrl = 'https://dev-bollo-sistemapiemonte.portali.csi.it'
    beAppContext = '/stawapp/rest/'
  } else if (process.env.REGION === 'vda') {
    devUrl = 'https://dev-bollo-vda.portali.csi.it'
    beAppContext = '/barwapp/rest/'
  }

  switch (selected) {
    case 'PUBLIC-API':
      devUrl += beAppContext
      break
    case 'AUTH-API':
      devUrl += protectedLocation + beAppContext
      break
    case 'AUTH-AREA':
      devUrl += protectedLocation
      break
  }
  return '"' + devUrl + '"' // Attenzione: doppi apici interni
}

function devRecaptchaSiteKey () {
  console.log('dev_csi region: ' + process.env.REGION)
  let devSiteKey = ''
  if (process.env.REGION === 'piemonte') {
    devSiteKey = '6Lfx6sQUAAAAAPagR1FYL20LGYA-IF1dq94h0tpU'
  } else if (process.env.REGION === 'vda') {
    devSiteKey = '6LcUD8YUAAAAAE8kIEpCUkv86emXnp8__cW4lXE-'
  }
  return '"' + devSiteKey + '"' // Attenzione: doppi apici interni
}

function piemonteTuUrl () {
  let urlPTU = ''
  if (process.env.REGION === 'piemonte') {
    urlPTU = '"https://dev-www-piemontetu.portali.csi.it/"'
  } else if (process.env.REGION === 'vda') {
    urlPTU = '"#"'
  }
  return urlPTU
}

function piemonteTuUrlLogged () {
  let urlPTU = ''
  if (process.env.REGION === 'piemonte') {
    urlPTU = '"https://dev-www-piemontetu.portali.csi.it/api/auth/login?redirect=true "'
  } else if (process.env.REGION === 'vda') {
    urlPTU = '"#"'
  }
  return urlPTU
}

module.exports = {
  NODE_ENV: '"production"',
  API_URL: devUrls('PUBLIC-API'),
  AUTH_API_URL: devUrls('AUTH-API'),
  AUTH_AREA_URL: devUrls('AUTH-AREA'),
  CUSTOMER_SATISFACTION_URL: '"https://tst-webform-csi.portali.csi.it/"',
  // GOOGLE_ANALYTICS_ID_MISURAZIONE: (process.env.REGION === 'piemonte') ? '"G-FW5J2PSGSB"' : '""',
  PIEMONTE_TU_URL: piemonteTuUrl(),
  PIEMONTE_TU_URL_LOGGED: piemonteTuUrlLogged(),
  RECAPTCHA_SITE_KEY: devRecaptchaSiteKey()
}
