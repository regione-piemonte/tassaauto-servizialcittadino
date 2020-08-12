require('@babel/register')
var config = require('../../config')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: [
    'test/e2e/specs/bollo/calcolo',
    'test/e2e/specs/bollo/info',
    'test/e2e/specs/bollo/memo',
    'test/e2e/specs/bollo/pago/pago_bollo',
    'test/e2e/specs/bollo/pago/pago_rate',
    'test/e2e/specs/bollo/ricevuta',
    'test/e2e/specs/navigazione',
    'test/e2e/specs/pratica/inserimento/domanda_discarico_rimborso',
    'test/e2e/specs/pratica/inserimento/osservazione/avviso_accertamento',
    'test/e2e/specs/pratica/inserimento/osservazione/avviso_scadenza',
    'test/e2e/specs/pratica/inserimento/rateizzazione',
    'test/e2e/specs/pratica/stampa',
    'test/e2e/specs/pratica/verifica'
  ],
  output_folder: 'test/e2e/reports',

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          w3c: false
        }
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
