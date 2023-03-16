const BollowebFilter = {
  convertBooleanToString (value) {
    if (value == null) return
    if (value === true) return 'SI'
    return 'NO'
  },

  formatCurrency (amount) {
    if (amount === 0) return '0,00 €'
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
  },

  getDate (timestamp) {
    if (timestamp.indexOf(' ') === -1) return timestamp
    const dArray = timestamp.split(' ')
    return dArray[0]
  }
}

export default BollowebFilter
