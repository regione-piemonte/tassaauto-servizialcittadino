<template>
  <PaginaServizio :servizio="servizio" />
</template>

<script>
import PaginaServizio from '@/components/layout/PaginaServizio'

export default {
  components: { PaginaServizio },
  data () {
    return {
      servizio: 'esenzioni_disabili'
    }
  }
}
</script>
