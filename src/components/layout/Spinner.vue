<template>
  <div>
    <v-overlay
      color="rgba(255,255,255, 1)"
      :value="pOverlay">
      <v-progress-circular
        :size="150"
        :width="10"
        :color="mainColor"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { REGIONE_PARAMS, REGIONE_ABILITATA } from '@/common/config'
export default {
  name: 'Spinner',
  props: {
    pOverlay: { type: Boolean, required: true }
  },
  data () {
    return {
      regione: REGIONE_ABILITATA,
      mainColor: REGIONE_PARAMS.MAIN_COLOR
    }
  }
}
</script>
