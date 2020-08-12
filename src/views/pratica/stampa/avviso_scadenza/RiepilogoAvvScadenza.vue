<template>
  <StampaPagamento
    :pSintesiPagamento="stampaAvvScadenza"
    :pStampaAccertamento="false"
  />
</template>

<script>
import StampaPagamento from '@/components/pratica/stampa/StampaPagamento'
import { mapGetters } from 'vuex'

export default {
  components: { StampaPagamento },
  computed: {
    ...mapGetters([
      'stampaAvvScadenza'
    ])
  }
}
</script>
