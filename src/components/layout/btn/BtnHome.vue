<template>
  <v-btn
    id="homeBtn"
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
