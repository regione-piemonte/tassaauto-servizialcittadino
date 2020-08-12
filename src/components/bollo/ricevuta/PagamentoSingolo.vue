<template>
  <div>
    <DatiAnagraficiIntestatario
      :denominazione="ricevuta.datiCalcolo.proprietario.denominazione"
      :codiceFiscale="ricevuta.datiCalcolo.codiceFiscale"
      :email="ricevuta.email"
      :tipoDatiAnagrafici="'intestatario pagamento'" />

    <DatiVeicolo
      :descrizione="ricevuta.datiCalcolo.tipoVeicolo.descrizione"
      :targa="ricevuta.datiCalcolo.targa"
      :scadenza="ricevuta.datiCalcolo.scadenza"
      :validita="Number(ricevuta.datiCalcolo.validita)"
      :tassa="ricevuta.importo" />

    <ComposizioneImporto
      :interesse="ricevuta.datiCalcolo.interesse"
      :sanzione="ricevuta.datiCalcolo.sanzione"
      :tassa="ricevuta.datiCalcolo.tassa"
      :totale="ricevuta.datiCalcolo.totaleDovuto" />

    <DatiPagamento :ricevutaPagam="ricevuta" />
  </div>
</template>

<script>
import ComposizioneImporto from '@/components/bollo/ComposizioneImporto'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiVeicolo from '@/components/DatiVeicolo'
import DatiPagamento from '@/components/bollo/ricevuta/DatiPagamento'

export default {
  name: 'PagamentoSingolo',
  props: {
    ricevuta: { type: Object, required: true }
  },
  components: { ComposizioneImporto, DatiAnagraficiIntestatario, DatiVeicolo, DatiPagamento }
}
</script>
