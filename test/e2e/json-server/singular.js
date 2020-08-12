'use strict'

module.exports = (req, res, next) => {
  // codice per ottenere dagli array solo il valore e non un array con un valore solo
  const _send = res.send
  res.send = function (body) {
    if (require('url').parse(req.url, true).query.singular) {
      try {
        const json = JSON.parse(body)
        if (Array.isArray(json)) {
          if (json.length === 1) {
            return _send.call(this, JSON.stringify(json[0]))
          } else if (json.length === 0) {
            return _send.call(this, '{}', 404)
          }
        }
      } catch (e) {}
    }
    return _send.call(this, body)
  }
 
  // codice per trasformare le POST in GET dal momento che le POST sovrascrivono il db-test.json
  if (req.method === 'POST') {

    // Converts POST to GET
    req.method = 'GET'
    if (req.originalUrl === '/rateizzazione/avviso' && req.body.soggetto.codiceFiscale === '00024770067') {
      req.originalUrl = '/rateizzazione/avvisoRappresentanteLegale'
      req.url = '/rateizzazioneSpeditaRappresentanteLegale'
    }
    if (req.originalUrl === '/discarico' && req.body.dataAnagraficiIntestatario.piva === '00368570859') {
      req.originalUrl = '/discaricoRL'
      req.url = '/domandaDiscaricoResponseRL'
    }
  }
  next()
}
