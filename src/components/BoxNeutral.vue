<template>
  <v-alert
  show
  v-if="this.msg.message !== '' && this.msg.title !== ''"
  aria-live="off"
  type="info"
  border="left"
  :icon="false">
    <v-row class="pl-6 pl-md-12">
      <v-col cols="12" md="1">
        <v-img
          width="40"
          :src="require(`@/assets/images/icone/alert/info.svg`)"
          :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"/>
      </v-col>
      <v-col cols="12" md="10" class="bodyAlertDark">
        <h4 class="alert-heading">{{msg.title}}</h4>
        <p v-html="msg.message" />
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: 'BoxNeutral',
  props: {
    msg: { type: Object, required: true }
  }
}
</script>
