<template>
  <div class="space-section" v-if="note">
    <h2>Note di lavorazione dell'osservazione</h2>
    <p v-html="note" class="font-weight-bold"></p>
  </div>
</template>

<script>
export default {
  name: 'NotePraticaAvviso',
  props: {
    note: { type: String }
  }
}
</script>
