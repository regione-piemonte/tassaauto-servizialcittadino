<template>
  <v-overlay
    color="rgba(255,255,255, 1)"
    :value="pOverlay">
    <img
      :src="require(`@/assets/images/loghi/${regione}/loading_spinner.gif`)"
      alt="Caricamento in corso"
      class="spinner"
    />
  </v-overlay>
</template>

<script>
import { REGIONE_ABILITATA } from '@/common/config'
export default {
  name: 'Spinner',
  props: {
    pOverlay: { type: Boolean, required: true }
  },
  data () {
    return {
      regione: REGIONE_ABILITATA
    }
  }
}
</script>
