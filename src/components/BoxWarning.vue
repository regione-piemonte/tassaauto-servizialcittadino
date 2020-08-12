<template>
  <v-alert
  class="w-100"
  type="warning"
  show
  border="left"
  v-if="this.warning.message !== '' && this.warning.title !== ''">
    <h4 class="alert-heading">{{warning.title}}</h4>
    <p>{{warning.message}}</p>
  </v-alert>
</template>

<script>
export default {
  name: 'BoxWarning',
  props: {
    warning: { type: Object, required: true }
  }
}
</script>
