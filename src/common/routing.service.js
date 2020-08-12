import { servizioAttivo } from '@/common/config'

export default {
  nomeRouteInizioOss () {
    if (servizioAttivo('osservazione_avviso_scadenza') && servizioAttivo('osservazione_avviso_accertamento')) return 'scelta_tipo_osservazione'
    if (servizioAttivo('osservazione_avviso_scadenza')) return 'cerca_avviso_scadenza'
    if (servizioAttivo('osservazione_avviso_accertamento')) return 'cerca_avviso_accertamento'
  },

  nomeRouteInizioPag () {
    if (servizioAttivo('pago_bollo') && servizioAttivo('pago_rate')) return 'scelta_tipo_pagamento'
    if (servizioAttivo('pago_bollo')) return 'avvio_pagopa'
    if (servizioAttivo('pago_bollo')) return 'avvio_pagopa_rate'
  },

  nomeRouteInizioStampa () {
    if (servizioAttivo('stampa_avviso_accertamento') && servizioAttivo('stampa_avviso_scadenza')) return 'scelta_tipo_stampa'
    if (servizioAttivo('stampa_avviso_accertamento')) return 'cerca_stampa_avv_accertamento'
    if (servizioAttivo('stampa_avviso_scadenza')) return 'cerca_stampa_avv_scadenza'
  }
}
