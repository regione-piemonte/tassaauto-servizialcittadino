<template>
  <v-btn
    type="button"
    color="primary"
    @click="stampaRiepilogo()">
    <v-icon class="mr-1">mdi-printer</v-icon> {{ label }}
  </v-btn>
</template>

<script>
export default {
  name: 'BtnStampaPagina',
  props: {
    label: { type: String, required: true }
  },
  methods: {
    stampaRiepilogo () {
      window.print()
    }
  }
}
</script>
