export default {

  hasTrueValue (obj, key) {
    if (obj[key] === null || obj[key] === undefined) return false
    if (obj[key].value) return true
    return false
  },

  oggettoDomanda (oggettoDom) {
    if (oggettoDom === null || oggettoDom === undefined) return ''
    if (this.hasTrueValue(oggettoDom, 'discaricoAmministrativo')) return 'discaricoAmministrativo'
    if (this.hasTrueValue(oggettoDom, 'rimborsoGiaPagato')) return 'rimborsoGiaPagato'
    return ''
  },

  tipoDiscAmministr (discaricoAmmin) {
    if (discaricoAmmin === null || discaricoAmmin === undefined) return ''
    if (discaricoAmmin.totale) return 'totale'
    if (discaricoAmmin.parziale) return 'parziale'
    return ''
  },

  motivoDomanda (motivoDom) {
    if (motivoDom === null || motivoDom === undefined) return ''
    if (motivoDom.pagamentoEseguito) return 'pagamentoEseguito'
    if (motivoDom.mancanzaPresupposto) return 'mancanzaPresupposto'
    if (this.hasTrueValue(motivoDom, 'altro')) return 'altro'
    return ''
  }
}
