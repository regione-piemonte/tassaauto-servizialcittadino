<template>
  <div class="space-section" id="dati-avviso-accertamento">
    <h2>
      Dati dell'avviso di accertamento
    </h2>
    <div class="dl-important-data-up">
      <dl>
        <dt>numero di protocollo dell'avviso</dt>
        <dd>{{ numeroRiferimento }}</dd>
      </dl>
    </div>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.scadenza') }} {{ new Date(scadenza) | dateFormat('MM/YYYY') }}
    </p>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.tributo_dovuto') }} {{ tributoDovuto | formatCurrency }}
    </p>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.data_invio') }} {{  new Date(dataInvio) | dateFormat('DD/MM/YYYY') }}
    </p>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.violazione') }} {{ violazioneAccertata }}
    </p>
    <p>
      {{ $t('pratica.verifica.accertamento.dati_avviso.data_notifica') }}
      <span v-if="dataNotifica !== ''">
      {{ new Date(dataNotifica) | dateFormat('DD/MM/YYYY') }}
      </span>
      <!--visualizzazione dataNotfica https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/117 -->
      <span v-else>
        <span aria-hidden="true">
          -
        </span>
        <span class="sr-only">
          dato non presente
        </span>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'DatiAvvisoAccertamento',
  props: {
    numeroRiferimento: { type: String, required: true },
    scadenza: { type: String, required: true },
    tributoDovuto: { type: Number, required: true },
    dataInvio: { type: String, required: true },
    violazioneAccertata: { type: String, required: true },
    dataNotifica: { type: String, required: true }
  }
}
</script>
