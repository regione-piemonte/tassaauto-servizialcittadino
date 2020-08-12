<template>
  <v-alert
    class="w-100"
    border="left"
    type="error"
    aria-relevant="all"
    :icon="false"
    show v-if="this.error.message !== '' && this.error.title !== ''">
    <v-row class="pl-6 pl-md-12">
      <v-col cols="12" md="1">
        <v-img
          width="40"
          :src="require(`@/assets/images/icone/alert/alert.svg`)"
          :lazy-src="require(`@/assets/images/icone/alert/alert.svg`)"/>
      </v-col>
      <v-col cols="12" md="10">
        <h4 class="alert-heading alertTitle">
          {{ error.title }}
        </h4>
        <p v-html="error.message" />
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: 'BoxErrore',
  props: {
    error: { type: Object, required: true }
  }
}
</script>
