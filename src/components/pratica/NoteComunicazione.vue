<template>
  <div class="space-section">
    <h2>
      Note comunicazione
    </h2>
    <div
      v-if="pTesto === null || pTesto === ''">
      Non specificate
    </div>
    <div v-else>
      <p v-html="pTesto"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Note comunicazione',
  props: {
    pTesto: { type: String, required: false }
  }
}
</script>
