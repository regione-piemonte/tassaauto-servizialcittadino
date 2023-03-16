<template>
  <v-alert
    class="w-100"
    type="warning"
    aria-relevant="all"
    border="left"
    :icon="false"
    v-if="this.warning.message !== '' && this.warning.title !== ''">
    <v-row class="pl-6 pl-md-12">
      <v-col cols="12" md="1">
        <v-img
          width="40"
          :src="require(`@/assets/images/icone/alert/warning.svg`)"
          :lazy-src="require(`@/assets/images/icone/alert/warning.svg`)"/>
      </v-col>
      <v-col cols="12" md="10">
        <h4 class="alert-heading">
          {{warning.title}}
        </h4>
        <p v-html="warning.message" />
      </v-col>
    </v-row>
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
