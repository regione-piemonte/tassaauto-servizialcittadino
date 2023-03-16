<template>
  <v-alert
  class="w-100 success-alert"
  type="success"
  border="left"
  :icon="false"
  :dismissible="dismiss"
  show
  aria-relevant="all"
  v-if="this.success.message !== '' && this.success.title !== ''">
    <v-row class="pl-6 pl-md-12">
      <v-col cols="12" md="1">
        <v-img
          width="40"
          :src="require(`@/assets/images/icone/alert/success.svg`)"
          :lazy-src="require(`@/assets/images/icone/alert/success.svg`)"/>
      </v-col>
      <v-col cols="12" md="10" class="bodyAlertDark">
        <h4 class="alert-heading">{{success.title}}</h4>
        <p v-html="success.message"/>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: 'BoxSuccesso',
  props: {
    success: { type: Object, required: true },
    dismiss: { type: Boolean }
  }
}
</script>
