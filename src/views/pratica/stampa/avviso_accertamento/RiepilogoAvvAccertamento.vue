<template>
  <StampaPagamento
    :pSintesiPagamento="stampaAvvAccertamento"
    :pStampaAccertamento="true"
  />
</template>

<script>
import StampaPagamento from '@/components/pratica/stampa/StampaPagamento'
import { mapGetters } from 'vuex'

export default {
  components: { StampaPagamento },
  computed: {
    ...mapGetters([
      'stampaAvvAccertamento'
    ])
  }
}
</script>
