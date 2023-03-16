function testUrls (selected) {
  console.log('test_csi region: ' + process.env.REGION)
  const protectedLocation = '/authapi'
  let tstUrl = ''
  let beAppContext = ''
  if (process.env.REGION === 'piemonte') {
    tstUrl = 'https://tst-bollo-sistemapiemonte.portali.csi.it'
    beAppContext = '/stawapp/rest/'
  } else if (process.env.REGION === 'vda') {
    tstUrl = 'https://tst-bollo-vda.portali.csi.it'
    beAppContext = '/barwapp/rest/'
  }

  switch (selected) {
    case 'PUBLIC-API':
      tstUrl += beAppContext
      break
    case 'AUTH-API':
      tstUrl += protectedLocation + beAppContext
      break
    case 'AUTH-AREA':
      tstUrl += protectedLocation
      break
  }
  return '"' + tstUrl + '"' // Attenzione: doppi apici interni
}

function testRecaptchaSiteKey () {
  let tstSiteKey = ''
  if (process.env.REGION === 'piemonte') {
    tstSiteKey = '6LfEDsYUAAAAABBNO-nXi20nMS1V4zyGmQs2_wkr'
  } else if (process.env.REGION === 'vda') {
    tstSiteKey = '6LcjD8YUAAAAAGiduJyrLJ6BRsGUyjuxQx_FiH7v'
  }
  return '"' + tstSiteKey + '"' // Attenzione: doppi apici interni
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
  API_URL: testUrls('PUBLIC-API'),
  AUTH_API_URL: testUrls('AUTH-API'),
  AUTH_AREA_URL: testUrls('AUTH-AREA'),
  CUSTOMER_SATISFACTION_URL: '"https://tst-webform-csi.portali.csi.it/"',
  // GOOGLE_ANALYTICS_ID_MISURAZIONE: (process.env.REGION === 'piemonte') ? '"G-TG92PFB214"' : '""', // TODO cambiare
  PIEMONTE_TU_URL: piemonteTuUrl(),
  PIEMONTE_TU_URL_LOGGED: piemonteTuUrlLogged(),
  RECAPTCHA_SITE_KEY: testRecaptchaSiteKey()
}
