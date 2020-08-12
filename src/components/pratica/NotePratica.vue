<template>
  <div class="space-section">
    <h2>
      Note
    </h2>
    <v-alert
    show
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
          <p>
            Puoi inserire ulteriori informazioni sulla motivazione.
          </p>
        </v-col>
      </v-row>
    </v-alert>
    <v-textarea
      id="notePratica"
      v-model="note"
      outlined
      auto-grow
      clearable
      rows="3"
      clear-icon="mdi-close-circle"/>
  </div>
</template>

<script>
export default {
  name: 'NotePratica',
  props: {
    pNote: { type: String, required: true }
  },
  data () {
    return {
      note: this.pNote
    }
  },
  methods: {
    getTestoNote () {
      return this.note
    }
  }
}
</script>
