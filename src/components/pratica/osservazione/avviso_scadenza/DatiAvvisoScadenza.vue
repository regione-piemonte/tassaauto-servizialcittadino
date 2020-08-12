<template>
  <div
    class="space-section"
    id="dati-avviso-scadenza">
    <h2>
      Dati avviso scadenza
    </h2>
    <div
      class="text-center">
      <div class="h1">
        {{ numeroRiferimento }}
      </div>
      numero di riferimento
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatiAvvisoScadenza',
  props: {
    numeroRiferimento: { type: String, required: true }
  }
}
</script>
