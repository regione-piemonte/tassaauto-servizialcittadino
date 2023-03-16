<template>
  <div>
    <h2>{{ $t("pratica.esenzioni_disabili.veicoliEsentare.titolo") }}</h2>
    <div
      :class="
        'row dl-inline-header text-center bg-ico bg-ico-' +
        veicolo.tipoVeicolo.codice
      "
    >
      <dl class="col-12 col-md-3">
        <dt>tipo</dt>
        <dd>
          {{ veicolo.tipoVeicolo.descrizione }}
        </dd>
      </dl>
      <dl class="col-12 col-md-3">
        <dt>targa</dt>
        <dd>
          {{ veicolo.targa }}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VeicoloEsentare',
  props: {
    veicolo: { type: Object, required: true }
  }
}
</script>
