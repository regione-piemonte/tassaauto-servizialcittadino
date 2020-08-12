import BollowebFilter from '@/filters/bolloweb.filter'

/**
 * @description
 * In questo file andiamo ad aggiungere filtri custom al progetto
 */
export default {
  install (Vue) {
    Vue.filter('convertBooleanToString', BollowebFilter.convertBooleanToString)
    Vue.filter('formatCurrency', BollowebFilter.formatCurrency)
    Vue.filter('getDate', BollowebFilter.getDate)
  }
}
