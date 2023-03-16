<template>
  <div class="space-section" id="dati-avviso-accertamento">
    <h2>
      {{ $t('pratica.osservazione.avviso_bonario.motivazione.titolo') }}
    </h2>
    <div class="dl-important-data-up">
      <dl>
        <dt>{{ $t('pratica.osservazione.avviso_accertamento.motivazione.numeroRiferimento') }}</dt>
        <dd>{{ numeroRiferimento }}</dd>
      </dl>
    </div>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.scadenza') }} {{ new Date(scadenza) | dateFormat('MM/YYYY') }}
    </p>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.data_invio') }}
      <span  v-if="dataInvio !== null">
         {{  new Date(dataInvio) | dateFormat('DD/MM/YYYY') }}
      </span>
      <span v-else>
        -
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'DatiAvvisoBonario',
  props: {
    numeroRiferimento: { type: String, required: true },
    scadenza: { type: String, required: true },
    dataInvio: { type: String, required: true }
  }
}
</script>
