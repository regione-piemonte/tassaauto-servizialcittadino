<template>
  <div class="space-section">
    <h2>
      Dati del piano di rateizzazione
    </h2>
    <div class="dl-inline-header data-up justify-content-center">
      <dl class="text-center col-6 col-sm-3 offset-sm-2">
        <dt>
          riferimento n°
        </dt>
        <dd>
          <strong>
            {{ numeroRiferimento }}
          </strong>
        </dd>
      </dl>
      <dl class="text-center col-sm-1 offset-sm-2 block-slash">
        <dt>
          &nbsp;
        </dt>
        <dd>
          <strong>
            /
          </strong>
        </dd>
      </dl>
      <dl class="text-center col-6 col-sm-2">
        <dt>
          anno
        </dt>
        <dd>
          <strong>
            {{ anno }}
          </strong>
        </dd>
      </dl>
    </div>
    <p>
       {{ descrTotale }} {{ totaleImporto }}
    </p>
    <p>
      {{ descrRate }} {{ numeroRateDaPagare }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'DatiPianoRateizzazione',
  props: {
    numeroRiferimento: { type: String, required: true },
    anno: { type: String, required: true },
    totaleImporto: { type: String, required: true },
    numeroRateDaPagare: { type: Number, required: true },
    ratePagate: { type: Boolean, required: true }
  },
  computed: {
    descrTotale: function () {
      if (this.ratePagate) return 'Totale importo rate pagate:'
      return 'Totale importo da pagare:'
    },
    descrRate: function () {
      if (this.ratePagate) return 'Numero di rate pagate:'
      return 'Numero di rate ancora da pagare:'
    }
  }
}
</script>
