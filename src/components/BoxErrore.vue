<template>
  <v-alert
    class="w-100"
    border="left"
    type="error"
    aria-relevant="all"
    :icon="false"
    show
    v-if="this.error.message !== '' && this.error.title !== ''">
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
        <p v-html="error.message" class="mt-2"/>
        <div v-if="error.fieldError">
          <p v-if="checkTypeError === true">
            {{ $t('general.api.errors.phone_error') }}
          </p>
          <v-list flat v-if="checkTypeError === 'errore'" class="error-bg pt-0" light>
            <v-list-item :inactive="true" :ripple="false" v-for="(errorFieldMsg, n)  in error.fieldError" :key="n">
              {{errorFieldMsg.fieldMessage}}
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: 'BoxErrore',
  props: {
    error: { type: Object, required: true }
  },
  computed: {
    checkTypeError () {
      if (this.error.fieldError.telefono || this.error.fieldError.cellulare || this.error.fieldError.cell) {
        return true
      }
      if (this.error.fieldError.length > 0) {
        return 'errore'
      }
      return false
    }
  },
  async mounted () {
    if (this.error.fieldError) {
      this.checkTypeError()
    }
  }
}
</script>
