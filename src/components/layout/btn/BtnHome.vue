<template>
  <v-btn
    depressed
    id="homeBtn"
    class="mb-5"
    aria-label="Torna alla home di Tassa Auto"
    :class="(cssClass !== undefined && cssClass !== null) ? cssClass : 'btn-secondary'"
    :to="{ name: 'home' }">
    {{ $t('general.buttons.home') }}
  </v-btn>
</template>

<script>
export default {
  name: 'BtnHome',
  props: {
    cssClass: { type: String, required: false }
  }
}
</script>
