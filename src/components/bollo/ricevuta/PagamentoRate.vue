<template>
  <div>
    <!-- cfr https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/127 -->
    <DatiAnagraficiIntestatario
      :denominazione="anagraficaIntest.nome"
      :codiceFiscale="anagraficaIntest.codiceFiscale"
      :email="anagraficaIntest.email"
      :tipoDatiAnagrafici="'intestatario avviso'"
    />
    <DatiPianoRateizzazione
      :numeroRiferimento="pianoRateizz.numeroRiferimento"
      :anno="pianoRateizz.anno"
      :totaleImporto="pianoRateizz.totale | formatCurrency"
      :numeroRateDaPagare="pianoRateizz.numeroRate"
      :ratePagate="true"
    />
    <TabellaRate
      :rate="rate"
      :importoTotale="ricevuta.importo"
      :ratePagate="true"
    />
    <DatiPagamento
      :ricevutaPagam="ricevuta"
    />
  </div>
</template>

<script>
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiPagamento from '@/components/bollo/ricevuta/DatiPagamento'
import DatiPianoRateizzazione from '@/components/bollo/rate/DatiPianoRateizzazione'
import TabellaRate from '@/components/bollo/rate/TabellaRate'

export default {
  name: 'PagamentoRate',
  props: {
    ricevuta: { type: Object, required: true },
    anagraficaIntest: { type: Object, required: true },
    pianoRateizz: { type: Object, required: true },
    rate: { type: Array, required: true }
  },
  components: {
    ComposizioneImporto,
    DatiAnagraficiIntestatario,
    DatiPagamento,
    DatiPianoRateizzazione,
    TabellaRate
  }
}
</script>
